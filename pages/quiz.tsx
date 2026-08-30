import type { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Film,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { LocaleToggle } from "@/components/cyber/locale-toggle";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import {
  QuestionTransition,
  Reveal,
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

const QUIZ_STAGE_ICONS: LucideIcon[] = [Zap, Eye, Sparkles, Film];

export default function QuizPage() {
  const router = useRouter();
  const runtimeStatus = getAssessmentRuntimeStatus();
  const { hydrated, locale, setLocale } = useMbtiZLocale();
  const [questions, setQuestions] = useState<GuestQuestion[]>([]);
  const [session, setSession] = useState<GuestSession | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftAnswerKey, setDraftAnswerKey] = useState<string | null>(null);
  const [transitionDirection, setTransitionDirection] =
    useState<QuestionDirection>("forward");

  useEffect(() => {
    if (!hydrated) return;

    const bootState = assessmentRuntime.bootstrapSession(
      typeof router.query.lang === "string" ? router.query.lang : locale
    );

    if (bootState.locale !== locale) {
      setLocale(bootState.locale);
    }

    setQuestions(bootState.questions);
    setSession(bootState.session);
    setReady(true);
  }, [hydrated, locale, router.query.lang, setLocale]);

  useEffect(() => {
    setDraftAnswerKey(null);
  }, [session?.currentIndex]);

  function syncSession(nextSession: GuestSession) {
    assessmentRuntime.persistSession(nextSession);
    setSession(nextSession);
  }

  function handleLocaleChange(nextLocale: GuestLocale) {
    if (nextLocale === locale) return;

    const answeredCount = session ? Object.keys(session.answers).length : 0;
    if (answeredCount > 0 && !window.confirm(mbtiZQuizCopy[locale].localeReset)) {
      return;
    }

    const nextSession = assessmentRuntime.resetSession(nextLocale);
    setDraftAnswerKey(null);
    setLocale(nextLocale);
    setQuestions(assessmentRuntime.getQuestions(nextLocale));
    setSession(nextSession);
  }

  function handleRestart() {
    const nextSession = assessmentRuntime.resetSession(locale);
    setDraftAnswerKey(null);
    setTransitionDirection("forward");
    setSession(nextSession);
  }

  async function commitAnswer(optionKey: string) {
    if (!session || submitting) return;

    const question = questions[session.currentIndex];
    if (!question) return;

    const nextSession = assessmentRuntime.saveAnswer(
      session,
      question.key,
      optionKey,
      questions
    );
    const nextAnsweredCount = Object.keys(nextSession.answers).length;
    const completed = nextAnsweredCount >= questions.length;

    setDraftAnswerKey(null);

    if (!completed) {
      setTransitionDirection("forward");
      syncSession(nextSession);
      return;
    }

    setSubmitting(true);

    try {
      const result = assessmentRuntime.submitSession(nextSession);
      await router.push(`/result/${result.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  function handlePrevious() {
    if (!session || session.currentIndex === 0 || submitting) return;

    setDraftAnswerKey(null);
    setTransitionDirection("backward");
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

  const activeCopy = mbtiZQuizCopy[locale];

  if (!hydrated || !ready || !session) {
    return (
      <>
        <Head>
          <title>{activeCopy.pageTitle}</title>
          <meta name="description" content={activeCopy.metaDescription} />
        </Head>

        <AmbientStage variant="quiz">
          <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col justify-center text-center">
              <p className="font-code text-[11px] uppercase tracking-[0.28em] text-white/38">
                {activeCopy.localRuntime}
              </p>
              <h1 className="mt-6 text-balance font-editorial text-[2.5rem] leading-[1.08] text-white sm:text-[3.3rem] lg:text-[4.6rem]">
                {activeCopy.title}
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/58 sm:text-base">
                {activeCopy.helper}
              </p>
            </div>
          </div>
        </AmbientStage>
      </>
    );
  }

  const currentQuestion = questions[session.currentIndex];
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

      <AmbientStage variant="quiz">
        <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 pb-36 pt-5 sm:px-6 sm:pb-32 lg:px-8 xl:pb-36">
          <header className="flex items-start justify-between gap-4">
            <Link
              href="/"
              aria-label={activeCopy.homeAriaLabel}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
            >
              <X className="h-5 w-5" />
            </Link>

            <div className="flex-1 pt-1 text-center">
              <p className="font-code text-[11px] uppercase tracking-[0.3em] text-white/50">
                {activeCopy.question} {questionNumber} / {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <LocaleToggle
                className="origin-top-right"
                locale={locale}
                onChange={handleLocaleChange}
              />
            </div>
          </header>

          <div className="mt-6">
            <div className="cyber-progress-shell overflow-hidden rounded-full p-[2px]">
              <motion.div
                animate={{ width: `${questionProgress}%` }}
                className="h-3 rounded-full bg-[linear-gradient(90deg,#f59bcc_0%,#c8a6ff_48%,#a88fff_100%)] shadow-[0_0_32px_rgba(200,166,255,0.28)]"
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>

            <div className="mt-5 grid gap-3 text-[11px] font-code uppercase tracking-[0.24em] text-white/28 sm:grid-cols-2 xl:grid-cols-4">
              {stageLabels.map((label, index) => {
                const Icon = QUIZ_STAGE_ICONS[index];
                const active = index === stageIndex;

                return (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-2 py-1.5 transition",
                      active ? "text-[#f0d6ff]" : "text-white/28"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-[#d8b9ff]" : "text-white/26")} />
                    <span>{label}</span>
                    <span
                      className={cn(
                        "hidden h-px flex-1 bg-white/8 sm:block",
                        active && "bg-[#d8b9ff]/24"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <main className="flex flex-1 flex-col justify-center py-10 lg:py-14">
            <Reveal className="w-full" mode="mount" variant="strong">
              <QuestionTransition direction={transitionDirection} stepKey={currentQuestion.key}>
                <div className="mx-auto w-full max-w-[1140px]">
                  <div className="text-center">
                    <p className="font-code text-[11px] uppercase tracking-[0.28em] text-[#dcc0ff]">
                      {moduleLabel}
                    </p>
                    <h1
                      className={cn(
                        "mx-auto mt-7 max-w-[16ch] text-balance text-[2.35rem] leading-[1.04] text-white sm:text-[3rem] lg:text-[4.35rem]",
                        headlineClass,
                        "cyber-title-glow"
                      )}
                    >
                      {currentQuestion.prompt}
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-balance text-sm leading-7 text-white/54 sm:text-base">
                      {questionHint}
                    </p>
                  </div>

                  <div className="mt-10 lg:mt-12">
                    <QuizAnswerDeck
                      activeOptionKey={activeOptionKey}
                      disabled={submitting}
                      onSelect={setDraftAnswerKey}
                      question={currentQuestion}
                      answerDeckCopy={activeCopy.answerDeck}
                      scaleLabel={activeCopy.scaleLabel}
                    />
                  </div>
                </div>
              </QuestionTransition>
            </Reveal>
          </main>

          <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#050814]/88 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-24px_80px_rgba(2,4,12,0.42)] backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={session.currentIndex === 0 || submitting}
                className="inline-flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-code text-[11px] uppercase tracking-[0.24em] text-white/72 transition hover:border-white/18 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                {activeCopy.previous}
              </button>

              <div className="order-3 hidden flex-col items-center gap-3 text-center xl:order-none xl:flex">
                <div className="flex flex-wrap items-center justify-center gap-3 font-code text-[10px] uppercase tracking-[0.22em] text-white/34">
                  <span>{activeCopy.localRuntime}</span>
                  <span className="h-1 w-1 rounded-full bg-white/18" />
                  <span>{footerMode}</span>
                  <span className="h-1 w-1 rounded-full bg-white/18" />
                  <span>{activeCopy.autosave}</span>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-white/44">
                  {activeCopy.details}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-3 font-code text-[10px] uppercase tracking-[0.22em] text-white/54 transition hover:border-white/18 hover:bg-white/[0.06] hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  {activeCopy.restart}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className={cn(
                    "inline-flex min-w-[164px] items-center justify-center gap-3 rounded-2xl border px-6 py-4 font-code text-[11px] uppercase tracking-[0.24em] transition",
                    canAdvance
                      ? "border-[#d8b9ff]/24 bg-[linear-gradient(180deg,rgba(72,72,104,0.72),rgba(52,52,78,0.78))] text-white shadow-[0_20px_60px_rgba(7,8,16,0.32)] hover:border-[#e5cbff]/36 hover:bg-[linear-gradient(180deg,rgba(84,84,118,0.82),rgba(59,59,86,0.86))]"
                      : "border-white/8 bg-white/[0.04] text-white/28"
                  )}
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.05,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.span>
                      {activeCopy.processing}
                    </>
                  ) : (
                    <>
                      {nextLabel}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </footer>
        </div>
      </AmbientStage>
    </>
  );
}

QuizPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
