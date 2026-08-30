"use client";

import type { ReactNode } from "react";

import { AmbientOrb } from "@/components/cyber/motion";
import { cn } from "@/lib/utils";

type AmbientVariant = "landing" | "quiz" | "result" | "dashboard" | "hold";

const ambientVariants: Record<
  AmbientVariant,
  {
    dotClass: string;
    gridClass: string;
    shellClass: string;
    starfieldClass: string;
    orbs: Array<{
      className: string;
      drift: { x: number[]; y: number[]; scale: number[] };
      duration?: number;
      size: "sm" | "md" | "lg" | "xl";
      tone: "violet" | "gold" | "blue" | "cyan";
    }>;
  }
> = {
  landing: {
    shellClass: "cyber-shell-landing",
    gridClass: "opacity-60",
    starfieldClass: "opacity-100",
    dotClass: "opacity-[0.08]",
    orbs: [
      {
        tone: "violet",
        size: "xl",
        className: "-left-32 top-12",
        duration: 22,
        drift: { x: [0, 30, -12, 0], y: [0, 22, -18, 0], scale: [1, 1.08, 0.96, 1] },
      },
      {
        tone: "gold",
        size: "xl",
        className: "right-[-6rem] top-[-2rem]",
        duration: 25,
        drift: { x: [0, -28, 10, 0], y: [0, 26, -14, 0], scale: [1, 0.94, 1.04, 1] },
      },
      {
        tone: "blue",
        size: "xl",
        className: "bottom-[-12rem] left-[30%]",
        duration: 30,
        drift: { x: [0, 20, -26, 0], y: [0, -14, 18, 0], scale: [1, 1.05, 0.94, 1] },
      },
    ],
  },
  quiz: {
    shellClass: "cyber-shell-quiz",
    gridClass: "opacity-50",
    starfieldClass: "opacity-80",
    dotClass: "opacity-[0.05]",
    orbs: [
      {
        tone: "cyan",
        size: "lg",
        className: "-left-24 top-24",
        duration: 19,
        drift: { x: [0, 16, -8, 0], y: [0, 10, -8, 0], scale: [1, 1.03, 0.97, 1] },
      },
      {
        tone: "violet",
        size: "lg",
        className: "right-[-4rem] top-[14%]",
        duration: 21,
        drift: { x: [0, -20, 8, 0], y: [0, 18, -10, 0], scale: [1, 0.96, 1.03, 1] },
      },
      {
        tone: "gold",
        size: "md",
        className: "bottom-[-7rem] right-[16%]",
        duration: 24,
        drift: { x: [0, -12, 6, 0], y: [0, -8, 12, 0], scale: [1, 1.04, 0.98, 1] },
      },
    ],
  },
  result: {
    shellClass: "cyber-shell-result",
    gridClass: "opacity-56",
    starfieldClass: "opacity-95",
    dotClass: "opacity-[0.06]",
    orbs: [
      {
        tone: "gold",
        size: "xl",
        className: "-left-28 top-10",
        duration: 24,
        drift: { x: [0, 18, -10, 0], y: [0, 14, -12, 0], scale: [1, 1.04, 0.98, 1] },
      },
      {
        tone: "violet",
        size: "lg",
        className: "right-[-5rem] top-[10%]",
        duration: 21,
        drift: { x: [0, -18, 12, 0], y: [0, 16, -8, 0], scale: [1, 0.95, 1.05, 1] },
      },
      {
        tone: "blue",
        size: "xl",
        className: "bottom-[-10rem] left-[42%]",
        duration: 28,
        drift: { x: [0, 24, -18, 0], y: [0, -10, 16, 0], scale: [1, 1.06, 0.95, 1] },
      },
    ],
  },
  dashboard: {
    shellClass: "cyber-shell-dashboard",
    gridClass: "opacity-48",
    starfieldClass: "opacity-72",
    dotClass: "opacity-[0.04]",
    orbs: [
      {
        tone: "blue",
        size: "lg",
        className: "-left-20 top-16",
        duration: 18,
        drift: { x: [0, 14, -8, 0], y: [0, 10, -6, 0], scale: [1, 1.02, 0.98, 1] },
      },
      {
        tone: "violet",
        size: "md",
        className: "right-[10%] top-[-2rem]",
        duration: 22,
        drift: { x: [0, -12, 10, 0], y: [0, 14, -8, 0], scale: [1, 0.97, 1.03, 1] },
      },
      {
        tone: "gold",
        size: "md",
        className: "bottom-[-6rem] left-[58%]",
        duration: 26,
        drift: { x: [0, 10, -6, 0], y: [0, -6, 10, 0], scale: [1, 1.02, 0.99, 1] },
      },
    ],
  },
  hold: {
    shellClass: "cyber-shell-hold",
    gridClass: "opacity-42",
    starfieldClass: "opacity-65",
    dotClass: "opacity-[0.03]",
    orbs: [
      {
        tone: "violet",
        size: "lg",
        className: "-left-24 top-10",
        duration: 21,
        drift: { x: [0, 16, -8, 0], y: [0, 12, -10, 0], scale: [1, 1.03, 0.98, 1] },
      },
      {
        tone: "gold",
        size: "md",
        className: "right-[-3rem] top-8",
        duration: 24,
        drift: { x: [0, -12, 8, 0], y: [0, 10, -8, 0], scale: [1, 0.97, 1.02, 1] },
      },
    ],
  },
};

export function AmbientStage({
  children,
  className,
  variant = "landing",
}: {
  children: ReactNode;
  className?: string;
  variant?: AmbientVariant;
}) {
  const scene = ambientVariants[variant];

  return (
    <div className={cn("cyber-shell relative overflow-hidden", scene.shellClass, className)}>
      <div className="cyber-vignette pointer-events-none absolute inset-0" />
      <div className="cyber-noise pointer-events-none absolute inset-0 opacity-30" />
      <div
        className={cn(
          "cyber-starfield pointer-events-none absolute inset-0",
          scene.starfieldClass
        )}
      />
      <div
        className={cn("cyber-grid pointer-events-none absolute inset-0", scene.gridClass)}
      />
      <div className={cn("cyber-dot pointer-events-none absolute inset-0", scene.dotClass)} />
      <div className="cyber-scanlines pointer-events-none absolute inset-0 opacity-18" />
      {scene.orbs.map((orb) => (
        <AmbientOrb
          key={`${variant}-${orb.tone}-${orb.className}`}
          className={orb.className}
          drift={orb.drift}
          duration={orb.duration}
          size={orb.size}
          tone={orb.tone}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
