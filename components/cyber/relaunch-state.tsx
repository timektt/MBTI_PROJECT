"use client";

import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  DatabaseZap,
  GalleryVerticalEnd,
  KeyRound,
  Share2,
  ShieldCheck,
  type LucideIcon,
  UserRound,
} from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { useMbtiZReducedMotion } from "@/components/cyber/motion";
import {
  mbtiZRelaunchCopy,
  type MbtiZLocale,
  type MbtiZRelaunchScenario,
} from "@/lib/mbti-z-copy";

export type RelaunchIntent =
  | "profile-home"
  | "public-profile"
  | "followers"
  | "following"
  | "user-alias"
  | "account-settings"
  | "password-settings"
  | "profile-setup"
  | "username-setup"
  | "password-reset"
  | "email-verification"
  | "community-explore"
  | "community-leaderboard"
  | "community-card"
  | "personal-card"
  | "profile-cards"
  | "public-share"
  | "admin-overview"
  | "admin-cards"
  | "admin-comments"
  | "admin-settings"
  | "admin-users";

type RelaunchIntentCopy = {
  browserTitle: string;
  headline: string;
};

type RelaunchPresentationCopy = {
  modeLabel: string;
  tag: string;
  statusLabel: string;
  statusHeading: string;
  primaryLabel: string;
  secondaryLabel: string;
};

const relaunchPresentationCopy: Record<
  MbtiZRelaunchScenario,
  Record<MbtiZLocale, RelaunchPresentationCopy>
> = {
  profile: {
    th: {
      modeLabel: "Guest Mode พร้อมใช้งาน",
      tag: "โปรไฟล์ยังพักไว้",
      statusLabel: "สิ่งที่ยังใช้งานได้",
      statusHeading: "รายละเอียดสถานะ",
      primaryLabel: "เปิด Dashboard",
      secondaryLabel: "กลับไปทำแบบทดสอบ",
    },
    en: {
      modeLabel: "Guest Mode Active",
      tag: "Profile on hold",
      statusLabel: "What still works",
      statusHeading: "Relaunch status",
      primaryLabel: "Open dashboard",
      secondaryLabel: "Return to assessment",
    },
  },
  settings: {
    th: {
      modeLabel: "Guest Mode พร้อมใช้งาน",
      tag: "การตั้งค่าบัญชียังพักไว้",
      statusLabel: "สถานะปัจจุบัน",
      statusHeading: "รายละเอียดสถานะ",
      primaryLabel: "เริ่มแบบทดสอบ",
      secondaryLabel: "กลับหน้าหลัก",
    },
    en: {
      modeLabel: "Guest Mode Active",
      tag: "Account settings on hold",
      statusLabel: "Current status",
      statusHeading: "Relaunch status",
      primaryLabel: "Start assessment",
      secondaryLabel: "Back to home",
    },
  },
  community: {
    th: {
      modeLabel: "Guest Mode พร้อมใช้งาน",
      tag: "พื้นที่ Community ยังพักไว้",
      statusLabel: "เหตุผลที่พักไว้",
      statusHeading: "รายละเอียดสถานะ",
      primaryLabel: "เปิด Dashboard",
      secondaryLabel: "ทำแบบทดสอบอีกครั้ง",
    },
    en: {
      modeLabel: "Guest Mode Active",
      tag: "Community on hold",
      statusLabel: "Why this is paused",
      statusHeading: "Relaunch status",
      primaryLabel: "Open dashboard",
      secondaryLabel: "Retake assessment",
    },
  },
  share: {
    th: {
      modeLabel: "Guest Mode พร้อมใช้งาน",
      tag: "การแชร์สาธารณะยังพักไว้",
      statusLabel: "สิ่งที่ยังใช้งานได้",
      statusHeading: "รายละเอียดสถานะ",
      primaryLabel: "เปิด Dashboard",
      secondaryLabel: "กลับไปทำแบบทดสอบ",
    },
    en: {
      modeLabel: "Guest Mode Active",
      tag: "Public sharing on hold",
      statusLabel: "What still works",
      statusHeading: "Relaunch status",
      primaryLabel: "See your dashboard",
      secondaryLabel: "Back to assessment",
    },
  },
  verification: {
    th: {
      modeLabel: "Guest Mode พร้อมใช้งาน",
      tag: "การยืนยันบัญชียังพักไว้",
      statusLabel: "สถานะปัจจุบัน",
      statusHeading: "รายละเอียดสถานะ",
      primaryLabel: "เริ่มแบบทดสอบ",
      secondaryLabel: "กลับหน้าหลัก",
    },
    en: {
      modeLabel: "Guest Mode Active",
      tag: "Account verification on hold",
      statusLabel: "Current status",
      statusHeading: "Relaunch status",
      primaryLabel: "Start assessment",
      secondaryLabel: "Back to home",
    },
  },
  operations: {
    th: {
      modeLabel: "Guest Mode พร้อมใช้งาน",
      tag: "เครื่องมือดูแลระบบยังพักไว้",
      statusLabel: "เหตุผลที่พักไว้",
      statusHeading: "รายละเอียดสถานะ",
      primaryLabel: "เปิด Dashboard",
      secondaryLabel: "กลับหน้าหลัก",
    },
    en: {
      modeLabel: "Guest Mode Active",
      tag: "Operations tools on hold",
      statusLabel: "Why this is held",
      statusHeading: "Relaunch status",
      primaryLabel: "Open dashboard",
      secondaryLabel: "Back to home",
    },
  },
};

const relaunchSummaryCopy: Record<
  MbtiZRelaunchScenario,
  Record<MbtiZLocale, string>
> = {
  profile: {
    th: "ตอนนี้คุณยังดูและจัดการโปรไฟล์ออนไลน์ไม่ได้ แต่ผลแบบทดสอบและประวัติใน browser นี้ยังใช้งานได้ตามปกติ",
    en: "Online profiles are not available yet, but your assessment results and history in this browser still work normally.",
  },
  settings: {
    th: "การตั้งค่าที่ต้องผูกกับบัญชียังไม่เปิดใช้งาน คุณยังเริ่มแบบทดสอบและเก็บผลลัพธ์ไว้ใน browser นี้ได้ทันที",
    en: "Account-linked settings are not available yet. You can still take the assessment and keep results in this browser.",
  },
  community: {
    th: "พื้นที่สาธารณะและกิจกรรมร่วมกับผู้ใช้อื่นยังไม่เปิดใช้งาน ระหว่างนี้คุณยังใช้แบบทดสอบ ผลลัพธ์ และ Dashboard ส่วนตัวได้",
    en: "Public discovery and community activity are not available yet. The assessment, results, and your local Dashboard remain ready.",
  },
  share: {
    th: "ลิงก์ผลลัพธ์สาธารณะยังไม่เปิดใช้งาน คุณยังเปิดผลลัพธ์เดิมจาก Dashboard และดาวน์โหลดภาพไว้แชร์ด้วยตัวเองได้",
    en: "Public result links are not available yet. You can still reopen local results from the Dashboard and download an image to share yourself.",
  },
  verification: {
    th: "การยืนยันอีเมลและกู้คืนบัญชียังไม่เปิดใช้งาน หน้านี้จะไม่รับข้อมูลหรือส่งอีเมลจนกว่าระบบบัญชีจะพร้อม",
    en: "Email verification and account recovery are not available yet. This page will not collect details or send email until accounts are ready.",
  },
  operations: {
    th: "เครื่องมือดูแลระบบยังไม่เปิดใช้งาน และหน้านี้ไม่แสดงข้อมูลผู้ใช้หรือการควบคุมระบบใด ๆ",
    en: "Operations tools are not available yet. This page does not expose user data or system controls.",
  },
};

const relaunchIntentCopy: Record<
  RelaunchIntent,
  Record<MbtiZLocale, RelaunchIntentCopy>
> = {
  "profile-home": {
    th: {
      browserTitle: "โปรไฟล์ของคุณยังพักไว้ | MBTI Z",
      headline: "โปรไฟล์ของคุณยังไม่เปิดใน Guest Mode",
    },
    en: {
      browserTitle: "Your Profile Is Paused | MBTI Z",
      headline: "Your profile is not available in Guest Mode yet",
    },
  },
  "public-profile": {
    th: {
      browserTitle: "โปรไฟล์สาธารณะยังพักไว้ | MBTI Z",
      headline: "โปรไฟล์สาธารณะกำลังรอ Account Runtime",
    },
    en: {
      browserTitle: "Public Profile Is Paused | MBTI Z",
      headline: "Public profiles are waiting for the account runtime",
    },
  },
  followers: {
    th: {
      browserTitle: "รายชื่อผู้ติดตามยังพักไว้ | MBTI Z",
      headline: "รายชื่อผู้ติดตามยังไม่เปิดใน Guest Mode",
    },
    en: {
      browserTitle: "Followers Are Paused | MBTI Z",
      headline: "Follower lists are not available in Guest Mode yet",
    },
  },
  following: {
    th: {
      browserTitle: "รายชื่อที่กำลังติดตามยังพักไว้ | MBTI Z",
      headline: "รายชื่อที่กำลังติดตามยังรอระบบบัญชี",
    },
    en: {
      browserTitle: "Following Is Paused | MBTI Z",
      headline: "Following lists are waiting for the account system",
    },
  },
  "user-alias": {
    th: {
      browserTitle: "หน้าโปรไฟล์ชื่อผู้ใช้ยังพักไว้ | MBTI Z",
      headline: "หน้าโปรไฟล์จากชื่อผู้ใช้ยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "User Alias Profile Is Paused | MBTI Z",
      headline: "User alias profiles are not active yet",
    },
  },
  "account-settings": {
    th: {
      browserTitle: "การตั้งค่าบัญชียังพักไว้ | MBTI Z",
      headline: "การตั้งค่าบัญชียังไม่เปิดใน Guest Mode",
    },
    en: {
      browserTitle: "Account Settings Are Paused | MBTI Z",
      headline: "Account settings are not available in Guest Mode yet",
    },
  },
  "password-settings": {
    th: {
      browserTitle: "การตั้งค่ารหัสผ่านยังพักไว้ | MBTI Z",
      headline: "การเปลี่ยนรหัสผ่านกำลังรอ Auth Runtime",
    },
    en: {
      browserTitle: "Password Settings Are Paused | MBTI Z",
      headline: "Password changes are waiting for the auth runtime",
    },
  },
  "profile-setup": {
    th: {
      browserTitle: "การตั้งค่าโปรไฟล์ยังพักไว้ | MBTI Z",
      headline: "การตั้งค่าโปรไฟล์จะกลับมาพร้อมระบบบัญชี",
    },
    en: {
      browserTitle: "Profile Setup Is Paused | MBTI Z",
      headline: "Profile setup will return with the account system",
    },
  },
  "username-setup": {
    th: {
      browserTitle: "การตั้งชื่อผู้ใช้ยังพักไว้ | MBTI Z",
      headline: "การตั้งชื่อผู้ใช้กำลังรอ Public Identity",
    },
    en: {
      browserTitle: "Username Setup Is Paused | MBTI Z",
      headline: "Username setup is waiting for public identity",
    },
  },
  "password-reset": {
    th: {
      browserTitle: "การรีเซ็ตรหัสผ่านยังพักไว้ | MBTI Z",
      headline: "การรีเซ็ตรหัสผ่านกำลังรอ Auth Runtime",
    },
    en: {
      browserTitle: "Password Reset Is Paused | MBTI Z",
      headline: "Password reset is waiting for the auth runtime",
    },
  },
  "email-verification": {
    th: {
      browserTitle: "การยืนยันอีเมลยังพักไว้ | MBTI Z",
      headline: "การยืนยันอีเมลกำลังรอ Auth Runtime",
    },
    en: {
      browserTitle: "Email Verification Is Paused | MBTI Z",
      headline: "Email verification is waiting for the auth runtime",
    },
  },
  "community-explore": {
    th: {
      browserTitle: "พื้นที่สำรวจ Community ยังพักไว้ | MBTI Z",
      headline: "พื้นที่สำรวจ Community ยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Community Explore Is Paused | MBTI Z",
      headline: "Community exploration is not active yet",
    },
  },
  "community-leaderboard": {
    th: {
      browserTitle: "Leaderboard ยังพักไว้ | MBTI Z",
      headline: "Leaderboard กำลังรอ Community Runtime",
    },
    en: {
      browserTitle: "Leaderboard Is Paused | MBTI Z",
      headline: "The leaderboard is waiting for the community runtime",
    },
  },
  "community-card": {
    th: {
      browserTitle: "Community Card ยังพักไว้ | MBTI Z",
      headline: "Community Card นี้ยังไม่เปิดแบบสาธารณะ",
    },
    en: {
      browserTitle: "Community Card Is Paused | MBTI Z",
      headline: "This community card is not publicly available yet",
    },
  },
  "personal-card": {
    th: {
      browserTitle: "การ์ดส่วนตัวของคุณยังพักไว้ | MBTI Z",
      headline: "การ์ดส่วนตัวกำลังรอระบบบัญชีและการบันทึก",
    },
    en: {
      browserTitle: "Your Personal Card Is Paused | MBTI Z",
      headline: "Your personal card is waiting for accounts and saving",
    },
  },
  "profile-cards": {
    th: {
      browserTitle: "การ์ดบนโปรไฟล์ยังพักไว้ | MBTI Z",
      headline: "ชุดการ์ดบนโปรไฟล์ยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Profile Cards Are Paused | MBTI Z",
      headline: "Profile card collections are not active yet",
    },
  },
  "public-share": {
    th: {
      browserTitle: "หน้าผลลัพธ์สาธารณะยังพักไว้ | MBTI Z",
      headline: "ลิงก์ผลลัพธ์สาธารณะยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Public Result Share Is Paused | MBTI Z",
      headline: "Public result links are not active yet",
    },
  },
  "admin-overview": {
    th: {
      browserTitle: "ภาพรวม Admin ยังพักไว้ | MBTI Z",
      headline: "ภาพรวม Admin ยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Admin Overview Is Paused | MBTI Z",
      headline: "The admin overview is not active yet",
    },
  },
  "admin-cards": {
    th: {
      browserTitle: "การจัดการการ์ดยังพักไว้ | MBTI Z",
      headline: "การจัดการการ์ดยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Admin Card Management Is Paused | MBTI Z",
      headline: "Admin card management is not active yet",
    },
  },
  "admin-comments": {
    th: {
      browserTitle: "การจัดการความคิดเห็นยังพักไว้ | MBTI Z",
      headline: "การจัดการความคิดเห็นยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Admin Comment Management Is Paused | MBTI Z",
      headline: "Admin comment management is not active yet",
    },
  },
  "admin-settings": {
    th: {
      browserTitle: "การตั้งค่า Admin ยังพักไว้ | MBTI Z",
      headline: "การตั้งค่า Admin ยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Admin Settings Are Paused | MBTI Z",
      headline: "Admin settings are not active yet",
    },
  },
  "admin-users": {
    th: {
      browserTitle: "การจัดการผู้ใช้ยังพักไว้ | MBTI Z",
      headline: "การจัดการผู้ใช้ยังไม่เปิดใช้งาน",
    },
    en: {
      browserTitle: "Admin User Management Is Paused | MBTI Z",
      headline: "Admin user management is not active yet",
    },
  },
};

const scenarioIcons: Record<MbtiZRelaunchScenario, LucideIcon> = {
  profile: UserRound,
  settings: KeyRound,
  community: GalleryVerticalEnd,
  share: Share2,
  verification: ShieldCheck,
  operations: DatabaseZap,
};

export function RelaunchState({
  intent,
  scenario,
}: {
  intent: RelaunchIntent;
  scenario: MbtiZRelaunchScenario;
}) {
  const { locale } = useMbtiZLocale();
  const shouldReduceMotion = useMbtiZReducedMotion();
  const activeCopy = mbtiZRelaunchCopy[scenario][locale];
  const intentCopy = relaunchIntentCopy[intent][locale];
  const summary = relaunchSummaryCopy[scenario][locale];
  const presentation = relaunchPresentationCopy[scenario][locale];
  const Icon = scenarioIcons[scenario];
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-editorial";

  return (
    <>
      <Head>
        <title>{intentCopy.browserTitle}</title>
        <meta name="description" content={summary} />
      </Head>

      <AmbientStage variant="hold">
        <main className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8">
          <header className="flex flex-wrap items-center justify-end gap-4">
            <div className="flex min-h-[44px] items-center gap-3 text-sm text-white/68">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#39c987] shadow-[0_0_16px_rgba(57,201,135,0.7)]"
              />
              {presentation.modeLabel}
            </div>
          </header>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.26,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="my-auto grid gap-10 border-t border-white/10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)] lg:items-end lg:gap-16 lg:py-20"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-sm font-medium text-[#f5c76d]">
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span>{presentation.tag}</span>
              </div>

              <h1 className={`mt-6 max-w-4xl text-4xl leading-[1.12] text-white sm:text-5xl lg:text-6xl ${headlineClass}`}>
                {intentCopy.headline}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
                {summary}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={activeCopy.primaryHref}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-3 rounded-lg bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-6 py-3 text-center text-sm font-semibold text-[#050814] outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#f5c76d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080d] motion-reduce:transition-none sm:w-auto"
                >
                  {presentation.primaryLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                </Link>

                {activeCopy.secondaryHref && activeCopy.secondaryLabel ? (
                  <Link
                    href={activeCopy.secondaryHref}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-white/15 px-6 py-3 text-center text-sm font-medium text-white/78 outline-none transition hover:border-white/30 hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-[#7cc8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080d] motion-reduce:transition-none sm:w-auto"
                  >
                    {presentation.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            <aside aria-label={presentation.statusHeading} className="min-w-0 lg:pb-1">
              <details className="group border-y border-white/12">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-left outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7cc8ff] [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-xs font-medium text-[#7cc8ff]">
                      {presentation.statusLabel}
                    </span>
                    <span className="mt-1 block text-lg font-semibold text-white">
                      {presentation.statusHeading}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-white/60 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>

                <div className="border-t border-white/10 pb-5 pt-5">
                  <p className="text-sm leading-7 text-white/68">{activeCopy.statusBody}</p>

                  <div className="mt-6">
                    <p className="text-xs font-medium text-white/48">{activeCopy.queueLabel}</p>
                    <ul className="mt-3 space-y-2" role="list">
                      {activeCopy.queueItems.map((item) => (
                        <li key={item} className="flex min-w-0 items-start gap-3 text-sm text-white/62">
                          <span
                            aria-hidden="true"
                            className="mt-[0.6rem] h-px w-3 shrink-0 bg-[#f5c76d]/65"
                          />
                          <span className="min-w-0 break-words font-code">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </aside>
          </motion.section>
        </main>
      </AmbientStage>
    </>
  );
}
