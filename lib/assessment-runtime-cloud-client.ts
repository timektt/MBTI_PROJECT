export type CloudRuntimeLocale = "th" | "en";

export type CloudQuestionKind = "mbti" | "movie";

export type CloudQuestionModule = "core" | "movie";

export type CloudAssessmentQuestion = {
  id: string;
  key: string;
  kind: CloudQuestionKind;
  module: CloudQuestionModule;
  dimension: string;
  prompt: string;
  sortOrder: number;
  poles: {
    left: {
      label: string;
      traitCode: string | null;
    };
    right: {
      label: string;
      traitCode: string | null;
    };
  } | null;
  options: Array<{
    id: string;
    key: string;
    traitCode: string | null;
    metaLabel: string | null;
    label: string;
    weights: Record<string, number> | null;
    movieScores: Record<string, number> | null;
  }>;
};

export type CloudAssessmentAnswerRef = {
  questionId: string;
  optionId: string;
};

export type CloudQuizStartResponse = {
  sessionId: string;
  locale: CloudRuntimeLocale;
  progress: number;
  answers: CloudAssessmentAnswerRef[];
  questions: CloudAssessmentQuestion[];
};

export type CloudQuizAnswerResponse = {
  ok: true;
  answeredCount: number;
  totalQuestions: number;
  progress: number;
  isComplete: boolean;
};

export type CloudQuizSubmitResponse = {
  resultId: string;
  mbtiType: string;
  locale: CloudRuntimeLocale;
  shareSlug: string;
  premiumReportId: string;
  redirectTo: string;
  artifact: CloudResultArtifact;
};

export type CloudResultArtifact = {
  id: string;
  locale: CloudRuntimeLocale;
  mbtiType: string;
  createdAt: string;
  archetypeName: string;
  tagline: string | null;
  summaryTitle: string | null;
  summaryBody: string;
  house: {
    key: string;
    title: string;
    description: string;
    accentFrom: string;
    accentTo: string;
    surface: string;
    imagePath: string;
  } | null;
  animal: {
    key: string;
    name: string;
    imagePath: string;
  } | null;
  movieProfile: {
    key: string;
    title: string;
    summary: string;
    tags: string[];
    scores: Record<string, number>;
    secondaryKeys: string[];
  } | null;
  premiumSections: Array<{
    section: string;
    title: string | null;
    body: string;
  }>;
  premiumStatus: string;
  premiumReportId: string | null;
  shareSlug: string | null;
  publicSharePath: string | null;
  cardId: string | null;
  coverage: {
    source: "cloud-core-v1";
    hasMovieProfile: boolean;
  };
};

export type CloudSavedResult = {
  id: string;
  mbtiType: string;
  locale: CloudRuntimeLocale;
  createdAt: string;
  summary: string | null;
  premiumStatus: string;
  premiumReportId: string | null;
  shareSlug: string | null;
  cardId: string | null;
  artifact: CloudResultArtifact;
};

export type CloudResultsResponse = {
  results: CloudSavedResult[];
};

export type CloudReconnectBundleImportSummary = {
  bundleVersion: "guest-cloud-handoff-v1";
  mode: "guest-local";
  locale: CloudRuntimeLocale;
  exportedAt: string;
  latestResultId: string | null;
  resultType: string | null;
  historyCount: number;
  hasPendingSession: boolean;
  inProgressAnswerCount: number;
  lastActivityAt: string | null;
};

export type CloudReconnectBundleImportResponse = {
  ok: boolean;
  status: "validated" | "conflict" | "imported";
  dryRun: boolean;
  summary: CloudReconnectBundleImportSummary;
  account: {
    existingResultCount: number;
    requiresConflictResolution: boolean;
  };
  imported?: {
    resultCount: number;
    results: Array<{
      sourceResultId: string;
      resultId: string;
      premiumReportId: string;
      shareSlug: string;
      isLatest: boolean;
    }>;
    pendingSession: {
      sessionId: string | null;
      importedAnswerCount: number;
      skippedAnswerCount: number;
    };
  };
};

export type CloudHealthResponse = {
  ok: boolean;
  service: "database";
  environment: string;
  timestamp: string;
};

export type CloudRuntimeFetch = (
  input: string,
  init?: RequestInit
) => Promise<Response>;

export type CloudRuntimeApiClientOptions = {
  baseUrl?: string;
  fetcher?: CloudRuntimeFetch;
};

export class CloudRuntimeApiError extends Error {
  readonly route: string;
  readonly status: number;

  constructor(route: string, status: number, message: string) {
    super(message);
    this.name = "CloudRuntimeApiError";
    this.route = route;
    this.status = status;
  }
}

function resolveFetch(fetcher?: CloudRuntimeFetch): CloudRuntimeFetch {
  if (fetcher) {
    return fetcher;
  }

  if (typeof globalThis.fetch === "function") {
    return globalThis.fetch.bind(globalThis);
  }

  throw new Error("No fetch implementation is available for the cloud runtime API client.");
}

function buildUrl(path: string, baseUrl?: string) {
  if (!baseUrl) {
    return path;
  }

  return new URL(path, baseUrl).toString();
}

function readErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return "Cloud runtime request failed";
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function createCloudRuntimeApiClient({
  baseUrl,
  fetcher,
}: CloudRuntimeApiClientOptions = {}) {
  const requestFetch = resolveFetch(fetcher);

  async function requestJson<TResponse>(
    path: string,
    init: RequestInit = {}
  ): Promise<TResponse> {
    const response = await requestFetch(buildUrl(path, baseUrl), {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
    const payload = await readJson(response);

    if (!response.ok) {
      throw new CloudRuntimeApiError(
        path,
        response.status,
        readErrorMessage(payload)
      );
    }

    return payload as TResponse;
  }

  return {
    health() {
      return requestJson<CloudHealthResponse>("/api/health/db", {
        method: "GET",
      });
    },
    startQuiz(locale?: CloudRuntimeLocale) {
      return requestJson<CloudQuizStartResponse>("/api/quiz/start", {
        method: "POST",
        body: JSON.stringify(locale ? { locale } : {}),
      });
    },
    saveAnswer(input: {
      sessionId: string;
      questionId: string;
      optionId: string;
      locale?: CloudRuntimeLocale;
    }) {
      return requestJson<CloudQuizAnswerResponse>("/api/quiz/answer", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    submitQuiz(input: {
      sessionId: string;
      locale?: CloudRuntimeLocale;
    }) {
      return requestJson<CloudQuizSubmitResponse>("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    listResults(locale?: CloudRuntimeLocale) {
      const query = locale ? `?locale=${encodeURIComponent(locale)}` : "";

      return requestJson<CloudResultsResponse>(`/api/me/results${query}`, {
        method: "GET",
      });
    },
    validateReconnectBundleImport(input: {
      bundle: unknown;
      dryRun?: true;
    }) {
      return requestJson<CloudReconnectBundleImportResponse>(
        "/api/me/reconnect-bundle/import",
        {
          method: "POST",
          body: JSON.stringify({
            ...input,
            dryRun: true,
          }),
        }
      );
    },
    importReconnectBundle(input: {
      bundle: unknown;
      overwrite?: boolean;
    }) {
      return requestJson<CloudReconnectBundleImportResponse>(
        "/api/me/reconnect-bundle/import",
        {
          method: "POST",
          body: JSON.stringify({
            bundle: input.bundle,
            dryRun: false,
            overwrite: input.overwrite ?? false,
          }),
        }
      );
    },
  };
}
