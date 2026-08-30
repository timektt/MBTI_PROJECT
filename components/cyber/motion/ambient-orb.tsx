"use client";

import { motion } from "framer-motion";

import { mbtiZEase } from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { cn } from "@/lib/utils";

type AmbientOrbTone = "violet" | "gold" | "blue" | "cyan";
type AmbientOrbSize = "sm" | "md" | "lg" | "xl";

const toneClass: Record<AmbientOrbTone, string> = {
  violet: "cyber-orb-violet",
  gold: "cyber-orb-gold",
  blue: "cyber-orb-blue",
  cyan: "cyber-orb-cyan",
};

const sizeClass: Record<AmbientOrbSize, string> = {
  sm: "cyber-orb-sm",
  md: "cyber-orb-md",
  lg: "cyber-orb-lg",
  xl: "cyber-orb-xl",
};

export function AmbientOrb({
  className,
  duration = 24,
  drift,
  size = "lg",
  tone,
}: {
  className?: string;
  duration?: number;
  drift: { x: number[]; y: number[]; scale: number[] };
  size?: AmbientOrbSize;
  tone: AmbientOrbTone;
}) {
  const reducedMotion = useMbtiZReducedMotion();

  return (
    <motion.div
      animate={
        reducedMotion
          ? undefined
          : {
              x: drift.x,
              y: drift.y,
              scale: drift.scale,
            }
      }
      className={cn("cyber-orb absolute", toneClass[tone], sizeClass[size], className)}
      transition={
        reducedMotion
          ? undefined
          : {
              duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: mbtiZEase,
            }
      }
    />
  );
}
