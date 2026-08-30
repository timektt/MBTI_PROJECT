"use client";

import {
  CLOUD_RUNTIME_NOT_READY_REASON,
  createCloudRuntimeAdapter,
} from "@/lib/assessment-runtime-cloud";
import { createGuestRuntimeAdapter } from "@/lib/assessment-runtime-guest";
import type { AssessmentRuntimeAdapter, AssessmentRuntimeMode } from "@/lib/assessment-runtime-types";

export type {
  AssessmentBootstrap,
  AssessmentDashboardState,
  AssessmentReconnectImportResult,
  AssessmentReconnectImportResultCode,
  AssessmentReconnectState,
  AssessmentResultState,
  AssessmentRuntimeAdapter,
  AssessmentRuntimeMode,
  AssessmentRuntimeStatus,
  GuestCloudReconnectBundle,
  GuestLocale,
  GuestQuestion,
  GuestResult,
  GuestSession,
} from "@/lib/assessment-runtime-types";

function normalizeConfiguredMode(value?: string): AssessmentRuntimeMode {
  return value === "cloud" ? "cloud" : "guest-local";
}

function createAssessmentRuntime(): AssessmentRuntimeAdapter {
  const configuredMode = normalizeConfiguredMode(
    process.env.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME
  );

  if (configuredMode === "cloud") {
    const cloudAdapter = createCloudRuntimeAdapter();

    if (cloudAdapter) {
      return cloudAdapter;
    }

    return createGuestRuntimeAdapter({
      configuredMode,
      fallbackReason: CLOUD_RUNTIME_NOT_READY_REASON,
    });
  }

  return createGuestRuntimeAdapter({
    configuredMode,
  });
}

export const assessmentRuntime = createAssessmentRuntime();

export function getAssessmentRuntimeStatus() {
  return assessmentRuntime.getStatus();
}
