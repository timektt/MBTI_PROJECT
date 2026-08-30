#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { collectEnvStatus } from "./check-env.mjs";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TARGETS = new Set(["development", "preview", "production"]);

function parseArgs(argv) {
  const parsed = {
    target: "preview",
    file: null,
    json: false,
    strict: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--target=")) {
      parsed.target = arg.split("=")[1] || parsed.target;
      continue;
    }

    if (arg.startsWith("--file=")) {
      parsed.file = arg.split("=")[1] || null;
      continue;
    }

    if (arg === "--json") {
      parsed.json = true;
      continue;
    }

    if (arg === "--strict") {
      parsed.strict = true;
    }
  }

  if (!TARGETS.has(parsed.target)) {
    throw new Error(
      `Unsupported target "${parsed.target}". Use development, preview, or production.`
    );
  }

  return parsed;
}

function read(relativePath) {
  return fs.readFileSync(path.join(APP_ROOT, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(path.join(APP_ROOT, relativePath));
}

function listMigrationDirs() {
  const migrationsRoot = path.join(APP_ROOT, "prisma", "migrations");

  if (!fs.existsSync(migrationsRoot)) {
    return [];
  }

  return fs
    .readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function readRuntimeMode(filePath) {
  if (!filePath) {
    return process.env.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME ?? null;
  }

  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(APP_ROOT, filePath);

  if (!fs.existsSync(absolutePath)) {
    return process.env.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME ?? null;
  }

  const raw = fs.readFileSync(absolutePath, "utf8");
  const line = raw
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith("NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME="));

  if (!line) {
    return process.env.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME ?? null;
  }

  return line.split("=").slice(1).join("=").replace(/^['"]|['"]$/g, "") || null;
}

function sourceIncludesResponseKey(source, key) {
  return new RegExp(`(?:^|[\\s,{])${key}(?:\\s*:|\\s*[,}])`, "m").test(source);
}

function collectMarkerCheck(id, source, markers) {
  const missingMarkers = markers.filter((marker) => !source.includes(marker));

  return {
    id,
    ok: missingMarkers.length === 0,
    missingMarkers,
  };
}

function collectApiShapeChecks(route, source) {
  const mbtiAssessmentSource = exists("lib/mbti-assessment.ts")
    ? read("lib/mbti-assessment.ts")
    : "";
  const reconnectImportSource = exists("lib/reconnect-bundle-cloud-import.ts")
    ? read("lib/reconnect-bundle-cloud-import.ts")
    : "";
  const routeWithReconnectImportSource = `${source}\n${reconnectImportSource}`;

  if (route.path === "/api/quiz/start") {
    return [
      collectMarkerCheck("quiz_start_localizes_mbti_z_question_metadata", source, [
        "questions.map((question) => localizeQuestion(question, locale))",
        "include: {",
        "options: {",
        'orderBy: { key: "asc" }',
      ]),
      collectMarkerCheck("localize_question_returns_ui_metadata", mbtiAssessmentSource, [
        "kind: normalizeQuestionKind",
        "module: normalizeQuestionModule",
        "poles: localizeQuestionPoles",
        "metaLabel: optionMetadata.metaLabel ?? null",
        "weights: readNumericRecord",
        "movieScores: readNumericRecord",
      ]),
    ];
  }

  if (route.path === "/api/quiz/submit") {
    return [
      collectMarkerCheck("quiz_submit_persists_and_returns_score_detail", source, [
        "const computed = computeAssessmentResult",
        "scoreDetail: computed",
        "artifact: buildResultArtifactPayload",
      ]),
      collectMarkerCheck("result_artifact_supports_movie_profile", mbtiAssessmentSource, [
        "const movieProfile = extractMovieProfileFromScoreDetail(scoreDetail, locale)",
        "movieProfile,",
        "hasMovieProfile: movieProfile !== null",
      ]),
    ];
  }

  if (route.path === "/api/me/results") {
    return [
      collectMarkerCheck("results_replay_artifact_from_persisted_score_detail", source, [
        "const artifact = buildResultArtifactPayload",
        "scoreDetail: result.scoreDetail",
        "summary: artifact.summaryBody",
      ]),
      collectMarkerCheck("result_artifact_relocalizes_movie_profile", mbtiAssessmentSource, [
        "function extractMovieProfileFromScoreDetail",
        "buildLocalizedMovieProfile",
        "locale: SupportedLocale",
      ]),
    ];
  }

  if (route.path === "/api/me/reconnect-bundle/import") {
    return [
      collectMarkerCheck("reconnect_import_validates_guest_handoff_bundle", source, [
        "parseReconnectBundlePayload",
        "getReconnectSummaryMismatches",
        'status: "validated"',
        "dryRun: true",
      ]),
      collectMarkerCheck("reconnect_import_persists_with_conflict_guard", source, [
        "parsed.data.dryRun !== false",
        "status: \"imported\"",
        "importReconnectBundleForUser",
        "existingResultCount",
        "requiresConflictResolution",
        "overwrite",
        "status: \"conflict\"",
      ]),
      collectMarkerCheck("reconnect_import_persists_guest_result_artifacts", routeWithReconnectImportSource, [
        "buildImportedScoreDetail",
        "importPendingSession",
        "premiumReport.upsert",
        "shareCard.upsert",
        "eventName: \"reconnect_bundle_imported\"",
        "stableReconnectImportId",
        "prisma.quizResult.count",
      ]),
    ];
  }

  return [];
}

function collectApiContractStatus(route) {
  if (!route.file || !exists(route.file)) {
    return {
      path: route.path ?? "unknown",
      file: route.file ?? null,
      ok: false,
      failures: ["route_file_missing"],
      shapeChecks: [],
    };
  }

  const source = read(route.file);
  const failures = [];

  if (!source.includes(`req.method !== "${route.method}"`)) {
    failures.push("method_guard");
  }

  if (route.auth === "authenticated-user") {
    if (!source.includes("getServerSession") || !source.includes("authOptions")) {
      failures.push("server_session_auth");
    }

    if (!source.includes("session?.user?.id")) {
      failures.push("authenticated_user_id_guard");
    }

    if (!source.includes("res.status(401)")) {
      failures.push("unauthorized_response");
    }
  }

  if (route.rateLimit && !source.includes("rateLimit(")) {
    failures.push("rate_limit");
  }

  if (route.requestSchema && !source.includes(`${route.requestSchema}.safeParse`)) {
    failures.push("request_schema");
  }

  if (route.userScopedPrisma && !source.includes("userId: session.user.id")) {
    failures.push("user_scoped_prisma");
  }

  const responseKeys = Array.isArray(route.responseKeys) ? route.responseKeys : [];
  const missingResponseKeys = responseKeys.filter(
    (key) => !sourceIncludesResponseKey(source, key)
  );

  if (missingResponseKeys.length > 0) {
    failures.push(`response_keys:${missingResponseKeys.join(",")}`);
  }

  const shapeChecks = collectApiShapeChecks(route, source);
  failures.push(
    ...shapeChecks
      .filter((check) => !check.ok)
      .map((check) => `shape_check:${check.id}:${check.missingMarkers.join("|")}`)
  );

  return {
    path: route.path,
    file: route.file,
    ok: failures.length === 0,
    failures,
    shapeChecks,
  };
}

function collectCloudRuntimeReadiness(options) {
  const envStatus = collectEnvStatus({
    file: options.file,
    target: options.target,
  });
  const manifestPath = "data/runtime/cloud-runtime-readiness.json";
  const manifest = exists(manifestPath) ? readJson(manifestPath) : null;
  const cloudAdapterSource = exists("lib/assessment-runtime-cloud.ts")
    ? read("lib/assessment-runtime-cloud.ts")
    : "";
  const runtimeSource = exists("lib/assessment-runtime.ts")
    ? read("lib/assessment-runtime.ts")
    : "";
  const schemaSource = exists("prisma/schema.prisma")
    ? read("prisma/schema.prisma")
    : "";
  const migrationDirs = listMigrationDirs();
  const runtimeMode = readRuntimeMode(options.file);
  const requiredApiRoutes = Array.isArray(manifest?.requiredApiRoutes)
    ? manifest.requiredApiRoutes
    : [];
  const requiredDataModels = Array.isArray(manifest?.requiredDataModels)
    ? manifest.requiredDataModels
    : [];
  const apiContractStatus = requiredApiRoutes.map(collectApiContractStatus);
  const failedApiContracts = apiContractStatus.filter((route) => !route.ok);
  const apiShapeChecks = apiContractStatus.flatMap((route) => route.shapeChecks);
  const failedApiShapeChecks = apiShapeChecks.filter((check) => !check.ok);
  const missingApiRoutes = requiredApiRoutes.filter(
    (route) => !route.file || !exists(route.file)
  );
  const missingDataModels = requiredDataModels.filter(
    (model) => !new RegExp(`model\\s+${model}\\s+\\{`).test(schemaSource)
  );
  const cloudAdapterImplemented = Boolean(manifest?.implemented);
  const manifestBlockers = Array.isArray(manifest?.blockers) ? manifest.blockers : [];

  const checks = [
    {
      id: "cloud_readiness_manifest_present",
      ok: Boolean(manifest),
      detail: manifestPath,
    },
    {
      id: "cloud_adapter_file_present",
      ok: Boolean(cloudAdapterSource),
      detail: "lib/assessment-runtime-cloud.ts",
    },
    {
      id: "cloud_adapter_manifest_linked",
      ok: cloudAdapterSource.includes("CLOUD_RUNTIME_READINESS"),
      detail: "cloud adapter should read the manifest before enabling cloud mode",
    },
    {
      id: "cloud_service_adapter_factory_present",
      ok:
        cloudAdapterSource.includes("createCloudRuntimeServiceAdapter") &&
        cloudAdapterSource.includes("createCloudRuntimeApiClient"),
      detail: "cloud service adapter should bind the future cloud adapter to the API client contract",
    },
    {
      id: "cloud_service_adapter_manifest_guarded",
      ok:
        cloudAdapterSource.includes("!readiness.implemented") &&
        cloudAdapterSource.includes("return null"),
      detail: "cloud service adapter should not instantiate while the manifest is blocked",
    },
    {
      id: "cloud_adapter_implemented",
      ok: cloudAdapterImplemented,
      detail: cloudAdapterImplemented
        ? "readiness manifest marks the cloud adapter as implemented"
        : "readiness manifest marks the cloud adapter as blocked",
    },
    {
      id: "cloud_manifest_blockers_declared",
      ok: cloudAdapterImplemented || manifestBlockers.length > 0,
      detail: `${manifestBlockers.length} manifest blockers`,
    },
    {
      id: "guest_fallback_present",
      ok:
        runtimeSource.includes("CLOUD_RUNTIME_NOT_READY_REASON") &&
        runtimeSource.includes("createGuestRuntimeAdapter"),
      detail: "cloud mode should fall back to guest-local until the adapter is real",
    },
    {
      id: "prisma_schema_present",
      ok: exists("prisma/schema.prisma"),
      detail: "prisma/schema.prisma",
    },
    {
      id: "prisma_migrations_present",
      ok: migrationDirs.length > 0,
      detail: `${migrationDirs.length} migration directories`,
    },
    {
      id: "required_cloud_api_routes_present",
      ok: missingApiRoutes.length === 0,
      detail:
        missingApiRoutes.length === 0
          ? `${requiredApiRoutes.length} required API routes present`
          : missingApiRoutes.map((route) => route.file).join(", "),
    },
    {
      id: "required_cloud_api_contracts_present",
      ok: failedApiContracts.length === 0,
      detail:
        failedApiContracts.length === 0
          ? `${apiContractStatus.length} required API route contracts pass static checks`
          : failedApiContracts
              .map((route) => `${route.file}: ${route.failures.join(", ")}`)
              .join("; "),
    },
    {
      id: "required_cloud_api_shape_checks_present",
      ok: failedApiShapeChecks.length === 0,
      detail:
        failedApiShapeChecks.length === 0
          ? `${apiShapeChecks.length} nested UI-facing API shape checks pass`
          : failedApiShapeChecks
              .map((check) => `${check.id}: ${check.missingMarkers.join(", ")}`)
              .join("; "),
    },
    {
      id: "required_cloud_data_models_present",
      ok: missingDataModels.length === 0,
      detail:
        missingDataModels.length === 0
          ? `${requiredDataModels.length} required Prisma models present`
          : missingDataModels.join(", "),
    },
    {
      id: "env_deploy_ready",
      ok: envStatus.ok,
      detail: envStatus.ok
        ? "environment is deploy-ready for target"
        : `${envStatus.missing.length} missing keys, ${envStatus.blockingWarnings.length} blocking warnings`,
    },
    {
      id: "runtime_not_cloud_until_adapter_ready",
      ok: cloudAdapterImplemented || runtimeMode !== "cloud",
      detail: "do not enable cloud runtime before the adapter is implemented",
    },
  ];

  const blockers = checks.filter((check) => !check.ok);

  return {
    generatedAt: new Date().toISOString(),
    appRoot: APP_ROOT,
    target: options.target,
    envSource: envStatus.source,
    ok: blockers.length === 0,
    summary: {
      cloudAdapterImplemented,
      manifestStatus: manifest?.status ?? "missing",
      manifestBlockerIds: manifestBlockers.map((blocker) => blocker.id),
      requiredApiRouteCount: requiredApiRoutes.length,
      apiContractCount: apiContractStatus.length,
      apiContractFailureCount: failedApiContracts.length,
      apiShapeCheckCount: apiShapeChecks.length,
      apiShapeCheckFailureCount: failedApiShapeChecks.length,
      requiredDataModelCount: requiredDataModels.length,
      migrationCount: migrationDirs.length,
      envOk: envStatus.ok,
      runtimeMode: runtimeMode ?? "not-set",
      missingEnvCount: envStatus.missing.length,
      blockingEnvWarningCount: envStatus.blockingWarnings.length,
      blockerCount: blockers.length,
    },
    checks,
    apiContracts: apiContractStatus,
    blockers,
  };
}

function printHuman(status) {
  console.log(`MBTI cloud runtime readiness target: ${status.target}`);
  console.log(`Env source: ${status.envSource ?? "process.env"}`);
  console.log("");
  console.log("Checks:");

  for (const check of status.checks) {
    const state = check.ok ? "OK" : "BLOCKER";
    console.log(`  - ${check.id}: ${state} (${check.detail})`);
  }

  console.log("");

  if (!status.ok) {
    console.log("Cloud runtime is not ready yet.");
    return;
  }

  console.log("Cloud runtime is ready.");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const status = collectCloudRuntimeReadiness(options);

  if (options.json) {
    console.log(JSON.stringify(status, null, 2));
  } else {
    printHuman(status);
  }

  if (options.strict && !status.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { collectCloudRuntimeReadiness };
