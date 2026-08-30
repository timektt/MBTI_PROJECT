"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Clapperboard,
  Download,
  Sparkles,
  Star,
} from "lucide-react";

import { LocaleToggle } from "@/components/cyber/locale-toggle";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { AmbientStage } from "@/components/cyber/ambient-stage";
import { Reveal, Stagger, StaggerItem } from "@/components/cyber/motion";
import { HouseBadge } from "@/components/mbti-z/house-badge";
import { ResultShareCard } from "@/components/mbti-z/result-share-card";
import type { GuestResult } from "@/lib/assessment-runtime";
import { mbtiZHomeCopy } from "@/lib/mbti-z-copy";
import { getMbtiZHouseScenePath } from "@/lib/mbti-z-visuals";
import { mbtiZHouses, mbtiZMovieProfiles, mbtiZProfiles } from "@/data/mbti/mbti-z-data.mjs";

type HouseEntry = {
  key: string;
  titleTh: string;
  titleEn: string;
  accentFrom: string;
  accentTo: string;
  descriptionTh: string;
  descriptionEn: string;
};

type MovieProfileEntry = {
  key: string;
  titleTh: string;
  titleEn: string;
  summaryTh: string;
  summaryEn: string;
  tagsTh: string[];
  tagsEn: string[];
};

type ProfileEntry = {
  code: string;
  houseKey: string;
  animalNameTh: string;
  animalNameEn: string;
  archetypeNameTh: string;
  archetypeNameEn: string;
  animalImagePath: string;
  taglineTh: string;
  taglineEn: string;
  summaryTh: string;
  summaryEn: string;
  houseTitleTh: string;
  houseTitleEn: string;
  houseDescriptionTh: string;
  houseDescriptionEn: string;
  accentFrom: string;
  accentTo: string;
};

const featureIcons = [BrainCircuit, Sparkles, Clapperboard, Download] as const;

function SectionHeader({
  title,
  description,
  className = "",
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="max-w-4xl text-2xl text-white sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-4xl text-sm leading-7 text-white/66 sm:text-base sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function PremiumHome() {
  const { locale, setLocale } = useMbtiZLocale();
  const copy = mbtiZHomeCopy[locale];
  const titleFontClass = locale === "th" ? "font-thai-editorial" : "font-luxury";
  const sectionFontClass = locale === "th" ? "font-thai-editorial" : "font-luxury";
  const houses = Object.values(mbtiZHouses) as HouseEntry[];
  const movieProfiles = Object.values(mbtiZMovieProfiles) as MovieProfileEntry[];
  const profiles = mbtiZProfiles as ProfileEntry[];
  const previewProfile = profiles.find((profile) => profile.code === "ENFJ") ?? profiles[0];
  const previewMovieProfile =
    movieProfiles.find((profile) => profile.key === "heartLens") ?? movieProfiles[0];
  const featuredMovieProfiles = [
    previewMovieProfile,
    ...movieProfiles.filter((profile) => profile.key !== previewMovieProfile.key),
  ].slice(0, 3);

  const houseCards = houses.map((house) => ({
    ...house,
    types: profiles
      .filter((profile) => profile.houseKey === house.key)
      .map((profile) => ({
        code: profile.code,
        animalName: locale === "en" ? profile.animalNameEn : profile.animalNameTh,
      })),
  }));
  const heroShowcase = houseCards.map((house) => {
    const sample = profiles.find((profile) => profile.houseKey === house.key);

    return {
      key: house.key,
      title: locale === "en" ? house.titleEn : house.titleTh,
      accentFrom: house.accentFrom,
      accentTo: house.accentTo,
      code: sample?.code ?? "MBTI",
      animalName: sample
        ? locale === "en"
          ? sample.animalNameEn
          : sample.animalNameTh
        : "",
    };
  });
  const previewResult: GuestResult = {
    id: "home-preview-enfj",
    locale,
    mbtiType: previewProfile.code,
    createdAt: "2026-06-05T00:00:00.000Z",
    confidence: 92,
    archetypeName:
      locale === "en" ? previewProfile.archetypeNameEn : previewProfile.archetypeNameTh,
    tagline: locale === "en" ? previewProfile.taglineEn : previewProfile.taglineTh,
    house: {
      key: previewProfile.houseKey,
      title: locale === "en" ? previewProfile.houseTitleEn : previewProfile.houseTitleTh,
      description:
        locale === "en"
          ? previewProfile.houseDescriptionEn
          : previewProfile.houseDescriptionTh,
      accentFrom: previewProfile.accentFrom,
      accentTo: previewProfile.accentTo,
      surface: "rgba(182,121,255,0.18)",
    },
    animal: {
      key: "preview-animal",
      name: locale === "en" ? previewProfile.animalNameEn : previewProfile.animalNameTh,
      imagePath: previewProfile.animalImagePath,
    },
    movieProfile: {
      key: previewMovieProfile.key,
      title: locale === "en" ? previewMovieProfile.titleEn : previewMovieProfile.titleTh,
      summary:
        locale === "en" ? previewMovieProfile.summaryEn : previewMovieProfile.summaryTh,
      tags: locale === "en" ? previewMovieProfile.tagsEn : previewMovieProfile.tagsTh,
      scores: { heartLens: 78, comfortAura: 66, worldBuilder: 41 },
      secondaryKeys: ["comfortAura"],
    },
    summaryTitle: copy.previewSummaryTitle,
    summaryBody:
      locale === "en"
        ? previewProfile.summaryEn
        : previewProfile.summaryTh,
    premiumSections: [],
    dimensions: [
      { pair: "E/I", left: "E", right: "I", leftScore: 72, rightScore: 28, winner: "E", balance: 44 },
      { pair: "S/N", left: "S", right: "N", leftScore: 32, rightScore: 68, winner: "N", balance: 36 },
      { pair: "T/F", left: "T", right: "F", leftScore: 39, rightScore: 61, winner: "F", balance: 22 },
      { pair: "J/P", left: "J", right: "P", leftScore: 66, rightScore: 34, winner: "J", balance: 32 },
    ],
    answerSummary: [],
    answerMap: {},
    questionCount: 60,
    coreQuestionCount: 48,
    movieQuestionCount: 12,
  };

  return (
    <AmbientStage variant="landing">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>

        <section className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <Reveal className="cyber-panel-strong rounded-[2rem] p-6 sm:p-8 lg:p-10" mode="mount" variant="hero">
            <div className="flex flex-wrap items-center gap-3">
              <div className="cyber-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <Star className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </div>
              <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.26em] text-white/66">
                {copy.status}
              </div>
            </div>

            <h1
              className={`cyber-title-glow mt-5 max-w-5xl text-[2.32rem] leading-[1.02] text-white sm:text-5xl lg:mt-6 lg:text-[3.5rem] lg:leading-[0.95] ${titleFontClass}`}
            >
              {copy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:mt-5 sm:text-lg sm:leading-8">
              {copy.subtitle}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                href="/quiz"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814] transition hover:brightness-110 sm:px-6"
              >
                {copy.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/6 px-5 font-code text-[11px] uppercase tracking-[0.16em] text-white/82 transition hover:bg-white/10 sm:px-6"
              >
                {copy.secondaryCta}
              </Link>
              <Link
                href="/types"
                className="inline-flex h-11 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 font-code text-[11px] uppercase tracking-[0.16em] text-white/72 transition hover:bg-white/10 hover:text-white sm:px-6"
              >
                {copy.tertiaryCta}
              </Link>
            </div>

            <Stagger
              className="mt-4 flex flex-wrap gap-2 sm:mt-6"
              delayChildren={0.12}
              mode="mount"
              staggerChildren={0.06}
            >
              {copy.heroChips.map((chip) => (
                <StaggerItem
                  key={chip}
                  className="cyber-data-chip rounded-full px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.18em] text-white/62 sm:px-4 sm:py-2"
                  distance={14}
                >
                  {chip}
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4">
              {copy.metrics.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[1rem] border border-white/10 bg-white/[0.035] px-3 py-2.5 sm:px-3.5 sm:py-3"
                >
                  <p className="font-luxury text-lg leading-none text-white sm:text-2xl">{value}</p>
                  <p className="mt-1.5 font-code text-[10px] uppercase tracking-[0.16em] text-white/48">
                    {label}
                  </p>
                </div>
              ))}
            </div>

          </Reveal>

          <Reveal className="cyber-panel rounded-[2rem] p-5 sm:p-6 lg:p-7" delay={0.1} mode="mount" variant="soft">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="cyber-kicker text-[11px]">{copy.previewEyebrow}</p>
                  <h2 className={`mt-3 text-2xl text-white ${sectionFontClass}`}>{copy.previewTitle}</h2>
                </div>
                <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.22em] text-[#ffe4aa]">
                  MBTI Z
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-white/66 line-clamp-3">{copy.previewBody}</p>

              <div className="mt-4">
                <ResultShareCard
                  result={previewResult}
                  locale={locale}
                  className="mx-auto max-w-[300px] sm:max-w-[360px] lg:max-w-[392px]"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {heroShowcase.map((house) => (
                  <div
                    key={house.key}
                    className="rounded-[1.05rem] border border-white/8 bg-white/[0.03] p-3"
                    style={{
                      boxShadow: `0 0 0 1px ${house.accentTo}14 inset`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <HouseBadge
                        accentFrom={house.accentFrom}
                        accentTo={house.accentTo}
                        label={house.title}
                      />
                      <span className="font-code text-[10px] uppercase tracking-[0.18em] text-white/42">
                        {house.code}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/66">{house.animalName}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {copy.previewItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.14em] text-white/62"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <Reveal className="mt-8" variant="soft">
          <SectionHeader
            title={copy.featureTitle}
            description={copy.featureSubtitle}
            className={sectionFontClass}
          />
          <Stagger className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4" delayChildren={0.08}>
            {copy.featureCards.map((card, index) => {
              const Icon = featureIcons[index];

              return (
                <StaggerItem
                  key={card.title}
                  className="rounded-[1.2rem] border border-white/10 bg-white/[0.035] p-3.5 sm:p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-[#7cc8ff]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-editorial text-base text-white sm:text-lg">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/66 line-clamp-2">{card.body}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Reveal>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <Reveal className="cyber-panel-strong rounded-[2rem] p-5 sm:p-7" variant="strong">
            <SectionHeader
              title={copy.houseTitle}
              description={copy.houseSubtitle}
              className={sectionFontClass}
            />
            <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
              {houseCards.map((house) => (
                <div
                  key={house.key}
                  className="relative min-w-[252px] snap-start overflow-hidden rounded-[1.35rem] border border-white/10 md:min-w-0"
                >
                  <Image
                    alt={locale === "en" ? house.titleEn : house.titleTh}
                    className="object-cover opacity-58"
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    src={getMbtiZHouseScenePath(house.key)}
                    unoptimized
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${house.accentFrom}12 0%, rgba(9,14,28,0.28) 28%, rgba(9,14,28,0.94) 100%)`,
                    }}
                  />
                  <div className="relative p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <HouseBadge
                        accentFrom={house.accentFrom}
                        accentTo={house.accentTo}
                        label={locale === "en" ? house.titleEn : house.titleTh}
                      />
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-white/66">
                        {copy.houseTypeCount} · {house.types.length}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl text-white sm:text-2xl">
                      {locale === "en" ? house.titleEn : house.titleTh}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 line-clamp-2">
                      {locale === "en" ? house.descriptionEn : house.descriptionTh}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {house.types.map((type) => (
                        <span
                          key={type.code}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-white/74 backdrop-blur-[2px]"
                        >
                          {type.code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/types"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814]"
            >
              {copy.houseCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="space-y-4">
            <Reveal className="cyber-panel rounded-[2rem] p-5 sm:p-6" variant="soft">
              <SectionHeader
                title={copy.movieTitle}
                description={copy.movieSubtitle}
                className={sectionFontClass}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-2">
                {featuredMovieProfiles.map((profile) => (
                  <div
                    key={profile.key}
                    className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] p-3.5"
                  >
                    <h3 className="text-base text-white sm:text-lg">
                      {locale === "en" ? profile.titleEn : profile.titleTh}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/66 line-clamp-2">
                      {locale === "en" ? profile.summaryEn : profile.summaryTh}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(locale === "en" ? profile.tagsEn : profile.tagsTh).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-code text-[10px] uppercase tracking-[0.16em] text-white/68"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="cyber-panel rounded-[2rem] p-5 sm:p-6" variant="soft">
              <SectionHeader
                title={copy.whyTitle}
                description={copy.whySubtitle}
                className={sectionFontClass}
              />
              <div className="mt-4 divide-y divide-white/10 rounded-[1.15rem] border border-white/10 bg-white/[0.025]">
                {copy.whyCards.map((card, index) => (
                  <div
                    key={card.title}
                    className="grid gap-2 p-3.5 sm:grid-cols-[2.5rem_1fr] sm:gap-3"
                  >
                    <p className="font-code text-[10px] uppercase tracking-[0.22em] text-[#f5c76d]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <h3 className="text-base text-white sm:text-lg">{card.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/66">{card.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <Reveal className="mt-8" variant="soft">
          <SectionHeader
            title={copy.journeyTitle}
            description={copy.journeySubtitle}
            className={sectionFontClass}
          />
          <Stagger className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" delayChildren={0.06}>
            {copy.journeySteps.map((step) => (
              <StaggerItem
                key={step.label}
                className="rounded-[1.1rem] border border-white/10 bg-white/[0.035] p-3.5 sm:p-4"
              >
                <p className="font-code text-[10px] uppercase tracking-[0.24em] text-[#f5c76d]">
                  {step.label}
                </p>
                <h3 className="mt-2 font-editorial text-base text-white sm:text-lg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/66 line-clamp-2">{step.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>

        <Reveal className="mt-6 rounded-[1.45rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" variant="soft">
          <h2 className={`max-w-4xl text-2xl text-white sm:text-3xl ${sectionFontClass}`}>
            {copy.finalTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
            {copy.finalBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3.5 font-code text-[11px] font-semibold uppercase tracking-[0.18em] text-[#050814] transition hover:brightness-110"
            >
              {copy.finalCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/types"
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3.5 font-code text-[11px] uppercase tracking-[0.18em] text-white/72 transition hover:bg-white/10 hover:text-white"
            >
              {copy.tertiaryCta}
            </Link>
          </div>
        </Reveal>
      </div>
    </AmbientStage>
  );
}
