"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { mbtiZNavCopy } from "@/lib/mbti-z-copy";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale } = useMbtiZLocale();
  const copy = mbtiZNavCopy[locale];

  const navItems = [
    { href: "/", label: copy.home },
    { href: "/quiz", label: copy.quiz },
    { href: "/dashboard", label: copy.dashboard },
    { href: "/login", label: copy.account },
  ];

  return (
    <header className="relative z-50 px-3 py-3 sm:px-5 md:sticky md:top-0">
      <div className="mx-auto max-w-7xl rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,rgba(6,9,22,0.78),rgba(9,12,24,0.68))] px-4 py-3 shadow-[0_24px_80px_rgba(3,6,18,0.42)] backdrop-blur-2xl sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-[#f5c76d]/20 bg-[linear-gradient(135deg,rgba(245,199,109,0.25),rgba(182,121,255,0.32))] shadow-[0_0_36px_rgba(182,121,255,0.18)]">
              <Sparkles className="h-5 w-5 text-[#f9d88e]" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-luxury text-[1.05rem] tracking-[0.12em] text-white sm:text-[1.15rem]">
                MBTI Z
              </p>
              <p className="truncate font-code text-[10px] uppercase tracking-[0.3em] text-white/42">
                {copy.brandTag}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? router.pathname === item.href
                  : router.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full px-4 py-2 font-code text-[11px] uppercase tracking-[0.2em] text-white/64 transition",
                    active
                      ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
                      : "hover:bg-white/6 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="cyber-data-chip rounded-full px-4 py-2 font-code text-[10px] uppercase tracking-[0.28em] text-[#ffe8b2]">
              {copy.guestMode}
            </div>
            <Link
              href="/quiz"
              className="inline-flex h-11 items-center rounded-full bg-[linear-gradient(135deg,#f5c76d,#c285ff)] px-5 py-2.5 font-code text-[11px] font-semibold uppercase tracking-[0.16em] text-[#050814] transition hover:brightness-110"
            >
              {copy.startQuiz}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white md:hidden"
            aria-label={copy.menuLabel}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="mt-4 border-t border-white/8 pt-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 font-code text-[11px] uppercase tracking-[0.16em] text-white/68 transition",
                      active
                        ? "bg-white/10 text-white"
                        : "bg-white/[0.03] hover:bg-white/6 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 rounded-2xl border border-[#f5c76d]/12 bg-[#f5c76d]/8 p-4">
              <p className="font-code text-[11px] uppercase tracking-[0.28em] text-[#ffd88b]">
                {copy.guestMode}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/68">{copy.runtimeHint}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
