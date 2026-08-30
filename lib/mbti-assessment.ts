import { Prisma } from "@prisma/client";

import { mbtiZMovieProfiles, mbtiZProfiles } from "@/data/mbti/mbti-z-data.mjs";
import {
  getMbtiZHouseScenePath,
  getMbtiZTypePosterPath,
} from "@/lib/mbti-z-visuals";

export type SupportedLocale = "th" | "en";

export type AssessmentQuestionWithOptions =
  Prisma.AssessmentQuestionGetPayload<{
    include: { options: true };
  }>;

export type AssessmentAnswerWithRelations =
  Prisma.AssessmentAnswerGetPayload<{
    include: {
      question: true;
      option: true;
    };
  }>;

type TraitCode = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

type MbtiZQuestionKind = "mbti" | "movie";

type MbtiZQuestionModule = "core" | "movie";

type QuestionPoles = {
  left: {
    label: string;
    traitCode: string | null;
  };
  right: {
    label: string;
    traitCode: string | null;
  };
};

type PersistedQuestionMetadata = {
  kind?: string | null;
  module?: string | null;
  poles?: unknown;
};

type PersistedOptionMetadata = {
  traitCode?: string | null;
  metaLabel?: string | null;
  weights?: unknown;
  movieScores?: unknown;
};

type MovieProfileEntry = {
  key: string;
  titleTh: string;
  titleEn: string;
  summaryTh: string;
  summaryEn: string;
  tagsTh: string[];
  tagsEn: string[];
};

type MovieProfileArtifact = {
  key: string;
  title: string;
  summary: string;
  tags: string[];
  scores: Record<string, number>;
  secondaryKeys: string[];
};

type PersonalityContentForArtifact = {
  locale: string;
  section: string;
  tier: string;
  title: string | null;
  body: string;
  sortOrder: number;
};

type ResultArtifactInput = {
  id: string;
  mbtiType: string;
  locale: SupportedLocale;
  createdAt: string;
  personalityContents?: PersonalityContentForArtifact[];
  premiumStatus?: string | null;
  premiumReportId?: string | null;
  shareSlug?: string | null;
  cardId?: string | null;
  scoreDetail?: unknown;
};

const dimensionPairs: Array<[TraitCode, TraitCode]> = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

const traitCodeSet = new Set<TraitCode>(["E", "I", "S", "N", "T", "F", "J", "P"]);

export const cardPlaceholderPath = "/mbti-card-placeholder.svg";

const mbtiZProfileByCode = new Map(
  (mbtiZProfiles as Array<{
    code: string;
    archetypeNameTh: string;
    archetypeNameEn: string;
    taglineTh: string;
    taglineEn: string;
    summaryTh: string;
    summaryEn: string;
    houseKey: string;
    houseTitleTh: string;
    houseTitleEn: string;
    houseDescriptionTh: string;
    houseDescriptionEn: string;
    accentFrom: string;
    accentTo: string;
    surface: string;
    animalKey: string;
    animalNameTh: string;
    animalNameEn: string;
  }>).map((profile) => [profile.code, profile])
);

const movieProfileByKey = new Map(
  Object.values(mbtiZMovieProfiles as Record<string, MovieProfileEntry>).map(
    (profile) => [profile.key, profile]
  )
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isTraitCode(value: unknown): value is TraitCode {
  return typeof value === "string" && traitCodeSet.has(value as TraitCode);
}

function readString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function readNumericRecord(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const entries = Object.entries(value)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .filter(([, score]) => Number.isFinite(score));

  return Object.fromEntries(entries) as Record<string, number>;
}

function createTraitScoreMap(): Record<TraitCode, number> {
  return {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };
}

function createMovieScoreMap() {
  const entries = Array.from(movieProfileByKey.keys()).map((key) => [key, 0]);
  return Object.fromEntries(entries) as Record<string, number>;
}

function pickMovieProfileKey(scores: Record<string, number>) {
  const sortedEntries = Object.entries(scores).sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }

    return left[0].localeCompare(right[0]);
  });

  return {
    primaryKey: sortedEntries[0]?.[0] ?? "worldBuilder",
    secondaryKeys: sortedEntries.slice(1, 3).map(([key]) => key),
  };
}

function buildLocalizedMovieProfile({
  key,
  scores,
  secondaryKeys,
  locale,
}: {
  key: string;
  scores: Record<string, number>;
  secondaryKeys: string[];
  locale: SupportedLocale;
}): MovieProfileArtifact | null {
  const profile = movieProfileByKey.get(key) ?? movieProfileByKey.get("worldBuilder");
  if (!profile) {
    return null;
  }

  return {
    key: profile.key,
    title: locale === "en" ? profile.titleEn : profile.titleTh,
    summary: locale === "en" ? profile.summaryEn : profile.summaryTh,
    tags: locale === "en" ? profile.tagsEn : profile.tagsTh,
    scores,
    secondaryKeys,
  };
}

function normalizeQuestionKind(kind: unknown): MbtiZQuestionKind {
  return kind === "movie" ? "movie" : "mbti";
}

function normalizeQuestionModule(module: unknown): MbtiZQuestionModule {
  return module === "movie" ? "movie" : "core";
}

function localizeQuestionPoles(value: unknown, locale: SupportedLocale): QuestionPoles | null {
  if (!isRecord(value) || !isRecord(value.left) || !isRecord(value.right)) {
    return null;
  }

  const leftLabel =
    locale === "en"
      ? readString(value.left.labelEn) ?? readString(value.left.label)
      : readString(value.left.labelTh) ?? readString(value.left.label);
  const rightLabel =
    locale === "en"
      ? readString(value.right.labelEn) ?? readString(value.right.label)
      : readString(value.right.labelTh) ?? readString(value.right.label);

  if (!leftLabel || !rightLabel) {
    return null;
  }

  return {
    left: {
      label: leftLabel,
      traitCode: readString(value.left.traitCode),
    },
    right: {
      label: rightLabel,
      traitCode: readString(value.right.traitCode),
    },
  };
}

function extractMovieProfileFromScoreDetail(
  scoreDetail: unknown,
  locale: SupportedLocale
) {
  if (!isRecord(scoreDetail)) {
    return null;
  }

  const movieScores =
    readNumericRecord(scoreDetail.movieScores) ??
    (isRecord(scoreDetail.movieProfile)
      ? readNumericRecord(scoreDetail.movieProfile.scores)
      : null);

  const profileKey =
    isRecord(scoreDetail.movieProfile) && typeof scoreDetail.movieProfile.key === "string"
      ? scoreDetail.movieProfile.key
      : movieScores
        ? pickMovieProfileKey(movieScores).primaryKey
        : null;

  if (!profileKey || !movieScores) {
    return null;
  }

  const secondaryKeys =
    isRecord(scoreDetail.movieProfile) && Array.isArray(scoreDetail.movieProfile.secondaryKeys)
      ? scoreDetail.movieProfile.secondaryKeys.filter(
          (key): key is string => typeof key === "string"
        )
      : pickMovieProfileKey(movieScores).secondaryKeys;

  return buildLocalizedMovieProfile({
    key: profileKey,
    scores: movieScores,
    secondaryKeys,
    locale,
  });
}

export function normalizeLocale(locale?: string | null): SupportedLocale {
  return locale === "en" ? "en" : "th";
}

export function localizeQuestion(
  question: AssessmentQuestionWithOptions,
  locale: SupportedLocale
) {
  const questionMetadata = question as AssessmentQuestionWithOptions & PersistedQuestionMetadata;

  return {
    id: question.id,
    key: question.key,
    kind: normalizeQuestionKind(questionMetadata.kind),
    module: normalizeQuestionModule(questionMetadata.module),
    dimension: question.dimension,
    prompt: locale === "en" ? question.promptEn : question.promptTh,
    sortOrder: question.sortOrder,
    poles: localizeQuestionPoles(questionMetadata.poles, locale),
    options: question.options
      .slice()
      .sort((left, right) => left.key.localeCompare(right.key))
      .map((option) => {
        const optionMetadata = option as typeof option & PersistedOptionMetadata;

        return {
          id: option.id,
          key: option.key,
          traitCode: optionMetadata.traitCode ?? null,
          metaLabel: optionMetadata.metaLabel ?? null,
          label: locale === "en" ? option.labelEn : option.labelTh,
          weights: readNumericRecord(optionMetadata.weights),
          movieScores: readNumericRecord(optionMetadata.movieScores),
        };
      }),
  };
}

export function computeAssessmentResult(
  answers: AssessmentAnswerWithRelations[],
  locale: SupportedLocale
) {
  const traitScores = createTraitScoreMap();
  const movieScores = createMovieScoreMap();

  const orderedAnswers = answers
    .slice()
    .sort((left, right) => left.question.sortOrder - right.question.sortOrder);

  for (const answer of orderedAnswers) {
    const option = answer.option as typeof answer.option & PersistedOptionMetadata;
    const weights = readNumericRecord(option.weights);
    const optionMovieScores = readNumericRecord(option.movieScores);

    if (weights) {
      for (const [traitCode, weight] of Object.entries(weights)) {
        if (isTraitCode(traitCode)) {
          traitScores[traitCode] += weight;
        }
      }
    } else if (isTraitCode(option.traitCode)) {
      traitScores[option.traitCode] += answer.option.scoreValue;
    }

    if (optionMovieScores) {
      for (const [movieKey, weight] of Object.entries(optionMovieScores)) {
        movieScores[movieKey] = (movieScores[movieKey] ?? 0) + weight;
      }
    }
  }

  const dimensions = dimensionPairs.map(([left, right]) => {
    const leftScore = traitScores[left];
    const rightScore = traitScores[right];
    const total = leftScore + rightScore || 1;
    const winner = leftScore >= rightScore ? left : right;

    return {
      pair: `${left}/${right}`,
      left,
      right,
      leftScore,
      rightScore,
      winner,
      balance: Math.round((Math.max(leftScore, rightScore) / total) * 100),
    };
  });

  const mbtiType = dimensions.map((dimension) => dimension.winner).join("");
  const { primaryKey, secondaryKeys } = pickMovieProfileKey(movieScores);
  const movieProfile = buildLocalizedMovieProfile({
    key: primaryKey,
    scores: movieScores,
    secondaryKeys,
    locale,
  });

  return {
    mbtiType,
    locale,
    traitScores,
    movieScores,
    movieProfile,
    dimensions,
    answers: orderedAnswers.map((answer) => ({
      questionId: answer.questionId,
      questionKey: answer.question.key,
      question: locale === "en" ? answer.question.promptEn : answer.question.promptTh,
      kind: normalizeQuestionKind(
        (answer.question as typeof answer.question & PersistedQuestionMetadata).kind
      ),
      module: normalizeQuestionModule(
        (answer.question as typeof answer.question & PersistedQuestionMetadata).module
      ),
      dimension: answer.question.dimension,
      optionKey: answer.option.key,
      traitCode:
        (answer.option as typeof answer.option & PersistedOptionMetadata).traitCode ?? null,
      metaLabel:
        (answer.option as typeof answer.option & PersistedOptionMetadata).metaLabel ?? null,
      label: locale === "en" ? answer.option.labelEn : answer.option.labelTh,
      scoreValue: answer.option.scoreValue,
    })),
  };
}

export function buildShareSlug(userId: string, mbtiType: string) {
  return `${mbtiType.toLowerCase()}-${userId.slice(0, 6)}-${Date.now().toString(36)}`;
}

export function getPersonalitySections(
  contents: Array<{
    locale: string;
    section: string;
    tier: string;
    title: string | null;
    body: string;
    sortOrder: number;
  }>,
  locale: SupportedLocale
) {
  return contents
    .filter((content) => content.locale === locale)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function buildResultArtifactPayload({
  id,
  mbtiType,
  locale,
  createdAt,
  personalityContents = [],
  premiumStatus = "locked",
  premiumReportId = null,
  shareSlug = null,
  cardId = null,
  scoreDetail,
}: ResultArtifactInput) {
  const profile = mbtiZProfileByCode.get(mbtiType);
  const movieProfile = extractMovieProfileFromScoreDetail(scoreDetail, locale);
  const localizedSections = getPersonalitySections(personalityContents, locale);
  const summarySection = localizedSections.find(
    (content) => content.section === "summary" && content.tier === "free"
  );
  const premiumSections = localizedSections
    .filter((content) => content.tier === "premium")
    .slice(0, 3)
    .map((content) => ({
      section: content.section,
      title: content.title,
      body: content.body,
    }));
  const fallbackSummary =
    locale === "en"
      ? `${mbtiType} personality result`
      : `ผลลัพธ์บุคลิกภาพ ${mbtiType}`;

  return {
    id,
    locale,
    mbtiType,
    createdAt,
    archetypeName:
      locale === "en"
        ? profile?.archetypeNameEn ?? mbtiType
        : profile?.archetypeNameTh ?? mbtiType,
    tagline:
      locale === "en"
        ? profile?.taglineEn ?? null
        : profile?.taglineTh ?? null,
    summaryTitle: summarySection?.title ?? null,
    summaryBody:
      summarySection?.body ??
      (locale === "en" ? profile?.summaryEn : profile?.summaryTh) ??
      fallbackSummary,
    house: profile
      ? {
          key: profile.houseKey,
          title: locale === "en" ? profile.houseTitleEn : profile.houseTitleTh,
          description:
            locale === "en"
              ? profile.houseDescriptionEn
              : profile.houseDescriptionTh,
          accentFrom: profile.accentFrom,
          accentTo: profile.accentTo,
          surface: profile.surface,
          imagePath: getMbtiZHouseScenePath(profile.houseKey),
        }
      : null,
    animal: profile
      ? {
          key: profile.animalKey,
          name: locale === "en" ? profile.animalNameEn : profile.animalNameTh,
          imagePath: getMbtiZTypePosterPath(mbtiType, profile.animalKey),
        }
      : null,
    movieProfile,
    premiumSections,
    premiumStatus: premiumStatus ?? "locked",
    premiumReportId,
    shareSlug,
    publicSharePath: shareSlug ? `/share/${shareSlug}` : null,
    cardId,
    coverage: {
      source: "cloud-core-v1",
      hasMovieProfile: movieProfile !== null,
    },
  };
}
