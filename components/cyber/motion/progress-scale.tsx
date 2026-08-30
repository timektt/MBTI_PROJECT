"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

import {
  mbtiZEase,
  resolveMotionDuration,
} from "@/components/cyber/motion/config";
import { useMbtiZReducedMotion } from "@/components/cyber/motion/reduced-motion-provider";
import { cn } from "@/lib/utils";

export function ProgressScale({
  className,
  style,
  value,
}: {
  className?: string;
  style?: CSSProperties;
  value: number;
}) {
  const reducedMotion = useMbtiZReducedMotion();
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <motion.div
      animate={{ scaleX: normalizedValue / 100 }}
      className={cn("h-full w-full origin-left", className)}
      initial={{ scaleX: 0 }}
      style={style}
      transition={{
        duration: resolveMotionDuration(reducedMotion, 0.35),
        ease: mbtiZEase,
      }}
    />
  );
}
