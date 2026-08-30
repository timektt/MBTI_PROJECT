import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight, Layers3 } from "lucide-react";
import { useEffect, useState } from "react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { Reveal, Stagger, StaggerItem } from "@/components/cyber/motion";
import { TypeCard } from "@/components/mbti-z/type-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mbtiZProfiles } from "@/data/mbti/mbti-z-data.mjs";
import {
  mbtiZTypesCopy,
  mbtiZTypesMovieLensCopy,
} from "@/lib/mbti-z-copy";
import {
  getMbtiZHouseScenePath,
  getMbtiZTypePosterPath,
} from "@/lib/mbti-z-visuals";

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
  animalImagePath: string | null;
  summaryTh: string;
  summaryEn: string;
  fitTh: string;
  fitEn: string;
};

const houseOrder = ["purple", "green", "yellow", "blue"] as const;
type HouseKey = (typeof houseOrder)[number];

type Locale = "th" | "en";
type RawProfile = Record<string, unknown>;

const houseFallbacks: Record<
  HouseKey,
  {
    codes: readonly string[];
    title: Record<Locale, string>;
    accentFrom: string;
    accentTo: string;
  }
> = {
  purple: {
    codes: ["INTJ", "INTP", "ENTJ", "ENTP"],
    title: { th: "บ้านม่วง", en: "Purple House" },
    accentFrom: "#6d3bf5",
    accentTo: "#ba7eff",
  },
  green: {
    codes: ["INFJ", "INFP", "ENFJ", "ENFP"],
    title: { th: "บ้านเขียว", en: "Green House" },
    accentFrom: "#0f9f6e",
    accentTo: "#76e6b2",
  },
  yellow: {
    codes: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    title: { th: "บ้านเหลือง", en: "Yellow House" },
    accentFrom: "#d8a623",
    accentTo: "#ffe082",
  },
  blue: {
    codes: ["ISTP", "ISFP", "ESTP", "ESFP"],
    title: { th: "บ้านฟ้า", en: "Blue House" },
    accentFrom: "#1f7cf0",
    accentTo: "#7cd9ff",
  },
};

const resilienceCopy: Record<
  Locale,
  {
    profile: string;
    summary: string;
    fit: string;
    animal: string;
    houseDescription: string;
    asset: string;
  }
> = {
  th: {
    profile: "ข้อมูลโปรไฟล์ยังไม่พร้อมใช้งาน",
    summary: "ข้อมูลสรุปของประเภทนี้ยังไม่พร้อมใช้งาน",
    fit: "ข้อมูลความเหมาะสมของประเภทนี้ยังไม่พร้อมใช้งาน",
    animal: "ข้อมูลสัตว์ประจำประเภทยังไม่พร้อมใช้งาน",
    houseDescription: "ข้อมูลภาพรวมของบ้านนี้ยังไม่พร้อมใช้งาน",
    asset: "ไม่มีภาพสัตว์",
  },
  en: {
    profile: "Profile content is not available",
    summary: "The summary for this type is not available.",
    fit: "The fit guidance for this type is not available.",
    animal: "The animal profile is not available",
    houseDescription: "The overview for this house is not available.",
    asset: "No animal image",
  },
};

function isRecord(value: unknown): value is RawProfile {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(profile: RawProfile | undefined, key: string, fallback: string) {
  const value = profile?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readAccent(profile: RawProfile | undefined, key: string, fallback: string) {
  const value = profile?.[key];
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value.trim())
    ? value.trim()
    : fallback;
}

function readImagePath(
  profile: RawProfile | undefined,
  code: string,
  animalKey: string
) {
  const value = profile?.animalImagePath;
  const expectedPath = getMbtiZTypePosterPath(code, animalKey);

  return typeof value === "string" && value.trim() === expectedPath
    ? expectedPath
    : null;
}

function findProfile(profiles: RawProfile[], code: string) {
  return profiles.find(
    (profile) =>
      typeof profile.code === "string" && profile.code.trim().toUpperCase() === code
  );
}

function normalizeProfile(
  profile: RawProfile | undefined,
  code: string,
  houseKey: HouseKey
): MbtiZProfile {
  const houseFallback = houseFallbacks[houseKey];
  const animalKey = readText(profile, "animalKey", "unavailable");

  return {
    code,
    archetypeNameTh: readText(profile, "archetypeNameTh", resilienceCopy.th.profile),
    archetypeNameEn: readText(profile, "archetypeNameEn", resilienceCopy.en.profile),
    houseKey,
    houseTitleTh: readText(profile, "houseTitleTh", houseFallback.title.th),
    houseTitleEn: readText(profile, "houseTitleEn", houseFallback.title.en),
    houseDescriptionTh: readText(
      profile,
      "houseDescriptionTh",
      resilienceCopy.th.houseDescription
    ),
    houseDescriptionEn: readText(
      profile,
      "houseDescriptionEn",
      resilienceCopy.en.houseDescription
    ),
    accentFrom: readAccent(profile, "accentFrom", houseFallback.accentFrom),
    accentTo: readAccent(profile, "accentTo", houseFallback.accentTo),
    animalKey,
    animalNameTh: readText(profile, "animalNameTh", resilienceCopy.th.animal),
    animalNameEn: readText(profile, "animalNameEn", resilienceCopy.en.animal),
    animalImagePath: readImagePath(profile, code, animalKey),
    summaryTh: readText(profile, "summaryTh", resilienceCopy.th.summary),
    summaryEn: readText(profile, "summaryEn", resilienceCopy.en.summary),
    fitTh: readText(profile, "fitTh", resilienceCopy.th.fit),
    fitEn: readText(profile, "fitEn", resilienceCopy.en.fit),
  };
}

export default function TypesPage() {
  const router = useRouter();
  const { locale } = useMbtiZLocale();
  const [activeHouseKey, setActiveHouseKey] = useState<HouseKey>(houseOrder[0]);
  const activeCopy = mbtiZTypesCopy[locale];
  const profiles = Array.isArray(mbtiZProfiles)
    ? (mbtiZProfiles as unknown[]).filter(isRecord)
    : [];
  const activeResilienceCopy = resilienceCopy[locale];
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";

  useEffect(() => {
    if (!router.isReady) return;

    const queryValue = Array.isArray(router.query.house)
      ? router.query.house[0]
      : router.query.house;
    const nextHouse = houseOrder.includes(queryValue as HouseKey)
      ? (queryValue as HouseKey)
      : houseOrder[0];

    setActiveHouseKey(nextHouse);
  }, [router.isReady, router.query.house]);

  const groupedProfiles = houseOrder.map((houseKey) => {
    const houseFallback = houseFallbacks[houseKey];
    const houseProfiles = houseFallback.codes.map((code) =>
      normalizeProfile(findProfile(profiles, code), code, houseKey)
    );
    const houseSource = houseFallback.codes
      .map((code) => findProfile(profiles, code))
      .find((profile) => profile !== undefined);
    const house = normalizeProfile(houseSource, houseFallback.codes[0], houseKey);

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

  function handleHouseChange(value: string) {
    if (!houseOrder.includes(value as HouseKey)) return;

    const nextHouse = value as HouseKey;
    setActiveHouseKey(nextHouse);
    void router.replace(
      { pathname: "/types", query: { house: nextHouse } },
      undefined,
      { shallow: true, scroll: false }
    );
  }

  return (
    <>
      <Head>
        <title>{activeCopy.pageTitle}</title>
        <meta name="description" content={activeCopy.metaDescription} />
      </Head>

      <AmbientStage variant="dashboard">
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <Reveal className="cyber-panel-strong rounded-[1.5rem] p-4 sm:p-6 lg:p-7" variant="hero">
            <div className="inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.18em] text-[#ffe3a1]">
              <Layers3 className="h-3.5 w-3.5" />
              {activeCopy.atlas}
            </div>

            <h1 className={`mt-3 max-w-4xl text-[2rem] leading-[1.02] text-white sm:text-[2.75rem] ${headlineClass}`}>
              {activeCopy.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-white/72">
              {activeCopy.subtitle}
            </p>
          </Reveal>

          <Tabs
            className="mt-4 gap-3"
            value={activeHouseKey}
            onValueChange={handleHouseChange}
          >
            <TabsList
              aria-label={activeCopy.houseLibrary}
              className="grid w-full grid-cols-2 gap-2 bg-[#070b16]/96 p-2 sm:flex sm:flex-wrap sm:justify-start sm:bg-white/[0.04] md:px-2"
            >
              {groupedProfiles.map((house) => (
                <TabsTrigger
                  key={house.houseKey}
                  value={house.houseKey}
                  className="min-w-0 border border-transparent px-2 tracking-[0.08em] data-[state=active]:font-bold sm:shrink-0 sm:px-3"
                  style={
                    activeHouseKey === house.houseKey
                      ? {
                          borderColor: `${house.accentTo}99`,
                          boxShadow: `inset 0 -2px 0 ${house.accentTo}`,
                        }
                      : undefined
                  }
                >
                  {house.houseTitle}
                </TabsTrigger>
              ))}
            </TabsList>

            {groupedProfiles.map((house) => (
              <TabsContent key={house.houseKey} value={house.houseKey} className="mt-0">
                <section
                  aria-labelledby={`house-${house.houseKey}-title`}
                  className="grid gap-4"
                >
                  <div
                    className="relative overflow-hidden rounded-[1.25rem] border p-4 sm:p-5 lg:p-6"
                    style={{ borderColor: `${house.accentTo}42` }}
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="object-cover opacity-30"
                      fill
                      fetchPriority={house.houseKey === "purple" ? "high" : "auto"}
                      priority={house.houseKey === "purple"}
                      sizes="(min-width: 1024px) 70vw, 100vw"
                      src={getMbtiZHouseScenePath(house.houseKey)}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,24,0.96),rgba(8,12,24,0.82),rgba(8,12,24,0.94))]" />
                    <div className="relative grid gap-3 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8">
                      <div>
                        <div
                          aria-hidden="true"
                          className="h-1 w-12 rounded-full"
                          style={{ backgroundColor: house.accentTo }}
                        />
                        <h2
                          id={`house-${house.houseKey}-title`}
                          className={`mt-3 text-[1.65rem] leading-tight text-white sm:text-[1.9rem] ${headlineClass}`}
                        >
                          {house.houseTitle}
                        </h2>
                        <p className="mt-2 max-w-2xl text-base leading-7 text-white/72">
                          {house.houseDescription}
                        </p>
                      </div>

                      <p className="border-t border-white/10 pt-3 text-sm leading-6 text-white/68 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                        <span className="font-code text-[10px] uppercase tracking-[0.12em] text-[#f5c76d]">
                          {activeCopy.movieLens}
                        </span>
                        {" · "}
                        {house.movieLens}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="cyber-kicker text-[11px]">{activeCopy.archiveTitle}</p>

                    <Stagger
                      className="mt-3 grid items-start gap-3 md:grid-cols-2 xl:grid-cols-4"
                      mode="mount"
                    >
                      {house.profiles.map((profile) => (
                        <StaggerItem key={profile.code}>
                          <TypeCard
                            accentFrom={profile.accentFrom}
                            accentTo={profile.accentTo}
                            animalLabel={activeCopy.animal}
                            assetFallbackLabel={activeResilienceCopy.asset}
                            animalName={
                              locale === "en" ? profile.animalNameEn : profile.animalNameTh
                            }
                            archetypeName={
                              locale === "en"
                                ? profile.archetypeNameEn
                                : profile.archetypeNameTh
                            }
                            code={profile.code}
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
                            href={`/types/${profile.code.toLowerCase()}?from=${house.houseKey}`}
                            viewProfileLabel={activeCopy.viewProfile}
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
        </main>
      </AmbientStage>
    </>
  );
}
