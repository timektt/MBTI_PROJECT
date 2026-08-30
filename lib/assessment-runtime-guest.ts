"use client";

import {
  clearGuestSession,
  computeGuestResult,
  createGuestSession,
  getGuestProgress,
  getGuestQuestions,
  getGuestResultById,
  importGuestCloudReconnectBundle,
  localizeGuestResult,
  normalizeGuestLocale,
  readGuestCloudReconnectBundle,
  readGuestHistory,
  readGuestResult,
  readGuestSession,
  saveGuestAnswer,
  writeGuestResult,
  writeGuestSession,
  type GuestLocale,
  type GuestSession,
} from "@/lib/mbti-guest";
import { parseReconnectBundlePayload } from "@/lib/reconnect-bundle";
import type {
  AssessmentBootstrap,
  AssessmentDashboardState,
  AssessmentReconnectImportResult,
  AssessmentReconnectState,
  AssessmentResultState,
  AssessmentRuntimeAdapter,
  AssessmentRuntimeMode,
  AssessmentRuntimeStatus,
} from "@/lib/assessment-runtime-types";

type GuestRuntimeOptions = {
  configuredMode: AssessmentRuntimeMode;
  fallbackReason?: string | null;
};

function resolveGuestLocale(requestedLocale?: string | null, fallbackLocale?: string | null) {
  return normalizeGuestLocale(requestedLocale ?? fallbackLocale);
}

export function createGuestRuntimeAdapter({
  configuredMode,
  fallbackReason = null,
}: GuestRuntimeOptions): AssessmentRuntimeAdapter {
  function getStatus(): AssessmentRuntimeStatus {
    return {
      configuredMode,
      activeMode: "guest-local",
      cloudReady: false,
      fallbackReason,
    };
  }

  function bootstrapSession(requestedLocale?: string | null): AssessmentBootstrap {
    const storedSession = readGuestSession();
    const locale = resolveGuestLocale(requestedLocale, storedSession?.locale);
    const questions = getGuestQuestions(locale);
    const session =
      storedSession && storedSession.locale === locale
        ? storedSession
        : createGuestSession(locale);

    writeGuestSession(session);

    return {
      locale,
      questions,
      session,
    };
  }

  function resetSession(locale: GuestLocale) {
    const session = createGuestSession(locale);

    clearGuestSession();
    writeGuestSession(session);

    return session;
  }

  function submitSession(session: GuestSession) {
    const result = computeGuestResult(session);

    writeGuestResult(result);
    clearGuestSession();

    return result;
  }

  function getResultState(
    id: string,
    requestedLocale?: string | null
  ): AssessmentResultState {
    const storedResult = getGuestResultById(id);
    const locale = resolveGuestLocale(requestedLocale, storedResult?.locale);

    return {
      locale,
      result: storedResult ? localizeGuestResult(storedResult, locale) : null,
    };
  }

  function getDashboardState(): AssessmentDashboardState {
    const latestResult = readGuestResult();
    const history = readGuestHistory();
    const locale = resolveGuestLocale(
      null,
      latestResult?.locale ?? history[0]?.locale ?? "th"
    );

    return {
      locale,
      latestResult: latestResult ? localizeGuestResult(latestResult, locale) : null,
      history: history.map((entry) => localizeGuestResult(entry, locale)),
    };
  }

  function getReconnectState(): AssessmentReconnectState {
    const bundle = readGuestCloudReconnectBundle();
    const locale = resolveGuestLocale(
      null,
      bundle?.locale ?? bundle?.latestResult?.locale ?? bundle?.history[0]?.locale ?? "th"
    );

    return {
      ready: Boolean(bundle),
      activeMode: "guest-local",
      bundleVersion: bundle?.version ?? null,
      exportedAt: bundle?.exportedAt ?? null,
      locale,
      latestResultId: bundle?.summary.latestResultId ?? null,
      historyCount: bundle?.summary.historyCount ?? 0,
      inProgressAnswerCount: bundle?.summary.inProgressAnswerCount ?? 0,
      hasPendingSession: bundle?.summary.hasPendingSession ?? false,
      lastActivityAt: bundle?.summary.lastActivityAt ?? null,
    };
  }

  function importReconnectBundle(
    serializedBundle: string
  ): AssessmentReconnectImportResult {
    if (typeof window === "undefined" || !window.localStorage) {
      return {
        ok: false,
        code: "storage_unavailable",
        bundle: null,
        reconnectState: null,
        overwritten: false,
      };
    }

    const currentBundle = readGuestCloudReconnectBundle();
    const parsedBundle = parseReconnectBundlePayload(serializedBundle);

    if (!parsedBundle.ok) {
      return {
        ok: false,
        code: parsedBundle.code,
        bundle: currentBundle,
        reconnectState: getReconnectState(),
        overwritten: Boolean(currentBundle),
      };
    }

    const importedBundle = importGuestCloudReconnectBundle(parsedBundle.bundle);

    return {
      ok: true,
      code: "imported",
      bundle: importedBundle,
      reconnectState: getReconnectState(),
      overwritten: Boolean(currentBundle),
    };
  }

  return {
    getStatus,
    resolveLocale: resolveGuestLocale,
    getQuestions: getGuestQuestions,
    bootstrapSession,
    persistSession: writeGuestSession,
    resetSession,
    readSession: readGuestSession,
    readLatestResult: readGuestResult,
    readHistory: readGuestHistory,
    clearSession: clearGuestSession,
    saveAnswer: saveGuestAnswer,
    getProgress: getGuestProgress,
    submitSession,
    getResultById: getGuestResultById,
    localizeResult: localizeGuestResult,
    getResultState,
    getDashboardState,
    getReconnectState,
    exportReconnectBundle: readGuestCloudReconnectBundle,
    importReconnectBundle,
  };
}
