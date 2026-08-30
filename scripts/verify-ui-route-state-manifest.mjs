#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  UI_ROUTE_STATE_MANIFEST,
  UI_VIEWPORT_TIERS,
} from "../data/ui/route-state-manifest.mjs";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPECTED_ROUTE_COUNT = 31;
const KNOWN_STATES = new Set([
  "loading",
  "empty",
  "populated",
  "not-found",
  "selected",
  "expanded",
]);
const EXPECTED_VIEWPORT_TIERS = {
  baseline: ["390x844", "1440x1000"],
  standard: ["320x700", "390x844", "768x1024", "1440x1000"],
  full: [
    "320x700",
    "390x844",
    "768x1024",
    "1024x768",
    "1440x1000",
    "1600x1000",
  ],
};
const FAMILY_CONTRACTS = new Map([
  [
    "active",
    {
      status: "active",
      scenarios: new Set([
        "home",
        "quiz",
        "result",
        "types",
        "type-detail",
        "dashboard",
      ]),
      sourceMarker: null,
    },
  ],
  [
    "account-hold",
    {
      status: "held",
      scenarios: new Set(["account"]),
      sourceMarker: "AccountHold",
      ownerComponent: "components/cyber/account-hold.tsx",
    },
  ],
  [
    "relaunch-profile",
    {
      status: "held",
      scenarios: new Set(["profile", "settings", "verification"]),
      sourceMarker: "RelaunchState",
      ownerComponent: "components/cyber/relaunch-state.tsx",
    },
  ],
  [
    "relaunch-community",
    {
      status: "held",
      scenarios: new Set(["community", "share"]),
      sourceMarker: "RelaunchState",
      ownerComponent: "components/cyber/relaunch-state.tsx",
    },
  ],
  [
    "relaunch-admin",
    {
      status: "held",
      scenarios: new Set(["operations"]),
      sourceMarker: "RelaunchState",
      ownerComponent: "components/cyber/relaunch-state.tsx",
    },
  ],
]);

function listFiles(directoryPath) {
  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name);

    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function routePatternForPageFile(filePath) {
  const relativePath = path.relative(APP_ROOT, filePath).replaceAll(path.sep, "/");

  if (!relativePath.startsWith("pages/") || !relativePath.endsWith(".tsx")) {
    return null;
  }

  if (relativePath.startsWith("pages/api/")) {
    return null;
  }

  if (relativePath === "pages/_app.tsx" || relativePath === "pages/_document.tsx") {
    return null;
  }

  const pagePath = relativePath.replace(/^pages\//, "").replace(/\.tsx$/, "");
  const routePath =
    pagePath === "index"
      ? ""
      : pagePath.endsWith("/index")
        ? pagePath.replace(/\/index$/, "")
        : pagePath;

  return `/${routePath}`.replace(/\/+/g, "/");
}

function collectPageRoutes() {
  const routes = new Map();

  for (const filePath of listFiles(path.join(APP_ROOT, "pages"))) {
    const routePattern = routePatternForPageFile(filePath);

    if (routePattern === null) {
      continue;
    }

    const existingFile = routes.get(routePattern);

    if (existingFile) {
      throw new Error(
        `Duplicate page route pattern ${routePattern}: ${path.relative(APP_ROOT, existingFile)}, ${path.relative(APP_ROOT, filePath)}`
      );
    }

    routes.set(routePattern, filePath);
  }

  return routes;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function routePatternRegExp(routePattern) {
  if (routePattern === "/") {
    return /^\/$/;
  }

  const segments = routePattern.split("/").slice(1);
  let source = "^";

  for (const segment of segments) {
    if (/^\[\[\.\.\.[^\]]+\]\]$/.test(segment)) {
      source += "(?:/.+)?";
    } else if (/^\[\.\.\.[^\]]+\]$/.test(segment)) {
      source += "/.+";
    } else if (/^\[[^\]]+\]$/.test(segment)) {
      source += "/[^/]+";
    } else {
      source += `/${escapeRegExp(segment)}`;
    }
  }

  return new RegExp(`${source}$`);
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

function arraysEqual(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function validateViewportTiers(failures) {
  const actualTierNames = Object.keys(UI_VIEWPORT_TIERS).sort();
  const expectedTierNames = Object.keys(EXPECTED_VIEWPORT_TIERS).sort();

  for (const tierName of difference(expectedTierNames, actualTierNames)) {
    failures.push(`viewport_tier_missing:${tierName}`);
  }

  for (const tierName of difference(actualTierNames, expectedTierNames)) {
    failures.push(`viewport_tier_unknown:${tierName}`);
  }

  for (const tierName of expectedTierNames) {
    if (!arraysEqual(UI_VIEWPORT_TIERS[tierName], EXPECTED_VIEWPORT_TIERS[tierName])) {
      failures.push(`viewport_tier_invalid:${tierName}`);
    }
  }
}

function validateRouteEntry(entry, index, pageRoutes, failures) {
  const label =
    entry && typeof entry.routePattern === "string" ? entry.routePattern : `index-${index}`;

  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    failures.push(`route_entry_invalid:${label}`);
    return;
  }

  const {
    routePattern,
    samplePath,
    family,
    status,
    scenario,
    requiredStates,
    viewportTier,
    ownerComponent,
  } = entry;
  const familyContract = FAMILY_CONTRACTS.get(family);

  if (typeof routePattern !== "string" || !routePattern.startsWith("/")) {
    failures.push(`route_pattern_invalid:${label}`);
  }

  if (
    typeof samplePath !== "string" ||
    !samplePath.startsWith("/") ||
    samplePath.includes("[") ||
    samplePath.includes("]") ||
    samplePath.includes("?") ||
    samplePath.includes("#") ||
    (samplePath !== "/" && samplePath.endsWith("/"))
  ) {
    failures.push(`sample_path_invalid:${label}`);
  } else if (typeof routePattern === "string") {
    const dynamicRoute = routePattern.includes("[");

    if (!dynamicRoute && samplePath !== routePattern) {
      failures.push(`static_sample_mismatch:${label}:${samplePath}`);
    }

    if (dynamicRoute && !routePatternRegExp(routePattern).test(samplePath)) {
      failures.push(`dynamic_sample_mismatch:${label}:${samplePath}`);
    }
  }

  if (!familyContract) {
    failures.push(`family_unknown:${label}:${family ?? "missing"}`);
  } else {
    if (status !== familyContract.status) {
      failures.push(`family_status_mismatch:${label}:${family}:${status ?? "missing"}`);
    }

    if (!familyContract.scenarios.has(scenario)) {
      failures.push(`family_scenario_mismatch:${label}:${family}:${scenario ?? "missing"}`);
    }

    if (familyContract.ownerComponent && ownerComponent !== familyContract.ownerComponent) {
      failures.push(`family_owner_mismatch:${label}:${ownerComponent ?? "missing"}`);
    }
  }

  if (!Array.isArray(requiredStates) || requiredStates.length === 0) {
    failures.push(`required_states_invalid:${label}`);
  } else {
    for (const state of requiredStates) {
      if (!KNOWN_STATES.has(state)) {
        failures.push(`required_state_unknown:${label}:${state}`);
      }
    }

    for (const state of duplicateValues(requiredStates)) {
      failures.push(`required_state_duplicate:${label}:${state}`);
    }
  }

  if (!Object.hasOwn(EXPECTED_VIEWPORT_TIERS, viewportTier)) {
    failures.push(`route_viewport_tier_unknown:${label}:${viewportTier ?? "missing"}`);
  }

  if (typeof ownerComponent !== "string" || ownerComponent.length === 0) {
    failures.push(`owner_component_invalid:${label}`);
  } else {
    const ownerPath = path.resolve(APP_ROOT, ownerComponent);

    if (!ownerPath.startsWith(`${APP_ROOT}${path.sep}`) || !fs.existsSync(ownerPath)) {
      failures.push(`owner_component_missing:${label}:${ownerComponent}`);
    }
  }

  const pageFile = pageRoutes.get(routePattern);

  if (!pageFile || !familyContract) {
    return;
  }

  const source = fs.readFileSync(pageFile, "utf8");
  const usesHoldComponent = source.includes("AccountHold") || source.includes("RelaunchState");

  if (family === "active" && usesHoldComponent) {
    failures.push(`active_route_uses_hold_component:${label}`);
  }

  if (familyContract.sourceMarker && !source.includes(familyContract.sourceMarker)) {
    failures.push(`held_route_component_mismatch:${label}:${familyContract.sourceMarker}`);
  }

  if (familyContract.sourceMarker === "RelaunchState") {
    const sourceScenario = source.match(
      /<RelaunchState\b[^>]*\bscenario="([^"]+)"/s
    )?.[1];

    if (sourceScenario !== scenario) {
      failures.push(`held_route_scenario_mismatch:${label}:${sourceScenario ?? "missing"}:${scenario}`);
    }
  }
}

export function collectUiRouteStateManifestStatus() {
  const failures = [];
  let pageRoutes;

  try {
    pageRoutes = collectPageRoutes();
  } catch (error) {
    return {
      ok: false,
      expectedRouteCount: EXPECTED_ROUTE_COUNT,
      sourceRouteCount: null,
      manifestRouteCount: Array.isArray(UI_ROUTE_STATE_MANIFEST)
        ? UI_ROUTE_STATE_MANIFEST.length
        : null,
      failures: [`page_route_collection_failed:${error.message}`],
    };
  }

  validateViewportTiers(failures);

  if (pageRoutes.size !== EXPECTED_ROUTE_COUNT) {
    failures.push(`source_route_count:${pageRoutes.size}:${EXPECTED_ROUTE_COUNT}`);
  }

  if (!Array.isArray(UI_ROUTE_STATE_MANIFEST)) {
    failures.push("manifest_invalid:not_array");
  } else {
    const manifestPatterns = UI_ROUTE_STATE_MANIFEST.map((entry) => entry?.routePattern).filter(
      (routePattern) => typeof routePattern === "string"
    );
    const manifestSamples = UI_ROUTE_STATE_MANIFEST.map((entry) => entry?.samplePath).filter(
      (samplePath) => typeof samplePath === "string"
    );
    const sourcePatterns = [...pageRoutes.keys()].sort();
    const uniqueManifestPatterns = [...new Set(manifestPatterns)].sort();

    if (UI_ROUTE_STATE_MANIFEST.length !== EXPECTED_ROUTE_COUNT) {
      failures.push(
        `manifest_route_count:${UI_ROUTE_STATE_MANIFEST.length}:${EXPECTED_ROUTE_COUNT}`
      );
    }

    for (const routePattern of duplicateValues(manifestPatterns)) {
      failures.push(`route_pattern_duplicate:${routePattern}`);
    }

    for (const samplePath of duplicateValues(manifestSamples)) {
      failures.push(`sample_path_duplicate:${samplePath}`);
    }

    for (const routePattern of difference(sourcePatterns, uniqueManifestPatterns)) {
      failures.push(`route_missing:${routePattern}`);
    }

    for (const routePattern of difference(uniqueManifestPatterns, sourcePatterns)) {
      failures.push(`route_extra:${routePattern}`);
    }

    UI_ROUTE_STATE_MANIFEST.forEach((entry, index) =>
      validateRouteEntry(entry, index, pageRoutes, failures)
    );
  }

  const familyCounts = Object.fromEntries(
    [...FAMILY_CONTRACTS.keys()].map((family) => [
      family,
      Array.isArray(UI_ROUTE_STATE_MANIFEST)
        ? UI_ROUTE_STATE_MANIFEST.filter((entry) => entry?.family === family).length
        : 0,
    ])
  );

  return {
    ok: failures.length === 0,
    expectedRouteCount: EXPECTED_ROUTE_COUNT,
    sourceRouteCount: pageRoutes.size,
    manifestRouteCount: Array.isArray(UI_ROUTE_STATE_MANIFEST)
      ? UI_ROUTE_STATE_MANIFEST.length
      : null,
    familyCounts,
    failures,
  };
}

function main() {
  const result = collectUiRouteStateManifestStatus();

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
