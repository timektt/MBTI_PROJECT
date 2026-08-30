import type { CSSProperties } from "react";
import Image from "next/image";

import type { GuestResult } from "@/lib/assessment-runtime";
import { mbtiZResultShareCopy } from "@/lib/mbti-z-copy";
import { cn } from "@/lib/utils";

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1350;

export function ResultShareCard({
  result,
  locale = "th",
  className,
  exportMode = false,
  id,
}: {
  result: GuestResult;
  locale?: "th" | "en";
  className?: string;
  exportMode?: boolean;
  id?: string;
}) {
  const copy = mbtiZResultShareCopy[locale];
  const createdAt = new Date(result.createdAt).toLocaleDateString(
    locale === "th" ? "th-TH" : "en-US"
  );

  if (!exportMode) {
    return (
      <div
        id={id}
        className={cn(
          "relative overflow-hidden rounded-[1.8rem] border border-white/10 p-4 text-white shadow-[0_30px_90px_rgba(2,5,16,0.44)] sm:p-5",
          className
        )}
        style={{
          background: `linear-gradient(160deg, ${result.house.accentFrom}, #05070f 42%, ${result.house.accentTo})`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_34%)]" />
        <div className="absolute inset-[5%] rounded-[inherit] border border-white/10 bg-[linear-gradient(180deg,rgba(6,10,21,0.72),rgba(8,12,24,0.9))]" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-code text-[10px] uppercase tracking-[0.28em] text-white/60">
                {copy.brand}
              </p>
              <p className="mt-2 text-5xl leading-none text-white/94 sm:text-6xl">
                {result.mbtiType}
              </p>
              <p className="mt-2 text-base leading-6 text-[#f5c76d] sm:text-lg">
                {result.archetypeName}
              </p>
            </div>
            <div className="shrink-0 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 font-code text-[9px] uppercase tracking-[0.2em] text-white/56 sm:px-4 sm:py-2 sm:text-[10px]">
              {copy.result}
            </div>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-3.5 sm:p-4">
            <div className="flex flex-wrap gap-2">
              <Chip label={`${copy.house} · ${result.house.title}`} />
              <Chip label={`${copy.animal} · ${result.animal.name}`} />
            </div>
            <p className="mt-3 text-sm leading-6 text-white/72 line-clamp-2">
              {result.tagline}
            </p>
          </div>

          <div className="relative mt-4 aspect-[16/11] overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#060a13]">
            <Image
              alt={`${result.mbtiType} ${result.animal.name}`}
              className="object-cover opacity-90"
              fill
              priority
              sizes="(min-width: 1024px) 22rem, 100vw"
              src={result.animal.imagePath}
              unoptimized
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${result.house.accentFrom}14 0%, rgba(5,7,15,0.12) 36%, rgba(5,7,15,0.9) 100%)`,
              }}
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.15rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,24,0.36),rgba(8,12,24,0.88))] p-3 backdrop-blur-[2px]">
              <p className="font-code text-[10px] uppercase tracking-[0.2em] text-white/44">
                {copy.animal}
              </p>
              <p className="mt-1.5 text-xl leading-tight text-white sm:text-2xl">
                {result.animal.name}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-3.5">
              <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/44">
                {copy.movieProfile}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-2">
                {result.movieProfile.title}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-3.5">
              <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/44">
                {copy.dimensions}
              </p>
              <p className="mt-2 font-code text-[10px] uppercase tracking-[0.2em] text-[#ffe4aa]">
                {createdAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const frameStyle = exportMode
    ? ({
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
      } satisfies CSSProperties)
    : undefined;

  const cardClass = exportMode
    ? "h-[1350px] w-[1080px] rounded-[52px] p-12"
    : "aspect-[4/5] w-full max-w-[420px] rounded-[2rem] p-6";

  return (
    <div
      id={id}
      className={cn(
        "relative overflow-hidden border border-white/10 text-white shadow-[0_40px_140px_rgba(2,5,16,0.58)]",
        cardClass,
        className
      )}
      style={{
        ...frameStyle,
        background: `linear-gradient(160deg, ${result.house.accentFrom}, #05070f 38%, ${result.house.accentTo})`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_30%)]" />
      <div className="absolute inset-[6%] rounded-[inherit] border border-white/10 bg-[linear-gradient(180deg,rgba(6,10,21,0.78),rgba(8,12,24,0.92))]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-code text-[11px] uppercase tracking-[0.32em] text-white/64">
              {copy.brand}
            </p>
            <p className={cn("mt-3 text-white/92", exportMode ? "text-[138px] leading-none" : "text-6xl leading-none")}>
              {result.mbtiType}
            </p>
            <p className={cn("mt-3 text-[#f5c76d]", exportMode ? "text-[34px]" : "text-lg")}>
              {result.archetypeName}
            </p>
          </div>
          <div className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 font-code text-[11px] uppercase tracking-[0.24em] text-white/56">
            {copy.result}
          </div>
        </div>

        <div className={cn("mt-6 grid gap-4", exportMode ? "grid-cols-[1.02fr_0.98fr]" : "grid-cols-1")}>
          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap gap-2">
              <Chip label={`${copy.house} · ${result.house.title}`} />
              <Chip label={`${copy.animal} · ${result.animal.name}`} />
            </div>
            <p className={cn("mt-5 text-white/74", exportMode ? "text-[18px] leading-8" : "text-sm leading-7")}>
              {result.tagline}
            </p>
          </div>

          <div
            className={cn(
              "relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#060a13]",
              exportMode ? "min-h-[396px]" : "min-h-[280px]"
            )}
          >
            <Image
              alt={`${result.mbtiType} ${result.animal.name}`}
              className="object-cover opacity-92"
              fill
              priority
              sizes={exportMode ? "420px" : "(min-width: 1024px) 22rem, 100vw"}
              src={result.animal.imagePath}
              unoptimized
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${result.house.accentFrom}18 0%, rgba(5,7,15,0.16) 38%, rgba(5,7,15,0.94) 100%)`,
              }}
            />
            <div
              className="absolute inset-x-[10%] top-[7%] h-[38%] rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${result.house.accentTo}44 0%, transparent 72%)`,
              }}
            />
            <div className="absolute inset-x-5 bottom-5">
              <div className="rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,24,0.28),rgba(8,12,24,0.88))] p-4 backdrop-blur-[2px]">
                <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/44">
                  {copy.animal}
                </p>
                <p className={cn("mt-4 text-white", exportMode ? "text-[44px] leading-[1.04]" : "text-3xl leading-tight")}>
                  {result.animal.name}
                </p>
                <p className={cn("mt-4 text-white/60", exportMode ? "text-[17px] leading-7" : "text-sm leading-7")}>
                  {result.house.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip label={result.movieProfile.title} subdued />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("mt-6 grid gap-4", exportMode ? "grid-cols-[0.98fr_1.02fr]" : "grid-cols-1")}>
          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/44">
              {copy.movieProfile}
            </p>
            <p className={cn("mt-4 text-white", exportMode ? "text-[28px]" : "text-xl")}>
              {result.movieProfile.title}
            </p>
            <p className={cn("mt-4 text-white/68", exportMode ? "text-[18px] leading-8" : "text-sm leading-7")}>
              {result.movieProfile.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {result.movieProfile.tags.slice(0, 3).map((tag) => (
                <Chip key={tag} label={tag} subdued />
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/44">
              {copy.summary}
            </p>
            <p className={cn("mt-4 text-white/82", exportMode ? "text-[18px] leading-8" : "text-sm leading-7")}>
              {result.summaryBody}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-code text-[11px] uppercase tracking-[0.24em] text-white/44">
              {copy.dimensions}
            </p>
            <p className="font-code text-[11px] uppercase tracking-[0.24em] text-[#ffe4aa]">
              {createdAt}
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {result.dimensions.map((dimension) => {
              const total = Math.max(dimension.leftScore + dimension.rightScore, 1);
              const leftPercent = Math.round((dimension.leftScore / total) * 100);
              const rightPercent = 100 - leftPercent;

              return (
                <div
                  key={dimension.pair}
                  className="rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-code text-[11px] uppercase tracking-[0.22em] text-white/48">
                      {dimension.pair}
                    </p>
                    <span className="font-code text-[10px] uppercase tracking-[0.22em] text-white/58">
                      {dimension.winner}
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div className="flex h-full">
                      <div
                        className="h-full bg-[linear-gradient(90deg,#7cc8ff,#ba7eff)]"
                        style={{ width: `${leftPercent}%` }}
                      />
                      <div
                        className="h-full bg-[linear-gradient(90deg,#f5c76d,#ff9b8f)]"
                        style={{ width: `${rightPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[13px] text-white/64">
                    <span>
                      {dimension.left} {dimension.leftScore}
                    </span>
                    <span>
                      {dimension.right} {dimension.rightScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({
  label,
  subdued = false,
}: {
  label: string;
  subdued?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 font-code text-[10px] uppercase tracking-[0.18em]",
        subdued
          ? "border-white/10 bg-white/[0.04] text-white/60"
          : "border-white/12 bg-white/[0.08] text-white/74"
      )}
    >
      {label}
    </span>
  );
}

export const resultShareCardSize = {
  width: EXPORT_WIDTH,
  height: EXPORT_HEIGHT,
} as const;
