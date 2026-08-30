"use client";

import type {
  GuestCloudReconnectBundle,
  GuestLocale,
  GuestQuestion,
  GuestResult,
  GuestSession,
} from "@/lib/mbti-guest";

export type {
  GuestCloudReconnectBundle,
  GuestLocale,
  GuestQuestion,
  GuestResult,
  GuestSession,
} from "@/lib/mbti-guest";

export type AssessmentRuntimeMode = "guest-local" | "cloud";

export type AssessmentRuntimeStatus = {
  configuredMode: AssessmentRuntimeMode;
  activeMode: AssessmentRuntimeMode;
  cloudReady: boolean;
  fallbackReason: string | null;
};

export type AssessmentBootstrap = {
  locale: GuestLocale;
  questions: GuestQuestion[];
  session: GuestSession;
};

export type AssessmentResultState = {
  locale: GuestLocale;
  result: GuestResult | null;
};

export type AssessmentDashboardState = {
  locale: GuestLocale;
  latestResult: GuestResult | null;
  history: GuestResult[];
};

export type AssessmentReconnectState = {
  ready: boolean;
  activeMode: AssessmentRuntimeMode;
  bundleVersion: GuestCloudReconnectBundle["version"] | null;
  exportedAt: string | null;
  locale: GuestLocale;
  latestResultId: string | null;
  historyCount: number;
  inProgressAnswerCount: number;
  hasPendingSession: boolean;
  lastActivityAt: string | null;
};

export type AssessmentReconnectImportResultCode =
  | "imported"
  | "invalid_json"
  | "invalid_bundle"
  | "storage_unavailable";

export type AssessmentReconnectImportResult = {
  ok: boolean;
  code: AssessmentReconnectImportResultCode;
  bundle: GuestCloudReconnectBundle | null;
  reconnectState: AssessmentReconnectState | null;
  overwritten: boolean;
};

export type AssessmentRuntimeAdapter = {
  getStatus: () => AssessmentRuntimeStatus;
  resolveLocale: (
    requestedLocale?: string | null,
    fallbackLocale?: string | null
  ) => GuestLocale;
  getQuestions: (locale: GuestLocale) => GuestQuestion[];
  bootstrapSession: (requestedLocale?: string | null) => AssessmentBootstrap;
  persistSession: (session: GuestSession) => void;
  resetSession: (locale: GuestLocale) => GuestSession;
  readSession: () => GuestSession | null;
  readLatestResult: () => GuestResult | null;
  readHistory: () => GuestResult[];
  clearSession: () => void;
  saveAnswer: (
    session: GuestSession,
    questionKey: string,
    optionKey: string,
    questions: GuestQuestion[]
  ) => GuestSession;
  getProgress: (session: GuestSession, questionCount: number) => number;
  submitSession: (session: GuestSession) => GuestResult;
  getResultById: (id: string) => GuestResult | null;
  localizeResult: (result: GuestResult, locale: GuestLocale) => GuestResult;
  getResultState: (
    id: string,
    requestedLocale?: string | null
  ) => AssessmentResultState;
  getDashboardState: () => AssessmentDashboardState;
  getReconnectState: () => AssessmentReconnectState;
  exportReconnectBundle: () => GuestCloudReconnectBundle | null;
  importReconnectBundle: (serializedBundle: string) => AssessmentReconnectImportResult;
};
