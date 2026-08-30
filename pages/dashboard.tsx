import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Clock3,
  DatabaseZap,
  LockKeyhole,
  Orbit,
  Radar,
  Sparkles,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { LocaleToggle } from "@/components/cyber/locale-toggle";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { ResultReveal, Stagger, StaggerItem } from "@/components/cyber/motion";
import { DownloadResultButton } from "@/components/mbti-z/download-result-button";
import { ResultShareCard } from "@/components/mbti-z/result-share-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReconnectBundleActions } from "@/components/cyber/reconnect-bundle-actions";
import {
  assessmentRuntime,
  type AssessmentReconnectState,
  type GuestCloudReconnectBundle,
  type GuestResult,
} from "@/lib/assessment-runtime";
import { mbtiZDashboardCopy } from "@/lib/mbti-z-copy";

export default function DashboardPage() {
  const { hydrated, locale, setLocale } = useMbtiZLocale();
  const [latestResult, setLatestResult] = useState<GuestResult | null>(null);
  const [history, setHistory] = useState<GuestResult[]>([]);
  const [reconnectState, setReconnectState] = useState<AssessmentReconnectState | null>(null);
  const [reconnectBundle, setReconnectBundle] = useState<GuestCloudReconnectBundle | null>(
    null
  );
  const [ready, setReady] = useState(false);

  function hydrateDashboardState() {
    const latest = assessmentRuntime.readLatestResult();
    const recentHistory = assessmentRuntime.readHistory();

    setLatestResult(latest);
    setHistory(recentHistory);
    setReconnectState(assessmentRuntime.getReconnectState());
    setReconnectBundle(assessmentRuntime.exportReconnectBundle());
    setReady(true);
  }

  useEffect(() => {
    if (!hydrated) return;
    hydrateDashboardState();
  }, [hydrated]);

  const activeCopy = mbtiZDashboardCopy[locale];

  if (!hydrated || !ready) {
    return (
      <>
        <Head>
          <title>{activeCopy.pageTitle}</title>
          <meta name="description" content={activeCopy.metaDescription} />
        </Head>

        <AmbientStage variant="dashboard">
          <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <div className="mt-8 cyber-panel rounded-[2rem] p-8 sm:p-10">
              <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/42">
                {activeCopy.eyebrow}
              </p>
              <h1 className="mt-4 text-3xl text-white sm:text-4xl">{activeCopy.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/66">{activeCopy.subtitle}</p>
            </div>
          </div>
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
  const shareCardTargetId = localizedLatest ? `dashboard-share-card-export-${localizedLatest.id}` : null;
  const exportFileName = localizedLatest
    ? `mbti-z-${localizedLatest.mbtiType.toLowerCase()}-${localizedLatest.createdAt.slice(0, 10)}.png`
    : null;
  const latestCreatedAt = localizedLatest
    ? new Date(localizedLatest.createdAt).toLocaleDateString(
        locale === "th" ? "th-TH" : "en-US"
      )
    : null;
  const handoffStateLabel = reconnectState?.ready
    ? activeCopy.handoffReady
    : activeCopy.handoffIdle;

  return (
    <>
      <Head>
        <title>{activeCopy.pageTitle}</title>
        <meta name="description" content={activeCopy.metaDescription} />
      </Head>

      <AmbientStage variant="dashboard">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <Link
              href="/quiz"
              className="inline-flex h-11 items-center rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814]"
            >
              {activeCopy.retake}
            </Link>
          </div>

          <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="space-y-6">
              <ResultReveal className="cyber-panel-strong self-start rounded-[1.9rem] p-5 sm:p-6" tone="hero">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c76d]/15 bg-[#f5c76d]/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.3em] text-[#ffe3a1]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {activeCopy.eyebrow}
                </div>
                <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.24em] text-white/60">
                  {handoffStateLabel}
                </div>
              </div>

              <h1 className={`mt-5 max-w-5xl text-[2.4rem] leading-[0.96] text-white sm:text-[3.15rem] ${headlineClass}`}>
                {activeCopy.title}
              </h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
                {activeCopy.subtitle}
              </p>
              {localizedLatest && shareCardTargetId && exportFileName ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <DownloadResultButton
                    targetId={shareCardTargetId}
                    fileName={exportFileName}
                    label={activeCopy.downloadPng}
                    payload={shareCardResult ?? undefined}
                    processingLabel={activeCopy.processingPng}
                    errorLabel={activeCopy.downloadError}
                  />
                  <Link
                    href={`/result/${localizedLatest.id}`}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.14em] text-white/74 transition hover:bg-white/8 hover:text-white"
                  >
                    {activeCopy.open}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}

              {!localizedLatest ? (
                <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                  <p className={`text-2xl text-white ${headlineClass}`}>{activeCopy.noResultTitle}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66">
                    {activeCopy.noResultBody}
                  </p>
                  <Link
                    href="/quiz"
                    className="mt-6 inline-flex h-11 items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3 font-code text-[11px] font-semibold uppercase tracking-[0.14em] text-[#050814]"
                  >
                    {activeCopy.startQuiz}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-start">
                    <div className="min-w-0">
                      <p className="cyber-kicker text-[11px]">{activeCopy.latest}</p>
                      <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
                        <h2 className={`text-4xl text-white sm:text-5xl ${headlineClass}`}>{localizedLatest.mbtiType}</h2>
                        <p className="text-base text-[#f5c76d] sm:text-lg">{localizedLatest.archetypeName}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/62">
                          {activeCopy.house} · {localizedLatest.house.title}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/62">
                          {activeCopy.animal} · {localizedLatest.animal.name}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/62">
                          {activeCopy.created} ·{" "}
                          {latestCreatedAt}
                        </span>
                      </div>
                      <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 line-clamp-2">
                        {localizedLatest.summaryBody}
                      </p>
                      <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4">
                        <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/42">
                          {activeCopy.movieProfile}
                        </p>
                      <p className="mt-2 text-sm text-[#f5c76d]">{localizedLatest.movieProfile.title}</p>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-white/58 line-clamp-2">
                        {localizedLatest.movieProfile.summary}
                      </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <FocusMetric
                        label={activeCopy.confidenceLabel}
                        value={`${localizedLatest.confidence}%`}
                        tone="gold"
                      />
                      <FocusMetric
                        label={activeCopy.movieProfile}
                        value={localizedLatest.movieProfile.tags[0] ?? localizedLatest.movieProfile.title}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/result/${localizedLatest.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.14em] text-white/74 transition hover:bg-white/8 hover:text-white"
                    >
                      {activeCopy.open}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/types"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.14em] text-white/74 transition hover:bg-white/8 hover:text-white"
                    >
                      {activeCopy.typeAtlas}
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <CompactMetric
                  icon={<Orbit className="h-4 w-4" />}
                  label={activeCopy.runtime}
                  value={activeCopy.guestValue}
                />
                <CompactMetric
                  icon={<DatabaseZap className="h-4 w-4" />}
                  label={activeCopy.historySlots}
                  value={`${history.length}${activeCopy.historySlotsValueSuffix}`}
                />
                <CompactMetric
                  icon={<Radar className="h-4 w-4" />}
                  label={activeCopy.bilingual}
                  value={activeCopy.bilingualValue}
                />
                <CompactMetric
                  icon={<Clock3 className="h-4 w-4" />}
                  label={activeCopy.handoff}
                  value={handoffStateLabel}
                />
              </div>
              </ResultReveal>
            </div>

            <div className="space-y-4 self-start lg:sticky lg:top-24">
              {shareCardResult ? (
                <ResultShareCard
                  result={shareCardResult}
                  locale="th"
                  className="mx-auto w-full max-w-[360px]"
                />
              ) : (
                <ResultReveal className="cyber-panel rounded-[1.8rem] p-6" delay={0.06}>
                  <p className="cyber-kicker text-[11px]">{activeCopy.sharePreview}</p>
                  <p className="mt-3 text-sm leading-7 text-white/64">{activeCopy.noResultBody}</p>
                </ResultReveal>
              )}

              <ResultReveal className="cyber-panel rounded-[1.8rem] p-5 sm:p-6" delay={0.1}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7cc8ff]/12 text-[#7cc8ff]">
                    <Radar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="cyber-kicker text-[11px]">{activeCopy.vaultTitle}</p>
                    <p className="mt-2 text-sm leading-7 text-white/64">{activeCopy.vaultBody}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(localizedLatest?.movieProfile.tags.slice(0, 3) ?? activeCopy.vaultTags).map((tag) => (
                    <span
                      key={tag}
                      className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/58"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </ResultReveal>
            </div>
          </section>

          <section className="mt-6">
            <ResultReveal className="cyber-panel rounded-[2rem] p-5 sm:p-7" delay={0.1}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="cyber-kicker text-[11px]">{activeCopy.history}</p>
                  <h2 className={`mt-2 text-2xl text-white ${headlineClass}`}>{activeCopy.archiveTitle}</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64">{activeCopy.archiveBody}</p>
                </div>
                <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.2em] text-white/58">
                  {handoffStateLabel}
                </div>
              </div>

              <Tabs className="mt-6" defaultValue="archive">
                <TabsList>
                  <TabsTrigger value="archive">{activeCopy.archiveTitle}</TabsTrigger>
                  <TabsTrigger value="cloud">{activeCopy.cloudQueueTitle}</TabsTrigger>
                </TabsList>

                <TabsContent value="archive">
                  <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7cc8ff]/12 text-[#7cc8ff]">
                          <DatabaseZap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="cyber-kicker text-[11px]">{activeCopy.archiveTitle}</p>
                          <p className="mt-2 text-sm leading-7 text-white/64">{activeCopy.archiveBody}</p>
                        </div>
                      </div>

                      <ScrollArea className="mt-5 h-[21rem] pr-4">
                        <Stagger className="space-y-4" mode="mount">
                          {localizedHistory.length === 0 ? (
                            <StaggerItem className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/64">
                              {activeCopy.noResultBody}
                            </StaggerItem>
                          ) : (
                            localizedHistory.map((entry, index) => (
                              <StaggerItem
                                key={entry.id}
                                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/40">
                                      {activeCopy.archiveItemLabel} {index + 1}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-3">
                                      <p className="font-editorial text-3xl text-white">{entry.mbtiType}</p>
                                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-white/58">
                                        {entry.house.title}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-sm text-[#f5c76d]">{entry.archetypeName}</p>
                                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/62 line-clamp-2">
                                      {entry.summaryBody}
                                    </p>
                                  </div>
                                  <div className="space-y-3 text-right">
                                    <div className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/56">
                                      {entry.confidence}% {activeCopy.confidenceLabel}
                                    </div>
                                    <Link
                                      href={`/result/${entry.id}`}
                                      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/8 hover:text-white"
                                    >
                                      {activeCopy.open}
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                  </div>
                                </div>
                              </StaggerItem>
                            ))
                          )}
                        </Stagger>
                      </ScrollArea>
                    </div>

                    <div className="space-y-4">
                      <OfflineCard title={activeCopy.localExport} body={activeCopy.sharePreviewBody} />
                      <OfflineCard
                        title={activeCopy.movieProfile}
                        body={localizedLatest?.movieProfile.summary ?? activeCopy.noResultBody}
                        meta={localizedLatest ? localizedLatest.movieProfile.tags.slice(0, 3) : undefined}
                      />
                      <OfflineCard
                        title={activeCopy.handoffTitle}
                        body={reconnectState?.ready ? activeCopy.handoffBodyReady : activeCopy.handoffBodyIdle}
                        meta={[
                          reconnectState?.bundleVersion ?? activeCopy.noBundleLabel,
                          `${activeCopy.historyMetaPrefix} ${reconnectState?.historyCount ?? 0}`,
                        ]}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cloud">
                  <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ba7eff]/12 text-[#ba7eff]">
                          <LockKeyhole className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="cyber-kicker text-[11px]">{activeCopy.locked}</p>
                          <p className="mt-2 text-sm leading-7 text-white/64">{activeCopy.lockedBody}</p>
                        </div>
                      </div>

                      <OfflineCard
                        title={activeCopy.accountSyncTitle}
                        body={reconnectState?.ready ? activeCopy.handoffBodyReady : activeCopy.handoffBodyIdle}
                        meta={[
                          reconnectState?.bundleVersion ?? activeCopy.noBundleLabel,
                          `${activeCopy.historyMetaPrefix} ${reconnectState?.historyCount ?? 0}`,
                          `${activeCopy.pendingSession} ${reconnectState?.inProgressAnswerCount ?? 0}`,
                        ]}
                      />
                      <OfflineCard title={activeCopy.premiumUnlockTitle} body={activeCopy.lockedBody} />
                    </div>

                    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-5">
                      {reconnectState?.ready ? (
                        <div className="rounded-[1.4rem] border border-[#f5c76d]/14 bg-[#f5c76d]/8 p-5">
                          <p className="font-code text-[11px] uppercase tracking-[0.24em] text-[#ffe4aa]">
                            {activeCopy.handoffTitle}
                          </p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="font-code text-[11px] uppercase tracking-[0.2em] text-white/44">
                                {activeCopy.lastActivity}
                              </p>
                              <p className="mt-2 text-sm text-white/78">
                                {reconnectState.lastActivityAt
                                  ? new Date(reconnectState.lastActivityAt).toLocaleString(
                                      locale === "th" ? "th-TH" : "en-US"
                                    )
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <p className="font-code text-[11px] uppercase tracking-[0.2em] text-white/44">
                                {activeCopy.exportedLabel}
                              </p>
                              <p className="mt-2 text-sm text-white/78">
                                {reconnectState.exportedAt
                                  ? new Date(reconnectState.exportedAt).toLocaleString(
                                      locale === "th" ? "th-TH" : "en-US"
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <ReconnectBundleActions
                        bundle={reconnectBundle}
                        locale={locale}
                        onImported={hydrateDashboardState}
                      />

                      <Link
                        href="/login"
                        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.18em] text-white/72 transition hover:bg-white/8 hover:text-white"
                      >
                        {activeCopy.accountQueue}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ResultReveal>
          </section>
        </div>

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

function CompactMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.05] p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-[0.95rem] bg-white/[0.06] text-[#f5c76d]">
        {icon}
      </div>
      <p className="mt-3 font-code text-[10px] uppercase tracking-[0.22em] text-white/44">{label}</p>
      <p className="mt-1.5 font-editorial text-[1.55rem] leading-none text-white">{value}</p>
    </div>
  );
}

function FocusMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "gold";
}) {
  return (
    <div
      className={
        tone === "gold"
          ? "rounded-[1.35rem] border border-[#f5c76d]/15 bg-[#f5c76d]/8 p-4"
          : "rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4"
      }
    >
      <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/44">{label}</p>
      <p className="mt-2 text-base text-white sm:text-lg">{value}</p>
    </div>
  );
}

function OfflineCard({
  title,
  body,
  meta,
}: {
  title: string;
  body: string;
  meta?: readonly string[];
}) {
  return (
    <StaggerItem className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="font-medium text-white">{title}</p>
      <p className="mt-3 text-sm leading-7 text-white/64">{body}</p>
      {meta?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.map((item) => (
            <span
              key={item}
              className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/52"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </StaggerItem>
  );
}
