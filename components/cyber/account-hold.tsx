"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CloudOff,
  DatabaseZap,
  LockKeyhole,
  Orbit,
  Sparkles,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { LocaleToggle } from "@/components/cyber/locale-toggle";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import {
  resolveMotionDistance,
  resolveMotionDuration,
  resolveMotionScale,
} from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { ReconnectBundleActions } from "@/components/cyber/reconnect-bundle-actions";
import { mbtiZHoldCopy, type MbtiZLocale } from "@/lib/mbti-z-copy";
import {
  assessmentRuntime,
  type AssessmentReconnectState,
  type GuestCloudReconnectBundle,
} from "@/lib/assessment-runtime";

const gatewayIcons = [Orbit, Sparkles, DatabaseZap] as const;

export function AccountHold({
  title,
  locale: initialLocale,
}: {
  title?: string;
  locale?: MbtiZLocale;
}) {
  const localeContext = useMbtiZLocale();
  const locale = initialLocale ?? localeContext.locale;
  const setLocale = initialLocale ? () => undefined : localeContext.setLocale;
  const copy = mbtiZHoldCopy[locale];
  const reducedMotion = useMbtiZReducedMotion();
  const [reconnectState, setReconnectState] = useState<AssessmentReconnectState | null>(null);
  const [reconnectBundle, setReconnectBundle] = useState<GuestCloudReconnectBundle | null>(null);
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";
  const pageTitle = title ?? copy.pageTitle;
  const bundleStatus = reconnectState?.ready
    ? copy.bundleReadyStatus
    : copy.bundleIdleStatus;

  function hydrateReconnectState() {
    setReconnectState(assessmentRuntime.getReconnectState());
    setReconnectBundle(assessmentRuntime.exportReconnectBundle());
  }

  useEffect(() => {
    hydrateReconnectState();
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={copy.metaDescription} />
      </Head>

      <AmbientStage variant="hold">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-8">
          {!initialLocale ? (
            <div className="flex justify-end">
              <LocaleToggle locale={locale} onChange={setLocale} />
            </div>
          ) : null}

          <motion.section
            initial={{
              opacity: 0,
              y: resolveMotionDistance(reducedMotion, 24),
              scale: resolveMotionScale(reducedMotion, 0.992),
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: resolveMotionDuration(reducedMotion, 0.7),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-[1.04fr_0.96fr]"
          >
            <div className="cyber-panel-strong rounded-[1.6rem] p-5 sm:rounded-[2rem] sm:p-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c76d]/16 bg-[#f5c76d]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-[#ffe3a1] sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.3em]">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  {copy.tag}
                </div>
                <div className="cyber-data-chip rounded-full px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.2em] text-white/60 sm:px-4 sm:py-2 sm:tracking-[0.24em]">
                  {copy.statusChip}
                </div>
                <div className="hidden rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.24em] text-white/60 sm:inline-flex cyber-data-chip">
                  {copy.bundleTitle} · {bundleStatus}
                </div>
              </div>

              <h1
                className={`mt-5 max-w-4xl text-[2.05rem] leading-[1.02] text-white sm:mt-7 sm:text-5xl sm:leading-[0.94] ${headlineClass}`}
              >
                {copy.title}
              </h1>
              <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-white/72 sm:mt-4 sm:text-base sm:leading-8">
                {copy.body}
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#050814] sm:px-6 sm:py-4"
                >
                  {copy.primary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-5 py-3.5 text-sm font-medium uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/10 sm:px-6 sm:py-4"
                >
                  {copy.secondary}
                </Link>
              </div>

              <div className="mt-5 cyber-subtle-panel rounded-[1.45rem] p-4 sm:mt-6 sm:rounded-[1.8rem] sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="cyber-kicker text-[11px]">{copy.guestPathTitle}</p>
                    <p className="mt-2.5 text-sm leading-6 text-white/66 sm:mt-3 sm:leading-7">
                      {copy.guestPathBody}
                    </p>
                  </div>
                  <div className="hidden rounded-full border border-[#7cc8ff]/18 bg-[#7cc8ff]/10 px-4 py-2 font-code text-[10px] uppercase tracking-[0.22em] text-[#c5ebff] sm:block">
                    {copy.primary}
                  </div>
                </div>

                <div className="mt-3.5 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {copy.worksNow.map((item, index) => {
                    const Icon = gatewayIcons[index];

                    return (
                      <InfoListItem
                        key={item}
                        icon={<Icon className="h-4 w-4" />}
                        tone="blue"
                      >
                        {item}
                      </InfoListItem>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-[1.45rem] border border-white/10 bg-white/[0.04] p-4 sm:mt-6 sm:rounded-[1.7rem] sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#ffb87f]/10 text-[#ffcfaa]">
                    <CloudOff className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="cyber-kicker text-[11px]">{copy.pausedTitle}</p>
                    <p className="mt-2.5 max-w-3xl text-sm leading-6 text-white/66 sm:mt-3 sm:leading-7">
                      {copy.pausedBody}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {copy.returnsLater.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-white/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="cyber-panel rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="cyber-kicker text-[11px]">{copy.runtimeTitle}</p>
                    <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/66 sm:mt-3 sm:leading-7">
                      {copy.runtimeBody}
                    </p>
                  </div>
                  <div className="rounded-full border border-[#f5c76d]/18 bg-[#f5c76d]/10 px-4 py-2 font-code text-[10px] uppercase tracking-[0.22em] text-[#ffe4aa]">
                    {copy.statusChip}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5 sm:mt-5 sm:gap-3">
                  <SnapshotCard
                    label={copy.worksTitle}
                    value={`${copy.worksNow.length}`}
                    tone="gold"
                  />
                  <SnapshotCard
                    label={copy.historyLabel}
                    value={`${reconnectState?.historyCount ?? 0}`}
                    tone="blue"
                  />
                  <SnapshotCard
                    label={copy.pendingLabel}
                    value={`${reconnectState?.inProgressAnswerCount ?? 0}`}
                    tone="violet"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusPill label={`${copy.bundleTitle} ${bundleStatus}`} />
                  <StatusPill label={`${copy.historyLabel} ${reconnectState?.historyCount ?? 0}`} />
                  <StatusPill
                    label={`${copy.pendingLabel} ${reconnectState?.inProgressAnswerCount ?? 0}`}
                  />
                </div>
              </div>

              <div className="cyber-panel rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-6">
                <div className="flex items-center gap-3 text-[#f5c76d]">
                  <DatabaseZap className="h-5 w-5" />
                  <p className="cyber-kicker text-[11px]">{copy.bundleTitle}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">
                  {reconnectState?.ready ? copy.bundleReady : copy.bundleIdle}
                </p>

                <ReconnectBundleActions
                  bundle={reconnectBundle}
                  locale={locale}
                  onImported={hydrateReconnectState}
                />
              </div>
            </div>
          </motion.section>
        </div>
      </AmbientStage>
    </>
  );
}

function InfoListItem({
  icon,
  children,
  tone,
}: {
  icon: ReactNode;
  children: ReactNode;
  tone: "blue" | "gold";
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={
          tone === "blue"
            ? "mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#7cc8ff]"
            : "mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#f5c76d]"
        }
      >
        {icon}
      </div>
      <p className="text-sm leading-7 text-white/68">{children}</p>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.2em] text-white/58">
      {label}
    </span>
  );
}

function SnapshotCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "gold" | "blue" | "violet";
}) {
  const toneClass =
    tone === "gold"
      ? "text-[#ffe4aa]"
      : tone === "blue"
        ? "text-[#c5ebff]"
        : "text-[#e4caff]";

  return (
    <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.04] p-4">
      <p className="font-code text-[10px] uppercase tracking-[0.2em] text-white/42">{label}</p>
      <p className={`mt-3 font-editorial text-3xl ${toneClass}`}>{value}</p>
    </div>
  );
}
