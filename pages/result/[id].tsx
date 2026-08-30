import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Gauge,
  Layers3,
  LockKeyhole,
  Orbit,
  RefreshCw,
  ScrollText,
  Sparkles,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { ChapterTrack } from "@/components/cyber/chapter-track";
import { LocaleToggle } from "@/components/cyber/locale-toggle";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { ResultReveal, Stagger, StaggerItem } from "@/components/cyber/motion";
import { AnimalPortrait } from "@/components/mbti-z/animal-portrait";
import { DownloadResultButton } from "@/components/mbti-z/download-result-button";
import { ResultShareCard } from "@/components/mbti-z/result-share-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  assessmentRuntime,
  type GuestResult,
} from "@/lib/assessment-runtime";
import { mbtiZResultCopy } from "@/lib/mbti-z-copy";

export default function ResultPage() {
  const router = useRouter();
  const { hydrated, locale, setLocale } = useMbtiZLocale();
  const [baseResult, setBaseResult] = useState<GuestResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated || !router.isReady) return;

    const resultId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    if (!resultId) return;

    const storedResult = assessmentRuntime.getResultById(resultId);
    const nextLocale = assessmentRuntime.resolveLocale(
      typeof router.query.lang === "string" ? router.query.lang : locale,
      storedResult?.locale
    );

    if (nextLocale !== locale) {
      setLocale(nextLocale);
    }

    setBaseResult(storedResult);
    setReady(true);
  }, [hydrated, locale, router.isReady, router.query.id, router.query.lang, setLocale]);

  const activeCopy = mbtiZResultCopy[locale];

  const result = baseResult ? assessmentRuntime.localizeResult(baseResult, locale) : null;
  const shareCardResult = baseResult ? assessmentRuntime.localizeResult(baseResult, "th") : null;

  if (!hydrated || !ready) {
    return (
      <>
        <Head>
          <title>{activeCopy.notFoundPageTitle}</title>
        </Head>

        <AmbientStage variant="result">
          <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <div className="mt-8 cyber-panel rounded-[2rem] p-8 sm:p-10">
              <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/42">
                {activeCopy.kicker}
              </p>
              <h1 className="mt-5 text-3xl text-white sm:text-4xl">{activeCopy.signature}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/66">
                {activeCopy.signatureBody}
              </p>
            </div>
          </div>
        </AmbientStage>
      </>
    );
  }
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";

  if (!result) {
    return (
      <AmbientStage variant="hold">
        <Head>
          <title>{activeCopy.notFoundPageTitle}</title>
        </Head>
        <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="cyber-panel-strong w-full rounded-[2rem] p-8 text-center sm:p-12">
            <p className="cyber-kicker text-xs">{activeCopy.kicker}</p>
            <h1 className={`mt-6 text-4xl text-white ${headlineClass}`}>{activeCopy.notFoundTitle}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/68">
              {activeCopy.notFoundBody}
            </p>
            <Link
              href="/quiz"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-6 py-4 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814]"
            >
              {activeCopy.notFoundCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </AmbientStage>
    );
  }

  const artifactLayers = [
    {
      label: `${activeCopy.layerLabel} 01`,
      title: result.mbtiType,
      body: result.summaryTitle ?? activeCopy.summary,
      meta: result.archetypeName,
    },
    {
      label: `${activeCopy.layerLabel} 02`,
      title: activeCopy.dimensions,
      body: activeCopy.signalMapTitle,
      meta: `${result.dimensions.length} ${activeCopy.axesUnit}`,
    },
    {
      label: `${activeCopy.layerLabel} 03`,
      title: activeCopy.premium,
      body: activeCopy.premiumModulesTitle,
      meta: `${result.premiumSections.length} ${activeCopy.modulesUnit}`,
    },
    {
      label: `${activeCopy.layerLabel} 04`,
      title: activeCopy.answers,
      body: activeCopy.answerTrailTitle,
      meta: `${Math.min(result.answerSummary.length, 6)} ${activeCopy.tracesUnit}`,
    },
  ];
  const shareCardTargetId = `result-share-card-export-${result.id}`;
  const exportFileName = `mbti-z-${result.mbtiType.toLowerCase()}-${result.createdAt.slice(0, 10)}.png`;

  return (
    <>
      <Head>
        <title>{`${result.mbtiType} | MBTI Z`}</title>
        <meta name="description" content={result.summaryBody} />
      </Head>

      <AmbientStage variant="result">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <Link
              href="/dashboard"
              className="cyber-data-chip inline-flex h-11 items-center rounded-full px-4 py-2 font-code text-[11px] uppercase tracking-[0.24em] text-white/68 transition hover:bg-white/10 hover:text-white"
            >
              {activeCopy.dashboard}
            </Link>
          </div>

          <ResultReveal className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start" tone="hero">
            <div className="cyber-panel-strong self-start rounded-[1.9rem] p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c76d]/15 bg-[#f5c76d]/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.28em] text-[#ffe3a1]">
                  <Orbit className="h-3.5 w-3.5" />
                  {activeCopy.kicker}
                </div>
                <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.24em] text-white/60">
                  {activeCopy.artifactRuntimeState}
                </div>
              </div>

              <h1 className={`mt-6 text-[3.9rem] leading-[0.88] text-white sm:text-[5.35rem] ${headlineClass}`}>
                {result.mbtiType}
              </h1>
              <p className="mt-4 text-lg text-[#f5c76d] sm:text-xl">{result.archetypeName}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">{result.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {shareCardResult ? (
                  <DownloadResultButton
                    targetId={shareCardTargetId}
                    fileName={exportFileName}
                    label={activeCopy.downloadPng}
                    payload={shareCardResult}
                    processingLabel={activeCopy.processingPng}
                    errorLabel={activeCopy.downloadError}
                  />
                ) : null}
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.16em] text-white/72 transition hover:bg-white/8 hover:text-white"
                >
                  {activeCopy.dashboard}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/quiz"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.16em] text-white/72 transition hover:bg-white/8 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                  {activeCopy.retake}
                </Link>
                <Link
                  href="/types"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.16em] text-white/72 transition hover:bg-white/8 hover:text-white"
                >
                  {activeCopy.typeAtlas}
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.22em] text-white/72">
                  {activeCopy.house} · {result.house.title}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.22em] text-white/72">
                  {activeCopy.animal} · {result.animal.name}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.22em] text-white/72">
                  {activeCopy.movieProfile} · {result.movieProfile.title}
                </span>
              </div>

              <div className="mt-5 rounded-[1.65rem] border border-white/10 bg-white/[0.04] p-5">
                <p className="font-code text-[11px] uppercase tracking-[0.26em] text-white/42">
                  {result.summaryTitle ?? activeCopy.summary}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/82 sm:text-base sm:leading-8">{result.summaryBody}</p>
              </div>

              <div className="mt-5 rounded-[1.45rem] border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#ba7eff]/12 text-[#ba7eff]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="cyber-kicker text-[11px]">{activeCopy.movieProfile}</p>
                    <p className="mt-2 text-sm text-[#f5c76d]">{result.movieProfile.title}</p>
                    <p className="mt-2 text-sm leading-7 text-white/62">{result.movieProfile.summary}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.movieProfile.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InlineMetric label={activeCopy.confidence} value={`${result.confidence}%`} />
                <InlineMetric label={activeCopy.questions} value={`${result.questionCount}`} />
                <InlineMetric label={activeCopy.runtime} value={activeCopy.local} />
                <InlineMetric
                  label={activeCopy.created}
                  value={new Date(result.createdAt).toLocaleDateString(
                    locale === "th" ? "th-TH" : "en-US"
                  )}
                />
              </div>

            </div>

            <div className="space-y-4 self-start lg:sticky lg:top-24">
              <AnimalPortrait
                accentFrom={result.house.accentFrom}
                accentTo={result.house.accentTo}
                alt={`${result.mbtiType} ${result.animal.name}`}
                imagePath={result.animal.imagePath}
                label={`${activeCopy.animal} · ${result.animal.name}`}
                ratio="portrait"
                subtitle={result.house.description}
                title={result.animal.name}
                titleClassName="text-[2.15rem] sm:text-[2.4rem]"
                priority
              />
              {shareCardResult ? (
                <ResultShareCard
                  result={shareCardResult}
                  locale="th"
                  className="mx-auto w-full max-w-[360px]"
                />
              ) : null}

              <ResultReveal className="cyber-panel rounded-[1.7rem] p-5" delay={0.05}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7cc8ff]/12 text-[#7cc8ff]">
                    <ScrollText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="cyber-kicker text-[11px]">{activeCopy.sharePreview}</p>
                    <p className="mt-2 text-sm leading-6 text-white/64">
                      {activeCopy.sharePreviewBody}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="cyber-data-chip rounded-full px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/58">
                    {activeCopy.thaiExport}
                  </span>
                  {shareCardResult ? (
                    <DownloadResultButton
                      targetId={shareCardTargetId}
                      fileName={exportFileName}
                      label={activeCopy.downloadPng}
                      payload={shareCardResult}
                      processingLabel={activeCopy.processingPng}
                      errorLabel={activeCopy.downloadError}
                    />
                  ) : null}
                </div>
              </ResultReveal>
            </div>
          </ResultReveal>
          <ResultReveal className="mt-5 cyber-panel rounded-[1.9rem] p-5 sm:p-6" delay={0.04}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#ba7eff]/12 text-[#ba7eff]">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="cyber-kicker text-[11px]">{activeCopy.artifactLayersTitle}</p>
                  <h2 className={`mt-3 text-2xl text-white ${headlineClass}`}>
                    {activeCopy.artifactLayersBody}
                  </h2>
                </div>
              </div>
              <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-xs uppercase tracking-[0.22em] text-white/46">
                {activeCopy.artifactRuntimeState}
              </div>
            </div>
            <ChapterTrack
              activeIndex={artifactLayers.length - 1}
              className="mt-6"
              items={artifactLayers}
              orientation="horizontal"
              tone="gold"
            />
          </ResultReveal>

          <section className="mt-5 grid gap-5 lg:grid-cols-[0.98fr_1.02fr]">
            <ResultReveal className="cyber-panel rounded-[1.9rem] p-6" delay={0.08}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7cc8ff]/12 text-[#7cc8ff]">
                  <Gauge className="h-5 w-5" />
                </div>
                <div>
                  <p className="cyber-kicker text-[11px]">{activeCopy.dimensions}</p>
                  <h2 className={`mt-2 text-2xl text-white ${headlineClass}`}>
                    {activeCopy.signalMapTitle}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {result.dimensions.map((dimension) => {
                  const spread = Math.abs(dimension.leftScore - dimension.rightScore);

                  return (
                    <div
                      key={`summary-${dimension.pair}`}
                      className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4"
                    >
                      <p className="font-code text-[10px] uppercase tracking-[0.24em] text-white/40">
                        {dimension.pair}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="font-editorial text-2xl text-white">{dimension.winner}</p>
                        <span className="rounded-full border border-[#f5c76d]/14 bg-[#f5c76d]/10 px-3 py-1 font-code text-[10px] uppercase tracking-[0.22em] text-[#ffe4aa]">
                          {activeCopy.spreadLabel} {spread}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Stagger className="mt-6 space-y-4" mode="mount" staggerChildren={0.08}>
                {result.dimensions.map((dimension) => {
                  const total = Math.max(dimension.leftScore + dimension.rightScore, 1);
                  const leftPercent = Math.round((dimension.leftScore / total) * 100);
                  const rightPercent = 100 - leftPercent;

                  return (
                    <StaggerItem
                      key={dimension.pair}
                      className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-code text-xs uppercase tracking-[0.26em] text-white/44">
                          {dimension.pair}
                        </p>
                        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-[#ffe3a1]">
                          {activeCopy.winnerLabel} · {dimension.winner}
                        </p>
                      </div>
                      <div className="cyber-signal-bar mt-4 h-3">
                        <div className="flex h-full">
                          <motion.div
                            className="bg-[linear-gradient(90deg,#7cc8ff,#ba7eff)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${leftPercent}%` }}
                            transition={{ duration: 0.72, delay: 0.18, ease: "easeOut" }}
                          />
                          <motion.div
                            className="bg-[linear-gradient(90deg,#f5c76d,#ff9b8f)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${rightPercent}%` }}
                            transition={{ duration: 0.72, delay: 0.22, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-white/64">
                        <span>
                          {dimension.left}: {dimension.leftScore}
                        </span>
                        <span>
                          {dimension.right}: {dimension.rightScore}
                        </span>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </ResultReveal>

            <ResultReveal className="cyber-panel rounded-[1.9rem] p-6" delay={0.12}>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#f5c76d]/12 text-[#f5c76d]">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="cyber-kicker text-[11px]">{activeCopy.premium}</p>
                  <h2 className={`mt-2 text-2xl text-white ${headlineClass}`}>
                    {activeCopy.premiumModulesTitle}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62">
                    {activeCopy.artifactLayersBody}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/58">
                  {result.premiumSections.length} {activeCopy.modulesUnit}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/58">
                  {Math.min(result.answerSummary.length, 6)} {activeCopy.tracesUnit}
                </span>
              </div>

              <Tabs className="mt-5" defaultValue="premium">
                <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap md:w-fit md:overflow-visible">
                  <TabsTrigger value="premium">{activeCopy.premium}</TabsTrigger>
                  <TabsTrigger value="answers">{activeCopy.answers}</TabsTrigger>
                  <TabsTrigger value="account">{activeCopy.accountQueue}</TabsTrigger>
                </TabsList>

                <TabsContent value="premium">
                  <ScrollArea className="mt-5 md:h-[26rem] md:pr-4">
                    <Stagger className="space-y-4" mode="mount">
                      {result.premiumSections.map((section) => (
                        <StaggerItem
                          key={section.section}
                          className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5"
                        >
                          <p className="font-code text-xs uppercase tracking-[0.24em] text-[#f5c76d]">
                            {section.section}
                          </p>
                          <p className="mt-3 font-medium text-white">
                            {section.title ?? section.section}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/62">
                            {section.body}
                          </p>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="answers">
                  <ScrollArea className="mt-5 md:h-[26rem] md:pr-4">
                    <Stagger className="space-y-3" mode="mount" staggerChildren={0.06}>
                      {result.answerSummary.slice(0, 6).map((answer) => (
                        <StaggerItem
                          key={answer.questionKey}
                          className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4"
                          distance={16}
                          duration={0.3}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-code text-xs uppercase tracking-[0.22em] text-white/40">
                              {answer.dimension}
                            </p>
                            <span className="rounded-full border border-white/10 px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-[#ffe4a7]">
                              {answer.traitCode}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-white/66">{answer.question}</p>
                          <p className="mt-2 text-sm font-medium text-white">{answer.label}</p>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="account">
                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#ba7eff]/12 text-[#ba7eff]">
                        <LockKeyhole className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="cyber-kicker text-[11px]">{activeCopy.lockedTitle}</p>
                        <p className="mt-2 text-sm leading-7 text-white/64">{activeCopy.lockedBody}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.18em] text-white/72 transition hover:bg-white/8 hover:text-white"
                          >
                            {activeCopy.premiumUnlock}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.18em] text-white/72 transition hover:bg-white/8 hover:text-white"
                          >
                            {activeCopy.dashboard}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ResultReveal>
          </section>
        </div>

        {shareCardResult ? (
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

function InlineMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3.5">
      <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/44">{label}</p>
      <p className="mt-1.5 text-base text-white sm:text-lg">{value}</p>
    </div>
  );
}
