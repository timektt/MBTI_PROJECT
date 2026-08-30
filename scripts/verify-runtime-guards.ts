type RuntimeGuardMode = "guest-local" | "cloud";

function parseMode(argv: string[]): RuntimeGuardMode {
  const modeArg = argv.find((arg) => arg.startsWith("--mode="));
  const requestedMode = modeArg?.split("=").slice(1).join("=");

  if (requestedMode === "guest-local" || requestedMode === "cloud") {
    return requestedMode;
  }

  return process.env.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME === "cloud"
    ? "cloud"
    : "guest-local";
}

async function main() {
  const configuredMode = parseMode(process.argv.slice(2));

  process.env.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME = configuredMode;

  const [{ CLOUD_RUNTIME_READINESS }, { assessmentRuntime }] = await Promise.all([
    import("@/lib/assessment-runtime-cloud"),
    import("@/lib/assessment-runtime"),
  ]);
  const status = assessmentRuntime.getStatus();

  if (configuredMode === "cloud") {
    if (CLOUD_RUNTIME_READINESS.implemented) {
      throw new Error("Runtime guard test expected a blocked cloud readiness manifest.");
    }

    if (status.configuredMode !== "cloud") {
      throw new Error(`Expected configuredMode=cloud, got ${status.configuredMode}.`);
    }

    if (status.activeMode !== "guest-local") {
      throw new Error(`Expected cloud fallback activeMode=guest-local, got ${status.activeMode}.`);
    }

    if (status.cloudReady !== false) {
      throw new Error("Expected cloudReady=false while the cloud adapter is blocked.");
    }

    if (!status.fallbackReason) {
      throw new Error("Expected a fallback reason when cloud mode falls back to guest-local.");
    }
  } else {
    if (status.configuredMode !== "guest-local") {
      throw new Error(`Expected configuredMode=guest-local, got ${status.configuredMode}.`);
    }

    if (status.activeMode !== "guest-local") {
      throw new Error(`Expected activeMode=guest-local, got ${status.activeMode}.`);
    }

    if (status.cloudReady !== false) {
      throw new Error("Expected cloudReady=false for guest-local runtime.");
    }
  }

  console.log(
    JSON.stringify(
      {
        configuredEnv: configuredMode,
        readinessImplemented: CLOUD_RUNTIME_READINESS.implemented,
        manifestStatus: CLOUD_RUNTIME_READINESS.status,
        status,
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
