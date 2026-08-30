"use client";

import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";

type Locale = "th" | "en";

export function LocaleToggle({
  locale,
  onChange,
  className,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-xs text-white/72 shadow-[0_20px_60px_rgba(4,8,20,0.35)] backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-[#f7d27c]">
        <Languages className="h-4 w-4" />
      </div>
      <button
        type="button"
        onClick={() => onChange("th")}
        className={cn(
          "h-11 rounded-full px-4 py-2 font-medium tracking-[0.18em] transition",
          locale === "th"
            ? "bg-[linear-gradient(135deg,rgba(245,199,108,0.95),rgba(186,126,255,0.92))] text-[#050814] shadow-[0_0_30px_rgba(186,126,255,0.35)]"
            : "text-white/68 hover:bg-white/6 hover:text-white"
        )}
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={cn(
          "h-11 rounded-full px-4 py-2 font-medium tracking-[0.18em] transition",
          locale === "en"
            ? "bg-[linear-gradient(135deg,rgba(245,199,108,0.95),rgba(186,126,255,0.92))] text-[#050814] shadow-[0_0_30px_rgba(186,126,255,0.35)]"
            : "text-white/68 hover:bg-white/6 hover:text-white"
        )}
      >
        EN
      </button>
    </div>
  );
}
