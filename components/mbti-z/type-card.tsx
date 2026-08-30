import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useState } from "react";

import { getMbtiZAnimalFocalPosition } from "@/lib/mbti-z-visuals";
import { cn } from "@/lib/utils";

function hasUsableImagePath(imagePath: string | null | undefined): imagePath is string {
  return (
    typeof imagePath === "string" &&
    /^\/(?!\/)[^\s?#]+(?:\?[^#\s]*)?$/.test(imagePath.trim())
  );
}

function TypeAnimalPortrait({
  code,
  animalName,
  imagePath,
  assetFallbackLabel,
  accentFrom,
  accentTo,
  priority,
}: {
  code: string;
  animalName: string;
  imagePath?: string | null;
  assetFallbackLabel: string;
  accentFrom: string;
  accentTo: string;
  priority: boolean;
}) {
  const normalizedImagePath = hasUsableImagePath(imagePath) ? imagePath.trim() : null;
  const [failedImagePath, setFailedImagePath] = useState<string | null>(null);
  const showImage = normalizedImagePath !== null && failedImagePath !== normalizedImagePath;

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-20 overflow-hidden rounded-[0.875rem] border border-white/10 bg-[#060a13] sm:w-[88px]",
        !showImage && "flex items-center justify-center"
      )}
      {...(!showImage
        ? {
            role: "img",
            "aria-label": `${code} ${animalName}. ${assetFallbackLabel}`,
          }
        : {})}
    >
      {showImage && normalizedImagePath ? (
        <Image
          alt={`${code} ${animalName}`}
          className="object-cover opacity-82 transition-transform duration-500 group-hover:scale-[1.045] group-focus-visible:scale-[1.045] motion-reduce:transition-none"
          fill
          onError={() => setFailedImagePath(normalizedImagePath)}
          priority={priority}
          sizes="(min-width: 1280px) 88px, 80px"
          src={normalizedImagePath}
          style={{ objectPosition: getMbtiZAnimalFocalPosition(code) }}
        />
      ) : (
        <div
          className="relative z-10 flex max-w-full flex-col items-center gap-1.5 px-1.5 text-center text-white/58"
          data-ui-asset-fallback="animal"
        >
          <ImageOff aria-hidden="true" className="h-5 w-5" />
          <span className="font-code text-[10px] uppercase leading-4 tracking-[0.08em]">
            {code}
          </span>
          <span className="line-clamp-2 text-[9px] leading-3">{assetFallbackLabel}</span>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${accentFrom}22 0%, rgba(5,9,18,0.14) 35%, rgba(5,9,18,0.88) 88%, ${accentTo}1f 100%)`,
        }}
      />
    </div>
  );
}

export function TypeCard({
  code,
  archetypeName,
  houseTitle,
  animalName,
  summary,
  accentFrom,
  accentTo,
  imagePath,
  priority = false,
  animalLabel,
  assetFallbackLabel,
  href,
  viewProfileLabel,
}: {
  code: string;
  archetypeName: string;
  houseTitle: string;
  animalName: string;
  summary: string;
  accentFrom: string;
  accentTo: string;
  imagePath?: string | null;
  priority?: boolean;
  animalLabel: string;
  assetFallbackLabel: string;
  href: string;
  viewProfileLabel: string;
}) {
  const headingId = `type-${code.toLowerCase()}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className="cyber-surface-card cyber-surface-interactive min-w-0 overflow-hidden p-0"
    >
      <Link
        href={href}
        className="group flex min-h-full min-w-0 flex-col rounded-[inherit] p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c76d]/55 focus-visible:ring-inset sm:p-3.5"
      >
        <div className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[88px_minmax(0,1fr)]">
          <TypeAnimalPortrait
            accentFrom={accentFrom}
            accentTo={accentTo}
            animalName={animalName}
            assetFallbackLabel={assetFallbackLabel}
            code={code}
            imagePath={imagePath}
            priority={priority}
          />

          <div className="min-w-0">
            <h3
              id={headingId}
              className="font-editorial text-[1.65rem] leading-none text-white sm:text-[1.8rem]"
            >
              {code}
            </h3>
            <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#f5c76d]">
              {archetypeName}
            </p>
            <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/46">
              {houseTitle} · {animalLabel} {animalName}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-white/66">
          {summary}
        </p>

        <span className="mt-auto flex min-h-[44px] items-center justify-between gap-3 border-t border-white/10 pt-3 font-code text-[10px] uppercase tracking-[0.12em] text-white/64 transition-colors group-hover:text-white group-focus-visible:text-white motion-reduce:transition-none">
          <span>{viewProfileLabel}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
      </Link>
    </article>
  );
}
