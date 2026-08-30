"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { MbtiZLocale } from "@/lib/mbti-z-copy";

const STORAGE_KEY = "mbti-z-locale";

type LocaleContextValue = {
  hydrated: boolean;
  locale: MbtiZLocale;
  setLocale: (locale: MbtiZLocale) => void;
};

const MbtiZLocaleContext = createContext<LocaleContextValue | null>(null);

function normalizeLocale(value?: string | null): MbtiZLocale {
  return value === "en" ? "en" : "th";
}

export function MbtiZLocaleProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocaleState] = useState<MbtiZLocale>("th");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedLocale = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    setLocaleState(storedLocale);
    setHydrated(true);
  }, []);

  const setLocale = useCallback((nextLocale: MbtiZLocale) => {
    setLocaleState(nextLocale);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      locale,
      setLocale,
    }),
    [hydrated, locale, setLocale]
  );

  return <MbtiZLocaleContext.Provider value={value}>{children}</MbtiZLocaleContext.Provider>;
}

export function useMbtiZLocale() {
  const context = useContext(MbtiZLocaleContext);

  if (!context) {
    throw new Error("useMbtiZLocale must be used inside MbtiZLocaleProvider");
  }

  return context;
}
