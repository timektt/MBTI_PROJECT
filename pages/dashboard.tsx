import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  History,
  LockKeyhole,
  Play,
  RefreshCcw,
  Settings2,
  Sparkles,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { ProgressScale, ResultReveal } from "@/components/cyber/motion";
import { ReconnectBundleActions } from "@/components/cyber/reconnect-bundle-actions";
import { AnimalPortrait } from "@/components/mbti-z/animal-portrait";
import { DownloadResultButton } from "@/components/mbti-z/download-result-button";
import { ResultShareCard } from "@/components/mbti-z/result-share-card";
import {
  assessmentRuntime,
  type GuestCloudReconnectBundle,
  type GuestLocale,
  type GuestResult,
  type GuestSession,
} from "@/lib/assessment-runtime";
import { mbtiZMyResultsCopy } from "@/lib/mbti-z-copy";
import { getMbtiZAnimalFocalPosition } from "@/lib/mbti-z-visuals";

type LocalizedGuestResult = ReturnType<typeof assessmentRuntime.localizeResult>;

const dashboardCopy = mbtiZMyResultsCopy;

export default function DashboardPage() {
  const { hydrated, locale } = useMbtiZLocale();
  const [latestResult, setLatestResult] = useState<GuestResult | null>(null);
  const [history, setHistory] = useState<GuestResult[]>([]);
  const [pendingSession, setPendingSession] = useState<GuestSession | null>(null);
  const [reconnectBundle, setReconnectBundle] = useState<GuestCloudReconnectBundle | null>(
    null
  );
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [ready, setReady] = useState(false);

  function hydrateDashboardState() {
    try {
      const storage = window.localStorage;
      void storage.length;

      setLatestResult(assessmentRuntime.readLatestResult());
      setHistory(assessmentRuntime.readHistory());
      setPendingSession(assessmentRuntime.readSession());
      setReconnectBundle(assessmentRuntime.exportReconnectBundle());
      setStorageUnavailable(false);
    } catch (error) {
      console.error("dashboard-storage-read-failed", error);
      setLatestResult(null);
      setHistory([]);
      setPendingSession(null);
      setReconnectBundle(null);
      setStorageUnavailable(true);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    hydrateDashboardState();
  }, [hydrated]);

  const copy = dashboardCopy[locale];

  if (!hydrated || !ready) {
    return (
      <>
        <Head>
          <title>{copy.pageTitle}</title>
          <meta name="description" content={copy.metaDescription} />
        </Head>

        <AmbientStage variant="dashboard">
          <main className="mx-auto min-h-[70vh] max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <p className="cyber-kicker mt-8 text-[10px]">{copy.localOnly}</p>
            <h1 className="mt-3 text-3xl text-white sm:text-4xl">{copy.title}</h1>
            <div
              aria-hidden="true"
              className="mt-6 h-64 animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.035]"
            />
          </main>
        </AmbientStage>
      </>
    );
  }

  const localizedLatest = latestResult
    ? assessmentRuntime.localizeResult(latestResult, locale)
    : null;
  const shareCardResult = latestResult ? assessmentRuntime.localizeResult(latestResult, "th") : null;
  const localizedHistory = history.map((entry) =>
    assessmentRuntime.localizeResult(entry, locale)
  );
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";
  const shareCardTargetId = localizedLatest
    ? `dashboard-share-card-export-${localizedLatest.id}`
    : null;
  const exportFileName = localizedLatest
    ? `mbti-z-${localizedLatest.mbtiType.toLowerCase()}-${localizedLatest.createdAt.slice(0, 10)}.png`
    : null;
  const pendingAnswerCount = pendingSession
    ? Object.keys(pendingSession.answers).length
    : 0;
  const pendingQuestionCount = pendingSession
    ? assessmentRuntime.getQuestions(pendingSession.locale).length
    : 0;
  const pendingProgress = pendingSession
    ? assessmentRuntime.getProgress(pendingSession, pendingQuestionCount)
    : 0;

  function handleStartNewQuiz() {
    const nextLocale = pendingSession?.locale ?? locale;

    if (pendingSession && !window.confirm(copy.restartConfirm)) {
      return;
    }

    try {
      assessmentRuntime.resetSession(nextLocale);
      window.location.assign(`/quiz?lang=${nextLocale}`);
    } catch (error) {
      console.error("dashboard-session-reset-failed", error);
      setStorageUnavailable(true);
    }
  }

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <meta name="description" content={copy.metaDescription} />
      </Head>

      <AmbientStage variant="dashboard">
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <header className="mt-6 border-b border-white/10 pb-6 sm:mt-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className={`text-3xl text-white sm:text-4xl ${headlineClass}`}>{copy.title}</h1>
              <p className="inline-flex items-center gap-2 text-xs text-white/52">
                <LockKeyhole className="h-3.5 w-3.5 text-[#7cc8ff]" aria-hidden="true" />
                {copy.localOnly}
              </p>
            </div>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/62">{copy.subtitle}</p>
          </header>

          {storageUnavailable ? (
            <StorageUnavailable copy={copy} headlineClass={headlineClass} onRetry={hydrateDashboardState} />
          ) : (
            <>
              {localizedLatest ? (
                <LatestResult
                  copy={copy}
                  exportFileName={exportFileName}
                  headlineClass={headlineClass}
                  locale={locale}
                  onRetake={handleStartNewQuiz}
                  result={localizedLatest}
                  shareCardResult={shareCardResult}
                  shareCardTargetId={shareCardTargetId}
                />
              ) : null}

              {pendingSession ? (
                <PendingAssessment
                  answerCount={pendingAnswerCount}
                  copy={copy}
                  headlineClass={headlineClass}
                  locale={pendingSession.locale}
                  onRestart={handleStartNewQuiz}
                  progress={pendingProgress}
                  questionCount={pendingQuestionCount}
                />
              ) : null}

              {!localizedLatest && !pendingSession ? (
                <EmptyResults copy={copy} headlineClass={headlineClass} locale={locale} />
              ) : null}

              {localizedHistory.length > 0 ? (
                <HistoryList
                  copy={copy}
                  headlineClass={headlineClass}
                  history={localizedHistory}
                  locale={locale}
                />
              ) : null}

              <AdvancedRecovery
                bundle={reconnectBundle}
                copy={copy}
                locale={locale}
                onImported={hydrateDashboardState}
              />
            </>
          )}
        </main>

        {shareCardResult && shareCardTargetId ? (
          <div aria-hidden="true" className="pointer-events-none fixed left-[-10000px] top-0">
            <ResultShareCard
              id={shareCardTargetId}
              result={shareCardResult}
              locale="th"
              exportMode
            />
          </div>
        ) : null}
      </AmbientStage>
    </>
  );
}

function LatestResult({
  copy,
  exportFileName,
  headlineClass,
  locale,
  onRetake,
  result,
  shareCardResult,
  shareCardTargetId,
}: {
  copy: (typeof dashboardCopy)[GuestLocale];
  exportFileName: string | null;
  headlineClass: string;
  locale: GuestLocale;
  onRetake: () => void;
  result: LocalizedGuestResult;
  shareCardResult: LocalizedGuestResult | null;
  shareCardTargetId: string | null;
}) {
  const createdAt = formatResultDate(result.createdAt, locale);

  return (
    <ResultReveal className="cyber-panel-strong mt-6 rounded-[1.5rem] p-5 sm:p-7" tone="hero">
      <div className="flex items-center gap-2 text-[#f5c76d]">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <p className="font-code text-[10px] uppercase tracking-[0.2em]">{copy.latest}</p>
      </div>

      <div className="mt-4 flex min-w-0 items-center gap-4 sm:gap-5">
        <AnimalPortrait
          imagePath={result.animal.imagePath}
          alt={result.animal.name}
          accentFrom={result.house.accentFrom}
          accentTo={result.house.accentTo}
          focalPosition={getMbtiZAnimalFocalPosition(result.mbtiType)}
          ratio="square"
          priority
          className="h-20 w-20 shrink-0 rounded-[1rem] sm:h-24 sm:w-24"
        />
        <div className="min-w-0">
          <h2 className={`text-5xl leading-none text-white sm:text-6xl ${headlineClass}`}>
            {result.mbtiType}
          </h2>
          <p className="mt-2 text-base leading-6 text-[#f5c76d] sm:text-lg">
            {result.archetypeName}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/48">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {createdAt}
          </p>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-base leading-7 text-white/72 line-clamp-3">
        {result.summaryBody}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-white/10 py-4 sm:grid-cols-4">
        <ResultFact label={copy.house} value={result.house.title} />
        <ResultFact label={copy.animal} value={result.animal.name} />
        <ResultFact label={copy.movieProfile} value={result.movieProfile.title} />
        <ResultFact label={copy.patternClarity} value={`${result.confidence}%`} />
      </dl>

      <p className="mt-5 text-sm leading-6 text-white/52">{copy.latestBody}</p>
      <div className="mt-3 grid gap-3 min-[390px]:flex min-[390px]:flex-wrap">
        <Link
          href={`/result/${result.id}`}
          className="signal-button-primary h-12 w-full min-w-0 justify-center px-5 text-center min-[390px]:w-auto"
        >
          {copy.openResult}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href={`/types/${result.mbtiType.toLowerCase()}`}
          className="signal-button-secondary h-12 w-full min-w-0 justify-center px-5 text-center min-[390px]:w-auto"
        >
          {copy.openType}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {shareCardTargetId && exportFileName ? (
          <DownloadResultButton
            className="signal-button-secondary h-12 w-full rounded-[var(--signal-radius-md)] !bg-transparent px-5 font-sans text-sm normal-case tracking-normal !text-white min-[390px]:w-auto"
            targetId={shareCardTargetId}
            fileName={exportFileName}
            label={copy.downloadPng}
            payload={shareCardResult ?? undefined}
            processingLabel={copy.processingPng}
            errorLabel={copy.downloadError}
          />
        ) : null}
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex h-12 w-full items-center justify-center gap-2 px-2 text-sm text-white/52 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c76d]/35 min-[390px]:w-auto"
        >
          <RefreshCcw className="h-4 w-4" aria-hidden="true" />
          {copy.retake}
        </button>
      </div>
    </ResultReveal>
  );
}

function PendingAssessment({
  answerCount,
  copy,
  headlineClass,
  locale,
  onRestart,
  progress,
  questionCount,
}: {
  answerCount: number;
  copy: (typeof dashboardCopy)[GuestLocale];
  headlineClass: string;
  locale: GuestLocale;
  onRestart: () => void;
  progress: number;
  questionCount: number;
}) {
  return (
    <ResultReveal
      className="mt-6 border-y border-[#7cc8ff]/20 bg-[#7cc8ff]/[0.055] px-1 py-5 sm:px-5"
      tone="detail"
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[#9bd8ff]">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            <p className="font-code text-[10px] uppercase tracking-[0.18em]">{copy.pending}</p>
          </div>
          <h2 className={`mt-2 text-xl text-white sm:text-2xl ${headlineClass}`}>
            {copy.resumeTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/64">{copy.resumeBody}</p>
          <p className="mt-3 text-xs text-white/52">
            {answerCount}/{questionCount} {copy.questionUnit}
          </p>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label={copy.answered}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <ProgressScale className="rounded-full bg-[#7cc8ff]" value={progress} />
          </div>
        </div>

        <div className="grid gap-2 min-[390px]:flex md:justify-end">
          <Link
            href={`/quiz?lang=${locale}`}
            className="signal-button-primary h-12 w-full min-w-0 justify-center px-5 text-center min-[390px]:w-auto"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            {copy.continueQuiz}
          </Link>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-12 w-full items-center justify-center gap-2 px-3 text-sm text-white/52 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cc8ff]/40 min-[390px]:w-auto"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            {copy.restartQuiz}
          </button>
        </div>
      </div>
    </ResultReveal>
  );
}

function EmptyResults({
  copy,
  headlineClass,
  locale,
}: {
  copy: (typeof dashboardCopy)[GuestLocale];
  headlineClass: string;
  locale: GuestLocale;
}) {
  return (
    <ResultReveal className="cyber-panel-strong mt-6 rounded-[1.5rem] p-6 sm:p-9" tone="hero">
      <h2 className={`max-w-2xl text-3xl leading-tight text-white sm:text-4xl ${headlineClass}`}>
        {copy.emptyTitle}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-white/64">{copy.emptyBody}</p>
      <Link
        href={`/quiz?lang=${locale}`}
        className="signal-button-primary mt-6 h-12 w-full min-w-0 justify-center px-5 text-center min-[390px]:w-auto"
      >
        {copy.startQuiz}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </ResultReveal>
  );
}

function HistoryList({
  copy,
  headlineClass,
  history,
  locale,
}: {
  copy: (typeof dashboardCopy)[GuestLocale];
  headlineClass: string;
  history: LocalizedGuestResult[];
  locale: GuestLocale;
}) {
  return (
    <section className="mt-6 border-t border-white/10 pt-6" aria-labelledby="results-history-title">
      <ResultReveal delay={0.12}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-white/48">
              <History className="h-4 w-4" aria-hidden="true" />
              <p className="font-code text-[10px] uppercase tracking-[0.2em]">{copy.history}</p>
            </div>
            <h2 id="results-history-title" className={`mt-2 text-2xl text-white ${headlineClass}`}>
              {copy.history}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/58">{copy.historyBody}</p>
          </div>
          <p className="font-code text-[10px] uppercase tracking-[0.18em] text-white/42">
            {history.length}/8
          </p>
        </div>

        <ol className="mt-4 divide-y divide-white/10">
          {history.map((entry, index) => (
            <HistoryRow
              key={entry.id}
              entry={entry}
              index={index}
              locale={locale}
              openLabel={copy.openHistoryItem}
            />
          ))}
        </ol>
      </ResultReveal>
    </section>
  );
}

function AdvancedRecovery({
  bundle,
  copy,
  locale,
  onImported,
}: {
  bundle: GuestCloudReconnectBundle | null;
  copy: (typeof dashboardCopy)[GuestLocale];
  locale: GuestLocale;
  onImported: () => void;
}) {
  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <details className="group rounded-[1.25rem] border border-white/10 bg-white/[0.025]">
        <summary className="flex min-h-14 list-none cursor-pointer items-center gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7cc8ff]/35 [&::-webkit-details-marker]:hidden">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/66">
            <Settings2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white/82">{copy.advanced}</span>
            <span className="mt-1 block text-xs leading-5 text-white/48">{copy.advancedTitle}</span>
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-white/52 transition group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>

        <div className="border-t border-white/10 p-4 sm:p-5">
          <p className="mb-4 max-w-2xl text-sm leading-6 text-white/58">{copy.advancedBody}</p>
          <ReconnectBundleActions
            bundle={bundle}
            compact
            locale={locale}
            onImported={onImported}
          />
        </div>
      </details>
    </section>
  );
}

function StorageUnavailable({
  copy,
  headlineClass,
  onRetry,
}: {
  copy: (typeof dashboardCopy)[GuestLocale];
  headlineClass: string;
  onRetry: () => void;
}) {
  return (
    <ResultReveal
      className="mt-6 border border-[#ffb4a8]/20 bg-[#ffb4a8]/[0.055] p-6 sm:p-8"
      tone="detail"
    >
      <div className="flex items-center gap-2 text-[#ffb4a8]">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        <p className="font-code text-[10px] uppercase tracking-[0.18em]">{copy.storageEyebrow}</p>
      </div>
      <h2 className={`mt-3 text-2xl text-white sm:text-3xl ${headlineClass}`}>{copy.storageTitle}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64">{copy.storageBody}</p>
      <button
        type="button"
        onClick={onRetry}
        className="signal-button-primary mt-6 h-12 w-full min-w-0 justify-center px-5 text-center min-[390px]:w-auto"
      >
        <RefreshCcw className="h-4 w-4" aria-hidden="true" />
        {copy.retryStorage}
      </button>
    </ResultReveal>
  );
}

function HistoryRow({
  entry,
  index,
  locale,
  openLabel,
}: {
  entry: LocalizedGuestResult;
  index: number;
  locale: GuestLocale;
  openLabel: string;
}) {
  const accessibleLabel = `${openLabel}: ${entry.mbtiType} ${entry.archetypeName}`;

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4">
      <p className="w-7 font-code text-[10px] text-white/32">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-editorial text-2xl leading-none text-white">{entry.mbtiType}</p>
          <p className="min-w-0 truncate text-sm text-[#f5c76d]">{entry.archetypeName}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/48">
          <span>{formatResultDate(entry.createdAt, locale)}</span>
          <span>{entry.house.title}</span>
          <span>{entry.animal.name}</span>
        </div>
      </div>
      <Link
        href={`/result/${entry.id}`}
        className="inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full border border-white/10 text-white/70 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c76d]/35"
        aria-label={accessibleLabel}
        title={accessibleLabel}
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </li>
  );
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-code text-[9px] uppercase tracking-[0.14em] text-white/38">{label}</dt>
      <dd className="mt-1 truncate text-sm text-white/78" title={value}>
        {value}
      </dd>
    </div>
  );
}

function formatResultDate(value: string, locale: GuestLocale) {
  return new Date(value).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
