#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  UI_ROUTE_STATE_MANIFEST,
  UI_VIEWPORT_TIERS,
} from "../data/ui/route-state-manifest.mjs";
import { collectUiRouteStateManifestStatus } from "./verify-ui-route-state-manifest.mjs";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUDIT_DATE = "2026-07-15";
const DEFAULT_REPORT_PATH =
  "output/ui-skills-router/2026-07-15/v2-08-full-quality/audit-report.json";
const DEFAULT_CURRENT_BROWSER_REPORT_PATH =
  "output/ui-skills-router/2026-07-16/v2-10-completion-audit/project-matrix-report.json";
const DATED_EVIDENCE_ROOT = path.join(
  APP_ROOT,
  "output/ui-skills-router/2026-07-15"
);
const EXPECTED_ROUTE_COUNT = 30;
const FAILURE_FIELDS = [
  "domFailures",
  "a11yFailures",
  "networkFailures",
  "runtimeFailures",
];
const REQUIRED_COMMAND_GATES = [
  "npm run ui:manifest:verify",
  "npm run assets:verify",
  "npm run data:validate",
  "npm run reconnect:verify",
  "npm run runtime:guards",
  "npm run auth:surface",
  "npm run typecheck",
  "npm run lint",
  "npm run build",
  "git diff --check",
  "npm run ui:route-sweep:verify",
  "npm run ui:completion",
];
const CURRENT_BROWSER_SOURCE_PATHS = [
  "pages",
  "components",
  "styles",
  "data/ui",
  "scripts/ui-fixtures",
  "public/mbti-z",
  "tailwind.config.js",
  "next.config.ts",
];

function parseArgs(argv) {
  const parsed = {
    report: DEFAULT_REPORT_PATH,
    currentBrowserReport: DEFAULT_CURRENT_BROWSER_REPORT_PATH,
  };

  for (const arg of argv) {
    if (arg.startsWith("--report=")) {
      parsed.report = arg.split("=").slice(1).join("=") || parsed.report;
    } else if (arg.startsWith("--current-browser-report=")) {
      parsed.currentBrowserReport =
        arg.split("=").slice(1).join("=") || parsed.currentBrowserReport;
    }
  }

  return parsed;
}

function latestModifiedTime(filePath) {
  const stat = fs.statSync(filePath);

  if (!stat.isDirectory()) {
    return stat.mtimeMs;
  }

  return fs.readdirSync(filePath, { withFileTypes: true }).reduce(
    (latest, entry) =>
      Math.max(latest, latestModifiedTime(path.join(filePath, entry.name))),
    stat.mtimeMs
  );
}

function latestUiSourceModifiedTime() {
  return CURRENT_BROWSER_SOURCE_PATHS.reduce((latest, sourcePath) => {
    const resolvedSourcePath = absolutePath(sourcePath);

    return fs.existsSync(resolvedSourcePath)
      ? Math.max(latest, latestModifiedTime(resolvedSourcePath))
      : latest;
  }, 0);
}

function absolutePath(relativeOrAbsolutePath) {
  return path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.join(APP_ROOT, relativeOrAbsolutePath);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates].sort();
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

function expectedViewportCount() {
  return UI_ROUTE_STATE_MANIFEST.reduce(
    (count, route) => count + (UI_VIEWPORT_TIERS[route.viewportTier]?.length ?? 0),
    0
  );
}

function expectedActiveStateCount() {
  return UI_ROUTE_STATE_MANIFEST.filter((route) => route.status === "active").reduce(
    (count, route) => count + route.requiredStates.length,
    0
  );
}

function validateEmptyFailureArrays(container, label, failures) {
  for (const field of FAILURE_FIELDS) {
    const listedFailures = container?.[field];

    if (!Array.isArray(listedFailures)) {
      failures.push(`${label}:${field}:not_array`);
    } else if (listedFailures.length > 0) {
      failures.push(`${label}:${field}:${listedFailures.length}`);
    }
  }
}

function isInsideDatedEvidenceRoot(filePath) {
  const relativePath = path.relative(DATED_EVIDENCE_ROOT, filePath);

  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

function validateEvidenceFile(value, label, failures, { imageOnly = false } = {}) {
  if (typeof value !== "string" || value.trim().length === 0) {
    failures.push(`${label}:path_invalid`);
    return;
  }

  const filePath = absolutePath(value);

  if (!isInsideDatedEvidenceRoot(filePath)) {
    failures.push(`${label}:outside_dated_output:${value}`);
    return;
  }

  if (imageOnly && !/\.(?:png|jpe?g|webp)$/i.test(filePath)) {
    failures.push(`${label}:not_image:${value}`);
  }

  try {
    if (!fs.statSync(filePath).isFile()) {
      failures.push(`${label}:not_file:${value}`);
    }
  } catch {
    failures.push(`${label}:missing:${value}`);
  }
}

function validateViewportEvidence(route, result, failures) {
  const label = `route:${route.routePattern}`;
  const expectedViewports = UI_VIEWPORT_TIERS[route.viewportTier] ?? [];
  const evidence = Array.isArray(result.viewportEvidence)
    ? result.viewportEvidence
    : [];

  if (!Array.isArray(result.viewportEvidence)) {
    failures.push(`${label}:viewport_evidence:not_array`);
  }

  const actualViewports = evidence
    .map((entry) => entry?.viewport)
    .filter((viewport) => typeof viewport === "string");

  for (const viewport of duplicateValues(actualViewports)) {
    failures.push(`${label}:viewport_duplicate:${viewport}`);
  }

  for (const viewport of difference(expectedViewports, actualViewports)) {
    failures.push(`${label}:viewport_missing:${viewport}`);
  }

  for (const viewport of difference(actualViewports, expectedViewports)) {
    failures.push(`${label}:viewport_extra:${viewport}`);
  }

  if (evidence.length !== expectedViewports.length) {
    failures.push(
      `${label}:viewport_evidence_count:${evidence.length}:${expectedViewports.length}`
    );
  }

  evidence.forEach((entry, index) => {
    const viewportLabel = `${label}:viewport:${entry?.viewport ?? `index-${index}`}`;

    if (!isRecord(entry)) {
      failures.push(`${viewportLabel}:entry_invalid`);
      return;
    }

    if (entry.statusCode !== 200) {
      failures.push(`${viewportLabel}:status_code:${entry.statusCode ?? "missing"}`);
    }

    validateEvidenceFile(entry.screenshot, `${viewportLabel}:screenshot`, failures, {
      imageOnly: true,
    });
    validateEmptyFailureArrays(entry, viewportLabel, failures);
  });
}

function validateStateEvidence(route, result, failures) {
  if (route.status !== "active") {
    return;
  }

  const label = `route:${route.routePattern}`;
  const evidence = Array.isArray(result.stateEvidence) ? result.stateEvidence : [];

  if (!Array.isArray(result.stateEvidence)) {
    failures.push(`${label}:state_evidence:not_array`);
  }

  const actualStates = evidence
    .map((entry) => entry?.state)
    .filter((state) => typeof state === "string");

  for (const state of duplicateValues(actualStates)) {
    failures.push(`${label}:state_duplicate:${state}`);
  }

  for (const state of difference(route.requiredStates, actualStates)) {
    failures.push(`${label}:state_missing:${state}`);
  }

  for (const state of difference(actualStates, route.requiredStates)) {
    failures.push(`${label}:state_extra:${state}`);
  }

  if (evidence.length !== route.requiredStates.length) {
    failures.push(
      `${label}:state_evidence_count:${evidence.length}:${route.requiredStates.length}`
    );
  }

  evidence.forEach((entry, index) => {
    const stateLabel = `${label}:state:${entry?.state ?? `index-${index}`}`;

    if (!isRecord(entry)) {
      failures.push(`${stateLabel}:entry_invalid`);
      return;
    }

    validateEvidenceFile(entry.evidence, `${stateLabel}:evidence`, failures);
  });
}

function validateRouteResults(report, failures) {
  const routeResults = Array.isArray(report.routeResults) ? report.routeResults : [];

  if (!Array.isArray(report.routeResults)) {
    failures.push("route_results:not_array");
  }

  if (routeResults.length !== EXPECTED_ROUTE_COUNT) {
    failures.push(`route_result_count:${routeResults.length}:${EXPECTED_ROUTE_COUNT}`);
  }

  const routePatterns = routeResults
    .map((result) => result?.routePattern)
    .filter((routePattern) => typeof routePattern === "string");

  for (const routePattern of duplicateValues(routePatterns)) {
    failures.push(`route_result_duplicate:${routePattern}`);
  }

  const resultsByPattern = new Map(
    routeResults
      .filter((result) => isRecord(result) && typeof result.routePattern === "string")
      .map((result) => [result.routePattern, result])
  );
  const manifestPatterns = UI_ROUTE_STATE_MANIFEST.map((route) => route.routePattern);

  for (const routePattern of difference(manifestPatterns, routePatterns)) {
    failures.push(`route_result_missing:${routePattern}`);
  }

  for (const routePattern of difference(routePatterns, manifestPatterns)) {
    failures.push(`route_result_extra:${routePattern}`);
  }

  for (const route of UI_ROUTE_STATE_MANIFEST) {
    const result = resultsByPattern.get(route.routePattern);

    if (!result) {
      continue;
    }

    for (const field of ["samplePath", "family", "status", "viewportTier"]) {
      if (result[field] !== route[field]) {
        failures.push(
          `route:${route.routePattern}:${field}:${result[field] ?? "missing"}:${route[field]}`
        );
      }
    }

    validateViewportEvidence(route, result, failures);
    validateStateEvidence(route, result, failures);
  }

  return routeResults;
}

function validateDynamicRouteSamples(report, failures) {
  const expectedSamples = UI_ROUTE_STATE_MANIFEST.filter((route) =>
    route.routePattern.includes("[")
  );
  const samples = Array.isArray(report.dynamicRouteSamples)
    ? report.dynamicRouteSamples
    : [];

  if (!Array.isArray(report.dynamicRouteSamples)) {
    failures.push("dynamic_route_samples:not_array");
  }

  if (samples.length !== expectedSamples.length) {
    failures.push(
      `dynamic_route_sample_count:${samples.length}:${expectedSamples.length}`
    );
  }

  const samplePatterns = samples
    .map((sample) => sample?.routePattern)
    .filter((routePattern) => typeof routePattern === "string");

  for (const routePattern of duplicateValues(samplePatterns)) {
    failures.push(`dynamic_route_sample_duplicate:${routePattern}`);
  }

  const samplesByPattern = new Map(
    samples
      .filter((sample) => isRecord(sample) && typeof sample.routePattern === "string")
      .map((sample) => [sample.routePattern, sample])
  );

  for (const route of expectedSamples) {
    const sample = samplesByPattern.get(route.routePattern);

    if (!sample) {
      failures.push(`dynamic_route_sample_missing:${route.routePattern}`);
    } else if (sample.samplePath !== route.samplePath) {
      failures.push(
        `dynamic_route_sample_mismatch:${route.routePattern}:${sample.samplePath ?? "missing"}:${route.samplePath}`
      );
    }
  }

  for (const routePattern of difference(
    samplePatterns,
    expectedSamples.map((route) => route.routePattern)
  )) {
    failures.push(`dynamic_route_sample_extra:${routePattern}`);
  }

  return samples;
}

function validateCommandGates(report, failures) {
  if (!isRecord(report.commandGates)) {
    failures.push("command_gates:not_object");
    return;
  }

  for (const command of REQUIRED_COMMAND_GATES) {
    if (!Object.hasOwn(report.commandGates, command)) {
      failures.push(`command_gate_missing:${command}`);
    } else if (typeof report.commandGates[command] !== "boolean") {
      failures.push(`command_gate_not_boolean:${command}`);
    } else if (report.commandGates[command] !== true) {
      failures.push(`command_gate_failed:${command}`);
    }
  }

  for (const [command, passed] of Object.entries(report.commandGates)) {
    if (REQUIRED_COMMAND_GATES.includes(command)) {
      continue;
    }

    if (typeof passed !== "boolean") {
      failures.push(`command_gate_not_boolean:${command}`);
    } else if (passed !== true) {
      failures.push(`command_gate_failed:${command}`);
    }
  }
}

function validateReportMetadata(report, failures) {
  if (report.ok !== true) {
    failures.push("report_not_ok");
  }

  if (report.batch !== "E") {
    failures.push(`batch:${report.batch ?? "missing"}:E`);
  }

  if (report.auditDate !== AUDIT_DATE) {
    failures.push(`audit_date:${report.auditDate ?? "missing"}:${AUDIT_DATE}`);
  }

  if (
    typeof report.generatedAt !== "string" ||
    Number.isNaN(Date.parse(report.generatedAt))
  ) {
    failures.push("generated_at:invalid");
  }

  if (report.runtimeMode !== "guest-local") {
    failures.push(`runtime_mode:${report.runtimeMode ?? "missing"}:guest-local`);
  }

  if (report.routeCount !== EXPECTED_ROUTE_COUNT) {
    failures.push(
      `report_route_count:${report.routeCount ?? "missing"}:${EXPECTED_ROUTE_COUNT}`
    );
  }

  const viewportCount = expectedViewportCount();

  if (report.sampleCount !== viewportCount) {
    failures.push(
      `report_sample_count:${report.sampleCount ?? "missing"}:${viewportCount}`
    );
  }

  const activeStateCount = expectedActiveStateCount();

  if (report.activeStateEvidenceCount !== activeStateCount) {
    failures.push(
      `report_active_state_evidence_count:${report.activeStateEvidenceCount ?? "missing"}:${activeStateCount}`
    );
  }

  if (!Array.isArray(report.failures)) {
    failures.push("failures:not_array");
  } else if (report.failures.length > 0) {
    failures.push(`failures:${report.failures.length}`);
  }

  validateEmptyFailureArrays(report, "report", failures);
}

function validateCurrentBrowserReport(report, reportPath, failures) {
  const expectedSampleCount = expectedViewportCount();

  if (!isRecord(report)) {
    failures.push("current_browser:report:not_object");
    return;
  }

  if (report.passed !== true) {
    failures.push("current_browser:report_not_passed");
  }
  if (report.routeCount !== EXPECTED_ROUTE_COUNT) {
    failures.push(
      `current_browser:route_count:${report.routeCount ?? "missing"}:${EXPECTED_ROUTE_COUNT}`
    );
  }
  if (report.sampleCount !== expectedSampleCount) {
    failures.push(
      `current_browser:sample_count:${report.sampleCount ?? "missing"}:${expectedSampleCount}`
    );
  }
  if (!Array.isArray(report.failures)) {
    failures.push("current_browser:failures:not_array");
  } else if (report.failures.length > 0) {
    failures.push(`current_browser:failures:${report.failures.length}`);
  }

  const generatedAt = Date.parse(report.generatedAt);

  if (Number.isNaN(generatedAt)) {
    failures.push("current_browser:generated_at:invalid");
  } else {
    const latestSourceMtime = latestUiSourceModifiedTime();

    if (generatedAt < latestSourceMtime) {
      failures.push(
        `current_browser:stale:${new Date(generatedAt).toISOString()}:${new Date(latestSourceMtime).toISOString()}`
      );
    }
  }

  const samples = Array.isArray(report.samples) ? report.samples : [];

  if (!Array.isArray(report.samples)) {
    failures.push("current_browser:samples:not_array");
  }
  if (samples.length !== expectedSampleCount) {
    failures.push(
      `current_browser:samples:length:${samples.length}:${expectedSampleCount}`
    );
  }

  const samplesByRoute = new Map();

  for (const sample of samples) {
    const routePattern = sample?.routePattern;

    if (typeof routePattern !== "string") {
      failures.push("current_browser:sample:route_pattern_missing");
      continue;
    }

    const routeSamples = samplesByRoute.get(routePattern) ?? [];
    routeSamples.push(sample);
    samplesByRoute.set(routePattern, routeSamples);
  }

  for (const route of UI_ROUTE_STATE_MANIFEST) {
    const routeSamples = samplesByRoute.get(route.routePattern) ?? [];
    const expectedViewports = UI_VIEWPORT_TIERS[route.viewportTier] ?? [];
    const actualViewports = routeSamples
      .map((sample) => sample?.viewport?.name)
      .filter((viewport) => typeof viewport === "string");

    for (const viewport of difference(expectedViewports, actualViewports)) {
      failures.push(
        `current_browser:${route.routePattern}:viewport_missing:${viewport}`
      );
    }
    for (const viewport of difference(actualViewports, expectedViewports)) {
      failures.push(
        `current_browser:${route.routePattern}:viewport_extra:${viewport}`
      );
    }
    for (const viewport of duplicateValues(actualViewports)) {
      failures.push(
        `current_browser:${route.routePattern}:viewport_duplicate:${viewport}`
      );
    }

    for (const sample of routeSamples) {
      const label = `current_browser:${route.routePattern}:${sample?.viewport?.name ?? "unknown"}`;

      if (sample.statusCode !== 200) failures.push(`${label}:status:${sample.statusCode}`);
      if (sample.horizontalOverflow !== false) failures.push(`${label}:horizontal_overflow`);
      if (sample.mainCount !== 1) failures.push(`${label}:main_count:${sample.mainCount}`);
      if (sample.h1Count !== 1) failures.push(`${label}:h1_count:${sample.h1Count}`);
      if (sample.frameworkOverlay !== false) failures.push(`${label}:framework_overlay`);

      for (const field of [
        "undersizedPrimaryControls",
        "consoleErrors",
        "pageErrors",
      ]) {
        if (!Array.isArray(sample[field])) {
          failures.push(`${label}:${field}:not_array`);
        } else if (sample[field].length > 0) {
          failures.push(`${label}:${field}:${sample[field].length}`);
        }
      }

      if (typeof sample.screenshot !== "string" || sample.screenshot.length === 0) {
        failures.push(`${label}:screenshot:invalid`);
      } else {
        const screenshotPath = absolutePath(sample.screenshot);

        if (!fs.existsSync(screenshotPath) || !fs.statSync(screenshotPath).isFile()) {
          failures.push(`${label}:screenshot:missing:${sample.screenshot}`);
        }
      }
    }
  }

  for (const routePattern of difference(
    [...samplesByRoute.keys()],
    UI_ROUTE_STATE_MANIFEST.map((route) => route.routePattern)
  )) {
    failures.push(`current_browser:route_extra:${routePattern}`);
  }

  if (!fs.existsSync(reportPath)) {
    failures.push(`current_browser:report_missing:${path.relative(APP_ROOT, reportPath)}`);
  }
}

export function collectUiV2QualityStatus(options = {}) {
  const reportPath = options.report ?? DEFAULT_REPORT_PATH;
  const resolvedReportPath = absolutePath(reportPath);
  const currentBrowserReportPath = absolutePath(
    options.currentBrowserReport ?? DEFAULT_CURRENT_BROWSER_REPORT_PATH
  );
  const manifest = collectUiRouteStateManifestStatus();
  const failures = manifest.failures.map((failure) => `manifest:${failure}`);
  let report;
  let currentBrowserReport;

  try {
    report = JSON.parse(fs.readFileSync(resolvedReportPath, "utf8"));
  } catch (error) {
    failures.push(
      fs.existsSync(resolvedReportPath)
        ? `report_invalid_json:${error.message}`
        : `report_missing:${path.relative(APP_ROOT, resolvedReportPath)}`
    );

    return {
      ok: false,
      reportPath: path.relative(APP_ROOT, resolvedReportPath),
      expectedRouteCount: EXPECTED_ROUTE_COUNT,
      auditedRouteCount: null,
      expectedSampleCount: expectedViewportCount(),
      auditedSampleCount: null,
      expectedActiveStateEvidenceCount: expectedActiveStateCount(),
      auditedActiveStateEvidenceCount: null,
      manifest,
      failures,
    };
  }

  if (!isRecord(report)) {
    failures.push("report:not_object");
  } else {
    validateReportMetadata(report, failures);
    validateRouteResults(report, failures);
    validateDynamicRouteSamples(report, failures);
    validateCommandGates(report, failures);
  }

  try {
    currentBrowserReport = JSON.parse(
      fs.readFileSync(currentBrowserReportPath, "utf8")
    );
    validateCurrentBrowserReport(
      currentBrowserReport,
      currentBrowserReportPath,
      failures
    );
  } catch (error) {
    failures.push(
      fs.existsSync(currentBrowserReportPath)
        ? `current_browser:report_invalid_json:${error.message}`
        : `current_browser:report_missing:${path.relative(APP_ROOT, currentBrowserReportPath)}`
    );
  }

  const routeResults = Array.isArray(report?.routeResults) ? report.routeResults : [];
  const auditedSampleCount = routeResults.reduce(
    (count, result) =>
      count + (Array.isArray(result?.viewportEvidence) ? result.viewportEvidence.length : 0),
    0
  );
  const activeRoutePatterns = new Set(
    UI_ROUTE_STATE_MANIFEST.filter((route) => route.status === "active").map(
      (route) => route.routePattern
    )
  );
  const auditedActiveStateEvidenceCount = routeResults.reduce(
    (count, result) =>
      count +
      (activeRoutePatterns.has(result?.routePattern) && Array.isArray(result?.stateEvidence)
        ? result.stateEvidence.length
        : 0),
    0
  );

  if (auditedSampleCount !== expectedViewportCount()) {
    failures.push(
      `audited_sample_count:${auditedSampleCount}:${expectedViewportCount()}`
    );
  }

  if (auditedActiveStateEvidenceCount !== expectedActiveStateCount()) {
    failures.push(
      `audited_active_state_evidence_count:${auditedActiveStateEvidenceCount}:${expectedActiveStateCount()}`
    );
  }

  return {
    ok: manifest.ok && failures.length === 0,
    reportPath: path.relative(APP_ROOT, resolvedReportPath),
    expectedRouteCount: EXPECTED_ROUTE_COUNT,
    auditedRouteCount: routeResults.length,
    expectedSampleCount: expectedViewportCount(),
    auditedSampleCount,
    expectedActiveStateEvidenceCount: expectedActiveStateCount(),
    auditedActiveStateEvidenceCount,
    requiredCommandGateCount: REQUIRED_COMMAND_GATES.length,
    currentBrowser: {
      reportPath: path.relative(APP_ROOT, currentBrowserReportPath),
      routeCount: currentBrowserReport?.routeCount ?? null,
      sampleCount: currentBrowserReport?.sampleCount ?? null,
      generatedAt: currentBrowserReport?.generatedAt ?? null,
      passed: currentBrowserReport?.passed === true,
    },
    manifest,
    failures,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = collectUiV2QualityStatus(args);

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
