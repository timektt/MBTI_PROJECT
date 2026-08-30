import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Check,
  Clapperboard,
  Compass,
  HeartHandshake,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { Reveal } from "@/components/cyber/motion";
import { selectMbtiZTypeLocale } from "@/data/mbti/mbti-z-type-details.mjs";
import {
  getMbtiZAnimalFocalPosition,
  getMbtiZHouseScenePath,
} from "@/lib/mbti-z-visuals";
import { cn } from "@/lib/utils";

type Locale = "th" | "en";

type LetterDetail = {
  letter: string;
  title: string;
  body: string;
};

type StrengthDetail = {
  title: string;
  body: string;
  example: string;
};

type GrowthDetail = {
  title: string;
  body: string;
  practice: string;
};

type LocalizedProfile = {
  code: string;
  routeSlug: string;
  houseKey: string;
  accentFrom: string;
  accentTo: string;
  animalImagePath: string | null;
  archetypeName: string;
  houseTitle: string;
  houseDescription: string;
  animalName: string;
  tagline: string;
  summary: string;
  identitySentence: string;
  introduction: string[];
  letters: LetterDetail[];
  strengths: StrengthDetail[];
  growthEdges: GrowthDetail[];
  decisionStyle: string;
  communicationStyle: string;
  relationships: string;
  work: {
    individual: string;
    teamwork: string;
    leadership: string;
    environments: string[];
    roleExamples: string[];
    tendencyNote: string;
  };
  stress: {
    signals: string[];
    recoveryPractices: string[];
  };
  movieProfileLens: {
    title: string;
    body: string;
    disclaimer: string;
  };
  disclaimer: string;
};

export type TypeProfile = {
  code: string;
  routeSlug: string;
  houseKey: string;
  accentFrom: string;
  accentTo: string;
  animalImagePath: string | null;
  archetypeNameTh: string;
  archetypeNameEn: string;
  houseTitleTh: string;
  houseTitleEn: string;
  animalNameTh: string;
  animalNameEn: string;
  locales: Record<Locale, unknown>;
  relatedCodes: string[];
};

export type RelatedTypeSummary = Pick<
  TypeProfile,
  | "code"
  | "routeSlug"
  | "houseKey"
  | "accentFrom"
  | "accentTo"
  | "animalImagePath"
  | "archetypeNameTh"
  | "archetypeNameEn"
  | "houseTitleTh"
  | "houseTitleEn"
  | "animalNameTh"
  | "animalNameEn"
>;

type PageCopy = {
  backToTypes: string;
  house: string;
  animal: string;
  sectionsLabel: string;
  sections: Array<{ id: string; label: string }>;
  overviewEyebrow: string;
  overviewTitle: string;
  letterTitle: string;
  letterIntro: string;
  strengthsEyebrow: string;
  strengthsTitle: string;
  growthTitle: string;
  exampleLabel: string;
  practiceLabel: string;
  relationshipsEyebrow: string;
  relationshipsTitle: string;
  decisionTitle: string;
  communicationTitle: string;
  relationshipTitle: string;
  workEyebrow: string;
  workTitle: string;
  individualTitle: string;
  teamworkTitle: string;
  leadershipTitle: string;
  environmentsTitle: string;
  rolesTitle: string;
  stressEyebrow: string;
  stressTitle: string;
  signalsTitle: string;
  recoveryTitle: string;
  movieEyebrow: string;
  relatedEyebrow: string;
  relatedTitle: string;
  viewProfile: string;
  quizAction: string;
  resultsAction: string;
  atlasAction: string;
  finalTitle: string;
  finalBody: string;
  metaSuffix: string;
};

const copyByLocale: Record<Locale, PageCopy> = {
  th: {
    backToTypes: "กลับไป 16 Types",
    house: "บ้าน",
    animal: "สัตว์ประจำไทป์",
    sectionsLabel: "สารบัญโปรไฟล์",
    sections: [
      { id: "overview", label: "ภาพรวม" },
      { id: "strengths", label: "จุดแข็ง" },
      { id: "relationships", label: "ความสัมพันธ์" },
      { id: "work", label: "การทำงาน" },
      { id: "stress", label: "ความเครียด" },
      { id: "movie-profile", label: "Movie Profile" },
    ],
    overviewEyebrow: "01 / ภาพรวม",
    overviewTitle: "โครงสร้างความคิดที่อยู่หลังตัวอักษร",
    letterTitle: "ความหมายของตัวอักษรทั้งสี่",
    letterIntro: "ตัวอักษรอธิบายแนวโน้มการรับพลัง รับข้อมูล ตัดสินใจ และจัดการโลกภายนอก ไม่ได้วัดความสามารถหรือคุณค่าของคน",
    strengthsEyebrow: "02 / ศักยภาพและพื้นที่เติบโต",
    strengthsTitle: "จุดแข็งเมื่อใช้ได้ถูกบริบท",
    growthTitle: "พื้นที่ฝึกเพื่อเพิ่มความยืดหยุ่น",
    exampleLabel: "ตัวอย่าง",
    practiceLabel: "วิธีฝึก",
    relationshipsEyebrow: "03 / การตัดสินใจและผู้คน",
    relationshipsTitle: "รูปแบบที่มักเห็นในการสื่อสารและความสัมพันธ์",
    decisionTitle: "การตัดสินใจ",
    communicationTitle: "การสื่อสาร",
    relationshipTitle: "ความสัมพันธ์",
    workEyebrow: "04 / การทำงาน",
    workTitle: "จังหวะงาน ทีม และการนำ",
    individualTitle: "งานรายบุคคล",
    teamworkTitle: "การทำงานเป็นทีม",
    leadershipTitle: "แนวโน้มการนำ",
    environmentsTitle: "สภาพแวดล้อมที่ช่วยให้ทำงานได้ดี",
    rolesTitle: "ตัวอย่างบทบาทเพื่อใช้สำรวจ",
    stressEyebrow: "05 / ความเครียดและการฟื้นตัว",
    stressTitle: "สัญญาณที่ควรสังเกตและวิธีกลับสู่สมดุล",
    signalsTitle: "สัญญาณภายใต้แรงกดดัน",
    recoveryTitle: "วิธีฟื้นพลังที่ลองได้",
    movieEyebrow: "06 / Movie Profile",
    relatedEyebrow: "ไปต่อ",
    relatedTitle: "สำรวจไทป์ที่มีมุมเชื่อมโยง",
    viewProfile: "ดูโปรไฟล์",
    quizAction: "ทำแบบทดสอบ",
    resultsAction: "ดู My Results",
    atlasAction: "เปิด Type Atlas",
    finalTitle: "ใช้โปรไฟล์นี้เป็นจุดเริ่มต้น ไม่ใช่คำตัดสิน",
    finalBody: "สังเกตว่าข้อไหนตรงกับบริบทจริงของคุณ แล้วใช้สิ่งที่พบเพื่อทดลองวิธีสื่อสาร ตัดสินใจ และฟื้นพลังที่เหมาะกว่าเดิม",
    metaSuffix: "โปรไฟล์บุคลิก MBTI Z",
  },
  en: {
    backToTypes: "Back to 16 Types",
    house: "House",
    animal: "Type animal",
    sectionsLabel: "Profile sections",
    sections: [
      { id: "overview", label: "Overview" },
      { id: "strengths", label: "Strengths" },
      { id: "relationships", label: "Relationships" },
      { id: "work", label: "Work" },
      { id: "stress", label: "Stress" },
      { id: "movie-profile", label: "Movie Profile" },
    ],
    overviewEyebrow: "01 / Overview",
    overviewTitle: "The thinking patterns behind the letters",
    letterTitle: "What the four letters describe",
    letterIntro: "The letters describe tendencies in energy, information, decisions, and outer-world structure. They do not measure ability or personal worth.",
    strengthsEyebrow: "02 / Potential and growth",
    strengthsTitle: "Strengths in the right context",
    growthTitle: "Practices that build flexibility",
    exampleLabel: "Example",
    practiceLabel: "Practice",
    relationshipsEyebrow: "03 / Decisions and people",
    relationshipsTitle: "Patterns that may appear in communication and relationships",
    decisionTitle: "Decision style",
    communicationTitle: "Communication style",
    relationshipTitle: "Relationships",
    workEyebrow: "04 / Work",
    workTitle: "Individual rhythm, teamwork, and leadership",
    individualTitle: "Individual work",
    teamworkTitle: "Team collaboration",
    leadershipTitle: "Leadership tendency",
    environmentsTitle: "Environments that may support good work",
    rolesTitle: "Role examples for exploration",
    stressEyebrow: "05 / Stress and recovery",
    stressTitle: "Signals to notice and ways to return to balance",
    signalsTitle: "Signals under pressure",
    recoveryTitle: "Recovery practices to try",
    movieEyebrow: "06 / Movie Profile",
    relatedEyebrow: "Continue exploring",
    relatedTitle: "Types with useful points of connection",
    viewProfile: "View profile",
    quizAction: "Take the quiz",
    resultsAction: "View My Results",
    atlasAction: "Open Type Atlas",
    finalTitle: "Use this profile as a starting point, not a verdict",
    finalBody: "Notice what fits your real context, then use the observations to test better ways of communicating, deciding, working, and recovering.",
    metaSuffix: "MBTI Z personality profile",
  },
};

const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-accent-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--signal-canvas)]";

const sectionClasses =
  "scroll-mt-[8.5rem] border-t border-white/10 py-16 sm:py-20 lg:scroll-mt-[9.5rem] lg:py-24";

const selectLocale = selectMbtiZTypeLocale as (
  profile: TypeProfile,
  locale: Locale
) => LocalizedProfile | null;

function readFromHouse(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return ["purple", "green", "yellow", "blue"].includes(candidate ?? "")
    ? candidate
    : null;
}

function ActionLink({
  children,
  href,
  primary = false,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors motion-reduce:transition-none",
        focusClasses,
        primary
          ? "bg-[var(--signal-accent)] text-[var(--signal-accent-ink)] hover:bg-[#f6d59b]"
          : "border border-white/15 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]"
      )}
    >
      {children}
    </Link>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="max-w-3xl" variant="soft">
      <p className="font-code text-xs text-[#f6d59b]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
    </Reveal>
  );
}

export function TypeDetailPage({
  canonicalUrl,
  profile,
  relatedProfiles,
}: {
  canonicalUrl: string;
  profile: TypeProfile;
  relatedProfiles: RelatedTypeSummary[];
}) {
  const router = useRouter();
  const { locale } = useMbtiZLocale();
  const copy = copyByLocale[locale];
  const localizedProfile = selectLocale(profile, locale);

  if (!localizedProfile) return null;

  const fromHouse = readFromHouse(router.query.from);
  const backHref = fromHouse ? `/types?house=${fromHouse}` : "/types";
  const title = `${localizedProfile.code} ${localizedProfile.archetypeName} | ${copy.metaSuffix}`;
  const description = localizedProfile.identitySentence;
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";

  return (
    <div
      className="min-h-screen overflow-x-clip bg-[#0b0c0f] text-[var(--signal-text)]"
      lang={locale}
      style={
        {
          "--type-accent-from": localizedProfile.accentFrom,
          "--type-accent-to": localizedProfile.accentTo,
        } as React.CSSProperties
      }
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>

      <main>
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <Image
            src={getMbtiZHouseScenePath(localizedProfile.houseKey)}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover opacity-25"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,12,15,0.98)_0%,rgba(11,12,15,0.90)_48%,rgba(11,12,15,0.76)_100%)]" />
          <div className="signal-container grid gap-8 py-8 sm:py-12 lg:min-h-[620px] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center lg:gap-14 lg:py-16">
            <Reveal className="min-w-0" mode="mount" variant="hero">
              <Link
                href={backHref}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm text-white/70 transition-colors hover:text-white motion-reduce:transition-none",
                  focusClasses
                )}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {copy.backToTypes}
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-white/68">
                <span className="rounded-md border border-white/15 bg-black/20 px-3 py-1.5">
                  {localizedProfile.houseTitle}
                </span>
                <span aria-hidden="true">/</span>
                <span>{localizedProfile.animalName}</span>
              </div>

              <h1
                className={cn(
                  "mt-5 max-w-4xl text-[clamp(2.75rem,9vw,6.75rem)] leading-[0.94] text-white",
                  headlineClass
                )}
              >
                <span className="block">{localizedProfile.code}</span>
                <span className="mt-3 block text-[clamp(1.5rem,4vw,3.2rem)] leading-tight text-white/92">
                  {localizedProfile.archetypeName}
                </span>
              </h1>

              <p
                className="mt-6 max-w-2xl text-sm font-semibold leading-6"
                style={{ color: localizedProfile.accentTo }}
              >
                {localizedProfile.tagline}
              </p>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                {localizedProfile.identitySentence}
              </p>

              <div className="mt-7 flex flex-wrap gap-2" aria-label={localizedProfile.code}>
                {localizedProfile.letters.map((item) => (
                  <span
                    key={item.letter}
                    className="grid h-11 w-11 place-items-center rounded-md border border-white/15 bg-black/25 font-code text-sm font-bold text-white"
                    title={item.title}
                  >
                    {item.letter}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink href="/quiz" primary>
                  {copy.quizAction}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ActionLink>
                <ActionLink href="/dashboard">{copy.resultsAction}</ActionLink>
              </div>
            </Reveal>

            <Reveal
              className="mx-auto w-full max-w-[420px] lg:justify-self-end"
              delay={0.08}
              mode="mount"
              variant="strong"
            >
            <figure className="relative w-full">
              {localizedProfile.animalImagePath ? (
                <Image
                  src={localizedProfile.animalImagePath}
                  alt={`${localizedProfile.code} - ${localizedProfile.animalName}`}
                  width={1080}
                  height={1350}
                  priority
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 52vw, 86vw"
                  className="relative aspect-[4/5] h-auto w-full object-contain drop-shadow-[0_32px_54px_rgba(0,0,0,0.5)]"
                  style={{ objectPosition: getMbtiZAnimalFocalPosition(localizedProfile.code) }}
                />
              ) : (
                <div
                  className="grid aspect-[4/5] place-items-center border-y border-white/10 text-center text-white/60"
                  data-ui-asset-fallback="animal"
                >
                  {localizedProfile.animalName}
                </div>
              )}
              <figcaption className="relative mt-2 text-center text-sm text-white/62">
                {copy.animal}: {localizedProfile.animalName}
              </figcaption>
            </figure>
            </Reveal>
          </div>
        </section>

        <nav
          aria-label={copy.sectionsLabel}
          className="sticky top-[60px] z-40 border-b border-white/10 bg-[#0b0c0f]/96 backdrop-blur-xl lg:top-[72px]"
        >
          <div className="signal-container py-2 sm:hidden">
            <label htmlFor="type-detail-section" className="sr-only">
              {copy.sectionsLabel}
            </label>
            <select
              id="type-detail-section"
              defaultValue=""
              onChange={(event) => {
                window.location.hash = event.target.value;
                event.currentTarget.value = "";
              }}
              className={cn(
                "min-h-11 w-full rounded-md border border-white/15 bg-[#111318] px-3 text-sm text-white",
                focusClasses
              )}
            >
              <option value="" disabled>{copy.sectionsLabel}</option>
              {copy.sections.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="signal-container hidden overflow-x-auto overscroll-x-contain sm:block">
            <div className="flex min-w-max gap-1 py-2">
              {copy.sections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-md px-3 text-sm text-white/68 transition-colors hover:bg-white/[0.06] hover:text-white motion-reduce:transition-none",
                    focusClasses
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <section id="overview" className={sectionClasses}>
          <div className="signal-container">
            <SectionHeading eyebrow={copy.overviewEyebrow} title={copy.overviewTitle} />
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div className="max-w-2xl space-y-5 text-base leading-8 text-white/75 sm:text-lg">
                {localizedProfile.introduction.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white">{copy.letterTitle}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                  {copy.letterIntro}
                </p>
                <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {localizedProfile.letters.map((item) => (
                    <article
                      key={item.letter}
                      className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-md bg-white/[0.06] font-code font-bold text-white">
                        {item.letter}
                      </span>
                      <div>
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="mt-2 leading-7 text-white/68">{item.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="strengths" className={cn(sectionClasses, "bg-white/[0.025]")}>
          <div className="signal-container">
            <SectionHeading eyebrow={copy.strengthsEyebrow} title={copy.strengthsTitle} />
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#f6d59b]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-white">{copy.strengthsTitle}</h3>
                </div>
                <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {localizedProfile.strengths.map((item) => (
                    <article key={item.title} className="py-6">
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 leading-7 text-white/72">{item.body}</p>
                      <p className="mt-3 border-l-2 border-[#f6d59b]/55 pl-4 text-sm leading-6 text-white/58">
                        <span className="font-semibold text-white/75">{copy.exampleLabel}: </span>
                        {item.example}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <Compass className="h-5 w-5 text-[#7cd9ff]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-white">{copy.growthTitle}</h3>
                </div>
                <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {localizedProfile.growthEdges.map((item) => (
                    <article key={item.title} className="py-6">
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <p className="mt-2 leading-7 text-white/72">{item.body}</p>
                      <p className="mt-3 border-l-2 border-[#7cd9ff]/55 pl-4 text-sm leading-6 text-white/58">
                        <span className="font-semibold text-white/75">{copy.practiceLabel}: </span>
                        {item.practice}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="relationships" className={sectionClasses}>
          <div className="signal-container">
            <SectionHeading
              eyebrow={copy.relationshipsEyebrow}
              title={copy.relationshipsTitle}
            />
            <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 lg:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: copy.decisionTitle,
                  body: localizedProfile.decisionStyle,
                },
                {
                  icon: Users,
                  title: copy.communicationTitle,
                  body: localizedProfile.communicationStyle,
                },
                {
                  icon: HeartHandshake,
                  title: copy.relationshipTitle,
                  body: localizedProfile.relationships,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="bg-[#111318] p-6 sm:p-7">
                    <Icon className="h-5 w-5 text-[#f6d59b]" aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 leading-7 text-white/70">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="work" className={cn(sectionClasses, "bg-white/[0.025]")}>
          <div className="signal-container">
            <SectionHeading eyebrow={copy.workEyebrow} title={copy.workTitle} />
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-14">
              <div className="divide-y divide-white/10 border-y border-white/10">
                {[
                  {
                    icon: Brain,
                    title: copy.individualTitle,
                    body: localizedProfile.work.individual,
                  },
                  {
                    icon: Users,
                    title: copy.teamworkTitle,
                    body: localizedProfile.work.teamwork,
                  },
                  {
                    icon: BriefcaseBusiness,
                    title: copy.leadershipTitle,
                    body: localizedProfile.work.leadership,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="grid gap-4 py-6 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                      <Icon className="h-5 w-5 text-[#7cd9ff]" aria-hidden="true" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 leading-7 text-white/70">{item.body}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="space-y-8 border-l border-white/10 pl-5 sm:pl-7">
                <div>
                  <h3 className="font-semibold text-white">{copy.environmentsTitle}</h3>
                  <ul className="mt-4 space-y-3">
                    {localizedProfile.work.environments.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-white/68">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#76e6b2]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{copy.rolesTitle}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {localizedProfile.work.roleExamples.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/68"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs leading-5 text-white/45">
                  {localizedProfile.work.tendencyNote}
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section id="stress" className={sectionClasses}>
          <div className="signal-container">
            <SectionHeading eyebrow={copy.stressEyebrow} title={copy.stressTitle} />
            <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 lg:grid-cols-2">
              <article className="bg-[#111318] p-6 sm:p-8">
                <TriangleAlert className="h-5 w-5 text-[#f5c76d]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-white">{copy.signalsTitle}</h3>
                <ul className="mt-5 space-y-4">
                  {localizedProfile.stress.signals.map((item) => (
                    <li key={item} className="flex gap-3 leading-7 text-white/70">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5c76d]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="bg-[#111318] p-6 sm:p-8">
                <RefreshCw className="h-5 w-5 text-[#76e6b2]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-white">{copy.recoveryTitle}</h3>
                <ul className="mt-5 space-y-4">
                  {localizedProfile.stress.recoveryPractices.map((item) => (
                    <li key={item} className="flex gap-3 leading-7 text-white/70">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#76e6b2]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section
          id="movie-profile"
          className={cn(sectionClasses, "relative isolate overflow-hidden bg-[#111318]")}
        >
          <div
            className="absolute inset-y-0 right-0 -z-10 w-1/3 border-l border-white/5 opacity-10"
            style={{ backgroundColor: localizedProfile.accentFrom }}
            aria-hidden="true"
          />
          <div className="signal-container grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
            <div>
              <p className="font-code text-xs text-[#f6d59b]">{copy.movieEyebrow}</p>
              <Clapperboard className="mt-7 h-10 w-10 text-white/80" aria-hidden="true" />
            </div>
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {localizedProfile.movieProfileLens.title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/75">
                {localizedProfile.movieProfileLens.body}
              </p>
              <p className="mt-7 border-l-2 border-white/20 pl-4 text-sm leading-6 text-white/52">
                {localizedProfile.movieProfileLens.disclaimer}
              </p>
            </div>
          </div>
        </section>

        <section className={sectionClasses} aria-labelledby="related-types-title">
          <div className="signal-container">
            <p className="font-code text-xs text-[#f6d59b]">{copy.relatedEyebrow}</p>
            <h2 id="related-types-title" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {copy.relatedTitle}
            </h2>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {relatedProfiles.map((related) => {
                const name = locale === "th" ? related.archetypeNameTh : related.archetypeNameEn;
                const house = locale === "th" ? related.houseTitleTh : related.houseTitleEn;
                const animal = locale === "th" ? related.animalNameTh : related.animalNameEn;

                return (
                  <Link
                    key={related.code}
                    href={`/types/${related.routeSlug}`}
                    className={cn(
                      "group grid min-h-[176px] grid-cols-[minmax(0,1fr)_5.5rem] overflow-hidden rounded-md border border-white/10 bg-white/[0.03] transition-colors hover:border-white/25 hover:bg-white/[0.06] motion-reduce:transition-none",
                      focusClasses
                    )}
                  >
                    <div className="min-w-0 p-5">
                      <p className="font-code text-xl font-bold text-white">{related.code}</p>
                      <p className="mt-2 font-semibold text-white/90">{name}</p>
                      <p className="mt-2 text-sm text-white/52">{house} / {animal}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm text-[#f6d59b]">
                        {copy.viewProfile}
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="relative overflow-hidden bg-black/20">
                      {related.animalImagePath ? (
                        <Image
                          src={related.animalImagePath}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="88px"
                          className="object-cover object-center opacity-80 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                          style={{ objectPosition: getMbtiZAnimalFocalPosition(related.code) }}
                        />
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.025] py-16 sm:py-20">
          <div className="signal-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{copy.finalTitle}</h2>
              <p className="mt-4 leading-7 text-white/68">{copy.finalBody}</p>
              <p className="mt-5 text-xs leading-5 text-white/45">{localizedProfile.disclaimer}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ActionLink href="/quiz" primary>{copy.quizAction}</ActionLink>
              <ActionLink href="/types">{copy.atlasAction}</ActionLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
