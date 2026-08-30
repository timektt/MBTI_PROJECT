"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import {
  mbtiZEase,
  mbtiZDuration,
  resolveMotionDistance,
  resolveMotionDuration,
  resolveMotionScale,
} from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { cn } from "@/lib/utils";

type ResultRevealTone = "hero" | "panel" | "detail";

const toneMap: Record<ResultRevealTone, { distance: number; duration: number; scale: number }> =
  {
    hero: { distance: 36, duration: mbtiZDuration.hero, scale: 0.975 },
    panel: { distance: 24, duration: 0.6, scale: 0.986 },
    detail: { distance: 18, duration: mbtiZDuration.base, scale: 0.992 },
  };

type ResultRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  tone?: ResultRevealTone;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

export function ResultReveal({
  children,
  className,
  delay = 0,
  tone = "panel",
  ...props
}: ResultRevealProps) {
  const reducedMotion = useMbtiZReducedMotion();
  const settings = toneMap[tone];

  return (
    <motion.div
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay,
          duration: resolveMotionDuration(reducedMotion, settings.duration),
          ease: mbtiZEase,
        },
      }}
      className={cn(className)}
      initial={{
        opacity: 0,
        y: resolveMotionDistance(reducedMotion, settings.distance),
        scale: resolveMotionScale(reducedMotion, settings.scale),
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
