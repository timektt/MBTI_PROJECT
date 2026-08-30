#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { collectHygieneStatus } from "./audit-repo-hygiene.mjs";
import { collectAuthSurfaceIsolationStatus } from "./audit-auth-surface-isolation.mjs";
import { collectCloudRuntimeReadiness } from "./cloud-runtime-readiness.mjs";
import { collectEnvStatus } from "./check-env.mjs";
import { collectMbtiZAssetStatus } from "./verify-mbti-z-assets.mjs";
import { collectSupabaseTargetReadiness } from "./supabase-target-readiness.mjs";
import { collectUiRouteSweepStatus } from "./verify-ui-route-sweep.mjs";
import { collectVercelTargetReadiness } from "./vercel-target-readiness.mjs";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function parseArgs(argv) {
  const parsed = {
    target: "preview",
    file: null,
    json: false,
    profile: "full",
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

    if (arg.startsWith("--profile=")) {
      parsed.profile = arg.split("=")[1] || parsed.profile;
      continue;
    }

    if (arg === "--json") {
      parsed.json = true;
    }
  }

  return parsed;
}

function exists(relativePath) {
  return fs.existsSync(path.join(APP_ROOT, relativePath));
}

function migrationDirs() {
  const migrationsRoot = path.join(APP_ROOT, "prisma", "migrations");

  if (!fs.existsSync(migrationsRoot)) {
    return [];
  }

  return fs
    .readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function collectPreflightStatus(options) {
  const profile = options.profile ?? "full";
  const guestLocalProfile = profile === "guest-local";
  const envStatus = collectEnvStatus({
    file: options.file,
    target: options.target,
    profile,
  });
  const hygieneStatus = collectHygieneStatus();
  const hygieneOk = hygieneStatus.blockers.length === 0;
  const assetStatus = collectMbtiZAssetStatus();
  const assetOk = assetStatus.ok;
  const authSurfaceStatus = collectAuthSurfaceIsolationStatus();
  const authSurfaceOk = authSurfaceStatus.blockers.length === 0;
  const uiRouteSweepStatus = collectUiRouteSweepStatus();
  const uiRouteSweepOk = uiRouteSweepStatus.ok;
  const supabaseTargetStatus = collectSupabaseTargetReadiness({
    file: options.file,
    target: options.target,
  });
  const supabaseTargetOk =
    guestLocalProfile || supabaseTargetStatus.blockers.length === 0;
  const vercelTargetStatus = collectVercelTargetReadiness({
    target: options.target,
  });
  const vercelTargetOk = vercelTargetStatus.blockers.length === 0;
  const cloudStatus = collectCloudRuntimeReadiness({
    file: options.file,
    target: options.target,
  });
  const guestCloudHoldCheckIds = new Set([
    "cloud_adapter_manifest_linked",
    "cloud_service_adapter_manifest_guarded",
    "cloud_manifest_blockers_declared",
    "guest_fallback_present",
    "runtime_not_cloud_until_adapter_ready",
  ]);
  const cloudStatusOk = guestLocalProfile
    ? cloudStatus.checks
        .filter((check) => guestCloudHoldCheckIds.has(check.id))
        .every((check) => check.ok)
    : cloudStatus.ok;

  const checks = [
    {
      label: "Repository hygiene",
      path: "scripts/audit-repo-hygiene.mjs",
      ok: hygieneOk,
      detail:
        hygieneOk
          ? "repo hygiene strict gate has no blockers"
          : hygieneStatus.blockers.map((item) => item.id).join(", "),
    },
    {
      label: "Cloud runtime readiness",
      path: "scripts/cloud-runtime-readiness.mjs",
      ok: cloudStatusOk,
      detail: cloudStatusOk
        ? guestLocalProfile
          ? "cloud runtime is held behind manifest and guest fallback guards"
          : "cloud runtime gate has no blockers"
        : cloudStatus.blockers.map((item) => item.id).join(", "),
    },
    {
      label: "MBTI Z visual assets",
      path: "scripts/verify-mbti-z-assets.mjs",
      ok: assetOk,
      detail: assetOk
        ? `${assetStatus.summary.houseCount} houses / ${assetStatus.summary.animalPosterCount} animal posters`
        : assetStatus.failures.join(", "),
    },
    {
      label: "Auth surface isolation",
      path: "scripts/audit-auth-surface-isolation.mjs",
      ok: authSurfaceOk,
      detail: authSurfaceOk
        ? "legacy UI surfaces are held and high-risk APIs have static guards"
        : authSurfaceStatus.blockers.map((item) => `${item.id}:${item.file}`).join(", "),
    },
    {
      label: "UI route sweep evidence",
      path: "scripts/verify-ui-route-sweep.mjs",
      ok: uiRouteSweepOk,
      detail: uiRouteSweepOk
        ? `${uiRouteSweepStatus.auditedRouteCount} routes / ${uiRouteSweepStatus.auditedSampleCount} samples / ${uiRouteSweepStatus.issueCount} issues`
        : uiRouteSweepStatus.failures.join(", "),
    },
    {
      label: "Supabase target readiness",
      path: "scripts/supabase-target-readiness.mjs",
      ok: supabaseTargetOk,
      detail: supabaseTargetOk
        ? guestLocalProfile
          ? "Supabase is not required while the verified runtime remains guest-local"
          : "database URLs resolve to the approved target policy"
        : supabaseTargetStatus.blockers.map((item) => item.id).join(", "),
    },
    {
      label: "Vercel target readiness",
      path: "scripts/vercel-target-readiness.mjs",
      ok: vercelTargetOk,
      detail: vercelTargetOk
        ? "project binding resolves to the approved target policy"
        : vercelTargetStatus.blockers.map((item) => item.id).join(", "),
    },
    {
      label: "Environment example file",
      path: ".env.example",
      ok: exists(".env.example"),
    },
    {
      label: "GitHub Actions CI workflow",
      path: ".github/workflows/ci.yml",
      ok: exists(".github/workflows/ci.yml"),
    },
    {
      label: "Architecture overview",
      path: "docs/architecture-overview.md",
      ok: exists("docs/architecture-overview.md"),
    },
    {
      label: "Platform runbook",
      path: "docs/platform-setup-runbook.md",
      ok: exists("docs/platform-setup-runbook.md"),
    },
    {
      label: "Execution status",
      path: "docs/execution-status.md",
      ok: exists("docs/execution-status.md"),
    },
    {
      label: "Environment matrix",
      path: "docs/env-matrix.md",
      ok: exists("docs/env-matrix.md"),
    },
    {
      label: "Prisma migration scaffold",
      path: "prisma/migrations",
      ok: migrationDirs().length > 0,
    },
  ];

  const missingChecks = checks.filter((item) => !item.ok && item.blocking !== false);
  const warnings = checks
    .filter((item) => !item.ok && item.blocking === false)
    .map((item) => `${item.label} is still missing (${item.path}).`);

  if (envStatus.missing.length > 0) {
    warnings.push("Required environment keys are still missing.");
  }

  if (envStatus.blockingWarnings.length > 0) {
    warnings.push("Environment has deploy-blocking warnings.");
  }

  if (!hygieneOk) {
    warnings.push("Repository hygiene has blocking issues.");
  }

  if (!assetOk) {
    warnings.push("MBTI Z visual assets have blocking issues.");
  }

  if (!authSurfaceOk) {
    warnings.push("Auth surface isolation has blocking issues.");
  }

  if (!uiRouteSweepOk) {
    warnings.push("UI route sweep evidence has blocking issues.");
  }

  if (!supabaseTargetOk) {
    warnings.push("Supabase target readiness has blocking issues.");
  }

  if (!vercelTargetOk) {
    warnings.push("Vercel target readiness has blocking issues.");
  }

  if (!cloudStatusOk) {
    warnings.push("Cloud runtime readiness has blocking issues.");
  }

  if (guestLocalProfile) {
    warnings.push(
      "Guest-local preflight does not authorize auth, database, email, realtime, media, or cloud runtime activation."
    );
  }

  return {
    ok:
      missingChecks.length === 0 &&
      envStatus.ok &&
      assetOk &&
      authSurfaceOk &&
      uiRouteSweepOk &&
      supabaseTargetOk &&
      vercelTargetOk &&
      cloudStatusOk,
    profile,
    target: options.target,
    checks,
    env: envStatus,
    repoHygiene: {
      ok: hygieneOk,
      summary: hygieneStatus.summary,
      blockers: hygieneStatus.blockers,
      warnings: hygieneStatus.warnings,
    },
    assets: assetStatus,
    authSurface: {
      ok: authSurfaceOk,
      summary: authSurfaceStatus.summary,
      blockers: authSurfaceStatus.blockers,
    },
    uiRouteSweep: uiRouteSweepStatus,
    supabaseTarget: {
      ok: supabaseTargetOk,
      summary: supabaseTargetStatus.summary,
      blockers: supabaseTargetStatus.blockers,
      connections: supabaseTargetStatus.connections,
      migrations: supabaseTargetStatus.migrations,
    },
    vercelTarget: {
      ok: vercelTargetOk,
      summary: vercelTargetStatus.summary,
      blockers: vercelTargetStatus.blockers,
      binding: vercelTargetStatus.binding,
      deploymentContract: vercelTargetStatus.deploymentContract,
    },
    cloudRuntime: {
      ok: cloudStatusOk,
      held: guestLocalProfile,
      summary: cloudStatus.summary,
      blockers: cloudStatus.blockers,
    },
    warnings,
  };
}

function printHuman(status) {
  console.log(`MBTI launch preflight target: ${status.target}`);
  console.log(`Deployment profile: ${status.profile}`);
  console.log("");
  console.log("Repo checks:");

  for (const check of status.checks) {
    const state = check.ok ? "OK" : check.blocking === false ? "WARN" : "BLOCKER";
    const detail = check.detail ? ` (${check.detail})` : "";
    console.log(`  - ${check.label}: ${state}${detail}`);
  }

  console.log("");
  console.log(
    `Environment check: ${status.env.ok ? "OK" : "NOT READY"}`
  );
  console.log("");

  if (status.warnings.length > 0 || status.env.warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of [...status.warnings, ...status.env.warnings]) {
      console.log(`  - ${warning}`);
    }
    console.log("");
  }

  if (!status.ok) {
    console.log("Preflight is not ready yet.");
    process.exitCode = 1;
    return;
  }

  console.log("Preflight is ready.");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const status = collectPreflightStatus(options);

  if (options.json) {
    console.log(JSON.stringify(status, null, 2));
  } else {
    printHuman(status);
  }

  if (!status.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
