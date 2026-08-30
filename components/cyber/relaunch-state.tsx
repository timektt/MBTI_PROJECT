"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  DatabaseZap,
  GalleryVerticalEnd,
  KeyRound,
  Orbit,
  Radar,
  type LucideIcon,
  Share2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { LocaleToggle } from "@/components/cyber/locale-toggle";
import {
  mbtiZRelaunchCopy,
  mbtiZRelaunchSharedCopy,
  type MbtiZLocale,
  type MbtiZRelaunchScenario,
} from "@/lib/mbti-z-copy";

const scenarioIcons: Record<MbtiZRelaunchScenario, LucideIcon> = {
  profile: UserRound,
  settings: KeyRound,
  community: GalleryVerticalEnd,
  share: Share2,
  verification: ShieldCheck,
  operations: DatabaseZap,
};

const bulletIcons: LucideIcon[] = [Orbit, Radar, DatabaseZap];

export function RelaunchState({
  scenario,
}: {
  scenario: MbtiZRelaunchScenario;
}) {
  const [locale, setLocale] = useState<MbtiZLocale>("th");
  const activeCopy = mbtiZRelaunchCopy[scenario][locale];
  const sharedCopy = mbtiZRelaunchSharedCopy[locale];
  const Icon = scenarioIcons[scenario];

  return (
    <>
      <Head>
        <title>{activeCopy.browserTitle}</title>
      </Head>

      <AmbientStage variant="hold">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <LocaleToggle locale={locale} onChange={setLocale} />
            <div className="rounded-full border border-[#f5c76d]/16 bg-[#f5c76d]/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#ffe8b2]">
              {sharedCopy.modeBadge}
            </div>
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="cyber-panel-strong rounded-[2rem] p-8 sm:p-10"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c76d]/15 bg-[#f5c76d]/10 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#ffe3a1]">
                <Icon className="h-3.5 w-3.5" />
                {activeCopy.tag}
              </div>
              <h1 className="mt-8 max-w-4xl font-editorial text-4xl leading-[0.92] text-white sm:text-5xl">
                {activeCopy.headline}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">
                {activeCopy.body}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={activeCopy.primaryHref}
                  className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#050814]"
                >
                  {activeCopy.primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={activeCopy.secondaryHref}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-6 py-4 text-sm font-medium uppercase tracking-[0.16em] text-white/78 transition hover:bg-white/10"
                >
                  {activeCopy.secondaryLabel}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="cyber-panel rounded-[2rem] p-8"
            >
              <div className="flex items-center gap-3 text-[#7cc8ff]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7cc8ff]/12">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="cyber-kicker text-[11px]">{activeCopy.statusLabel}</p>
                  <h2 className="mt-2 font-editorial text-2xl text-white">
                    {sharedCopy.statusHeading}
                  </h2>
                </div>
              </div>
              <p className="mt-6 text-sm leading-8 text-white/68">{activeCopy.statusBody}</p>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="cyber-kicker text-[11px]">{activeCopy.queueLabel}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {activeCopy.queueItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-code text-[11px] uppercase tracking-[0.18em] text-white/68"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            {activeCopy.bullets.map((bullet, index) => {
              const BulletIcon = bulletIcons[index] ?? Orbit;

              return (
                <motion.article
                  key={bullet.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.12 + index * 0.06 }}
                  className="cyber-panel rounded-[1.7rem] p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] text-[#f5c76d]">
                    <BulletIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-editorial text-2xl text-white">{bullet.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/66">{bullet.body}</p>
                </motion.article>
              );
            })}
          </section>
        </div>
      </AmbientStage>
    </>
  );
}
