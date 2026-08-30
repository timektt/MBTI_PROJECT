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

type RevealMode = "mount" | "view";
type RevealVariant = "soft" | "strong" | "hero";

const variantMap: Record<
  RevealVariant,
  { distance: number; duration: number; scale: number }
> = {
  soft: { distance: 18, duration: mbtiZDuration.base, scale: 0.992 },
  strong: { distance: 28, duration: 0.6, scale: 0.985 },
  hero: { distance: 38, duration: mbtiZDuration.hero, scale: 0.978 },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  mode?: RevealMode;
  once?: boolean;
  amount?: number;
  variant?: RevealVariant;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

export function Reveal({
  amount = 0.24,
  children,
  className,
  delay = 0,
  mode = "view",
  once = true,
  variant = "strong",
  ...props
}: RevealProps) {
  const reducedMotion = useMbtiZReducedMotion();
  const settings = variantMap[variant];

  const initial = {
    opacity: 0,
    y: resolveMotionDistance(reducedMotion, settings.distance),
    scale: resolveMotionScale(reducedMotion, settings.scale),
  };

  const visible = {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay,
      duration: resolveMotionDuration(reducedMotion, settings.duration),
      ease: mbtiZEase,
    },
  };

  if (mode === "mount") {
    return (
      <motion.div
        animate={visible}
        className={cn(className)}
        initial={initial}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      viewport={{ once, amount }}
      whileInView={visible}
      {...props}
    >
      {children}
    </motion.div>
  );
}
