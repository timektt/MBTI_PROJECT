import { z } from "zod";

import type { GuestCloudReconnectBundle } from "@/lib/mbti-guest";
import type { AssessmentReconnectImportResultCode } from "@/lib/assessment-runtime-types";

const traitCodeSchema = z.enum(["E", "I", "S", "N", "T", "F", "J", "P"]);
const guestLocaleSchema = z.enum(["th", "en"]);

const guestSessionSchema = z.object({
  version: z.enum(["guest-v1", "guest-v2"]),
  locale: guestLocaleSchema,
  currentIndex: z.number().int().min(0),
  answers: z.record(z.string()),
  startedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const guestResultSchema = z.object({
  id: z.string().min(1),
  locale: guestLocaleSchema,
  mbtiType: z.string().length(4),
  createdAt: z.string().datetime(),
  confidence: z.number().min(0).max(100),
  archetypeName: z.string().min(1),
  tagline: z.string().min(1),
  house: z.object({
    key: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    accentFrom: z.string().min(1),
    accentTo: z.string().min(1),
    surface: z.string().min(1),
  }),
  animal: z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    imagePath: z.string().min(1),
  }),
  movieProfile: z.object({
    key: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    tags: z.array(z.string().min(1)),
    scores: z.record(z.number()),
    secondaryKeys: z.array(z.string().min(1)),
  }),
  summaryTitle: z.string().nullable(),
  summaryBody: z.string().min(1),
  premiumSections: z.array(
    z.object({
      section: z.string().min(1),
      title: z.string().nullable(),
      body: z.string().min(1),
    })
  ),
  dimensions: z.array(
    z.object({
      pair: z.string().min(1),
      left: traitCodeSchema,
      right: traitCodeSchema,
      leftScore: z.number().int().min(0),
      rightScore: z.number().int().min(0),
      winner: traitCodeSchema,
      balance: z.number().min(0),
    })
  ),
  answerSummary: z.array(
    z.object({
      questionKey: z.string().min(1),
      question: z.string().min(1),
      kind: z.enum(["mbti", "movie"]),
      module: z.enum(["core", "movie"]),
      dimension: z.string().min(1),
      optionKey: z.string().min(1),
      traitCode: z.string().nullable(),
      metaLabel: z.string().nullable(),
      label: z.string().min(1),
    })
  ),
  answerMap: z.record(z.string()),
  questionCount: z.number().int().min(1),
  coreQuestionCount: z.number().int().min(1),
  movieQuestionCount: z.number().int().min(0),
});

export const reconnectBundleSchema = z.object({
  version: z.literal("guest-cloud-handoff-v1"),
  exportedAt: z.string().datetime(),
  mode: z.literal("guest-local"),
  locale: guestLocaleSchema,
  latestResult: guestResultSchema.nullable(),
  history: z.array(guestResultSchema),
  session: guestSessionSchema.nullable(),
  summary: z.object({
    latestResultId: z.string().nullable(),
    historyCount: z.number().int().min(0),
    inProgressAnswerCount: z.number().int().min(0),
    hasPendingSession: z.boolean(),
    lastActivityAt: z.string().datetime().nullable(),
  }),
});

export type ParsedReconnectBundleResult =
  | {
      ok: true;
      bundle: GuestCloudReconnectBundle;
    }
  | {
      ok: false;
      code: Extract<AssessmentReconnectImportResultCode, "invalid_json" | "invalid_bundle">;
    };

function normalizeFileTimestamp(value: string) {
  return value.replace(/[:.]/g, "-");
}

export function serializeReconnectBundle(bundle: GuestCloudReconnectBundle) {
  return JSON.stringify(bundle, null, 2);
}

export function getReconnectBundleFileName(bundle: GuestCloudReconnectBundle) {
  const timestamp = normalizeFileTimestamp(bundle.exportedAt);
  return `mbti-z-handoff-${bundle.locale}-${timestamp}.json`;
}

export function parseReconnectBundlePayload(
  payload: string
): ParsedReconnectBundleResult {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(payload);
  } catch {
    return {
      ok: false,
      code: "invalid_json",
    };
  }

  const parsedBundle = reconnectBundleSchema.safeParse(parsedJson);

  if (!parsedBundle.success) {
    return {
      ok: false,
      code: "invalid_bundle",
    };
  }

  return {
    ok: true,
    bundle: parsedBundle.data,
  };
}
