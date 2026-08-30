"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, LayoutDashboard, LockKeyhole } from "lucide-react";

import { AmbientStage } from "@/components/cyber/ambient-stage";
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
  type GuestCloudReconnectBundle,
} from "@/lib/assessment-runtime";

export type AccountHoldMode = "login" | "register" | "recovery";

type RouteHoldCopy = {
  pageTitle: string;
  metaDescription: string;
  routeLabel: string;
  status: string;
  title: string;
  body: string;
  guestNote: string;
  advancedTitle: string;
  advancedBody: string;
};

const routeHoldCopy: Record<MbtiZLocale, Record<AccountHoldMode, RouteHoldCopy>> = {
  th: {
    login: {
      pageTitle: "เข้าสู่ระบบยังไม่เปิด | MBTI Z",
      metaDescription:
        "การเข้าสู่ระบบ MBTI Z ยังไม่เปิดใช้งาน แต่แบบทดสอบและ Dashboard แบบ Guest ใช้งานได้ตามปกติ",
      routeLabel: "การเข้าสู่ระบบ",
      status: "ยังไม่เปิดใช้งาน",
      title: "ระบบเข้าสู่บัญชียังไม่พร้อมใช้งาน",
      body:
        "ตอนนี้ยังเข้าสู่บัญชีและซิงก์ข้อมูลออนไลน์ไม่ได้ หน้านี้จึงไม่รับข้อมูลเข้าสู่ระบบ แต่คุณยังใช้แบบทดสอบ ผลลัพธ์ และประวัติใน browser นี้ได้ตามปกติ",
      guestNote:
        "คุณยังทำแบบทดสอบ ดูผลลัพธ์ และเปิดประวัติที่เก็บอยู่ใน browser นี้ได้โดยไม่ต้องเข้าสู่ระบบ",
      advancedTitle: "การกู้คืนข้อมูล Guest",
      advancedBody:
        "ถ้าคุณเคยเก็บ reconnect bundle ไว้ ให้เปิดเครื่องมือขั้นสูงด้านล่างเพื่อดาวน์โหลด คัดลอก หรือนำเข้าข้อมูลกลับสู่ browser นี้",
    },
    register: {
      pageTitle: "การสมัครสมาชิกยังไม่เปิด | MBTI Z",
      metaDescription:
        "การสมัครสมาชิก MBTI Z ยังไม่เปิดใช้งาน แต่สามารถเริ่มแบบทดสอบและเก็บผลลัพธ์แบบ Guest ได้ทันที",
      routeLabel: "การสมัครสมาชิก",
      status: "ยังไม่เปิดใช้งาน",
      title: "ยังไม่เปิดรับการสมัครบัญชีใหม่",
      body:
        "ตอนนี้ยังสร้างบัญชีและบันทึกข้อมูลออนไลน์ไม่ได้ หน้านี้จึงไม่แสดงแบบฟอร์มสมัครที่ยังใช้งานไม่ครบ แต่คุณเริ่มใช้ MBTI Z แบบ Guest ได้ทันที",
      guestNote:
        "เริ่มใช้งาน MBTI Z แบบ Guest ได้ทันที ผลลัพธ์และประวัติจะถูกเก็บไว้ใน browser เครื่องนี้",
      advancedTitle: "เก็บเส้นทาง Guest ไว้เชื่อมภายหลัง",
      advancedBody:
        "Reconnect bundle เป็นไฟล์สำรองสำหรับข้อมูล Guest ไม่ใช่การสมัครสมาชิก เปิดเครื่องมือเมื่อคุณต้องการสำรองหรือนำเข้าข้อมูลเท่านั้น",
    },
    recovery: {
      pageTitle: "การกู้คืนบัญชียังไม่เปิด | MBTI Z",
      metaDescription:
        "การกู้คืนรหัสผ่าน MBTI Z ยังไม่เปิดใช้งาน และจะไม่มีการส่งอีเมลรีเซ็ตจากหน้านี้",
      routeLabel: "การกู้คืนบัญชี",
      status: "ยังไม่เปิดใช้งาน",
      title: "ระบบกู้คืนรหัสผ่านยังไม่เปิดใช้งาน",
      body:
        "ตอนนี้ยังไม่สามารถกู้คืนรหัสผ่านหรือส่งอีเมลรีเซ็ตได้ หน้านี้จะไม่รับข้อมูลส่วนตัวจนกว่าระบบบัญชีจะพร้อมและผ่านการตรวจด้านความปลอดภัย",
      guestNote:
        "ถ้าต้องการทำแบบทดสอบหรือกลับไปดูผลลัพธ์ในเครื่องนี้ คุณใช้เส้นทาง Guest ได้โดยไม่ต้องกู้คืนบัญชี",
      advancedTitle: "กู้คืนข้อมูล Guest แทนบัญชี",
      advancedBody:
        "เครื่องมือนี้กู้คืนเฉพาะผลลัพธ์และ session จาก reconnect bundle ใน browser ไม่ได้เปลี่ยนรหัสผ่านหรือกู้คืนบัญชีออนไลน์",
    },
  },
  en: {
    login: {
      pageTitle: "Sign in unavailable | MBTI Z",
      metaDescription:
        "MBTI Z sign-in is unavailable while the guest Quiz and Dashboard remain ready to use.",
      routeLabel: "Sign in",
      status: "Unavailable",
      title: "Account sign-in is not available yet",
      body:
        "Account sign-in and online sync are not available yet, so this page does not collect credentials. The assessment, results, and history in this browser still work normally.",
      guestNote:
        "You can still take the assessment, view results, and open history stored in this browser without signing in.",
      advancedTitle: "Guest data recovery",
      advancedBody:
        "If you previously saved a reconnect bundle, open the advanced tool below to download, copy, or restore guest data in this browser.",
    },
    register: {
      pageTitle: "Registration unavailable | MBTI Z",
      metaDescription:
        "MBTI Z registration is unavailable, but the guest assessment and local result history are ready now.",
      routeLabel: "Registration",
      status: "Unavailable",
      title: "New account registration is not open yet",
      body:
        "Online accounts cannot be created yet, so this page does not show a registration form that cannot finish. You can start using MBTI Z as a guest now.",
      guestNote:
        "Start using MBTI Z as a guest now. Results and recent history stay in this browser.",
      advancedTitle: "Keep the guest path for later reconnect",
      advancedBody:
        "A reconnect bundle backs up guest data; it does not register an account. Open the tool only when you need to save or restore local data.",
    },
    recovery: {
      pageTitle: "Account recovery unavailable | MBTI Z",
      metaDescription:
        "MBTI Z password recovery is unavailable, and this route does not send reset email.",
      routeLabel: "Account recovery",
      status: "Unavailable",
      title: "Password recovery is not available yet",
      body:
        "Password recovery and reset email are not available yet. This page will not collect personal details until the account system is ready and security-verified.",
      guestNote:
        "To take the assessment or revisit results in this browser, use the guest path without recovering an account.",
      advancedTitle: "Recover guest data, not an account",
      advancedBody:
        "This tool restores results and sessions from a reconnect bundle in the browser. It does not change a password or recover an online account.",
    },
  },
};

export function AccountHold({
  mode,
  locale: initialLocale,
}: {
  mode: AccountHoldMode;
  locale?: MbtiZLocale;
}) {
  const localeContext = useMbtiZLocale();
  const locale = initialLocale ?? localeContext.locale;
  const sharedCopy = mbtiZHoldCopy[locale];
  const copy = routeHoldCopy[locale][mode];
  const reducedMotion = useMbtiZReducedMotion();
  const [reconnectBundle, setReconnectBundle] = useState<GuestCloudReconnectBundle | null>(null);
  const headlineClass = locale === "th" ? "font-thai-editorial" : "font-luxury";

  function hydrateReconnectBundle() {
    setReconnectBundle(assessmentRuntime.exportReconnectBundle());
  }

  useEffect(() => {
    hydrateReconnectBundle();
  }, []);

  return (
    <>
      <Head>
        <title>{copy.pageTitle}</title>
        <meta name="description" content={copy.metaDescription} />
      </Head>

      <AmbientStage variant="hold">
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-8">
          <motion.section
            initial={{
              opacity: 0,
              y: resolveMotionDistance(reducedMotion, 20),
              scale: resolveMotionScale(reducedMotion, 0.995),
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: resolveMotionDuration(reducedMotion, 0.45),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-4 sm:mt-8"
          >
            <div className="flex items-center gap-3 text-[#ffd99a]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#f5c76d]/20 bg-[#f5c76d]/10">
                <LockKeyhole aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-[#ffe3a1]">{copy.routeLabel}</p>
                <p className="mt-1 text-sm text-white/58">{copy.status}</p>
              </div>
            </div>

            <h1
              className={`mt-5 max-w-3xl text-[2rem] leading-tight text-white sm:mt-7 sm:text-5xl sm:leading-[1.08] ${headlineClass}`}
            >
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-white/72 sm:text-base sm:leading-8">
              {copy.body}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/quiz"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f5c76d,#ba7eff)] px-5 py-3 text-center text-sm font-semibold text-[#050814] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c76d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080d] sm:w-auto"
              >
                {sharedCopy.primary}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-5 py-3 text-center text-sm font-medium text-white/80 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7cc8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080d] sm:w-auto"
              >
                <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                {sharedCopy.dashboard}
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58">
              {copy.guestNote}
            </p>

            <section aria-labelledby="available-now-title" className="mt-8 border-t border-white/10 pt-6 sm:mt-10 sm:pt-8">
              <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#9edcff]">
                    {sharedCopy.statusChip}
                  </p>
                  <h2 id="available-now-title" className="mt-2 text-lg font-semibold text-white">
                    {sharedCopy.guestPathTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/58">
                    {sharedCopy.guestPathBody}
                  </p>
                </div>
                <ul className="grid gap-3" aria-label={sharedCopy.worksTitle}>
                  {sharedCopy.worksNow.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/68">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#7cc8ff]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section
              aria-labelledby="reconnect-title"
              className="account-reconnect mt-8 border-t border-white/10 pt-6 sm:mt-10 sm:pt-8"
            >
              <h2 id="reconnect-title" className="text-lg font-semibold text-white">
                {copy.advancedTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/58">
                {copy.advancedBody}
              </p>
              <div className="mt-4 [&_details:not([open])>div]:!hidden">
                <ReconnectBundleActions
                  bundle={reconnectBundle}
                  compact
                  locale={locale}
                  onImported={hydrateReconnectBundle}
                />
              </div>
              <div className="account-reconnect-runtime mt-3 border-l-2 border-[#7cc8ff]/35 pl-4">
                <p className="text-xs font-semibold uppercase text-[#9edcff]">
                  {sharedCopy.runtimeTitle}
                </p>
                <p className="mt-1.5 text-sm leading-7 text-white/58">
                  {sharedCopy.runtimeBody}
                </p>
              </div>
              <style jsx>{`
                .account-reconnect-runtime {
                  display: none;
                }

                .account-reconnect:has(:global(details[open])) .account-reconnect-runtime {
                  display: block;
                }
              `}</style>
            </section>
          </motion.section>
        </main>
      </AmbientStage>
    </>
  );
}
