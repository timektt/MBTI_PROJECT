import { z } from "zod";

export const resultShareImageSchema = z.object({
  locale: z.enum(["th", "en"]),
  mbtiType: z.string(),
  createdAt: z.string(),
  confidence: z.number(),
  archetypeName: z.string(),
  tagline: z.string(),
  house: z.object({
    title: z.string(),
    description: z.string(),
    accentFrom: z.string(),
    accentTo: z.string(),
  }),
  animal: z.object({
    name: z.string(),
    imagePath: z.string(),
  }),
  movieProfile: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
  }),
  summaryBody: z.string(),
  dimensions: z.array(
    z.object({
      pair: z.string(),
      left: z.string(),
      right: z.string(),
      leftScore: z.number(),
      rightScore: z.number(),
      winner: z.string(),
    })
  ),
});

export type ResultShareImagePayload = z.infer<typeof resultShareImageSchema>;
