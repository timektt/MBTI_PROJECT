import type { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Languages,
  RefreshCw,
  RotateCcw,
  X,
} from "lucide-react";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import {
  ProgressScale,
  QuestionTransition,
  useMbtiZReducedMotion,
  type QuestionDirection,
} from "@/components/cyber/motion";
import { QuizAnswerDeck } from "@/components/mbti-z/quiz/answer-deck";
import {
  assessmentRuntime,
  getAssessmentRuntimeStatus,
  type GuestLocale,
  type GuestQuestion,
  type GuestSession,
} from "@/lib/assessment-runtime";
import { mbtiZQuizCopy } from "@/lib/mbti-z-copy";
import { cn } from "@/lib/utils";

type QuizBootStatus = "loading" | "ready" | "recovery";

const QUIZ_STATUS_COPY = {
  th: {
    loadingTitle: "กำลังเตรียมแบบทดสอบ",
    loadingBody: "กำลังเรียกคืนคำตอบล่าสุดใน browser นี้",
    recoveryTitle: "เปิดคำถามต่อไม่ได้",
    recoveryBody: "เริ่ม session ใหม่เพื่อกลับเข้าสู่แบบทดสอบอย่างปลอดภัย",
    submitError: "ยังเปิดหน้าผลลัพธ์ไม่ได้ คำตอบของคุณยังอยู่ ลองอีกครั้ง",
  },
  en: {
    loadingTitle: "Preparing your assessment",
    loadingBody: "Restoring your latest answers from this browser.",
    recoveryTitle: "The next question could not be opened",
    recoveryBody: "Start a new session to return to the assessment safely.",
    submitError: "The result page did not open. Your answers are still safe. Try again.",
  },
} as const;

function hasCurrentQuestion(questions: GuestQuestion[], session: GuestSession) {
  return (
    questions.length > 0 &&
    Number.isInteger(session.currentIndex) &&
    session.currentIndex >= 0 &&
    session.currentIndex < questions.length &&
    Boolean(questions[session.currentIndex])
  );
}

export default function QuizPage() {
  const router = useRouter();
  const runtimeStatus = getAssessmentRuntimeStatus();
  const { hydrated, locale, setLocale } = useMbtiZLocale();
  const reducedMotion = useMbtiZReducedMotion();
  const [questions, setQuestions] = useState<GuestQuestion[]>([]);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [bootStatus, setBootStatus] = useState<QuizBootStatus>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [draftAnswerKey, setDraftAnswerKey] = useState<string | null>(null);
  const [focusAnswerDeck, setFocusAnswerDeck] = useState(false);
  const [transitionDirection, setTransitionDirection] =
    useState<QuestionDirection>("forward");
  const bootAttemptedRef = useRef(false);
  const submitLockRef = useRef(false);
  const pendingResultIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || !router.isReady || bootAttemptedRef.current) return;

    bootAttemptedRef.current = true;

    try {
      const bootState = assessmentRuntime.bootstrapSession(
        typeof router.query.lang === "string" ? router.query.lang : locale
      );

      if (!hasCurrentQuestion(bootState.questions, bootState.session)) {
        throw new Error("Assessment bootstrap returned no current question.");
      }

      if (bootState.locale !== locale) {
        setLocale(bootState.locale);
      }

      setQuestions(bootState.questions);
      setSession(bootState.session);
      setBootStatus("ready");
    } catch {
      setQuestions([]);
      setSession(null);
      setBootStatus("recovery");
    }
  }, [hydrated, locale, router.isReady, router.query.lang, setLocale]);

  useEffect(() => {
    setDraftAnswerKey(null);
  }, [session?.currentIndex]);

  function syncSession(nextSession: GuestSession) {
    assessmentRuntime.persistSession(nextSession);
    setSession(nextSession);
  }

  function clearSubmissionRetry() {
    pendingResultIdRef.current = null;
    setSubmitError(false);
  }

  function handleRecovery() {
    const requestedLocale =
      typeof router.query.lang === "string" ? router.query.lang : locale;
    const recoveryLocale = assessmentRuntime.resolveLocale(requestedLocale, locale);

    setBootStatus("loading");

    try {
      const nextQuestions = assessmentRuntime.getQuestions(recoveryLocale);
      const nextSession = assessmentRuntime.resetSession(recoveryLocale);

      if (!hasCurrentQuestion(nextQuestions, nextSession)) {
        throw new Error("Assessment recovery returned no current question.");
      }

      clearSubmissionRetry();
      setDraftAnswerKey(null);
      setTransitionDirection("forward");
      setFocusAnswerDeck(true);
      setQuestions(nextQuestions);
      setSession(nextSession);
      setLocale(recoveryLocale);
      setBootStatus("ready");
    } catch {
      setQuestions([]);
      setSession(null);
      setBootStatus("recovery");
    }
  }

  function handleLocaleChange(nextLocale: GuestLocale) {
    if (nextLocale === locale || submitting) return;

    const answeredCount = session ? Object.keys(session.answers).length : 0;
    if (answeredCount > 0 && !window.confirm(mbtiZQuizCopy[locale].localeReset)) {
      return;
    }

    try {
      const nextQuestions = assessmentRuntime.getQuestions(nextLocale);
      const nextSession = assessmentRuntime.resetSession(nextLocale);

      if (!hasCurrentQuestion(nextQuestions, nextSession)) {
        throw new Error("Locale reset returned no current question.");
      }

      clearSubmissionRetry();
      setDraftAnswerKey(null);
      setTransitionDirection("forward");
      setFocusAnswerDeck(true);
      setLocale(nextLocale);
      setQuestions(nextQuestions);
      setSession(nextSession);
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, lang: nextLocale },
        },
        undefined,
        { shallow: true }
      );
    } catch {
      setQuestions([]);
      setSession(null);
      setBootStatus("recovery");
    }
  }

  function handleRestart() {
    if (submitting) return;

    try {
      const nextQuestions = assessmentRuntime.getQuestions(locale);
      const nextSession = assessmentRuntime.resetSession(locale);

      if (!hasCurrentQuestion(nextQuestions, nextSession)) {
        throw new Error("Assessment restart returned no current question.");
      }

      clearSubmissionRetry();
      setDraftAnswerKey(null);
      setTransitionDirection("forward");
      setFocusAnswerDeck(true);
      setQuestions(nextQuestions);
      setSession(nextSession);
    } catch {
      setQuestions([]);
      setSession(null);
      setBootStatus("recovery");
    }
  }

  async function commitAnswer(optionKey: string) {
    if (!session || submitting || submitLockRef.current) return;

    const question = questions[session.currentIndex];
    if (!question) return;

    const nextSession = assessmentRuntime.saveAnswer(
      session,
      question.key,
      optionKey,
      questions
    );
    const completed = questions.every((entry) => nextSession.answers[entry.key]);

    setDraftAnswerKey(null);

    if (!completed) {
      clearSubmissionRetry();
      setTransitionDirection("forward");
      setFocusAnswerDeck(true);
      syncSession(nextSession);
      return;
    }

    submitLockRef.current = true;
    setSession(nextSession);
    setSubmitting(true);
    setSubmitError(false);

    try {
      let resultId = pendingResultIdRef.current;

      if (!resultId) {
        assessmentRuntime.persistSession(nextSession);
        const result = assessmentRuntime.submitSession(nextSession);

        if (!assessmentRuntime.getResultById(result.id)) {
          throw new Error("Submitted result could not be restored.");
        }

        resultId = result.id;
        pendingResultIdRef.current = resultId;
      }

      const navigated = await router.push(`/result/${resultId}`);

      if (!navigated) {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  }

  function handlePrevious() {
    if (!session || session.currentIndex === 0 || submitting) return;

    clearSubmissionRetry();
    setDraftAnswerKey(null);
    setTransitionDirection("backward");
    setFocusAnswerDeck(true);
    syncSession({
      ...session,
      currentIndex: session.currentIndex - 1,
      updatedAt: new Date().toISOString(),
    });
  }

  function handleNext() {
    if (!session || submitting) return;

    const currentQuestion = questions[session.currentIndex];
    if (!currentQuestion) return;

    const answerKey =
      draftAnswerKey ?? session.answers[currentQuestion.key] ?? null;

    if (!answerKey) return;

    void commitAnswer(answerKey);
  }

  function handleAnswerSelect(optionKey: string) {
    clearSubmissionRetry();
    setDraftAnswerKey(optionKey);
  }

  const activeCopy = mbtiZQuizCopy[locale];
  const statusCopy = QUIZ_STATUS_COPY[locale];
  const currentQuestion = session ? questions[session.currentIndex] : undefined;

  if (!hydrated || bootStatus !== "ready" || !session || !currentQuestion) {
    const recoveryVisible =
      bootStatus === "recovery" || (bootStatus === "ready" && !currentQuestion);

    return (
      <>
        <Head>
          <title>{activeCopy.pageTitle}</title>
          <meta name="description" content={activeCopy.metaDescription} />
        </Head>

        <div className="signal-page min-h-screen">
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-[var(--signal-border)]">
              <div className="signal-container flex min-h-[72px] items-center justify-between gap-3 py-3">
                <Link
                  href="/"
                  aria-label={activeCopy.homeAriaLabel}
                  title={activeCopy.homeAriaLabel}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--signal-radius-md)] border border-[var(--signal-border)] text-[var(--signal-text-soft)] transition-colors hover:border-[var(--signal-border-strong)] hover:bg-white/[0.05] hover:text-[var(--signal-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)]"
                >
                  <X className="h-5 w-5" />
                </Link>

                <p className="min-w-0 truncate text-center text-xs font-bold text-[var(--signal-text)]">
                  {activeCopy.title}
                </p>

                <div
                  aria-hidden="true"
                  className="flex shrink-0 items-center rounded-[var(--signal-radius-md)] border border-[var(--signal-border)] p-1 opacity-50"
                >
                  {(["th", "en"] as const).map((language) => (
                    <span
                      key={language}
                      className="flex h-10 w-10 items-center justify-center rounded-[var(--signal-radius-sm)] text-xs font-bold uppercase"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            <main className="signal-container flex flex-1 items-center justify-center py-10">
              <div
                aria-live="polite"
                className="max-w-xl text-center"
                role={recoveryVisible ? "alert" : "status"}
              >
                <motion.div
                  animate={
                    recoveryVisible || reducedMotion ? undefined : { rotate: 360 }
                  }
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--signal-border-strong)] text-[var(--signal-accent)]"
                  transition={{
                    duration: 1.1,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  {recoveryVisible ? (
                    <RotateCcw className="h-5 w-5" />
                  ) : (
                    <RefreshCw className="h-5 w-5" />
                  )}
                </motion.div>
                <h1 className="mt-5 font-editorial text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl">
                  {recoveryVisible
                    ? statusCopy.recoveryTitle
                    : statusCopy.loadingTitle}
                </h1>
                <p className="mt-4 text-sm leading-7 text-[var(--signal-text-soft)]">
                  {recoveryVisible
                    ? statusCopy.recoveryBody
                    : statusCopy.loadingBody}
                </p>
                {recoveryVisible ? (
                  <button
                    type="button"
                    className="signal-button-primary mx-auto mt-7 h-12 px-6"
                    onClick={handleRecovery}
                  >
                    <RotateCcw className="h-4 w-4" />
                    {activeCopy.restart}
                  </button>
                ) : null}
              </div>
            </main>

            <footer className="border-t border-[var(--signal-border)] bg-[var(--signal-canvas-soft)]">
              <div className="signal-container h-[81px]" />
            </footer>
          </div>
        </div>
      </>
    );
  }

  const activeOptionKey =
    draftAnswerKey ?? session.answers[currentQuestion.key] ?? null;
  const questionNumber = session.currentIndex + 1;
  const questionProgress = Math.max((questionNumber / questions.length) * 100, 4);
  const questionHint =
    currentQuestion.kind === "movie" ? activeCopy.movieHint : activeCopy.coreHint;
  const moduleLabel =
    currentQuestion.kind === "movie"
      ? activeCopy.moduleMovie
      : `${activeCopy.currentAxis} · ${currentQuestion.dimension}`;
  const footerMode =
    runtimeStatus.activeMode === "guest-local" ? "GUEST LOCAL" : "CLOUD";
  const canAdvance = Boolean(activeOptionKey) && !submitting;
  const nextLabel =
    session.currentIndex === questions.length - 1
      ? activeCopy.revealResult
      : activeCopy.next;
  const stageLabels = activeCopy.stageLabels;
  const stageIndex = Math.min(
    Math.floor(((questionNumber - 1) / Math.max(questions.length, 1)) * stageLabels.length),
    stageLabels.length - 1
  );
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-editorial";

  return (
    <>
      <Head>
        <title>{activeCopy.pageTitle}</title>
        <meta name="description" content={activeCopy.metaDescription} />
      </Head>

      <div className="signal-page min-h-screen">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-[var(--signal-border)]">
            <div className="signal-container flex min-h-[72px] items-center justify-between gap-3 py-3">
              <Link
                href="/"
                aria-label={activeCopy.homeAriaLabel}
                title={activeCopy.homeAriaLabel}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--signal-radius-md)] border border-[var(--signal-border)] text-[var(--signal-text-soft)] transition-colors hover:border-[var(--signal-border-strong)] hover:bg-white/[0.05] hover:text-[var(--signal-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)]"
              >
                <X className="h-5 w-5" />
              </Link>

              <div className="min-w-0 text-center">
                <p className="truncate text-xs font-bold text-[var(--signal-text)]">
                  {activeCopy.question} {questionNumber} / {questions.length}
                </p>
                <p className="mt-1 hidden truncate text-xs text-[var(--signal-text-muted)] sm:block">
                  {stageLabels[stageIndex]}
                </p>
              </div>

              <div
                aria-label="Language"
                className="flex shrink-0 items-center rounded-[var(--signal-radius-md)] border border-[var(--signal-border)] p-1"
                role="group"
              >
                <Languages className="ml-2 hidden h-4 w-4 text-[var(--signal-text-muted)] sm:block" />
                {(["th", "en"] as const).map((language) => (
                  <button
                    key={language}
                    type="button"
                    aria-pressed={locale === language}
                    disabled={submitting}
                    onClick={() => handleLocaleChange(language)}
                    className={cn(
                      "h-11 w-11 rounded-[var(--signal-radius-sm)] text-xs font-bold uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)] disabled:cursor-not-allowed disabled:opacity-40",
                      locale === language
                        ? "bg-[var(--signal-text)] text-[var(--signal-canvas)]"
                        : "text-[var(--signal-text-muted)] hover:text-[var(--signal-text)]"
                    )}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <div className="signal-container pt-5 sm:pt-6">
            <div
              aria-label={`${activeCopy.progressLabel} ${Math.round(questionProgress)}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(questionProgress)}
              className="h-1.5 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
            >
              <ProgressScale
                className="rounded-full bg-[var(--signal-accent)]"
                value={questionProgress}
              />
            </div>

            <div className="mt-3 hidden grid-cols-4 gap-4 md:grid">
              {stageLabels.map((label, index) => (
                <span
                  key={label}
                  className={cn(
                    "text-xs",
                    index === stageIndex
                      ? "font-bold text-[var(--signal-accent-soft)]"
                      : "text-[var(--signal-text-muted)]"
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <main className="signal-container flex flex-1 flex-col justify-center py-8 sm:py-10 lg:py-12">
            <QuestionTransition
              direction={transitionDirection}
              stepKey={`${locale}:${currentQuestion.key}`}
            >
              <div className="mx-auto w-full max-w-[1040px]">
                <div className="text-center">
                  <p className="signal-eyebrow">{moduleLabel}</p>
                  <h1
                    className={cn(
                      "mx-auto mt-4 max-w-[24ch] text-balance text-[2rem] leading-[1.18] text-[var(--signal-text)] sm:text-[2.5rem] lg:text-[3rem]",
                      headlineClass
                    )}
                  >
                    {currentQuestion.prompt}
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--signal-text-muted)] sm:text-base sm:leading-7">
                    {questionHint}
                  </p>
                </div>

                <div className="mt-8 sm:mt-10">
                  <QuizAnswerDeck
                    activeOptionKey={activeOptionKey}
                    autoFocus={focusAnswerDeck}
                    disabled={submitting}
                    onSelect={handleAnswerSelect}
                    question={currentQuestion}
                    answerDeckCopy={activeCopy.answerDeck}
                    scaleLabel={activeCopy.scaleLabel}
                  />
                </div>
              </div>
            </QuestionTransition>
          </main>

          <footer className="border-t border-[var(--signal-border)] bg-[var(--signal-canvas-soft)]">
            <div className="signal-container py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {submitError ? (
                <p
                  className="mb-3 text-center text-sm leading-6 text-[var(--signal-accent-soft)]"
                  role="alert"
                >
                  {statusCopy.submitError}
                </p>
              ) : null}

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={session.currentIndex === 0 || submitting}
                  title={activeCopy.previous}
                  className="signal-button-secondary h-12 min-w-12 px-3 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{activeCopy.previous}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  disabled={submitting}
                  title={activeCopy.restart}
                  className="signal-button-secondary h-12 min-w-12 px-3 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden lg:inline">{activeCopy.restart}</span>
                </button>

                <div className="hidden min-w-0 flex-1 px-3 text-center lg:block">
                  <p className="truncate text-xs font-semibold text-[var(--signal-text-soft)]">
                    {activeCopy.autosave} · {footerMode}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--signal-text-muted)]">
                    {activeCopy.details}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance}
                  aria-busy={submitting}
                  className="signal-button-primary ml-auto h-12 min-w-0 flex-1 px-4 disabled:cursor-not-allowed disabled:opacity-35 sm:max-w-[220px] sm:px-6"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={reducedMotion ? undefined : { rotate: 360 }}
                        className="shrink-0"
                        transition={{
                          duration: 1.05,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.span>
                      <span className="truncate">{activeCopy.processing}</span>
                    </>
                  ) : (
                    <>
                      <span className="truncate">{nextLabel}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

QuizPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
