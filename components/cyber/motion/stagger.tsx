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

type StaggerMode = "mount" | "view";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  mode?: StaggerMode;
  once?: boolean;
  amount?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

export function Stagger({
  amount = 0.2,
  children,
  className,
  delayChildren = 0,
  mode = "view",
  once = true,
  staggerChildren = 0.08,
  ...props
}: StaggerProps) {
  const reducedMotion = useMbtiZReducedMotion();

  const variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren,
        staggerChildren: reducedMotion ? 0.03 : staggerChildren,
      },
    },
  };

  if (mode === "mount") {
    return (
      <motion.div
        animate="visible"
        className={cn(className)}
        initial="hidden"
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      variants={variants}
      viewport={{ once, amount }}
      whileInView="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  scaleFrom?: number;
} & Omit<HTMLMotionProps<"div">, "children" | "className" | "variants">;

export function StaggerItem({
  children,
  className,
  distance = 22,
  duration = mbtiZDuration.base,
  scaleFrom = 0.988,
  ...props
}: StaggerItemProps) {
  const reducedMotion = useMbtiZReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: {
          opacity: 0,
          y: resolveMotionDistance(reducedMotion, distance),
          scale: resolveMotionScale(reducedMotion, scaleFrom),
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: resolveMotionDuration(reducedMotion, duration),
            ease: mbtiZEase,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
