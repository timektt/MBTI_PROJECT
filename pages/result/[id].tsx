import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Gauge,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { ProgressScale, ResultReveal } from "@/components/cyber/motion";
import { AnimalPortrait } from "@/components/mbti-z/animal-portrait";
import { DownloadResultButton } from "@/components/mbti-z/download-result-button";
import { ResultShareCard } from "@/components/mbti-z/result-share-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  assessmentRuntime,
  type GuestLocale,
  type GuestResult,
} from "@/lib/assessment-runtime";
import { mbtiZResultCopy } from "@/lib/mbti-z-copy";
import { getMbtiZAnimalFocalPosition } from "@/lib/mbti-z-visuals";

type ResultLoadState = "loading" | "ready" | "missing";

export default function ResultPage() {
  const router = useRouter();
  const { hydrated, locale, setLocale } = useMbtiZLocale();
  const [baseResult, setBaseResult] = useState<GuestResult | null>(null);
  const [loadState, setLoadState] = useState<ResultLoadState>("loading");

  useEffect(() => {
    if (!hydrated || !router.isReady) return;

    const resultId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const requestedLocale = typeof router.query.lang === "string" ? router.query.lang : locale;

    if (!resultId) {
      setBaseResult(null);
      setLoadState("missing");
      return;
    }

    try {
      const storedResult = assessmentRuntime.getResultById(resultId);
      const validResult = isRenderableGuestResult(storedResult) ? storedResult : null;
      const nextLocale = assessmentRuntime.resolveLocale(requestedLocale, validResult?.locale);

      if (nextLocale !== locale) {
        setLocale(nextLocale);
      }

      setBaseResult(validResult);
      setLoadState(validResult ? "ready" : "missing");
    } catch {
      const nextLocale = assessmentRuntime.resolveLocale(requestedLocale, locale);

      if (nextLocale !== locale) {
        setLocale(nextLocale);
      }

      setBaseResult(null);
      setLoadState("missing");
    }
  }, [hydrated, locale, router.isReady, router.query.id, router.query.lang, setLocale]);

  const activeCopy = mbtiZResultCopy[locale];
  const result = baseResult ? localizeRenderableResult(baseResult, locale) : null;
  const shareCardResult = baseResult ? localizeRenderableResult(baseResult, "th") : null;
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";

  if (!hydrated || !router.isReady || loadState === "loading") {
    return (
      <div className="signal-page">
        <Head>
          <title>MBTI Z</title>
        </Head>

        <main
          aria-busy="true"
          aria-live="polite"
          className="signal-container flex min-h-[calc(100svh-73px)] items-center py-12"
        >
          <div className="w-full max-w-2xl">
            <LoaderCircle
              aria-hidden="true"
              className="h-7 w-7 animate-spin text-[var(--signal-accent)]"
            />
            <p className="signal-eyebrow mt-6">{activeCopy.kicker}</p>
            <h1 className={`mt-4 text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl ${headlineClass}`}>
              {activeCopy.signature}
            </h1>
            <div aria-hidden="true" className="mt-8 space-y-3">
              <div className="h-3 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-4/5 max-w-lg animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loadState === "missing" || !result || !shareCardResult) {
    return (
      <div className="signal-page">
        <Head>
          <title>{activeCopy.notFoundPageTitle}</title>
        </Head>

        <main className="signal-container flex min-h-[calc(100svh-73px)] items-center py-12">
          <div className="max-w-2xl">
            <p className="signal-eyebrow">{activeCopy.kicker}</p>
            <h1 className={`mt-4 text-4xl leading-tight text-[var(--signal-text)] sm:text-5xl ${headlineClass}`}>
              {activeCopy.notFoundTitle}
            </h1>
            <p className="mt-5 text-base leading-8 text-[var(--signal-text-soft)]">
              {activeCopy.notFoundBody}
            </p>
            <Link href="/quiz" className="signal-button-primary mt-8">
              {activeCopy.notFoundCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const shareCardTargetId = `result-share-card-export-${result.id}`;
  const exportFileName = `mbti-z-${result.mbtiType.toLowerCase()}-${result.createdAt.slice(0, 10)}.png`;
  const createdAt = new Date(result.createdAt).toLocaleDateString(
    locale === "th" ? "th-TH" : "en-US"
  );

  return (
    <>
      <Head>
        <title>{`${result.mbtiType} | MBTI Z`}</title>
        <meta name="description" content={result.summaryBody} />
      </Head>

      <div className="signal-page">
        <header className="border-b border-[var(--signal-border)]">
          <div className="signal-container flex min-h-[60px] items-center justify-end py-2">
            <Link href="/dashboard" className="signal-button-secondary min-h-11 px-4">
              {activeCopy.dashboard}
            </Link>
          </div>
        </header>

        <main>
          <section className="signal-container py-8 sm:py-10 lg:py-12" aria-labelledby="result-identity">
            <ResultReveal
              className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.72fr)] lg:gap-12"
              tone="hero"
            >
              <div className="min-w-0">
                <p className="signal-eyebrow">{activeCopy.kicker}</p>
                <h1
                  id="result-identity"
                  className={`mt-4 text-[4rem] leading-none text-[var(--signal-text)] sm:text-[5rem] ${headlineClass}`}
                >
                  {result.mbtiType}
                </h1>
                <p className="mt-4 text-xl font-semibold leading-8 text-[var(--signal-accent-soft)] sm:text-2xl">
                  {result.archetypeName}
                </p>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--signal-text-soft)] sm:text-lg sm:leading-8">
                  {result.tagline}
                </p>

                <dl className="mt-7 grid border-y border-[var(--signal-border)] min-[520px]:grid-cols-2">
                  <ResultFact label={activeCopy.house} value={result.house.title} />
                  <ResultFact label={activeCopy.animal} value={result.animal.name} />
                </dl>

                <div className="mt-7 flex flex-col flex-wrap gap-3 min-[390px]:flex-row">
                  <DownloadResultButton
                    className="signal-button-primary h-12 w-full rounded-[var(--signal-radius-md)] !bg-[var(--signal-accent)] px-5 font-sans text-sm normal-case tracking-normal text-[var(--signal-accent-ink)] hover:!bg-[var(--signal-accent-soft)] min-[390px]:w-auto"
                    targetId={shareCardTargetId}
                    fileName={exportFileName}
                    label={activeCopy.downloadPng}
                    payload={shareCardResult}
                    processingLabel={activeCopy.processingPng}
                    errorLabel={activeCopy.downloadError}
                    successLabel={locale === "th" ? "ดาวน์โหลด PNG แล้ว" : "PNG downloaded"}
                  />
                  <Link href="/quiz" className="signal-button-secondary h-12">
                    <RefreshCw className="h-4 w-4" />
                    {activeCopy.retake}
                  </Link>
                  <Link href="/types" className="signal-button-secondary h-12">
                    {activeCopy.typeAtlas}
                  </Link>
                </div>
              </div>

              <AnimalPortrait
                accentFrom={result.house.accentFrom}
                accentTo={result.house.accentTo}
                alt=""
                className="signal-media mx-auto w-full max-w-[28rem] rounded-[var(--signal-radius-media)] lg:mx-0 lg:ml-auto"
                imagePath={result.animal.imagePath}
                focalPosition={getMbtiZAnimalFocalPosition(result.mbtiType)}
                fallbackLabel={locale === "th" ? "ยังโหลดภาพสัตว์ไม่ได้" : "Animal image unavailable"}
                label={`${activeCopy.house} · ${result.house.title}`}
                ratio="portrait"
                subtitle={result.house.description}
                title={result.animal.name}
                titleClassName="text-2xl sm:text-3xl"
                priority
              />
            </ResultReveal>
          </section>

          <section className="signal-section" aria-labelledby="result-dimensions">
            <div className="signal-container">
              <ResultReveal tone="detail">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 text-[var(--signal-accent)]">
                    <Gauge className="h-5 w-5" />
                    <p className="signal-eyebrow">{activeCopy.dimensions}</p>
                  </div>
                  <h2
                    id="result-dimensions"
                    className={`mt-3 text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl ${headlineClass}`}
                  >
                    {activeCopy.signalMapTitle}
                  </h2>
                </div>

                <div className="mt-8 grid gap-x-10 lg:grid-cols-2">
                  {result.dimensions.map((dimension) => {
                    const total = Math.max(dimension.leftScore + dimension.rightScore, 1);
                    const leftPercent = Math.round((dimension.leftScore / total) * 100);

                    return (
                      <div
                        key={dimension.pair}
                        className="border-t border-[var(--signal-border)] py-5"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                          <p className="text-sm font-bold text-[var(--signal-text)]">
                            {dimension.pair}
                          </p>
                          <p className="text-sm text-[var(--signal-text-soft)]">
                            {activeCopy.winnerLabel}: <strong className="text-[var(--signal-text)]">{dimension.winner} {dimension.balance}%</strong>
                          </p>
                        </div>
                        <div
                          aria-label={`${dimension.left} ${dimension.leftScore}, ${dimension.right} ${dimension.rightScore}`}
                          className="mt-4 flex h-2 overflow-hidden rounded-full bg-[var(--signal-surface-raised)]"
                          role="img"
                        >
                          <ProgressScale
                            style={{ backgroundColor: result.house.accentTo }}
                            value={leftPercent}
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[var(--signal-text-muted)]">
                          <span>{dimension.left}: {dimension.leftScore}</span>
                          <span>{dimension.right}: {dimension.rightScore}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ResultReveal>
            </div>
          </section>

          <section className="signal-section" aria-labelledby="result-narrative">
            <div className="signal-container">
              <ResultReveal className="max-w-3xl" tone="detail">
                <p className="signal-eyebrow">{activeCopy.summary}</p>
                <h2
                  id="result-narrative"
                  className={`mt-3 text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl ${headlineClass}`}
                >
                  {result.summaryTitle ?? activeCopy.signature}
                </h2>
                <p className="mt-6 text-base leading-8 text-[var(--signal-text-soft)] sm:text-lg sm:leading-9">
                  {result.summaryBody}
                </p>
              </ResultReveal>
            </div>
          </section>

          <section className="signal-section" aria-labelledby="result-movie-profile">
            <div className="signal-container">
              <ResultReveal
                className="grid gap-8 md:grid-cols-[minmax(12rem,0.68fr)_minmax(0,1.32fr)] md:gap-12"
                tone="detail"
              >
                <div>
                  <Sparkles className="h-6 w-6 text-[var(--signal-accent)]" />
                  <p className="signal-eyebrow mt-5">{activeCopy.movieProfile}</p>
                  <h2
                    id="result-movie-profile"
                    className={`mt-3 text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl ${headlineClass}`}
                  >
                    {result.movieProfile.title}
                  </h2>
                </div>
                <div className="md:pt-11">
                  <p className="max-w-3xl text-base leading-8 text-[var(--signal-text-soft)] sm:text-lg sm:leading-9">
                    {result.movieProfile.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--signal-border)] pt-5">
                    {result.movieProfile.tags.map((tag) => (
                      <li key={tag} className="text-sm font-semibold text-[var(--signal-text)]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </ResultReveal>
            </div>
          </section>

          <section className="signal-section" aria-labelledby="result-share-preview">
            <div className="signal-container">
              <ResultReveal
                className="grid items-center gap-9 lg:grid-cols-[minmax(17.5rem,22.5rem)_minmax(0,1fr)] lg:gap-16"
                tone="detail"
              >
                <ResultShareCard
                  result={shareCardResult}
                  locale="th"
                  className="mx-auto w-full max-w-[360px] rounded-[var(--signal-radius-media)] lg:mx-0"
                />
                <div className="max-w-2xl">
                  <ScrollText className="h-6 w-6 text-[var(--signal-accent)]" />
                  <p className="signal-eyebrow mt-5">{activeCopy.thaiExport}</p>
                  <h2
                    id="result-share-preview"
                    className={`mt-3 text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl ${headlineClass}`}
                  >
                    {activeCopy.sharePreview}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-[var(--signal-text-soft)]">
                    {activeCopy.sharePreviewBody}
                  </p>
                </div>
              </ResultReveal>
            </div>
          </section>

          <section className="signal-section" aria-labelledby="result-supporting-details">
            <div className="signal-container">
              <ResultReveal tone="detail">
                <div className="max-w-3xl">
                  <p className="signal-eyebrow">{activeCopy.premium}</p>
                  <h2
                    id="result-supporting-details"
                    className={`mt-3 text-3xl leading-tight text-[var(--signal-text)] sm:text-4xl ${headlineClass}`}
                  >
                    {activeCopy.premiumModulesTitle}
                  </h2>
                </div>

                <dl className="mt-8 grid border-y border-[var(--signal-border)] sm:grid-cols-3">
                  <ResultFact label={activeCopy.confidence} value={`${result.confidence}%`} />
                  <ResultFact label={activeCopy.questions} value={`${result.questionCount}`} />
                  <ResultFact label={activeCopy.created} value={createdAt} />
                </dl>

                <div className="mt-8 grid gap-x-10 lg:grid-cols-2">
                  {result.premiumSections.map((section) => (
                    <article
                      key={section.section}
                      className="border-t border-[var(--signal-border)] py-5"
                    >
                      <p className="text-sm font-bold text-[var(--signal-accent-soft)]">
                        {section.section}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold leading-7 text-[var(--signal-text)]">
                        {section.title ?? section.section}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-[var(--signal-text-soft)]">
                        {section.body}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="mt-8 border-y border-[var(--signal-border)] py-5">
                  <div className="flex items-start gap-4">
                    <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-[var(--signal-accent)]" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--signal-text)]">
                        {activeCopy.lockedTitle}
                      </h3>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--signal-text-soft)]">
                        {activeCopy.lockedBody}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link href="/login" className="signal-button-secondary min-h-11 px-4">
                          {activeCopy.premiumUnlock}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/dashboard" className="signal-button-secondary min-h-11 px-4">
                          {activeCopy.dashboard}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <Accordion className="mt-10" collapsible type="single">
                  <AccordionItem
                    className="border-y border-[var(--signal-border)]"
                    value="answer-summary"
                  >
                    <AccordionTrigger className="py-5 text-[var(--signal-text)] hover:text-[var(--signal-text)] focus-visible:ring-[var(--signal-accent)]">
                      <span className="min-w-0 text-left">
                        <span className="block text-lg font-semibold leading-7">
                          {activeCopy.answerTrailTitle}
                        </span>
                        <span className="mt-2 block text-sm font-normal leading-6 text-[var(--signal-text-muted)]">
                          {activeCopy.questions} {result.answerSummary.length}/{result.questionCount} · Core MBTI {result.coreQuestionCount} · {activeCopy.movieProfile} {result.movieQuestionCount}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 text-[var(--signal-text-soft)]">
                      <ol>
                        {result.answerSummary.map((answer, index) => (
                          <li
                            key={answer.questionKey}
                            className="grid gap-2 border-t border-[var(--signal-border)] py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(8rem,0.42fr)] sm:gap-4"
                          >
                            <span className="text-xs font-bold text-[var(--signal-text-muted)]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm leading-6 text-[var(--signal-text-soft)]">
                                {answer.question}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-[var(--signal-accent-soft)]">
                                {answer.dimension}
                              </p>
                            </div>
                            <p className="text-sm font-semibold leading-6 text-[var(--signal-text)] sm:text-right">
                              {answer.label}
                              {answer.traitCode ? (
                                <span className="ml-2 text-xs text-[var(--signal-text-muted)]">
                                  {answer.traitCode}
                                </span>
                              ) : null}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </ResultReveal>
            </div>
          </section>
        </main>

        <div aria-hidden="true" className="pointer-events-none fixed left-[-10000px] top-0">
          <ResultShareCard
            id={shareCardTargetId}
            result={shareCardResult}
            locale="th"
            exportMode
          />
        </div>
      </div>
    </>
  );
}

function ResultFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 py-4 min-[520px]:px-4 min-[520px]:first:pl-0 min-[520px]:last:pr-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
      <dt className="text-xs font-semibold text-[var(--signal-text-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-base font-semibold leading-6 text-[var(--signal-text)]">
        {value}
      </dd>
    </div>
  );
}

function localizeRenderableResult(result: GuestResult, locale: GuestLocale) {
  try {
    const localizedResult = assessmentRuntime.localizeResult(result, locale);
    return isRenderableGuestResult(localizedResult) ? localizedResult : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRenderableGuestResult(value: unknown): value is GuestResult {
  if (!isRecord(value)) return false;

  const house = value.house;
  const animal = value.animal;
  const movieProfile = value.movieProfile;

  if (!isRecord(house) || !isRecord(animal) || !isRecord(movieProfile)) return false;

  const dimensionsAreValid =
    Array.isArray(value.dimensions) &&
    value.dimensions.length === 4 &&
    value.dimensions.every(
      (dimension) =>
        isRecord(dimension) &&
        typeof dimension.pair === "string" &&
        typeof dimension.left === "string" &&
        typeof dimension.right === "string" &&
        typeof dimension.leftScore === "number" &&
        Number.isFinite(dimension.leftScore) &&
        typeof dimension.rightScore === "number" &&
        Number.isFinite(dimension.rightScore) &&
        typeof dimension.winner === "string" &&
        typeof dimension.balance === "number" &&
        Number.isFinite(dimension.balance)
    );
  const premiumSectionsAreValid =
    Array.isArray(value.premiumSections) &&
    value.premiumSections.every(
      (section) =>
        isRecord(section) &&
        typeof section.section === "string" &&
        (section.title === null || typeof section.title === "string") &&
        typeof section.body === "string"
    );
  const answerSummaryIsValid =
    Array.isArray(value.answerSummary) &&
    value.answerSummary.every(
      (answer) =>
        isRecord(answer) &&
        typeof answer.questionKey === "string" &&
        typeof answer.question === "string" &&
        typeof answer.dimension === "string" &&
        typeof answer.label === "string" &&
        (answer.traitCode === null || typeof answer.traitCode === "string")
    );

  return (
    typeof value.id === "string" &&
    (value.locale === "th" || value.locale === "en") &&
    typeof value.mbtiType === "string" &&
    /^[EISNTFJP]{4}$/.test(value.mbtiType) &&
    typeof value.createdAt === "string" &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.confidence === "number" &&
    Number.isFinite(value.confidence) &&
    typeof value.archetypeName === "string" &&
    typeof value.tagline === "string" &&
    typeof value.summaryBody === "string" &&
    (value.summaryTitle === null || typeof value.summaryTitle === "string") &&
    typeof value.questionCount === "number" &&
    Number.isFinite(value.questionCount) &&
    typeof value.coreQuestionCount === "number" &&
    Number.isFinite(value.coreQuestionCount) &&
    typeof value.movieQuestionCount === "number" &&
    Number.isFinite(value.movieQuestionCount) &&
    typeof house.title === "string" &&
    typeof house.description === "string" &&
    typeof house.accentFrom === "string" &&
    typeof house.accentTo === "string" &&
    typeof animal.name === "string" &&
    typeof animal.imagePath === "string" &&
    typeof movieProfile.title === "string" &&
    typeof movieProfile.summary === "string" &&
    Array.isArray(movieProfile.tags) &&
    movieProfile.tags.every((tag) => typeof tag === "string") &&
    dimensionsAreValid &&
    premiumSectionsAreValid &&
    answerSummaryIsValid
  );
}
