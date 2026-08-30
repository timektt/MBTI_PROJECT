#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DEFAULT_AUDIT_PATH =
  "output/ui-redesign-v3/audit/browser-audit-report.json";
const DEFAULT_ISSUES_PATH =
  "output/ui-redesign-v3/audit/issues.json";
const PRIMARY_ROUTE_PATHS = new Set([
  "/",
  "/quiz",
  "/types",
  "/types/intj",
  "/login",
  "/dashboard",
  "/result/guest-mqtpomkf-estj",
]);
const REQUIRED_BASE_VIEWPORTS = new Set([
  "mobile-390x844",
  "desktop-1440x1000",
]);
const REQUIRED_PRIMARY_VIEWPORTS = new Set([
  "mobile-390x844",
  "tablet-768x1024",
  "desktop-1440x1000",
]);
const DYNAMIC_ROUTE_SAMPLES = new Map([
  ["/card/[id]", "/card/demo-card"],
  ["/profile/[username]", "/profile/demo"],
  ["/profile/[username]/cards", "/profile/demo/cards"],
  ["/profile/[username]/followers", "/profile/demo/followers"],
  ["/profile/[username]/following", "/profile/demo/following"],
  ["/result/[id]", "/result/guest-mqtpomkf-estj"],
  ["/types/[code]", "/types/intj"],
  ["/share/[slug]", "/share/demo"],
  ["/u/[username]", "/u/demo"],
]);
const V3_PRIMARY_ROUTE_PATTERNS = new Set([
  "/",
  "/quiz",
  "/result/[id]",
  "/types",
  "/types/[code]",
  "/dashboard",
  "/login",
]);
const V3_BASE_VIEWPORTS = new Set(["390x844", "1440x1000"]);
const V3_PRIMARY_VIEWPORTS = new Set(["390x844", "768x1024", "1440x1000"]);
const V3_SOURCE_PATHS = ["components", "data", "lib", "pages", "styles"];
const REQUIRE_SCREENSHOT_ARTIFACTS = process.env.CI !== "true";

function parseArgs(argv) {
  const parsed = {
    audit: DEFAULT_AUDIT_PATH,
    issues: DEFAULT_ISSUES_PATH,
  };

  for (const arg of argv) {
    if (arg.startsWith("--audit=")) {
      parsed.audit = arg.split("=").slice(1).join("=") || parsed.audit;
      continue;
    }

    if (arg.startsWith("--issues=")) {
      parsed.issues = arg.split("=").slice(1).join("=") || parsed.issues;
    }
  }

  return parsed;
}

function absolutePath(relativeOrAbsolutePath) {
  return path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.join(APP_ROOT, relativeOrAbsolutePath);
}

function readJson(relativeOrAbsolutePath) {
  return JSON.parse(fs.readFileSync(absolutePath(relativeOrAbsolutePath), "utf8"));
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return listFiles(fullPath);
    }

    return [fullPath];
  });
}

function v3SourceFingerprint() {
  const hash = createHash("sha256");

  for (const sourcePath of V3_SOURCE_PATHS) {
    const resolvedPath = absolutePath(sourcePath);
    if (!fs.existsSync(resolvedPath)) continue;

    for (const filePath of listFiles(resolvedPath).sort()) {
      const relativePath = path.relative(APP_ROOT, filePath).replaceAll(path.sep, "/");
      hash.update(relativePath);
      hash.update("\0");
      hash.update(fs.readFileSync(filePath));
      hash.update("\0");
    }
  }

  return hash.digest("hex");
}

function routePatternForPageFile(filePath) {
  const relativePath = path.relative(APP_ROOT, filePath).replaceAll(path.sep, "/");

  if (!relativePath.startsWith("pages/")) {
    return null;
  }

  if (!relativePath.endsWith(".tsx")) {
    return null;
  }

  if (relativePath.startsWith("pages/api/")) {
    return null;
  }

  if (relativePath === "pages/_app.tsx" || relativePath === "pages/_document.tsx") {
    return null;
  }

  const withoutPrefix = relativePath
    .replace(/^pages\//, "")
    .replace(/\.tsx$/, "");
  const withoutIndex =
    withoutPrefix === "index"
      ? ""
      : withoutPrefix.endsWith("/index")
        ? withoutPrefix.replace(/\/index$/, "")
        : withoutPrefix;

  return `/${withoutIndex}`.replace(/\/+/g, "/");
}

function samplePathForRoutePattern(routePattern) {
  if (!routePattern.includes("[")) {
    return routePattern;
  }

  return DYNAMIC_ROUTE_SAMPLES.get(routePattern) ?? null;
}

function collectExpectedRoutes() {
  const pageFiles = listFiles(path.join(APP_ROOT, "pages"));
  const routePatterns = pageFiles
    .map(routePatternForPageFile)
    .filter((routePattern) => routePattern !== null)
    .sort();
  const missingSamples = routePatterns.filter(
    (routePattern) => samplePathForRoutePattern(routePattern) === null
  );
  const samplePaths = routePatterns
    .map(samplePathForRoutePattern)
    .filter((samplePath) => samplePath !== null)
    .sort();

  return {
    missingSamples,
    routePatterns,
    samplePaths,
  };
}

function unique(values) {
  return [...new Set(values)];
}

function arrayDifference(left, right) {
  const rightSet = new Set(right);
  return left.filter((entry) => !rightSet.has(entry));
}

function collectRouteViewportMap(routeResults) {
  const routeViewportMap = new Map();

  for (const result of routeResults) {
    const routePath = result?.route?.path;
    const viewportName = result?.viewport?.name;

    if (!routePath || !viewportName) {
      continue;
    }

    const viewports = routeViewportMap.get(routePath) ?? new Set();
    viewports.add(viewportName);
    routeViewportMap.set(routePath, viewports);
  }

  return routeViewportMap;
}

function hasConsoleIssue(result) {
  const entries = Array.isArray(result.console) ? result.console : [];
  return entries.some((entry) => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    return entry.type === "error" || entry.type === "warning";
  });
}

function collectSampleFailures(routeResults) {
  const failures = [];

  for (const result of routeResults) {
    const label = `${result?.route?.path ?? "unknown"} @ ${result?.viewport?.name ?? "unknown"}`;
    const metrics = result?.metrics ?? {};

    if (result?.gotoStatus !== 200) {
      failures.push(`${label}:status:${result?.gotoStatus ?? "missing"}`);
    }

    if (metrics.hasHorizontalOverflow) {
      failures.push(`${label}:horizontal_overflow`);
    }

    if (metrics.containsNocturne) {
      failures.push(`${label}:legacy_nocturne_copy`);
    }

    if ((metrics.unnamedInteractive ?? []).length > 0) {
      failures.push(`${label}:unnamed_interactive`);
    }

    if ((metrics.unlabeledInputs ?? []).length > 0) {
      failures.push(`${label}:unlabeled_inputs`);
    }

    if ((metrics.smallTouchTargets ?? []).length > 0) {
      failures.push(`${label}:small_touch_targets`);
    }

    if ((result?.badResponses ?? []).length > 0) {
      failures.push(`${label}:bad_responses`);
    }

    if ((result?.pageErrors ?? []).length > 0) {
      failures.push(`${label}:page_errors`);
    }

    if (hasConsoleIssue(result)) {
      failures.push(`${label}:console_issue`);
    }
  }

  return failures;
}

function collectV3RouteSweepStatus(audit, auditPath) {
  const expected = collectExpectedRoutes();
  const results = Array.isArray(audit.results) ? audit.results : [];
  const expectedPatterns = expected.routePatterns;
  const actualPatterns = unique(
    results
      .map((result) => result?.routePattern)
      .filter((routePattern) => typeof routePattern === "string")
  ).sort();
  const failures = [
    ...expected.missingSamples.map((routePattern) => `dynamic_sample_missing:${routePattern}`),
    ...arrayDifference(expectedPatterns, actualPatterns).map(
      (routePattern) => `route_missing:${routePattern}`
    ),
    ...arrayDifference(actualPatterns, expectedPatterns).map(
      (routePattern) => `route_extra:${routePattern}`
    ),
  ];
  const viewportMap = new Map();

  for (const result of results) {
    const routePattern = result?.routePattern;
    const viewportName = result?.viewport?.name;
    if (typeof routePattern !== "string" || typeof viewportName !== "string") continue;

    const viewports = viewportMap.get(routePattern) ?? new Set();
    viewports.add(viewportName);
    viewportMap.set(routePattern, viewports);

    const label = `${result.samplePath ?? routePattern} @ ${viewportName}`;
    if (result.statusCode !== 200) failures.push(`${label}:status:${result.statusCode}`);
    if (result.horizontalOverflow) failures.push(`${label}:horizontal_overflow`);
    if ((result.clippedControls ?? []).length) failures.push(`${label}:clipped_controls`);
    if ((result.brokenImages ?? []).length) failures.push(`${label}:broken_images`);
    if ((result.consoleErrors ?? []).length) failures.push(`${label}:console_errors`);
    if ((result.pageErrors ?? []).length) failures.push(`${label}:page_errors`);

    const screenshotPath = absolutePath(result.screenshot ?? "");
    if (!result.screenshot) {
      failures.push(`${label}:screenshot_reference_missing`);
    } else if (REQUIRE_SCREENSHOT_ARTIFACTS && !fs.existsSync(screenshotPath)) {
      failures.push(`${label}:screenshot_missing`);
    }
  }

  for (const routePattern of expectedPatterns) {
    const requiredViewports = V3_PRIMARY_ROUTE_PATTERNS.has(routePattern)
      ? V3_PRIMARY_VIEWPORTS
      : V3_BASE_VIEWPORTS;
    const actualViewports = viewportMap.get(routePattern) ?? new Set();
    for (const viewport of requiredViewports) {
      if (!actualViewports.has(viewport)) {
        failures.push(`viewport_missing:${routePattern}:${viewport}`);
      }
    }
  }

  const generatedAt = Date.parse(audit.generatedAt);
  const expectedSourceFingerprint = v3SourceFingerprint();
  if (Number.isNaN(generatedAt)) {
    failures.push("generated_at_invalid");
  }
  if (typeof audit.sourceFingerprint !== "string") {
    failures.push("source_fingerprint_missing");
  } else if (audit.sourceFingerprint !== expectedSourceFingerprint) {
    failures.push(`report_stale:fingerprint:${audit.sourceFingerprint}:${expectedSourceFingerprint}`);
  }
  if (audit.passed !== true) failures.push("report_not_passed");
  if (!Array.isArray(audit.failures)) failures.push("report_failures_invalid");
  else if (audit.failures.length) failures.push(`report_failures:${audit.failures.length}`);
  if (audit.routePatternCount !== expectedPatterns.length) {
    failures.push(`route_pattern_count:${audit.routePatternCount}:${expectedPatterns.length}`);
  }
  if (audit.concreteTypePathCount !== 16) {
    failures.push(`concrete_type_path_count:${audit.concreteTypePathCount}:16`);
  }
  if (audit.sampleCount !== results.length) {
    failures.push(`sample_count:${audit.sampleCount}:${results.length}`);
  }

  return {
    ok: failures.length === 0,
    auditPath: path.relative(APP_ROOT, absolutePath(auditPath)),
    issuePath: null,
    schema: "v3-browser-audit",
    expectedRouteCount: expectedPatterns.length,
    auditedRouteCount: actualPatterns.length,
    expectedSampleCount: null,
    auditedSampleCount: results.length,
    concreteTypePathCount: audit.concreteTypePathCount ?? null,
    issueCount: Array.isArray(audit.failures) ? audit.failures.length : null,
    failures,
  };
}

export function collectUiRouteSweepStatus(options = {}) {
  const auditPath = options.audit ?? DEFAULT_AUDIT_PATH;
  const issuesPath = options.issues ?? DEFAULT_ISSUES_PATH;
  const audit = readJson(auditPath);

  if (Array.isArray(audit.results)) {
    return collectV3RouteSweepStatus(audit, auditPath);
  }

  const issues = fs.existsSync(absolutePath(issuesPath)) ? readJson(issuesPath) : [];
  const routeResults = Array.isArray(audit.routeResults) ? audit.routeResults : [];
  const expected = collectExpectedRoutes();
  const actualRoutePaths = unique(
    routeResults
      .map((result) => result?.route?.path)
      .filter((routePath) => typeof routePath === "string")
  ).sort();
  const missingRoutes = arrayDifference(expected.samplePaths, actualRoutePaths);
  const extraRoutes = arrayDifference(actualRoutePaths, expected.samplePaths);
  const routeViewportMap = collectRouteViewportMap(routeResults);
  const viewportFailures = [];

  for (const routePath of expected.samplePaths) {
    const requiredViewports = PRIMARY_ROUTE_PATHS.has(routePath)
      ? REQUIRED_PRIMARY_VIEWPORTS
      : REQUIRED_BASE_VIEWPORTS;
    const actualViewports = routeViewportMap.get(routePath) ?? new Set();

    for (const requiredViewport of requiredViewports) {
      if (!actualViewports.has(requiredViewport)) {
        viewportFailures.push(`${routePath}:${requiredViewport}`);
      }
    }
  }

  const expectedSampleCount =
    expected.samplePaths.length * REQUIRED_BASE_VIEWPORTS.size +
    PRIMARY_ROUTE_PATHS.size;
  const sampleFailures = collectSampleFailures(routeResults);
  const failures = [
    ...expected.missingSamples.map((routePattern) => `dynamic_sample_missing:${routePattern}`),
    ...missingRoutes.map((routePath) => `route_missing:${routePath}`),
    ...extraRoutes.map((routePath) => `route_extra:${routePath}`),
    ...viewportFailures.map((failure) => `viewport_missing:${failure}`),
    ...(audit?.summary?.routeCount === expected.samplePaths.length
      ? []
      : [
          `summary_route_count:${audit?.summary?.routeCount ?? "missing"}:${expected.samplePaths.length}`,
        ]),
    ...(audit?.summary?.expectedSampleCount === expectedSampleCount
      ? []
      : [
          `summary_expected_sample_count:${audit?.summary?.expectedSampleCount ?? "missing"}:${expectedSampleCount}`,
        ]),
    ...(routeResults.length === expectedSampleCount
      ? []
      : [`route_result_count:${routeResults.length}:${expectedSampleCount}`]),
    ...(audit?.summary?.issueCount === 0
      ? []
      : [`summary_issue_count:${audit?.summary?.issueCount ?? "missing"}`]),
    ...(Array.isArray(issues) && issues.length === 0
      ? []
      : [`issues_file_count:${Array.isArray(issues) ? issues.length : "invalid"}`]),
    ...sampleFailures,
  ];
  const result = {
    ok: failures.length === 0,
    auditPath: path.relative(APP_ROOT, absolutePath(auditPath)),
    issuePath: path.relative(APP_ROOT, absolutePath(issuesPath)),
    expectedRouteCount: expected.samplePaths.length,
    auditedRouteCount: actualRoutePaths.length,
    expectedSampleCount,
    auditedSampleCount: routeResults.length,
    issueCount: audit?.summary?.issueCount ?? null,
    failures,
  };

  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = collectUiRouteSweepStatus(args);

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
