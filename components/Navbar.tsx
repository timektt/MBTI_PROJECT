"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { LogIn, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useMbtiZLocale } from "@/components/cyber/mbti-z-locale-provider";
import { mbtiZNavCopy } from "@/lib/mbti-z-copy";
import { cn } from "@/lib/utils";

const navigationFocusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal-accent-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--signal-canvas)]";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale } = useMbtiZLocale();
  const copy = mbtiZNavCopy[locale];

  const primaryNavItems = [
    { href: "/", label: copy.home },
    { href: "/quiz", label: copy.quiz },
    { href: "/types", label: copy.types },
  ];

  function isActive(href: string) {
    return href === "/" ? router.pathname === href : router.pathname.startsWith(href);
  }

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);

    router.events.on("routeChangeStart", closeMenu);

    return () => {
      router.events.off("routeChangeStart", closeMenu);
    };
  }, [router.events]);

  useEffect(() => {
    if (!menuOpen) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableItems = () =>
      Array.from(
        menuPanelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      ).filter((element) => element.getClientRects().length > 0);

    requestAnimationFrame(() => focusableItems()[0]?.focus());

    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const items = focusableItems();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (event.key !== "Escape") return;

      event.preventDefault();
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    const closeMenuOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeMenuOnEscape);
    document.addEventListener("pointerdown", closeMenuOutside);

    return () => {
      document.removeEventListener("keydown", closeMenuOnEscape);
      document.removeEventListener("pointerdown", closeMenuOutside);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="relative sticky top-0 z-50 border-b border-white/10 bg-[#0b0c0f]/94 backdrop-blur-xl"
    >
      <div className="signal-container flex min-h-[60px] items-center justify-between gap-2 sm:gap-5 lg:min-h-[72px]">
        <Link
          href="/"
          className={cn("flex min-h-[44px] min-w-0 items-center gap-2 sm:gap-3", navigationFocusClasses)}
          aria-label="MBTI Z"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e7b55b]/40 font-luxury text-sm font-semibold text-[#f6d59b]">
            Z
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-luxury text-lg font-semibold text-[#f5f3ed]">MBTI Z</span>
            <span className="hidden truncate text-[11px] text-[#777b85] sm:block">{copy.brandTag}</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={copy.primaryNavigationLabel}
        >
          {primaryNavItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-md px-3.5 text-sm text-[#b9bbc3] transition-colors hover:bg-white/[0.06] hover:text-[#f5f3ed] motion-reduce:transition-none",
                  navigationFocusClasses,
                  active && "bg-white/[0.07] text-[#f5f3ed]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            aria-label={copy.login}
            title={copy.login}
            aria-current={isActive("/login") ? "page" : undefined}
            className={cn(
              "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md border border-[#e7b55b]/35 px-3 text-sm font-medium text-[#f6d59b] transition-colors hover:border-[#f6d59b]/65 hover:bg-[#e7b55b]/10 motion-reduce:transition-none sm:px-4",
              navigationFocusClasses,
              isActive("/login") && "border-[#f6d59b]/70 bg-[#e7b55b]/12 text-[#fff1cf]"
            )}
          >
            <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="max-[359px]:sr-only">{copy.login}</span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "grid h-[44px] w-[44px] shrink-0 place-items-center rounded-md bg-white/[0.06] text-[#f5f3ed] transition-colors hover:bg-white/[0.1] motion-reduce:transition-none",
              navigationFocusClasses
            )}
            aria-label={menuOpen ? copy.closeMenuLabel : copy.menuLabel}
            aria-controls="site-navigation-menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          ref={menuPanelRef}
          id="site-navigation-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-60px)] overflow-y-auto overscroll-contain border-y border-white/10 bg-[#0b0c0f] shadow-[0_22px_48px_rgba(0,0,0,0.42)]"
        >
          <div className="signal-container flex justify-end py-4">
            <div className="w-full lg:max-w-sm">
              <nav
                className="grid gap-1 lg:hidden"
                aria-label={copy.primaryNavigationLabel}
              >
                {primaryNavItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[44px] items-center rounded-md px-3 text-sm text-[#b9bbc3]",
                        navigationFocusClasses,
                        active && "bg-white/[0.07] text-[#f5f3ed]"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <nav
                className="mt-2 border-t border-white/10 pt-2 lg:mt-0 lg:border-t-0 lg:pt-0"
                aria-label={copy.secondaryNavigationLabel}
              >
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive("/dashboard") ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center justify-between rounded-md px-3 text-sm text-[#f5f3ed] transition-colors hover:bg-white/[0.06] motion-reduce:transition-none",
                    navigationFocusClasses,
                    isActive("/dashboard") && "bg-white/[0.07]"
                  )}
                >
                  <span>{copy.myResults}</span>
                  <span className="text-xs text-[#777b85]">/dashboard</span>
                </Link>
              </nav>

              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 pt-3">
                <div className="min-w-0">
                  <p className="text-sm text-[#b9bbc3]">{copy.guestMode}</p>
                  <p className="mt-1 text-xs leading-5 text-[#777b85]">{copy.runtimeHint}</p>
                </div>
                <div
                  className="flex rounded-md border border-white/10 p-1"
                  role="group"
                  aria-label={copy.languageLabel}
                >
                  {(["th", "en"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setLocale(option)}
                      className={cn(
                        "min-h-[44px] min-w-[44px] rounded-md text-xs uppercase text-[#777b85] transition-colors hover:text-[#f5f3ed] motion-reduce:transition-none",
                        navigationFocusClasses,
                        locale === option && "bg-white/[0.08] text-[#f5f3ed]"
                      )}
                      aria-pressed={locale === option}
                      lang={option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
