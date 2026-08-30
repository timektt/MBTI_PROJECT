"use client";

import cloudRuntimeReadiness from "@/data/runtime/cloud-runtime-readiness.json";
import {
  createCloudRuntimeApiClient,
  type CloudAssessmentQuestion,
  type CloudAssessmentAnswerRef,
  type CloudQuizAnswerResponse,
  type CloudQuizStartResponse,
  type CloudQuizSubmitResponse,
  type CloudReconnectBundleImportResponse,
  type CloudRuntimeLocale,
  type CloudRuntimeFetch,
  type CloudSavedResult,
} from "@/lib/assessment-runtime-cloud-client";
import type {
  AssessmentRuntimeAdapter,
  AssessmentRuntimeStatus,
} from "@/lib/assessment-runtime-types";

export const CLOUD_RUNTIME_NOT_READY_REASON =
  "Cloud runtime is configured but no live Supabase-backed assessment adapter is wired yet, so the app is falling back to guest-local mode.";

export const CLOUD_RUNTIME_READINESS = cloudRuntimeReadiness;

export type CloudRuntimeReadiness = typeof CLOUD_RUNTIME_READINESS;

export type CloudRuntimeServiceAdapterOptions = {
  readiness?: CloudRuntimeReadiness;
  baseUrl?: string;
  fetcher?: CloudRuntimeFetch;
};

export type CloudRuntimeServiceAdapter = ReturnType<typeof createCloudRuntimeServiceAdapter> extends infer T
  ? NonNullable<T>
  : never;

export type CloudRuntimeSessionSnapshot = {
  locale: CloudRuntimeLocale;
  sessionId: string;
  progress: number;
  answeredCount: number;
  totalQuestions: number;
  isComplete: boolean;
  currentQuestionIndex: number;
  currentQuestion: CloudAssessmentQuestion | null;
  questions: CloudAssessmentQuestion[];
  answers: CloudAssessmentAnswerRef[];
};

export type CloudRuntimeAnswerState = CloudQuizAnswerResponse & {
  sessionId: string;
  locale: CloudRuntimeLocale | null;
};

export type CloudRuntimeSubmissionState = CloudQuizSubmitResponse & {
  sessionId: string;
};

export type CloudRuntimeDashboardState = {
  locale: CloudRuntimeLocale;
  latestResult: CloudSavedResult | null;
  history: CloudSavedResult[];
};

export type CloudRuntimeReconnectImportState =
  CloudReconnectBundleImportResponse;

function getReadinessBlockerReason(readiness: CloudRuntimeReadiness) {
  return readiness.blockers.map((blocker) => blocker.id).join(", ");
}

function createCloudSessionSnapshot(
  response: CloudQuizStartResponse
): CloudRuntimeSessionSnapshot {
  const answeredQuestionIds = new Set(
    response.answers.map((answer) => answer.questionId)
  );
  const firstUnansweredIndex = response.questions.findIndex(
    (question) => !answeredQuestionIds.has(question.id)
  );
  const currentQuestionIndex =
    firstUnansweredIndex >= 0
      ? firstUnansweredIndex
      : response.questions.length > 0
        ? response.questions.length - 1
        : -1;

  return {
    locale: response.locale,
    sessionId: response.sessionId,
    progress: response.progress,
    answeredCount: response.answers.length,
    totalQuestions: response.questions.length,
    isComplete:
      response.questions.length > 0 &&
      response.answers.length >= response.questions.length,
    currentQuestionIndex,
    currentQuestion:
      currentQuestionIndex >= 0 ? response.questions[currentQuestionIndex] : null,
    questions: response.questions,
    answers: response.answers,
  };
}

export function createCloudRuntimeServiceAdapter({
  readiness = CLOUD_RUNTIME_READINESS,
  baseUrl,
  fetcher,
}: CloudRuntimeServiceAdapterOptions = {}) {
  if (!readiness.implemented) {
    return null;
  }

  const apiClient = createCloudRuntimeApiClient({
    baseUrl,
    fetcher,
  });

  function getStatus(): AssessmentRuntimeStatus {
    return {
      configuredMode: "cloud",
      activeMode: "cloud",
      cloudReady: true,
      fallbackReason: null,
    };
  }

  async function bootstrapSession(locale?: CloudRuntimeLocale) {
    const response = await apiClient.startQuiz(locale);
    return createCloudSessionSnapshot(response);
  }

  async function saveSessionAnswer(input: {
    sessionId: string;
    questionId: string;
    optionId: string;
    locale?: CloudRuntimeLocale;
  }): Promise<CloudRuntimeAnswerState> {
    const response = await apiClient.saveAnswer(input);

    return {
      ...response,
      sessionId: input.sessionId,
      locale: input.locale ?? null,
    };
  }

  async function submitSession(input: {
    sessionId: string;
    locale?: CloudRuntimeLocale;
  }): Promise<CloudRuntimeSubmissionState> {
    const response = await apiClient.submitQuiz(input);

    return {
      ...response,
      sessionId: input.sessionId,
    };
  }

  async function getDashboardState(
    locale?: CloudRuntimeLocale
  ): Promise<CloudRuntimeDashboardState> {
    const response = await apiClient.listResults(locale);
    const resolvedLocale = locale ?? response.results[0]?.locale ?? "th";

    return {
      locale: resolvedLocale,
      latestResult: response.results[0] ?? null,
      history: response.results,
    };
  }

  async function validateReconnectBundleImport(input: {
    bundle: unknown;
    dryRun?: true;
  }): Promise<CloudRuntimeReconnectImportState> {
    return apiClient.validateReconnectBundleImport(input);
  }

  async function importReconnectBundle(input: {
    bundle: unknown;
    overwrite?: boolean;
  }): Promise<CloudRuntimeReconnectImportState> {
    return apiClient.importReconnectBundle(input);
  }

  return {
    getStatus,
    bootstrapSession,
    saveSessionAnswer,
    submitSession,
    getDashboardState,
    validateReconnectBundleImport,
    importReconnectBundle,
    health: apiClient.health,
    startQuiz: apiClient.startQuiz,
    saveAnswer: apiClient.saveAnswer,
    submitQuiz: apiClient.submitQuiz,
    listResults: apiClient.listResults,
  };
}

export function getCloudRuntimeServiceStatus(
  readiness: CloudRuntimeReadiness = CLOUD_RUNTIME_READINESS
): AssessmentRuntimeStatus {
  if (!readiness.implemented) {
    return {
      configuredMode: "cloud",
      activeMode: "guest-local",
      cloudReady: false,
      fallbackReason:
        getReadinessBlockerReason(readiness) || CLOUD_RUNTIME_NOT_READY_REASON,
    };
  }

  return {
    configuredMode: "cloud",
    activeMode: "cloud",
    cloudReady: true,
    fallbackReason: null,
  };
}

export function createCloudRuntimeAdapter(): AssessmentRuntimeAdapter | null {
  if (!CLOUD_RUNTIME_READINESS.implemented) {
    return null;
  }

  // The public page runtime still expects the synchronous AssessmentRuntimeAdapter
  // used by guest-local localStorage. Keep returning null until the cloud page
  // flow is migrated to the async service adapter above.
  return null;
}
