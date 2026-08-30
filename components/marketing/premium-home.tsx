"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Download, History } from "lucide-react";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { Reveal, Stagger, StaggerItem } from "@/components/cyber/motion";
import { mbtiZHouses, mbtiZProfiles } from "@/data/mbti/mbti-z-data.mjs";
import { mbtiZHomeCopy } from "@/lib/mbti-z-copy";
import { getMbtiZHouseScenePath } from "@/lib/mbti-z-visuals";
import { cn } from "@/lib/utils";

type HouseKey = "purple" | "green" | "yellow" | "blue";

type HouseEntry = {
  key: HouseKey;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  accentFrom: string;
};

type ProfileEntry = {
  code: string;
  houseKey: HouseKey;
};

const houseOrder: HouseKey[] = ["purple", "green", "yellow", "blue"];
const HOME_HERO_PATH = "/mbti-z/v4/fantasy-v2/home/living-archive-hero-v2.webp";

export function PremiumHome() {
  const { locale } = useMbtiZLocale();
  const copy = mbtiZHomeCopy[locale];
  const houses = Object.values(mbtiZHouses) as HouseEntry[];
  const profiles = mbtiZProfiles as ProfileEntry[];
  const titleClass = locale === "th" ? "font-thai-editorial" : "font-luxury";
  const resultLayers = [
    copy.outcomes[0],
    copy.outcomes[1],
    [
      "Result Artifact",
      locale === "th"
        ? "รวม Animal, Movie Profile และภาพ PNG ที่เก็บหรือแบ่งปันต่อได้"
        : "Animal, Movie Profile, and a PNG you can keep or share.",
    ],
  ] as const;

  const localizeHouse = (house: HouseEntry) => ({
    title: locale === "en" ? house.titleEn : house.titleTh,
    description: locale === "en" ? house.descriptionEn : house.descriptionTh,
  });

  return (
    <main className="signal-page overflow-x-clip">
      <section
        className="relative isolate min-h-[27rem] overflow-hidden border-b border-white/10"
        style={{ minHeight: "max(27rem, calc(100svh - 8rem))" }}
        aria-labelledby="home-title"
      >
        <Image
          src={HOME_HERO_PATH}
          alt=""
          fill
          fetchPriority="high"
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,10,0.96)_0%,rgba(7,8,10,0.83)_38%,rgba(7,8,10,0.24)_72%,rgba(7,8,10,0.12)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(7,8,10,0.9)_0%,transparent_48%,rgba(7,8,10,0.18)_100%)]"
          aria-hidden="true"
        />

        <div className="signal-container relative z-10 flex min-h-[inherit] items-end py-6 sm:py-10 lg:items-center lg:py-14">
          <Reveal className="max-w-[42rem]" mode="mount" variant="hero">
            <p className="signal-eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-[#e7b55b]" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h1
              id="home-title"
              className="mt-4 font-luxury text-5xl leading-none text-[#f5f3ed] sm:text-6xl lg:text-7xl"
            >
              MBTI Z
            </h1>
            <p
              className={cn(
                "mt-4 max-w-[23ch] text-balance text-2xl leading-tight text-[#f5f3ed] sm:text-3xl lg:text-4xl",
                titleClass
              )}
            >
              {copy.title}
            </p>
            <p className="mt-4 max-w-[58ch] text-sm leading-6 text-[#c4c3bf] sm:text-base sm:leading-7">
              {copy.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/quiz" className="signal-button-primary group min-w-0 text-center">
                {copy.start}
                <ArrowRight
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/types"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#f5f3ed] underline decoration-white/30 underline-offset-4 outline-none hover:decoration-[#e7b55b] focus-visible:ring-2 focus-visible:ring-[#f6d59b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0d]"
              >
                {copy.explore}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
            </div>
            <p className="mt-4 max-w-[48ch] text-xs leading-5 text-[#a4a39f] sm:text-sm sm:leading-6">
              {copy.guestNote}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/10 py-12 sm:py-16 lg:py-20" aria-labelledby="result-anatomy-title">
        <div className="signal-container">
          <Reveal
            className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-16"
            variant="soft"
          >
            <div>
              <p className="signal-eyebrow">{copy.outcomeEyebrow}</p>
              <h2
                id="result-anatomy-title"
                className={cn("mt-3 max-w-[18ch] text-3xl leading-tight text-[#f5f3ed] sm:text-5xl", titleClass)}
              >
                {copy.outcomeTitle}
              </h2>
            </div>
            <p className="max-w-[62ch] text-base leading-7 text-[#b9bbc3] sm:text-lg sm:leading-8">
              {copy.outcomeBody}
            </p>
          </Reveal>

          <Stagger className="mt-8 grid border-y border-white/10 md:grid-cols-3 lg:mt-12">
            {resultLayers.map(([title, body], index) => (
              <StaggerItem key={title} className="h-full">
                <article className="group relative h-full min-w-0 border-b border-white/10 py-6 last:border-b-0 md:min-h-56 md:border-b-0 md:border-r md:p-7 md:last:border-r-0">
                  <span
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#e7b55b] opacity-0 transition-[transform,opacity] duration-300 group-hover:scale-x-100 group-hover:opacity-100 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-code text-xs text-[#e7b55b]">{String(index + 1).padStart(2, "0")}</span>
                    {index === 2 ? <Download className="h-4 w-4 text-[#777b85]" aria-hidden="true" /> : null}
                  </div>
                  <h3 className="mt-7 break-words font-luxury text-2xl text-[#f5f3ed]">{title}</h3>
                  <p className="mt-3 break-words text-base leading-7 text-[#9fa2aa] transition-colors group-hover:text-[#d4d2cc]">
                    {body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0f1014] py-12 sm:py-16 lg:py-20" aria-labelledby="houses-title">
        <div className="signal-container">
          <Reveal
            className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16"
            variant="soft"
          >
            <div>
              <p className="signal-eyebrow">{copy.houseEyebrow}</p>
              <h2
                id="houses-title"
                className={cn("mt-3 max-w-[19ch] text-3xl leading-tight text-[#f5f3ed] sm:text-5xl", titleClass)}
              >
                {copy.houseTitle}
              </h2>
            </div>
            <p className="max-w-[62ch] text-base leading-7 text-[#b9bbc3] sm:text-lg sm:leading-8">
              {copy.houseBody}
            </p>
          </Reveal>

          <Stagger className="mt-8 grid gap-3 min-[420px]:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {houseOrder.map((houseKey) => {
              const house = houses.find((entry) => entry.key === houseKey);
              if (!house) return null;

              const houseCopy = localizeHouse(house);
              const typeCodes = profiles
                .filter((profile) => profile.houseKey === house.key)
                .map((profile) => profile.code);

              return (
                <StaggerItem key={house.key} className="h-full">
                  <Link
                  href={`/types?house=${house.key}`}
                  className="group relative block aspect-[5/3] min-h-0 min-w-0 overflow-hidden rounded-[6px] border border-white/10 bg-[#171a20] outline-none transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-[0_18px_48px_rgba(0,0,0,0.32)] focus-visible:-translate-y-1 focus-visible:border-[#f6d59b] focus-visible:ring-2 focus-visible:ring-[#f6d59b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0f1014] motion-reduce:transform-none"
                  aria-label={`${copy.explore}: ${houseCopy.title}`}
                >
                  <Image
                    src={getMbtiZHouseScenePath(house.key)}
                    alt=""
                    fill
                    quality={78}
                    sizes="(min-width: 1024px) 25vw, (min-width: 420px) 50vw, 100vw"
                    className="object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:saturate-125 group-focus-visible:scale-110 group-focus-visible:saturate-125 motion-reduce:transform-none"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/32 to-black/10 transition-colors duration-500 group-hover:via-black/12 group-focus-visible:via-black/12"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transform-none"
                    style={{ backgroundColor: house.accentFrom }}
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="flex items-end justify-between gap-3">
                      <span className={cn("text-xl leading-tight text-white sm:text-2xl", titleClass)}>
                        {houseCopy.title}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-white/75 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 block font-code text-[0.6875rem] leading-5 text-white/70 sm:text-xs">
                      {typeCodes.join(" · ")}
                    </span>
                  </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20" aria-labelledby="journey-title">
        <div className="signal-container">
          <Reveal className="max-w-3xl" variant="soft">
            <p className="signal-eyebrow">{copy.howEyebrow}</p>
            <h2
              id="journey-title"
              className={cn("mt-3 text-3xl leading-tight text-[#f5f3ed] sm:text-5xl", titleClass)}
            >
              {copy.howTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#b9bbc3] sm:text-lg sm:leading-8">{copy.howBody}</p>
          </Reveal>

          <ol className="mt-8 grid border-y border-white/10 md:grid-cols-3 lg:mt-12">
            {copy.steps.map(([label, title, body]) => (
              <li
                key={label}
                className="min-w-0 border-b border-white/10 py-6 md:min-h-52 md:border-b-0 md:border-r md:p-7 md:last:border-r-0"
              >
                <p className="font-code text-xs font-semibold text-[#e7b55b]">{label}</p>
                <h3 className="mt-6 break-words text-xl font-semibold text-[#f5f3ed] sm:text-2xl">{title}</h3>
                <p className="mt-3 break-words text-base leading-7 text-[#9fa2aa]">{body}</p>
              </li>
            ))}
          </ol>

          <Reveal className="mt-12 grid gap-9 border-t border-white/10 pt-10 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end lg:gap-16 lg:pt-14" variant="soft">
            <div className="min-w-0">
              <p className="signal-eyebrow">{copy.resultsEyebrow}</p>
              <h2 className={cn("mt-3 max-w-[20ch] text-3xl leading-tight text-[#f5f3ed] sm:text-5xl", titleClass)}>
                {copy.finalTitle}
              </h2>
              <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#b9bbc3] sm:text-lg sm:leading-8">
                {copy.resultsBody}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link href="/quiz" className="signal-button-primary group min-w-0 text-center">
                  {copy.start}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/dashboard"
                  className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#f5f3ed] underline decoration-white/30 underline-offset-4 outline-none hover:decoration-[#e7b55b] focus-visible:ring-2 focus-visible:ring-[#f6d59b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0c0f]"
                >
                  {copy.resultsCta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            <div className="min-w-0 border-l border-white/10 pl-5 sm:pl-7">
              <History className="h-6 w-6 text-[#e7b55b]" aria-hidden="true" />
              <ul className="mt-5 space-y-3">
                {copy.resultsPoints.map((point) => (
                  <li key={point} className="flex min-w-0 gap-3 text-sm leading-6 text-[#d4d2cc] sm:text-base">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#e7b55b]" aria-hidden="true" />
                    <span className="min-w-0 break-words">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
