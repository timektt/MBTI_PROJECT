import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AmbientVariant = "landing" | "quiz" | "result" | "dashboard" | "hold";

const ambientVariants: Record<
  AmbientVariant,
  {
    dotClass: string;
    gridClass: string;
    shellClass: string;
    starfieldClass: string;
  }
> = {
  landing: {
    shellClass: "cyber-shell-landing",
    gridClass: "opacity-60",
    starfieldClass: "opacity-100",
    dotClass: "opacity-[0.08]",
  },
  quiz: {
    shellClass: "cyber-shell-quiz",
    gridClass: "opacity-50",
    starfieldClass: "opacity-80",
    dotClass: "opacity-[0.05]",
  },
  result: {
    shellClass: "cyber-shell-result",
    gridClass: "opacity-56",
    starfieldClass: "opacity-95",
    dotClass: "opacity-[0.06]",
  },
  dashboard: {
    shellClass: "cyber-shell-dashboard",
    gridClass: "opacity-48",
    starfieldClass: "opacity-72",
    dotClass: "opacity-[0.04]",
  },
  hold: {
    shellClass: "cyber-shell-hold",
    gridClass: "opacity-42",
    starfieldClass: "opacity-65",
    dotClass: "opacity-[0.03]",
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
      <div className="relative z-10">{children}</div>
    </div>
  );
}
