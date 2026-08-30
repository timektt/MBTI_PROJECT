"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type ChapterTrackItem = {
  body: string;
  label: string;
  meta?: string;
  title: string;
};

type ChapterTrackProps = {
  activeIndex?: number;
  className?: string;
  items: readonly ChapterTrackItem[];
  orientation?: "horizontal" | "vertical";
  tone?: "gold" | "violet";
};

export function ChapterTrack({
  activeIndex = 0,
  className,
  items,
  orientation = "vertical",
  tone = "violet",
}: ChapterTrackProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal
          ? "grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          : "space-y-3",
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const isCompleted = index < activeIndex;
        const accent =
          tone === "gold"
            ? "from-[#f5c76d]/20 via-[#f5c76d]/10 to-[#ba7eff]/12"
            : "from-[#ba7eff]/18 via-[#7cc8ff]/10 to-white/[0.02]";
        const markerClass = isActive
          ? tone === "gold"
            ? "border-[#f5c76d]/36 bg-[#f5c76d]/14 text-[#ffe4aa]"
            : "border-[#ba7eff]/32 bg-[#ba7eff]/14 text-[#ecd8ff]"
          : isCompleted
            ? "border-white/14 bg-white/[0.08] text-white/82"
            : "border-white/10 bg-white/[0.03] text-white/42";

        return (
          <article
            key={`${item.label}-${item.title}`}
            className={cn(
              "relative overflow-hidden rounded-[1.5rem] border p-5 backdrop-blur-xl transition",
              isActive
                ? `border-white/16 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_64px_rgba(3,6,18,0.34)]`
                : isCompleted
                  ? "border-white/12 bg-white/[0.045]"
                  : "border-white/8 bg-white/[0.025]"
            )}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent",
                isActive && "opacity-100",
                !isActive && "opacity-50"
              )}
            />
            {isActive && (
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", accent)} />
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold uppercase tracking-[0.18em]",
                    markerClass
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, "0")}
                </div>
                <div className="text-right">
                  <p className="font-code text-[10px] uppercase tracking-[0.24em] text-white/40">
                    {item.label}
                  </p>
                  {item.meta ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/48">
                      {item.meta}
                    </p>
                  ) : null}
                </div>
              </div>

              <h3 className="mt-5 font-editorial text-2xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/64">{item.body}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
