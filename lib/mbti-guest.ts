"use client";

import {
  buildMbtiZLocalizedContent,
  mbtiZMovieProfiles,
  mbtiZProfiles,
  mbtiZQuestionBank,
} from "@/data/mbti/mbti-z-data.mjs";

export type GuestLocale = "th" | "en";
export type TraitCode = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type GuestQuestionOption = {
  id: string;
  key: string;
  label: string;
  traitCode: string | null;
  metaLabel: string | null;
  weights?: Partial<Record<TraitCode, number>>;
  movieScores?: Record<string, number>;
};

export type GuestQuestion = {
  id: string;
  key: string;
  kind: "mbti" | "movie";
  module: "core" | "movie";
  dimension: string;
  prompt: string;
  sortOrder: number;
  poles?: {
    left: {
      label: string;
      traitCode: string | null;
    };
    right: {
      label: string;
      traitCode: string | null;
    };
  };
  options: GuestQuestionOption[];
};

export type GuestSession = {
  version: "guest-v1" | "guest-v2";
  locale: GuestLocale;
  currentIndex: number;
  answers: Record<string, string>;
  startedAt: string;
  updatedAt: string;
};

export type GuestResult = {
  id: string;
  locale: GuestLocale;
  mbtiType: string;
  createdAt: string;
  confidence: number;
  archetypeName: string;
  tagline: string;
  house: {
    key: string;
    title: string;
    description: string;
    accentFrom: string;
    accentTo: string;
    surface: string;
  };
  animal: {
    key: string;
    name: string;
    imagePath: string;
  };
  movieProfile: {
    key: string;
    title: string;
    summary: string;
    tags: string[];
    scores: Record<string, number>;
    secondaryKeys: string[];
  };
  summaryTitle: string | null;
  summaryBody: string;
  premiumSections: Array<{
    section: string;
    title: string | null;
    body: string;
  }>;
  dimensions: Array<{
    pair: string;
    left: TraitCode;
    right: TraitCode;
    leftScore: number;
    rightScore: number;
    winner: TraitCode;
    balance: number;
  }>;
  answerSummary: Array<{
    questionKey: string;
    question: string;
    kind: "mbti" | "movie";
    module: "core" | "movie";
    dimension: string;
    optionKey: string;
    traitCode: string | null;
    metaLabel: string | null;
    label: string;
  }>;
  answerMap: Record<string, string>;
  questionCount: number;
  coreQuestionCount: number;
  movieQuestionCount: number;
};

export type GuestCloudReconnectBundle = {
  version: "guest-cloud-handoff-v1";
  exportedAt: string;
  mode: "guest-local";
  locale: GuestLocale;
  latestResult: GuestResult | null;
  history: GuestResult[];
  session: GuestSession | null;
  summary: {
    latestResultId: string | null;
    historyCount: number;
    inProgressAnswerCount: number;
    hasPendingSession: boolean;
    lastActivityAt: string | null;
  };
};

type FoundationQuestionOption = {
  key: string;
  labelTh: string;
  labelEn: string;
  traitCode?: string;
  metaLabel?: string;
  weights?: Partial<Record<TraitCode, number>>;
  movieScores?: Record<string, number>;
};

type FoundationQuestion = {
  key: string;
  kind: "mbti" | "movie";
  module: "core" | "movie";
  dimension: string;
  promptTh: string;
  promptEn: string;
  sortOrder: number;
  poles?: {
    left: {
      labelTh: string;
      labelEn: string;
      traitCode?: string;
    };
    right: {
      labelTh: string;
      labelEn: string;
      traitCode?: string;
    };
  };
  options: FoundationQuestionOption[];
};

type LocalizedContentBlock = {
  locale: GuestLocale;
  section: string;
  title: string | null;
  body: string;
  tier: "free" | "premium";
  sortOrder: number;
};

type ProfileEntry = {
  code: string;
  slug: string;
  archetypeNameTh: string;
  archetypeNameEn: string;
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
  animalImagePath: string;
  taglineTh: string;
  taglineEn: string;
  summaryTh: string;
  summaryEn: string;
  contents: LocalizedContentBlock[];
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

export const GUEST_SESSION_KEY = "mbti_guest_session_v1";
export const GUEST_RESULT_KEY = "mbti_guest_result_v1";
export const GUEST_HISTORY_KEY = "mbti_guest_history_v1";
export const GUEST_CLOUD_HANDOFF_KEY = "mbti_guest_cloud_handoff_v1";

const PROFILE_MAP = new Map<string, ProfileEntry>(
  (mbtiZProfiles as Array<Omit<ProfileEntry, "contents">>).map((profile) => [
    profile.code,
    {
      ...profile,
      contents: buildMbtiZLocalizedContent(profile) as LocalizedContentBlock[],
    },
  ])
);

const MOVIE_PROFILE_MAP = new Map<string, MovieProfileEntry>(
  Object.values(mbtiZMovieProfiles as Record<string, MovieProfileEntry>).map((profile) => [
    profile.key,
    profile,
  ])
);

const DIMENSION_PAIRS: Array<[TraitCode, TraitCode]> = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

function safeStorageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
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
  const entries = Array.from(MOVIE_PROFILE_MAP.keys()).map((key) => [key, 0]);
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

export function normalizeGuestLocale(locale?: string | null): GuestLocale {
  return locale === "en" ? "en" : "th";
}

export function getGuestQuestions(locale: GuestLocale): GuestQuestion[] {
  return (mbtiZQuestionBank as FoundationQuestion[])
    .slice()
    .sort(
      (left: { sortOrder: number }, right: { sortOrder: number }) =>
        left.sortOrder - right.sortOrder
    )
    .map((question) => ({
      id: question.key,
      key: question.key,
      kind: question.kind,
      module: question.module,
      dimension: question.dimension,
      prompt: locale === "en" ? question.promptEn : question.promptTh,
      sortOrder: question.sortOrder,
      poles: question.poles
        ? {
            left: {
              label:
                locale === "en"
                  ? question.poles.left.labelEn
                  : question.poles.left.labelTh,
              traitCode: question.poles.left.traitCode ?? null,
            },
            right: {
              label:
                locale === "en"
                  ? question.poles.right.labelEn
                  : question.poles.right.labelTh,
              traitCode: question.poles.right.traitCode ?? null,
            },
          }
        : undefined,
      options: question.options.map((option) => ({
        id: `${question.key}:${option.key}`,
        key: option.key,
        label: locale === "en" ? option.labelEn : option.labelTh,
        traitCode: option.traitCode ?? null,
        metaLabel: option.metaLabel ?? null,
        weights: option.weights,
        movieScores: option.movieScores,
      })),
    }));
}

export function createGuestSession(locale: GuestLocale): GuestSession {
  const timestamp = new Date().toISOString();

  return {
    version: "guest-v2",
    locale,
    currentIndex: 0,
    answers: {},
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function readGuestSession() {
  if (!safeStorageAvailable()) return null;

  return parseJson<GuestSession | null>(
    window.localStorage.getItem(GUEST_SESSION_KEY),
    null
  );
}

export function writeGuestSession(session: GuestSession) {
  if (!safeStorageAvailable()) return;
  window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(session));
  refreshGuestCloudReconnectBundle();
}

export function clearGuestSession() {
  if (!safeStorageAvailable()) return;
  window.localStorage.removeItem(GUEST_SESSION_KEY);
  refreshGuestCloudReconnectBundle();
}

export function readGuestResult() {
  if (!safeStorageAvailable()) return null;

  return parseJson<GuestResult | null>(
    window.localStorage.getItem(GUEST_RESULT_KEY),
    null
  );
}

export function readGuestHistory() {
  if (!safeStorageAvailable()) return [];

  return parseJson<GuestResult[]>(window.localStorage.getItem(GUEST_HISTORY_KEY), []);
}

export function writeGuestResult(result: GuestResult) {
  if (!safeStorageAvailable()) return;

  const history = readGuestHistory().filter((entry) => entry.id !== result.id);
  const nextHistory = [result, ...history].slice(0, 8);

  window.localStorage.setItem(GUEST_RESULT_KEY, JSON.stringify(result));
  window.localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(nextHistory));
  refreshGuestCloudReconnectBundle();
}

export function getGuestResultById(id: string) {
  if (id === "guest-latest") {
    return readGuestResult();
  }

  return readGuestHistory().find((entry) => entry.id === id) ?? null;
}

function buildGuestCloudReconnectBundle(): GuestCloudReconnectBundle | null {
  if (!safeStorageAvailable()) return null;

  const session = readGuestSession();
  const latestResult = readGuestResult();
  const history = readGuestHistory();

  if (!session && !latestResult && history.length === 0) {
    return null;
  }

  const lastActivityAt =
    session?.updatedAt ??
    latestResult?.createdAt ??
    history[0]?.createdAt ??
    null;

  return {
    version: "guest-cloud-handoff-v1",
    exportedAt: new Date().toISOString(),
    mode: "guest-local",
    locale: normalizeGuestLocale(
      session?.locale ?? latestResult?.locale ?? history[0]?.locale ?? "th"
    ),
    latestResult,
    history,
    session,
    summary: {
      latestResultId: latestResult?.id ?? null,
      historyCount: history.length,
      inProgressAnswerCount: session ? Object.keys(session.answers).length : 0,
      hasPendingSession: Boolean(session),
      lastActivityAt,
    },
  };
}

export function readGuestCloudReconnectBundle() {
  if (!safeStorageAvailable()) return null;

  const storedBundle = parseJson<GuestCloudReconnectBundle | null>(
    window.localStorage.getItem(GUEST_CLOUD_HANDOFF_KEY),
    null
  );

  if (storedBundle) {
    return storedBundle;
  }

  const fallbackBundle = buildGuestCloudReconnectBundle();
  if (fallbackBundle) {
    window.localStorage.setItem(
      GUEST_CLOUD_HANDOFF_KEY,
      JSON.stringify(fallbackBundle)
    );
  }

  return fallbackBundle;
}

export function refreshGuestCloudReconnectBundle() {
  if (!safeStorageAvailable()) return null;

  const bundle = buildGuestCloudReconnectBundle();

  if (!bundle) {
    window.localStorage.removeItem(GUEST_CLOUD_HANDOFF_KEY);
    return null;
  }

  window.localStorage.setItem(GUEST_CLOUD_HANDOFF_KEY, JSON.stringify(bundle));
  return bundle;
}

function dedupeGuestHistory(entries: GuestResult[]) {
  const nextHistory: GuestResult[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (!entry?.id || seen.has(entry.id)) {
      continue;
    }

    seen.add(entry.id);
    nextHistory.push(entry);
  }

  return nextHistory.slice(0, 8);
}

export function importGuestCloudReconnectBundle(bundle: GuestCloudReconnectBundle) {
  if (!safeStorageAvailable()) return null;

  const nextHistory = dedupeGuestHistory([
    ...(bundle.latestResult ? [bundle.latestResult] : []),
    ...bundle.history,
  ]);
  const latestResult = bundle.latestResult ?? nextHistory[0] ?? null;

  if (bundle.session) {
    window.localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(bundle.session));
  } else {
    window.localStorage.removeItem(GUEST_SESSION_KEY);
  }

  if (latestResult) {
    window.localStorage.setItem(GUEST_RESULT_KEY, JSON.stringify(latestResult));
  } else {
    window.localStorage.removeItem(GUEST_RESULT_KEY);
  }

  if (nextHistory.length > 0) {
    window.localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(nextHistory));
  } else {
    window.localStorage.removeItem(GUEST_HISTORY_KEY);
  }

  return refreshGuestCloudReconnectBundle();
}

export function saveGuestAnswer(
  session: GuestSession,
  questionKey: string,
  optionKey: string,
  questions: GuestQuestion[]
) {
  const answered = {
    ...session.answers,
    [questionKey]: optionKey,
  };

  const firstUnansweredIndex = questions.findIndex((question) => !answered[question.key]);

  return {
    ...session,
    answers: answered,
    currentIndex:
      firstUnansweredIndex === -1 ? questions.length - 1 : firstUnansweredIndex,
    updatedAt: new Date().toISOString(),
  };
}

export function getGuestProgress(session: GuestSession, questionCount: number) {
  return Math.round(
    (Object.keys(session.answers).length / Math.max(questionCount, 1)) * 100
  );
}

export function computeGuestResult(session: GuestSession) {
  return buildGuestResultFromAnswers({
    locale: normalizeGuestLocale(session.locale),
    answers: session.answers,
  });
}

function buildFallbackDecoratedResult(
  result: GuestResult,
  locale: GuestLocale
): GuestResult {
  const normalizedLocale = normalizeGuestLocale(locale);
  const profile = PROFILE_MAP.get(result.mbtiType);

  if (!profile) {
    return {
      ...result,
      locale: normalizedLocale,
    };
  }

  const fallbackMovieKey =
    profile.houseKey === "purple"
      ? "mindBender"
      : profile.houseKey === "green"
        ? "heartLens"
        : profile.houseKey === "yellow"
          ? "comfortAura"
          : "pulseRider";
  const movieProfileEntry =
    MOVIE_PROFILE_MAP.get(fallbackMovieKey) ?? MOVIE_PROFILE_MAP.get("worldBuilder");

  return {
    ...result,
    locale: normalizedLocale,
    house: {
      key: profile.houseKey,
      title:
        normalizedLocale === "en" ? profile.houseTitleEn : profile.houseTitleTh,
      description:
        normalizedLocale === "en"
          ? profile.houseDescriptionEn
          : profile.houseDescriptionTh,
      accentFrom: profile.accentFrom,
      accentTo: profile.accentTo,
      surface: profile.surface,
    },
    animal: {
      key: profile.animalKey,
      name:
        normalizedLocale === "en" ? profile.animalNameEn : profile.animalNameTh,
      imagePath: profile.animalImagePath,
    },
    movieProfile: movieProfileEntry
      ? {
          key: movieProfileEntry.key,
          title:
            normalizedLocale === "en"
              ? movieProfileEntry.titleEn
              : movieProfileEntry.titleTh,
          summary:
            normalizedLocale === "en"
              ? movieProfileEntry.summaryEn
              : movieProfileEntry.summaryTh,
          tags:
            normalizedLocale === "en"
              ? movieProfileEntry.tagsEn
              : movieProfileEntry.tagsTh,
          scores: {},
          secondaryKeys: [],
        }
      : result.movieProfile,
  };
}

export function localizeGuestResult(
  result: GuestResult,
  locale: GuestLocale
): GuestResult {
  if (!result.answerMap || Object.keys(result.answerMap).length === 0) {
    return buildFallbackDecoratedResult(result, locale);
  }

  const localized = buildGuestResultFromAnswers({
    locale,
    answers: result.answerMap,
  });

  return {
    ...localized,
    id: result.id,
    createdAt: result.createdAt,
  };
}

function buildGuestResultFromAnswers({
  locale,
  answers,
}: {
  locale: GuestLocale;
  answers: Record<string, string>;
}) {
  const normalizedLocale = normalizeGuestLocale(locale);
  const localizedQuestions = getGuestQuestions(normalizedLocale);
  const traitScores = createTraitScoreMap();
  const movieScores = createMovieScoreMap();

  const answerSummary = localizedQuestions
    .map((question) => {
      const optionKey = answers[question.key];
      if (!optionKey) return null;

      const option = question.options.find((entry) => entry.key === optionKey);
      if (!option) return null;

      if (option.weights) {
        for (const [traitCode, weight] of Object.entries(option.weights)) {
          const key = traitCode as TraitCode;
          traitScores[key] += weight ?? 0;
        }
      }

      if (option.movieScores) {
        for (const [movieKey, weight] of Object.entries(option.movieScores)) {
          movieScores[movieKey] = (movieScores[movieKey] ?? 0) + (weight ?? 0);
        }
      }

      return {
        questionKey: question.key,
        question: question.prompt,
        kind: question.kind,
        module: question.module,
        dimension: question.dimension,
        optionKey: option.key,
        traitCode: option.traitCode,
        metaLabel: option.metaLabel,
        label: option.label,
      };
    })
    .filter(Boolean) as GuestResult["answerSummary"];

  const dimensions = DIMENSION_PAIRS.map(([left, right]) => {
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
  const profile = PROFILE_MAP.get(mbtiType);

  if (!profile) {
    throw new Error(`Unknown MBTI type "${mbtiType}"`);
  }

  const { primaryKey, secondaryKeys } = pickMovieProfileKey(movieScores);
  const movieProfileEntry =
    MOVIE_PROFILE_MAP.get(primaryKey) ?? MOVIE_PROFILE_MAP.get("worldBuilder");

  if (!movieProfileEntry) {
    throw new Error(`Unknown movie profile "${primaryKey}"`);
  }

  const localizedContent = profile.contents
    .filter((content) => content.locale === normalizedLocale)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const summary = localizedContent.find(
    (content) => content.section === "summary" && content.tier === "free"
  );

  const premiumSections = localizedContent
    .filter((content) => content.tier === "premium")
    .slice(0, 3)
    .map((content) => ({
      section: content.section,
      title: content.title,
      body: content.body,
    }));

  const confidence = Math.round(
    dimensions.reduce((total, dimension) => total + dimension.balance, 0) /
      Math.max(dimensions.length, 1)
  );

  const coreQuestionCount = localizedQuestions.filter(
    (question) => question.module === "core"
  ).length;
  const movieQuestionCount = localizedQuestions.filter(
    (question) => question.module === "movie"
  ).length;

  return {
    id: `guest-${Date.now().toString(36)}-${mbtiType.toLowerCase()}`,
    locale: normalizedLocale,
    mbtiType,
    createdAt: new Date().toISOString(),
    confidence,
    archetypeName:
      normalizedLocale === "en" ? profile.archetypeNameEn : profile.archetypeNameTh,
    tagline: normalizedLocale === "en" ? profile.taglineEn : profile.taglineTh,
    house: {
      key: profile.houseKey,
      title:
        normalizedLocale === "en" ? profile.houseTitleEn : profile.houseTitleTh,
      description:
        normalizedLocale === "en"
          ? profile.houseDescriptionEn
          : profile.houseDescriptionTh,
      accentFrom: profile.accentFrom,
      accentTo: profile.accentTo,
      surface: profile.surface,
    },
    animal: {
      key: profile.animalKey,
      name:
        normalizedLocale === "en" ? profile.animalNameEn : profile.animalNameTh,
      imagePath: profile.animalImagePath,
    },
    movieProfile: {
      key: movieProfileEntry.key,
      title:
        normalizedLocale === "en"
          ? movieProfileEntry.titleEn
          : movieProfileEntry.titleTh,
      summary:
        normalizedLocale === "en"
          ? movieProfileEntry.summaryEn
          : movieProfileEntry.summaryTh,
      tags:
        normalizedLocale === "en"
          ? movieProfileEntry.tagsEn
          : movieProfileEntry.tagsTh,
      scores: movieScores,
      secondaryKeys,
    },
    summaryTitle: summary?.title ?? null,
    summaryBody:
      summary?.body ??
      (normalizedLocale === "en"
        ? `${profile.archetypeNameEn} carries a distinctive energy pattern.`
        : `${profile.archetypeNameTh} มีรูปแบบพลังงานและการตัดสินใจที่ชัดเจน`),
    premiumSections,
    dimensions,
    answerSummary,
    answerMap: { ...answers },
    questionCount: localizedQuestions.length,
    coreQuestionCount,
    movieQuestionCount,
  } satisfies GuestResult;
}
