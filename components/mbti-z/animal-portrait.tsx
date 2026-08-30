import Image from "next/image";

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
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#060a13]",
        ratioClasses[ratio],
        className
      )}
    >
      <Image
        alt={alt}
        className="object-cover opacity-82"
        fill
        priority={priority}
        sizes={ratio === "wide" ? "(min-width: 1280px) 32vw, 100vw" : "(min-width: 1280px) 24vw, (min-width: 768px) 40vw, 100vw"}
        src={imagePath}
        unoptimized
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${accentFrom}22 0%, rgba(5,9,18,0.14) 35%, rgba(5,9,18,0.88) 100%)`,
        }}
      />
      <div
        className="absolute inset-x-[8%] top-[8%] h-[44%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accentTo}3d 0%, transparent 74%)`,
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
