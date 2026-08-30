"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ratioClasses = {
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/10]",
  square: "aspect-square",
} as const;

export function AnimalPortrait({
  imagePath,
  alt,
  accentFrom,
  accentTo,
  label,
  title,
  subtitle,
  ratio = "portrait",
  priority = false,
  className,
  titleClassName,
  fallbackLabel = "Animal image unavailable",
  focalPosition = "50% 50%",
}: {
  imagePath: string;
  alt: string;
  accentFrom: string;
  accentTo: string;
  label?: string;
  title?: string;
  subtitle?: string;
  ratio?: keyof typeof ratioClasses;
  priority?: boolean;
  className?: string;
  titleClassName?: string;
  fallbackLabel?: string;
  focalPosition?: string;
}) {
  const [loadedPath, setLoadedPath] = useState<string | null>(null);
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const loaded = loadedPath === imagePath;
  const failed = failedPath === imagePath;

  useEffect(() => {
    setLoadedPath(null);
    setFailedPath(null);
  }, [imagePath]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#060a13]",
        ratioClasses[ratio],
        className
      )}
    >
      {!failed ? (
        <Image
          alt={alt}
          className={cn("object-cover opacity-82 transition-opacity duration-300", loaded ? "opacity-82" : "opacity-0")}
          fill
          onError={() => setFailedPath(imagePath)}
          onLoad={() => setLoadedPath(imagePath)}
          priority={priority}
          sizes={ratio === "wide" ? "(min-width: 1280px) 32vw, 100vw" : "(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 100vw"}
          src={imagePath}
          style={{ objectPosition: focalPosition }}
        />
      ) : (
        <div
          aria-label={fallbackLabel}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#080d18] px-6 text-center text-white/58"
          data-ui-asset-fallback="animal"
          role="img"
        >
          <ImageOff aria-hidden="true" className="h-9 w-9 text-white/42" />
          <span className="text-sm leading-6">{fallbackLabel}</span>
        </div>
      )}

      {!loaded && !failed ? (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-white/[0.05]" />
      ) : null}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${accentFrom}22 0%, rgba(5,9,18,0.14) 35%, rgba(5,9,18,0.88) 88%, ${accentTo}1f 100%)`,
        }}
      />

      {(label || title || subtitle) ? (
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,24,0.2),rgba(8,12,24,0.84))] p-4 backdrop-blur-[2px]">
            {label ? (
              <p className="font-code text-[10px] uppercase tracking-[0.22em] text-white/54">
                {label}
              </p>
            ) : null}
            {title ? (
              <p className={cn("mt-2 text-2xl leading-tight text-white", titleClassName)}>
                {title}
              </p>
            ) : null}
            {subtitle ? (
              <p className="mt-2 text-sm leading-6 text-white/66">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
