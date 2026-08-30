"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { mbtiZEase, mbtiZDuration } from "@/components/cyber/motion/config";

const MbtiZReducedMotionContext = createContext(false);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const reducedMotion = hydrated ? Boolean(prefersReducedMotion) : false;

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: mbtiZDuration.base, ease: mbtiZEase }}
    >
      <MbtiZReducedMotionContext.Provider value={Boolean(reducedMotion)}>
        {children}
      </MbtiZReducedMotionContext.Provider>
    </MotionConfig>
  );
}

export function useMbtiZReducedMotion() {
  return useContext(MbtiZReducedMotionContext);
}
