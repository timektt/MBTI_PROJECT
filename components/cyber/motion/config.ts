"use client";

export const mbtiZEase = [0.16, 1, 0.3, 1] as const;

export const mbtiZDuration = {
  fast: 0.18,
  base: 0.44,
  slow: 0.72,
  hero: 0.88,
} as const;

export function resolveMotionDistance(reducedMotion: boolean, distance: number) {
  return reducedMotion ? 0 : distance;
}

export function resolveMotionScale(reducedMotion: boolean, scale: number) {
  return reducedMotion ? 1 : scale;
}

export function resolveMotionDuration(reducedMotion: boolean, duration: number) {
  return reducedMotion ? Math.min(duration, mbtiZDuration.fast) : duration;
}
