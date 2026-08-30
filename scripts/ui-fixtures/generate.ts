#!/usr/bin/env -S npx --yes tsx

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  GUEST_CLOUD_HANDOFF_KEY,
  GUEST_HISTORY_KEY,
  GUEST_RESULT_KEY,
  GUEST_SESSION_KEY,
  computeGuestResult,
  getGuestQuestions,
  type GuestCloudReconnectBundle,
  type GuestLocale,
  type GuestQuestion,
  type GuestResult,
  type GuestSession,
} from "../../lib/mbti-guest";

const FIXTURE_VERSION = "mbti-z-ui-fixtures-v1" as const;
const LOCALE_KEY = "mbti-z-locale";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(SCRIPT_DIR, "generated");
const INIT_SCRIPT_DIR = path.join(OUTPUT_DIR, "init");
const GENERATED_AT = "2026-07-15T00:00:00.000Z";
const BASE_TIME_MS = Date.parse(GENERATED_AT);
const MANAGED_STORAGE_KEYS = [
  LOCALE_KEY,
  GUEST_SESSION_KEY,
  GUEST_RESULT_KEY,
  GUEST_HISTORY_KEY,
  GUEST_CLOUD_HANDOFF_KEY,
] as const;

type FixtureCategory = "quiz" | "result" | "dashboard" | "missing-result";

type UiFixture = {
  fixtureId: string;
  category: FixtureCategory;
  description: string;
  route: string;
  locale: GuestLocale;
  localStorage: Record<string, string>;
  expected: Record<string, unknown>;
};

type FixtureManifest = {
  version: typeof FIXTURE_VERSION;
  generatedAt: string;
  generator: string;
  safety: {
    production: false;
    writesDatabase: false;
    requiresEnvironment: false;
  };
  managedStorageKeys: readonly string[];
  fixtures: UiFixture[];
};

type StorageState = {
  locale: GuestLocale;
  session?: GuestSession | null;
  latestResult?: GuestResult | null;
  history?: GuestResult[];
  reconnectBundle?: GuestCloudReconnectBundle | null;
};

const questionsByLocale: Record<GuestLocale, GuestQuestion[]> = {
  th: getGuestQuestions("th"),
  en: getGuestQuestions("en"),
};

function timestamp(offsetMinutes: number) {
  return new Date(BASE_TIME_MS + offsetMinutes * 60_000).toISOString();
}

function chooseAnswerForTrait(question: GuestQuestion, targetTrait: string) {
  const rankedOptions = question.options
    .map((option) => ({
      key: option.key,
      weight: option.weights?.[targetTrait as keyof typeof option.weights] ?? 0,
    }))
    .sort((left, right) => right.weight - left.weight || left.key.localeCompare(right.key));
  const selected = rankedOptions[0];
  assert.ok(selected && selected.weight > 0, `No weighted ${targetTrait} option for ${question.key}.`);
  return selected.key;
}

function chooseAnswer(question: GuestQuestion, targetType: string, movieSeed = 0) {
  if (question.module === "movie") {
    const option = question.options[movieSeed % question.options.length];
    assert.ok(option, `Movie question ${question.key} has no selectable option.`);
    return option.key;
  }

  const targetTrait = targetType
    .split("")
    .find((trait) => question.dimension.split("/").includes(trait));
  assert.ok(targetTrait, `Type ${targetType} does not cover ${question.dimension}.`);

  return chooseAnswerForTrait(question, targetTrait);
}

function createAnswers(
  locale: GuestLocale,
  targetType: string,
  count: number,
  movieSeed = 0,
  balancedDimension?: string
) {
  const questions = questionsByLocale[locale];
  assert.ok(count >= 0 && count <= questions.length, `Invalid answer count ${count}.`);
  const balancedQuestions = balancedDimension
    ? questions.filter(
        (question) => question.module === "core" && question.dimension === balancedDimension
      )
    : [];
  const targetAnswerCount = Math.floor(balancedQuestions.length / 2) + 1;
  let balancedIndex = 0;

  return Object.fromEntries(
    questions.slice(0, count).map((question) => {
      if (balancedDimension && question.module === "core" && question.dimension === balancedDimension) {
        const traits = question.dimension.split("/");
        const targetTrait = targetType.split("").find((trait) => traits.includes(trait));
        assert.ok(targetTrait, `Type ${targetType} does not cover ${question.dimension}.`);
        const oppositeTrait = traits.find((trait) => trait !== targetTrait);
        assert.ok(oppositeTrait, `Dimension ${question.dimension} has no opposite trait.`);
        const selectedTrait = balancedIndex < targetAnswerCount ? targetTrait : oppositeTrait;
        balancedIndex += 1;
        return [question.key, chooseAnswerForTrait(question, selectedTrait)];
      }

      return [question.key, chooseAnswer(question, targetType, movieSeed)];
    })
  );
}

function createSession({
  locale,
  currentIndex,
  targetType = "INTJ",
  offsetMinutes,
}: {
  locale: GuestLocale;
  currentIndex: number;
  targetType?: string;
  offsetMinutes: number;
}): GuestSession {
  const startedAt = timestamp(offsetMinutes);

  return {
    version: "guest-v2",
    locale,
    currentIndex,
    answers: createAnswers(locale, targetType, currentIndex),
    startedAt,
    updatedAt: timestamp(offsetMinutes + 5),
  };
}

function createResult({
  fixtureId,
  locale,
  targetType,
  expectedHouse,
  offsetMinutes,
  movieSeed = 0,
  balancedDimension,
}: {
  fixtureId: string;
  locale: GuestLocale;
  targetType: string;
  expectedHouse: string;
  offsetMinutes: number;
  movieSeed?: number;
  balancedDimension?: string;
}): GuestResult {
  const questions = questionsByLocale[locale];
  const completedSession: GuestSession = {
    version: "guest-v2",
    locale,
    currentIndex: questions.length - 1,
    answers: createAnswers(
      locale,
      targetType,
      questions.length,
      movieSeed,
      balancedDimension
    ),
    startedAt: timestamp(offsetMinutes - 30),
    updatedAt: timestamp(offsetMinutes),
  };
  const computed = computeGuestResult(completedSession);

  assert.equal(computed.mbtiType, targetType, `${fixtureId} scored as ${computed.mbtiType}.`);
  assert.equal(computed.house.key, expectedHouse, `${fixtureId} resolved to the wrong house.`);

  return {
    ...computed,
    id: `guest-fixture-${fixtureId}-${targetType.toLowerCase()}`,
    createdAt: timestamp(offsetMinutes),
  };
}

function createReconnectBundle({
  locale,
  latestResult = null,
  history = [],
  session = null,
  offsetMinutes,
}: {
  locale: GuestLocale;
  latestResult?: GuestResult | null;
  history?: GuestResult[];
  session?: GuestSession | null;
  offsetMinutes: number;
}): GuestCloudReconnectBundle {
  return {
    version: "guest-cloud-handoff-v1",
    exportedAt: timestamp(offsetMinutes),
    mode: "guest-local",
    locale,
    latestResult,
    history,
    session,
    summary: {
      latestResultId: latestResult?.id ?? null,
      historyCount: history.length,
      inProgressAnswerCount: session ? Object.keys(session.answers).length : 0,
      hasPendingSession: Boolean(session),
      lastActivityAt:
        session?.updatedAt ?? latestResult?.createdAt ?? history[0]?.createdAt ?? null,
    },
  };
}

function createStorageState({
  locale,
  session = null,
  latestResult = null,
  history = [],
  reconnectBundle = null,
}: StorageState) {
  const storage: Record<string, string> = {
    [LOCALE_KEY]: locale,
  };

  if (session) storage[GUEST_SESSION_KEY] = JSON.stringify(session);
  if (latestResult) storage[GUEST_RESULT_KEY] = JSON.stringify(latestResult);
  if (history.length > 0) storage[GUEST_HISTORY_KEY] = JSON.stringify(history);
  if (reconnectBundle) {
    storage[GUEST_CLOUD_HANDOFF_KEY] = JSON.stringify(reconnectBundle);
  }

  return storage;
}

function createQuizFixture({
  fixtureId,
  description,
  locale,
  currentIndex,
  offsetMinutes,
}: {
  fixtureId: string;
  description: string;
  locale: GuestLocale;
  currentIndex: number;
  offsetMinutes: number;
}): UiFixture {
  const session = createSession({ locale, currentIndex, offsetMinutes });
  const question = questionsByLocale[locale][currentIndex];
  assert.ok(question, `Missing question at index ${currentIndex}.`);
  const reconnectBundle = createReconnectBundle({
    locale,
    session,
    offsetMinutes: offsetMinutes + 6,
  });

  return {
    fixtureId,
    category: "quiz",
    description,
    route: `/quiz?lang=${locale}`,
    locale,
    localStorage: createStorageState({ locale, session, reconnectBundle }),
    expected: {
      pageState: "quiz",
      currentIndex,
      questionKey: question.key,
      questionKind: question.kind,
      questionModule: question.module,
      answeredCount: currentIndex,
      totalQuestionCount: questionsByLocale[locale].length,
    },
  };
}

function createResultFixture({
  fixtureId,
  description,
  locale,
  targetType,
  expectedHouse,
  offsetMinutes,
  movieSeed,
  balancedDimension,
}: {
  fixtureId: string;
  description: string;
  locale: GuestLocale;
  targetType: string;
  expectedHouse: string;
  offsetMinutes: number;
  movieSeed: number;
  balancedDimension?: string;
}): UiFixture {
  const result = createResult({
    fixtureId,
    locale,
    targetType,
    expectedHouse,
    offsetMinutes,
    movieSeed,
    balancedDimension,
  });
  const history = [result];
  const reconnectBundle = createReconnectBundle({
    locale,
    latestResult: result,
    history,
    offsetMinutes: offsetMinutes + 1,
  });

  return {
    fixtureId,
    category: "result",
    description,
    route: `/result/${result.id}?lang=${locale}`,
    locale,
    localStorage: createStorageState({
      locale,
      latestResult: result,
      history,
      reconnectBundle,
    }),
    expected: {
      pageState: "result",
      resultFound: true,
      resultId: result.id,
      mbtiType: result.mbtiType,
      houseKey: result.house.key,
      dimensionBalances: Object.fromEntries(
        result.dimensions.map((dimension) => [dimension.pair, dimension.balance])
      ),
      historyCount: 1,
    },
  };
}

function buildFixtures(): UiFixture[] {
  const questionCount = questionsByLocale.th.length;
  const coreQuestionCount = questionsByLocale.th.filter(
    (question) => question.module === "core"
  ).length;
  const middleCoreIndex = Math.floor(coreQuestionCount / 2);
  const firstMovieIndex = questionsByLocale.th.findIndex(
    (question) => question.module === "movie"
  );

  assert.ok(firstMovieIndex > 0, "Question bank has no movie module boundary.");

  const quizFixtures = [
    createQuizFixture({
      fixtureId: "quiz-first-core",
      description: "Fresh guest-local quiz at the first core question.",
      locale: "th",
      currentIndex: 0,
      offsetMinutes: 10,
    }),
    createQuizFixture({
      fixtureId: "quiz-middle-core",
      description: "Guest-local quiz with every question before the middle core question answered.",
      locale: "en",
      currentIndex: middleCoreIndex,
      offsetMinutes: 20,
    }),
    createQuizFixture({
      fixtureId: "quiz-first-movie",
      description: "Guest-local quiz at the first movie question after all core answers.",
      locale: "th",
      currentIndex: firstMovieIndex,
      offsetMinutes: 30,
    }),
    createQuizFixture({
      fixtureId: "quiz-final-question",
      description: "Guest-local quiz with only the final question unanswered.",
      locale: "en",
      currentIndex: questionCount - 1,
      offsetMinutes: 40,
    }),
  ];

  const resultFixtures = [
    createResultFixture({
      fixtureId: "result-house-purple",
      description: "Complete INTJ result representing the purple house.",
      locale: "th",
      targetType: "INTJ",
      expectedHouse: "purple",
      offsetMinutes: 100,
      movieSeed: 0,
    }),
    createResultFixture({
      fixtureId: "result-house-green",
      description: "Complete INFJ result representing the green house.",
      locale: "en",
      targetType: "INFJ",
      expectedHouse: "green",
      offsetMinutes: 110,
      movieSeed: 1,
      balancedDimension: "T/F",
    }),
    createResultFixture({
      fixtureId: "result-house-yellow",
      description: "Complete ISTJ result representing the yellow house.",
      locale: "th",
      targetType: "ISTJ",
      expectedHouse: "yellow",
      offsetMinutes: 120,
      movieSeed: 2,
    }),
    createResultFixture({
      fixtureId: "result-house-blue",
      description: "Complete ISTP result representing the blue house.",
      locale: "en",
      targetType: "ISTP",
      expectedHouse: "blue",
      offsetMinutes: 130,
      movieSeed: 3,
    }),
  ];

  const dashboardOneResult = createResult({
    fixtureId: "dashboard-one-result",
    locale: "en",
    targetType: "ENFP",
    expectedHouse: "green",
    offsetMinutes: 200,
    movieSeed: 1,
  });
  const manyResultSpecs = [
    ["ENTP", "purple"],
    ["ENFP", "green"],
    ["ESFJ", "yellow"],
    ["ESTP", "blue"],
    ["INTJ", "purple"],
    ["INFJ", "green"],
    ["ISTJ", "yellow"],
    ["ISTP", "blue"],
  ] as const;
  const dashboardManyResults = manyResultSpecs.map(([targetType, expectedHouse], index) =>
    createResult({
      fixtureId: `dashboard-many-${index + 1}`,
      locale: "th",
      targetType,
      expectedHouse,
      offsetMinutes: 300 - index,
      movieSeed: index,
    })
  );
  const pendingSession = createSession({
    locale: "en",
    currentIndex: middleCoreIndex,
    targetType: "ENFP",
    offsetMinutes: 400,
  });

  const dashboardFixtures: UiFixture[] = [
    {
      fixtureId: "dashboard-empty",
      category: "dashboard",
      description: "Dashboard with no guest result, history, or pending quiz.",
      route: "/dashboard?lang=th",
      locale: "th",
      localStorage: createStorageState({ locale: "th" }),
      expected: {
        pageState: "dashboard",
        latestResultId: null,
        historyCount: 0,
        pendingAnswerCount: 0,
        reconnectReady: false,
      },
    },
    {
      fixtureId: "dashboard-one-result",
      category: "dashboard",
      description: "Dashboard with one latest guest result and one history entry.",
      route: "/dashboard?lang=en",
      locale: "en",
      localStorage: createStorageState({
        locale: "en",
        latestResult: dashboardOneResult,
        history: [dashboardOneResult],
        reconnectBundle: createReconnectBundle({
          locale: "en",
          latestResult: dashboardOneResult,
          history: [dashboardOneResult],
          offsetMinutes: 201,
        }),
      }),
      expected: {
        pageState: "dashboard",
        latestResultId: dashboardOneResult.id,
        historyCount: 1,
        pendingAnswerCount: 0,
        reconnectReady: true,
      },
    },
    {
      fixtureId: "dashboard-many-results",
      category: "dashboard",
      description: "Dashboard at the guest-local eight-result history cap with all houses represented.",
      route: "/dashboard?lang=th",
      locale: "th",
      localStorage: createStorageState({
        locale: "th",
        latestResult: dashboardManyResults[0],
        history: dashboardManyResults,
        reconnectBundle: createReconnectBundle({
          locale: "th",
          latestResult: dashboardManyResults[0],
          history: dashboardManyResults,
          offsetMinutes: 301,
        }),
      }),
      expected: {
        pageState: "dashboard",
        latestResultId: dashboardManyResults[0]?.id ?? null,
        historyCount: 8,
        pendingAnswerCount: 0,
        reconnectReady: true,
        representedHouses: ["purple", "green", "yellow", "blue"],
      },
    },
    {
      fixtureId: "dashboard-pending-quiz",
      category: "dashboard",
      description: "Dashboard with an in-progress guest quiz and no completed result.",
      route: "/dashboard?lang=en",
      locale: "en",
      localStorage: createStorageState({
        locale: "en",
        session: pendingSession,
        reconnectBundle: createReconnectBundle({
          locale: "en",
          session: pendingSession,
          offsetMinutes: 406,
        }),
      }),
      expected: {
        pageState: "dashboard",
        latestResultId: null,
        historyCount: 0,
        pendingAnswerCount: middleCoreIndex,
        pendingQuestionKey: questionsByLocale.en[middleCoreIndex]?.key ?? null,
        reconnectReady: true,
      },
    },
  ];

  const knownResult = createResult({
    fixtureId: "invalid-result-reference",
    locale: "th",
    targetType: "INTJ",
    expectedHouse: "purple",
    offsetMinutes: 500,
  });
  const invalidResultId = "guest-fixture-id-not-in-history";
  const missingResultFixtures: UiFixture[] = [
    {
      fixtureId: "result-invalid-id",
      category: "missing-result",
      description: "Result route requests an id that is absent from otherwise valid guest history.",
      route: `/result/${invalidResultId}?lang=th`,
      locale: "th",
      localStorage: createStorageState({
        locale: "th",
        latestResult: knownResult,
        history: [knownResult],
        reconnectBundle: createReconnectBundle({
          locale: "th",
          latestResult: knownResult,
          history: [knownResult],
          offsetMinutes: 501,
        }),
      }),
      expected: {
        pageState: "missing-result",
        requestedResultId: invalidResultId,
        resolvedResultId: null,
        reason: "id-not-in-history",
        storedResultId: knownResult.id,
      },
    },
    {
      fixtureId: "result-missing-storage",
      category: "missing-result",
      description: "Latest-result route with no guest result or history in localStorage.",
      route: "/result/guest-latest?lang=en",
      locale: "en",
      localStorage: createStorageState({ locale: "en" }),
      expected: {
        pageState: "missing-result",
        requestedResultId: "guest-latest",
        resolvedResultId: null,
        reason: "storage-empty",
        storedResultId: null,
      },
    },
  ];

  return [...quizFixtures, ...resultFixtures, ...dashboardFixtures, ...missingResultFixtures];
}

function parseStorageJson<T>(fixture: UiFixture, key: string): T | null {
  const serialized = fixture.localStorage[key];
  if (serialized === undefined) return null;

  try {
    return JSON.parse(serialized) as T;
  } catch (error) {
    throw new Error(`${fixture.fixtureId} has invalid JSON at ${key}.`, { cause: error });
  }
}

function validateSession(fixture: UiFixture, session: GuestSession) {
  const questions = questionsByLocale[session.locale];
  assert.equal(session.version, "guest-v2", `${fixture.fixtureId} uses a stale session version.`);
  assert.ok(Number.isInteger(session.currentIndex), `${fixture.fixtureId} has a fractional index.`);
  assert.ok(
    session.currentIndex >= 0 && session.currentIndex < questions.length,
    `${fixture.fixtureId} has an out-of-range currentIndex.`
  );
  assert.equal(new Date(session.startedAt).toISOString(), session.startedAt);
  assert.equal(new Date(session.updatedAt).toISOString(), session.updatedAt);

  for (const [questionKey, optionKey] of Object.entries(session.answers)) {
    const question = questions.find((entry) => entry.key === questionKey);
    assert.ok(question, `${fixture.fixtureId} answers unknown question ${questionKey}.`);
    assert.ok(
      question.options.some((option) => option.key === optionKey),
      `${fixture.fixtureId} uses unknown option ${questionKey}:${optionKey}.`
    );
  }

  if (fixture.category === "quiz") {
    assert.equal(
      Object.keys(session.answers).length,
      session.currentIndex,
      `${fixture.fixtureId} must answer every question before currentIndex only.`
    );
    for (const question of questions.slice(0, session.currentIndex)) {
      assert.ok(session.answers[question.key], `${fixture.fixtureId} skips ${question.key}.`);
    }
    assert.equal(
      session.answers[questions[session.currentIndex]?.key ?? ""],
      undefined,
      `${fixture.fixtureId} pre-answers its target question.`
    );
  }
}

function validateResult(fixture: UiFixture, result: GuestResult) {
  const questions = questionsByLocale[result.locale];
  assert.match(result.id, /^guest-fixture-[a-z0-9-]+-[a-z]{4}$/);
  assert.match(result.mbtiType, /^[EI][SN][TF][JP]$/);
  assert.equal(new Date(result.createdAt).toISOString(), result.createdAt);
  assert.ok(result.confidence >= 50 && result.confidence <= 100);
  assert.ok(result.archetypeName.length > 0);
  assert.ok(result.tagline.length > 0);
  assert.ok(result.house.key.length > 0);
  assert.ok(result.animal.key.length > 0);
  assert.ok(result.animal.imagePath.length > 0);
  assert.ok(result.movieProfile.key.length > 0);
  assert.equal(result.dimensions.length, 4);
  assert.equal(result.questionCount, questions.length);
  assert.equal(
    result.coreQuestionCount,
    questions.filter((question) => question.module === "core").length
  );
  assert.equal(
    result.movieQuestionCount,
    questions.filter((question) => question.module === "movie").length
  );
  assert.equal(Object.keys(result.answerMap).length, questions.length);
  assert.equal(result.answerSummary.length, questions.length);
  assert.equal(result.premiumSections.length, 3);

  for (const question of questions) {
    const optionKey = result.answerMap[question.key];
    assert.ok(optionKey, `${fixture.fixtureId} result omits ${question.key}.`);
    assert.ok(
      question.options.some((option) => option.key === optionKey),
      `${fixture.fixtureId} result has invalid ${question.key}:${optionKey}.`
    );
  }
}

function validateReconnectBundle(
  fixture: UiFixture,
  bundle: GuestCloudReconnectBundle,
  session: GuestSession | null,
  latestResult: GuestResult | null,
  history: GuestResult[]
) {
  assert.equal(bundle.version, "guest-cloud-handoff-v1");
  assert.equal(bundle.mode, "guest-local");
  assert.equal(bundle.locale, fixture.locale);
  assert.equal(bundle.latestResult?.id ?? null, latestResult?.id ?? null);
  assert.deepEqual(
    bundle.history.map((result) => result.id),
    history.map((result) => result.id)
  );
  assert.deepEqual(bundle.session, session);
  assert.equal(bundle.summary.latestResultId, latestResult?.id ?? null);
  assert.equal(bundle.summary.historyCount, history.length);
  assert.equal(bundle.summary.inProgressAnswerCount, Object.keys(session?.answers ?? {}).length);
  assert.equal(bundle.summary.hasPendingSession, Boolean(session));
  assert.equal(
    bundle.summary.lastActivityAt,
    session?.updatedAt ?? latestResult?.createdAt ?? history[0]?.createdAt ?? null
  );
}

function validateFixture(fixture: UiFixture) {
  assert.match(fixture.fixtureId, /^[a-z0-9-]+$/);
  assert.ok(fixture.description.length > 0);
  assert.ok(fixture.route.startsWith("/"));
  assert.equal(fixture.localStorage[LOCALE_KEY], fixture.locale);

  for (const key of Object.keys(fixture.localStorage)) {
    assert.ok(
      MANAGED_STORAGE_KEYS.includes(key as (typeof MANAGED_STORAGE_KEYS)[number]),
      `${fixture.fixtureId} writes unmanaged localStorage key ${key}.`
    );
  }

  const session = parseStorageJson<GuestSession>(fixture, GUEST_SESSION_KEY);
  const latestResult = parseStorageJson<GuestResult>(fixture, GUEST_RESULT_KEY);
  const history = parseStorageJson<GuestResult[]>(fixture, GUEST_HISTORY_KEY) ?? [];
  const bundle = parseStorageJson<GuestCloudReconnectBundle>(
    fixture,
    GUEST_CLOUD_HANDOFF_KEY
  );

  if (session) validateSession(fixture, session);
  if (latestResult) validateResult(fixture, latestResult);
  for (const result of history) validateResult(fixture, result);

  assert.ok(history.length <= 8, `${fixture.fixtureId} exceeds the guest history cap.`);
  assert.equal(new Set(history.map((result) => result.id)).size, history.length);
  if (latestResult) {
    assert.equal(
      history[0]?.id,
      latestResult.id,
      `${fixture.fixtureId} latest result must lead history.`
    );
  }
  if (bundle) validateReconnectBundle(fixture, bundle, session, latestResult, history);

  if (fixture.category === "result") {
    assert.ok(latestResult, `${fixture.fixtureId} has no latest result.`);
    assert.equal(fixture.expected.resultId, latestResult.id);
    assert.ok(fixture.route.includes(latestResult.id));
  }

  if (fixture.category === "missing-result") {
    assert.equal(fixture.expected.resolvedResultId, null);
    const requestedResultId = fixture.expected.requestedResultId;
    assert.equal(typeof requestedResultId, "string");
    if (requestedResultId === "guest-latest") {
      assert.equal(latestResult, null);
    } else {
      assert.ok(!history.some((result) => result.id === requestedResultId));
    }
  }

  if (fixture.category === "dashboard") {
    assert.equal(fixture.expected.historyCount, history.length);
    assert.equal(fixture.expected.latestResultId, latestResult?.id ?? null);
    assert.equal(
      fixture.expected.pendingAnswerCount,
      Object.keys(session?.answers ?? {}).length
    );
  }
}

function validateManifest(manifest: FixtureManifest) {
  assert.equal(manifest.version, FIXTURE_VERSION);
  assert.deepEqual(manifest.safety, {
    production: false,
    writesDatabase: false,
    requiresEnvironment: false,
  });
  assert.deepEqual(manifest.managedStorageKeys, MANAGED_STORAGE_KEYS);

  const fixtureIds = manifest.fixtures.map((fixture) => fixture.fixtureId);
  assert.equal(new Set(fixtureIds).size, fixtureIds.length, "Fixture ids must be unique.");

  const requiredFixtureIds = [
    "quiz-first-core",
    "quiz-middle-core",
    "quiz-first-movie",
    "quiz-final-question",
    "result-house-purple",
    "result-house-green",
    "result-house-yellow",
    "result-house-blue",
    "dashboard-empty",
    "dashboard-one-result",
    "dashboard-many-results",
    "dashboard-pending-quiz",
    "result-invalid-id",
    "result-missing-storage",
  ];

  for (const fixtureId of requiredFixtureIds) {
    assert.ok(fixtureIds.includes(fixtureId), `Missing required fixture ${fixtureId}.`);
  }
  for (const fixture of manifest.fixtures) validateFixture(fixture);

  const resultHouses = new Set(
    manifest.fixtures
      .filter((fixture) => fixture.category === "result")
      .map((fixture) => fixture.expected.houseKey)
  );
  assert.deepEqual(resultHouses, new Set(["purple", "green", "yellow", "blue"]));

  const resultBalances = manifest.fixtures
    .filter((fixture) => fixture.category === "result")
    .flatMap((fixture) => Object.values(fixture.expected.dimensionBalances as Record<string, number>));
  assert.ok(resultBalances.some((balance) => balance <= 60), "Result fixtures need a balanced dimension.");
  assert.ok(resultBalances.some((balance) => balance >= 90), "Result fixtures need a decisive dimension.");
}

function createManifest(): FixtureManifest {
  return {
    version: FIXTURE_VERSION,
    generatedAt: GENERATED_AT,
    generator: "scripts/ui-fixtures/generate.ts",
    safety: {
      production: false,
      writesDatabase: false,
      requiresEnvironment: false,
    },
    managedStorageKeys: MANAGED_STORAGE_KEYS,
    fixtures: buildFixtures(),
  };
}

function createInitScript(fixture: UiFixture) {
  const metadata = {
    fixtureId: fixture.fixtureId,
    category: fixture.category,
    route: fixture.route,
    expected: fixture.expected,
  };

  return `(() => {
  const managedKeys = ${JSON.stringify(MANAGED_STORAGE_KEYS, null, 2)};
  const values = ${JSON.stringify(fixture.localStorage, null, 2)};

  for (const key of managedKeys) window.localStorage.removeItem(key);
  for (const [key, value] of Object.entries(values)) window.localStorage.setItem(key, value);

  Object.defineProperty(window, "__MBTI_Z_UI_FIXTURE__", {
    configurable: true,
    value: ${JSON.stringify(metadata, null, 2)},
  });
})();
`;
}

function writeGeneratedFiles(manifest: FixtureManifest) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.rmSync(INIT_SCRIPT_DIR, { recursive: true, force: true });
  fs.mkdirSync(INIT_SCRIPT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  for (const fixture of manifest.fixtures) {
    fs.writeFileSync(
      path.join(INIT_SCRIPT_DIR, `${fixture.fixtureId}.js`),
      createInitScript(fixture),
      "utf8"
    );
  }
}

function printHelp() {
  console.log(`Usage:
  npx --yes tsx scripts/ui-fixtures/generate.ts
  npx --yes tsx scripts/ui-fixtures/generate.ts --check

Default output: scripts/ui-fixtures/generated`);
}

function main() {
  const args = process.argv.slice(2);
  const unknownArgs = args.filter((arg) => !["--check", "--help"].includes(arg));
  assert.deepEqual(unknownArgs, [], `Unknown arguments: ${unknownArgs.join(", ")}`);

  if (args.includes("--help")) {
    printHelp();
    return;
  }

  const firstManifest = createManifest();
  const secondManifest = createManifest();
  validateManifest(firstManifest);
  validateManifest(secondManifest);
  assert.deepEqual(secondManifest, firstManifest, "Fixture generation is not deterministic.");

  if (!args.includes("--check")) writeGeneratedFiles(firstManifest);

  const resultIds = firstManifest.fixtures
    .filter((fixture) => fixture.category === "result")
    .map((fixture) => fixture.expected.resultId);

  console.log(
    JSON.stringify(
      {
        mode: args.includes("--check") ? "check" : "generate",
        fixtureVersion: firstManifest.version,
        fixtureCount: firstManifest.fixtures.length,
        deterministicResultIds: resultIds,
        outputPath: args.includes("--check") ? null : OUTPUT_DIR,
        status: "passed",
      },
      null,
      2
    )
  );
}

main();
