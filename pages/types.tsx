import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clapperboard, Layers3 } from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { LocaleToggle } from "@/components/cyber/locale-toggle";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { Reveal, Stagger, StaggerItem } from "@/components/cyber/motion";
import { HouseBadge } from "@/components/mbti-z/house-badge";
import { TypeCard } from "@/components/mbti-z/type-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mbtiZProfiles } from "@/data/mbti/mbti-z-data.mjs";
import {
  mbtiZTypesCopy,
  mbtiZTypesMovieLensCopy,
} from "@/lib/mbti-z-copy";
import { getMbtiZHouseScenePath } from "@/lib/mbti-z-visuals";

type MbtiZProfile = {
  code: string;
  archetypeNameTh: string;
  archetypeNameEn: string;
  houseKey: string;
  houseTitleTh: string;
  houseTitleEn: string;
  houseDescriptionTh: string;
  houseDescriptionEn: string;
  accentFrom: string;
  accentTo: string;
  animalKey: string;
  animalNameTh: string;
  animalNameEn: string;
  animalImagePath: string;
  summaryTh: string;
  summaryEn: string;
  fitTh: string;
  fitEn: string;
};

const houseOrder = ["purple", "green", "yellow", "blue"] as const;

export default function TypesPage() {
  const { locale, setLocale } = useMbtiZLocale();
  const activeCopy = mbtiZTypesCopy[locale];
  const profiles = mbtiZProfiles as MbtiZProfile[];
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";

  const groupedProfiles = houseOrder.map((houseKey) => {
    const houseProfiles = profiles.filter((profile) => profile.houseKey === houseKey);
    const house = houseProfiles[0];

    return {
      houseKey,
      houseTitle: locale === "en" ? house.houseTitleEn : house.houseTitleTh,
      houseDescription:
        locale === "en" ? house.houseDescriptionEn : house.houseDescriptionTh,
      accentFrom: house.accentFrom,
      accentTo: house.accentTo,
      movieLens:
        locale === "en"
          ? mbtiZTypesMovieLensCopy[houseKey].en
          : mbtiZTypesMovieLensCopy[houseKey].th,
      profiles: houseProfiles,
    };
  });

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
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-full border border-white/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.16em] text-white/74 transition hover:bg-white/8 hover:text-white"
              >
                {activeCopy.home}
              </Link>
              <Link
                href="/quiz"
                className="inline-flex h-11 items-center rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-2 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814]"
              >
                {activeCopy.quiz}
              </Link>
            </div>
          </div>

          <Reveal className="mt-6 cyber-panel-strong rounded-[1.9rem] p-6 sm:p-7 lg:p-8" variant="hero">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c76d]/15 bg-[#f5c76d]/10 px-4 py-2 font-code text-[11px] uppercase tracking-[0.28em] text-[#ffe3a1]">
                <Layers3 className="h-3.5 w-3.5" />
                {activeCopy.atlas}
              </div>
              <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.24em] text-white/60">
                {activeCopy.houseLibrary}
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div>
                <h1 className={`max-w-4xl text-[2.25rem] leading-[0.95] text-white sm:text-[3.2rem] ${headlineClass}`}>
                  {activeCopy.title}
                </h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/72 sm:text-base">
                  {activeCopy.subtitle}
                </p>
              </div>

              <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7cc8ff]/12 text-[#7cc8ff]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="cyber-kicker text-[11px]">{activeCopy.quickScanTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-white/66">{activeCopy.quickScanBody}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Stagger
            className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4"
            mode="mount"
          >
            {groupedProfiles.map((house) => (
              <StaggerItem
                key={`overview-${house.houseKey}`}
                className="relative min-w-[248px] snap-start overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.04] p-4 md:min-w-0"
              >
                <Image
                  alt={house.houseTitle}
                  className="object-cover opacity-46"
                  fill
                  sizes="(min-width: 1280px) 20vw, (min-width: 768px) 40vw, 100vw"
                  src={getMbtiZHouseScenePath(house.houseKey)}
                  unoptimized
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,18,0.2),rgba(6,10,18,0.88))]" />
                <div className="relative">
                  <HouseBadge
                    accentFrom={house.accentFrom}
                    accentTo={house.accentTo}
                    label={house.houseTitle}
                  />
                  <p className="mt-4 text-sm leading-6 text-white/68 line-clamp-3">
                    {house.houseDescription}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="font-code text-[10px] uppercase tracking-[0.22em] text-white/44">
                      {activeCopy.typeCount} · {house.profiles.length}
                    </span>
                    <span className="line-clamp-1 max-w-[60%] text-right font-code text-[10px] uppercase tracking-[0.18em] text-white/36">
                      {house.profiles.map((profile) => profile.code).join(" · ")}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Tabs className="mt-8" defaultValue={groupedProfiles[0]?.houseKey}>
            <TabsList className="-mx-4 w-auto flex-nowrap justify-start overflow-x-auto px-4 sm:mx-0 sm:w-full sm:flex-wrap sm:overflow-visible sm:px-0">
              {groupedProfiles.map((house) => (
                <TabsTrigger key={house.houseKey} value={house.houseKey} className="shrink-0">
                  {house.houseTitle}
                </TabsTrigger>
              ))}
            </TabsList>

            {groupedProfiles.map((house) => (
              <TabsContent key={house.houseKey} value={house.houseKey}>
                <section className="grid gap-5 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
                  <Reveal className="relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 sm:p-6" variant="soft">
                    <Image
                      alt={house.houseTitle}
                      className="object-cover opacity-56"
                      fill
                      priority={house.houseKey === "purple"}
                      sizes="(min-width: 1024px) 32vw, 100vw"
                      src={getMbtiZHouseScenePath(house.houseKey)}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,24,0.14),rgba(8,12,24,0.9))]" />
                    <div className="relative">
                      <HouseBadge
                        accentFrom={house.accentFrom}
                        accentTo={house.accentTo}
                        label={house.houseTitle}
                      />
                      <h2 className={`mt-5 text-[1.8rem] leading-none text-white sm:text-[2.05rem] ${headlineClass}`}>{house.houseTitle}</h2>
                      <p className="mt-3 text-sm leading-6 text-white/72 sm:text-[15px] sm:leading-7">{house.houseDescription}</p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                          <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/40">
                            {activeCopy.typeCount}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/66">
                            {activeCopy.typeCount} · {house.profiles.length}
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                          <p className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.22em] text-white/40">
                            <Clapperboard className="h-3.5 w-3.5 text-[#f5c76d]" />
                            {activeCopy.movieLens}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/66">{house.movieLens}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {house.profiles.map((profile) => (
                          <span
                            key={`tag-${profile.code}`}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.16em] text-white/70"
                          >
                            {profile.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="cyber-kicker text-[11px]">{activeCopy.archiveTitle}</p>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
                          {activeCopy.archiveBody}
                        </p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-code text-[10px] uppercase tracking-[0.2em] text-white/54">
                        {activeCopy.typeCount} · {house.profiles.length}
                      </div>
                    </div>

                    <Stagger className="mt-4 grid gap-3 md:grid-cols-2" mode="mount">
                      {house.profiles.map((profile) => (
                        <StaggerItem key={profile.code}>
                          <TypeCard
                            accentFrom={profile.accentFrom}
                            accentTo={profile.accentTo}
                            animalLabel={activeCopy.animal}
                            animalName={
                              locale === "en" ? profile.animalNameEn : profile.animalNameTh
                            }
                            archetypeName={
                              locale === "en"
                                ? profile.archetypeNameEn
                                : profile.archetypeNameTh
                            }
                            code={profile.code}
                            fit={locale === "en" ? profile.fitEn : profile.fitTh}
                            fitLabel={activeCopy.fit}
                            houseTitle={
                              locale === "en"
                                ? profile.houseTitleEn
                                : profile.houseTitleTh
                            }
                            imagePath={profile.animalImagePath}
                            priority={house.houseKey === "purple"}
                            summary={
                              locale === "en" ? profile.summaryEn : profile.summaryTh
                            }
                            summaryLabel={activeCopy.summaryLabel}
                          />
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </section>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-code text-[11px] uppercase tracking-[0.16em] text-white/74 transition hover:bg-white/8 hover:text-white"
            >
              {activeCopy.result}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </AmbientStage>
    </>
  );
}
