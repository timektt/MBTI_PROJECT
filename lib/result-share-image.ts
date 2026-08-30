import { z } from "zod";

const RESULT_SHARE_ANIMAL_ASSET_STEMS = [
  "intj-obsidian-raven",
  "intp-arcane-owl",
  "entj-crowned-lion",
  "entp-storm-fox",
  "infj-moon-deer",
  "infp-dream-swan",
  "enfj-solar-phoenix",
  "enfp-aurora-rabbit",
  "istj-iron-wolf",
  "isfj-guardian-bear",
  "estj-golden-eagle",
  "esfj-hearth-stag",
  "istp-steel-panther",
  "isfp-crystal-lynx",
  "estp-thunder-tiger",
  "esfp-neon-peacock",
] as const;

const APPROVED_RESULT_SHARE_ANIMAL_PATHS = new Set(
  RESULT_SHARE_ANIMAL_ASSET_STEMS.flatMap((stem) => [
    `/mbti-z/animals/${stem}.png`,
    `/mbti-z/v4/fantasy-v2/animals/${stem}.webp`,
  ])
);

const MBTI_TYPE_CODES = new Set([
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]);
const MBTI_TRAITS = new Set(["E", "I", "S", "N", "T", "F", "J", "P"]);
const DIMENSION_PAIRS = new Set(["E/I", "S/N", "T/F", "J/P"]);
const mbtiTypeSchema = z
  .string()
  .refine((value) => MBTI_TYPE_CODES.has(value), "Unsupported MBTI type");
const traitSchema = z
  .string()
  .refine((value) => MBTI_TRAITS.has(value), "Unsupported MBTI trait");
const dimensionPairSchema = z
  .string()
  .refine((value) => DIMENSION_PAIRS.has(value), "Unsupported MBTI dimension pair");
const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i);

function boundedText(maxLength: number) {
  return z.string().trim().min(1).max(maxLength);
}

export function isApprovedResultShareAnimalPath(value: string) {
  return APPROVED_RESULT_SHARE_ANIMAL_PATHS.has(value);
}

export function resolveResultShareRenderableAnimalPath(value: string) {
  if (!isApprovedResultShareAnimalPath(value)) return null;

  const fantasyV2Prefix = "/mbti-z/v4/fantasy-v2/animals/";

  if (value.startsWith(fantasyV2Prefix) && value.endsWith(".webp")) {
    return `/mbti-z/animals/${value.slice(fantasyV2Prefix.length, -".webp".length)}.png`;
  }

  return value;
}

export function resolveResultShareAssetOrigin({
  configuredSiteUrl,
  nodeEnv,
  requestHost,
  vercelUrl,
}: {
  configuredSiteUrl?: string;
  nodeEnv?: string;
  requestHost?: string;
  vercelUrl?: string;
}) {
  if (nodeEnv !== "production" && requestHost) {
    const localHostPattern = /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i;

    if (localHostPattern.test(requestHost)) {
      return `http://${requestHost}`;
    }
  }

  if (vercelUrl) {
    try {
      const candidate = vercelUrl.includes("://") ? vercelUrl : `https://${vercelUrl}`;
      const parsed = new URL(candidate);

      if (parsed.protocol === "https:") {
        return parsed.origin;
      }
    } catch {
      // Continue to the explicitly configured public site URL.
    }
  }

  if (configuredSiteUrl) {
    try {
      const parsed = new URL(configuredSiteUrl);

      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.origin;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export const resultShareImageSchema = z.object({
  locale: z.enum(["th", "en"]),
  mbtiType: mbtiTypeSchema,
  createdAt: z.string().datetime({ offset: true }),
  confidence: z.number().finite().min(0).max(100),
  archetypeName: boundedText(120),
  tagline: boundedText(320),
  house: z.object({
    title: boundedText(80),
    description: boundedText(420),
    accentFrom: hexColorSchema,
    accentTo: hexColorSchema,
  }),
  animal: z.object({
    name: boundedText(80),
    imagePath: z
      .string()
      .refine(isApprovedResultShareAnimalPath, "Unapproved result animal asset path"),
  }),
  movieProfile: z.object({
    title: boundedText(120),
    summary: boundedText(520),
    tags: z.array(boundedText(48)).max(6),
  }),
  summaryBody: boundedText(720),
  dimensions: z
    .array(
      z.object({
        pair: dimensionPairSchema,
        left: traitSchema,
        right: traitSchema,
        leftScore: z.number().finite().min(0).max(1_000),
        rightScore: z.number().finite().min(0).max(1_000),
        winner: traitSchema,
      })
    )
    .length(4),
});

export type ResultShareImagePayload = z.infer<typeof resultShareImageSchema>;
