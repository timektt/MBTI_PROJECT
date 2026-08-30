#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import { collectPreflightStatus } from "./launch-preflight.mjs";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function parseArgs(argv) {
  const parsed = {
    target: "preview",
    file: ".env.example",
    outDir: null,
    strict: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--target=")) {
      parsed.target = arg.split("=").slice(1).join("=") || parsed.target;
      continue;
    }

    if (arg.startsWith("--file=")) {
      parsed.file = arg.split("=").slice(1).join("=") || parsed.file;
      continue;
    }

    if (arg.startsWith("--out-dir=")) {
      parsed.outDir = arg.split("=").slice(1).join("=") || null;
      continue;
    }

    if (arg === "--strict") {
      parsed.strict = true;
    }
  }

  return parsed;
}

function absolute(relativePath) {
  return path.isAbsolute(relativePath)
    ? relativePath
    : path.join(APP_ROOT, relativePath);
}

function todayBangkokDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function defaultOutDir() {
  return path.join(
    APP_ROOT,
    "output",
    "vibe-to-prod",
    todayBangkokDate(),
    "launch-handoff"
  );
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function bulletList(items, emptyText = "- none") {
  if (!items || items.length === 0) {
    return emptyText;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function blockerIds(blockers) {
  return blockers.map((blocker) => blocker.id);
}

function buildActionPlan(status) {
  const actions = [];

  if (!status.supabaseTarget.ok) {
    actions.push(
      "Create or select a fresh MBTI Z Supabase project in the approved organization.",
      "Update `data/runtime/supabase-target-readiness.json` with the approved preview/production project refs.",
      "Bind deploy-safe `DATABASE_URL` and `DIRECT_URL` values from that Supabase target without committing secrets."
    );
  }

  if (!status.vercelTarget.ok) {
    actions.push(
      "Create and bind a dedicated Vercel project for `timektt/MBTI_PROJECT`.",
      "Update `data/runtime/vercel-target-readiness.json` with the approved Vercel project id.",
      "Configure preview/production Vercel env values from `.env.example` after Supabase target refs are approved."
    );
  }

  if (!status.env.ok) {
    actions.push(
      "Replace preview/production placeholder and localhost env values in the deployment environment; keep `.env.example` placeholder-only."
    );
  }

  if (!status.assets.ok) {
    actions.push(
      "Restore the MBTI Z house scenes and animal posters to the expected dimensions before handoff."
    );
  }

  if (!status.uiRouteSweep.ok) {
    actions.push(
      "Refresh the current route sweep evidence before handoff so all user-facing Pages Router routes are covered."
    );
  }

  if (!status.cloudRuntime.ok) {
    actions.push(
      "Keep `NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=guest-local` until Supabase/Vercel/env gates are ready and the cloud adapter is implemented."
    );
  }

  return [...new Set(actions)];
}

function buildSummary(status, options) {
  const actionPlan = buildActionPlan(status);
  const supabase = status.supabaseTarget;
  const vercel = status.vercelTarget;
  const cloud = status.cloudRuntime;

  return `# MBTI Z Launch Handoff

Generated: ${new Date().toISOString()}

Target: \`${status.target}\`
Env source: \`${options.file ?? "process.env"}\`
Overall status: \`${status.ok ? "ready" : "blocked"}\`

## Proven Local Gates

- Repository hygiene: \`${status.repoHygiene.ok ? "ok" : "blocked"}\`
- Visual assets: \`${status.assets.ok ? `${status.assets.summary.houseCount}/4 houses, ${status.assets.summary.animalPosterCount}/16 animal posters` : "blocked"}\`
- Auth surface isolation: \`${status.authSurface.ok ? "ok" : "blocked"}\`
- UI route sweep: \`${status.uiRouteSweep.ok ? `${status.uiRouteSweep.auditedRouteCount}/${status.uiRouteSweep.expectedRouteCount} routes, ${status.uiRouteSweep.auditedSampleCount}/${status.uiRouteSweep.expectedSampleCount} samples` : "blocked"}\`
- Supabase required migrations: \`${supabase.summary.requiredMigrationCount - supabase.summary.missingRequiredMigrationCount}/${supabase.summary.requiredMigrationCount}\`
- Vercel deploy contract files: \`${vercel.summary.requiredFileCount - vercel.summary.missingRequiredFileCount}/${vercel.summary.requiredFileCount}\`
- Vercel deploy contract scripts: \`${vercel.summary.requiredScriptCount - vercel.summary.missingRequiredScriptCount}/${vercel.summary.requiredScriptCount}\`
- Cloud API contracts: \`${cloud.summary.apiContractCount - cloud.summary.apiContractFailureCount}/${cloud.summary.apiContractCount}\`
- Cloud API shape checks: \`${cloud.summary.apiShapeCheckCount - cloud.summary.apiShapeCheckFailureCount}/${cloud.summary.apiShapeCheckCount}\`
- Runtime mode requested by env: \`${cloud.summary.runtimeMode}\`

## Current Blockers

Supabase:
${bulletList(blockerIds(supabase.blockers))}

Vercel:
${bulletList(blockerIds(vercel.blockers))}

Environment:
${bulletList(status.env.blockingWarnings)}

Cloud runtime:
${bulletList(blockerIds(cloud.blockers))}

## Required External Actions

${bulletList(actionPlan)}

## Verification Commands

\`\`\`bash
npm run verify
npm run supabase:target -- --target=${status.target} --file=${options.file} --json
npm run vercel:target -- --target=${status.target} --json
npm run preflight:preview -- --file=${options.file} --json
\`\`\`

## Notes

- This handoff is secret-safe: it records env key status, blockers, hosts/refs, and guard summaries, not secret values.
- A blocked handoff is expected until fresh Supabase and Vercel targets are approved and bound.
- Do not enable \`NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud\` while this handoff is blocked.
`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const outDir = absolute(options.outDir ?? defaultOutDir());
  fs.mkdirSync(outDir, { recursive: true });

  const status = collectPreflightStatus({
    target: options.target,
    file: options.file,
  });
  const payload = {
    generatedAt: new Date().toISOString(),
    target: options.target,
    envSource: options.file,
    ok: status.ok,
    summary: {
      repoHygieneOk: status.repoHygiene.ok,
      assetsOk: status.assets.ok,
      authSurfaceOk: status.authSurface.ok,
      uiRouteSweepOk: status.uiRouteSweep.ok,
      supabaseTargetOk: status.supabaseTarget.ok,
      vercelTargetOk: status.vercelTarget.ok,
      cloudRuntimeOk: status.cloudRuntime.ok,
      envOk: status.env.ok,
    },
    status,
    actionPlan: buildActionPlan(status),
  };

  const jsonPath = path.join(outDir, "handoff-report.json");
  const markdownPath = path.join(outDir, "summary.md");
  writeJson(jsonPath, payload);
  fs.writeFileSync(markdownPath, buildSummary(status, options));

  console.log(`Launch handoff written to ${outDir}`);
  console.log(`Status: ${status.ok ? "ready" : "blocked"}`);
  console.log(`Summary: ${markdownPath}`);
  console.log(`JSON: ${jsonPath}`);

  if (options.strict && !status.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
