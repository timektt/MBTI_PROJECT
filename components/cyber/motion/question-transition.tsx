"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import {
  mbtiZEase,
  resolveMotionDistance,
  resolveMotionDuration,
} from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { cn } from "@/lib/utils";

export type QuestionDirection = "forward" | "backward";

export function QuestionTransition({
  children,
  className,
  direction = "forward",
  stepKey,
}: {
  children: ReactNode;
  className?: string;
  direction?: QuestionDirection;
  stepKey: string;
}) {
  const reducedMotion = useMbtiZReducedMotion();
  const travel = resolveMotionDistance(reducedMotion, direction === "forward" ? 24 : -24);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={stepKey}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        className={cn(className)}
        exit={{
          opacity: 0,
          x: -travel * 0.6,
          y: reducedMotion ? 0 : -10,
          scale: reducedMotion ? 1 : 0.992,
        }}
        initial={{
          opacity: 0,
          x: travel,
          y: reducedMotion ? 0 : 18,
          scale: reducedMotion ? 1 : 0.988,
        }}
        transition={{
          duration: resolveMotionDuration(reducedMotion, 0.42),
          ease: mbtiZEase,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
