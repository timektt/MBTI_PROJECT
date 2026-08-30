#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const EXPECTED_ROOT_APP_PATHS = [
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "tailwind.config.js",
  "pages",
  "components",
  "lib",
  "data",
  "prisma",
  "public",
  "styles",
  "scripts",
  "docs",
  "PRD.md",
  "CONTEXT.md",
  "AGENTS.md",
];

const REVIEWED_RETIRED_OLD_ROOT_PATHS = new Map([
  [
    "mbti_test/middleware.ts",
    "guest-first runtime intentionally has no active Next middleware until server-side auth/authorization is rebuilt",
  ],
  [
    "mbti_test/pages/reset-password.ts",
    "old duplicate API handler lived under pages/ and is replaced by pages/api/reset-password.ts plus pages/reset-password.tsx",
  ],
  [
    "mbti_test/scripts/debug-env.ts",
    "old debug helper printed DATABASE_URL and should not be restored",
  ],
]);

function isOldRootPath(entry) {
  return entry.startsWith("mbti_test/");
}

function isOldRootDbDataPath(entry) {
  return entry.startsWith("mbti_test/db_data/");
}

function stripOldRootPrefix(entry) {
  return entry.replace(/^mbti_test\//, "");
}

function parseArgs(argv) {
  return {
    json: argv.includes("--json"),
    strict: argv.includes("--strict"),
  };
}

function git(args) {
  return execFileSync("git", args, {
    cwd: APP_ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function gitLines(args) {
  const output = git(args);
  return output ? output.split("\n").filter(Boolean) : [];
}

function exists(relativePath) {
  return fs.existsSync(path.join(APP_ROOT, relativePath));
}

function countByPrefix(entries, prefix) {
  return entries.filter((entry) => entry === prefix || entry.startsWith(`${prefix}/`)).length;
}

export function collectHygieneStatus() {
  const tracked = gitLines(["ls-files"]);
  const untracked = gitLines(["ls-files", "--others", "--exclude-standard"]);
  const deleted = gitLines(["diff", "--name-only", "--diff-filter=D"]);
  const stagedDeleted = gitLines(["diff", "--cached", "--name-only", "--diff-filter=D"]);
  const modified = gitLines(["diff", "--name-only", "--diff-filter=M"]);
  const gitignore = exists(".gitignore")
    ? fs.readFileSync(path.join(APP_ROOT, ".gitignore"), "utf8")
    : "";

  const rootPathStatus = EXPECTED_ROOT_APP_PATHS.map((relativePath) => ({
    path: relativePath,
    exists: exists(relativePath),
    tracked: tracked.includes(relativePath) || countByPrefix(tracked, relativePath) > 0,
    untracked: untracked.includes(relativePath) || countByPrefix(untracked, relativePath) > 0,
  }));

  const trackedOldRoot = tracked.filter(isOldRootPath);
  const trackedOldDbData = trackedOldRoot.filter(isOldRootDbDataPath);
  const trackedOldSource = trackedOldRoot.filter((entry) => !isOldRootDbDataPath(entry));
  const deletedOldRootCount = deleted.filter(isOldRootPath).length;
  const stagedDeletedOldRootCount = stagedDeleted.filter(isOldRootPath).length;
  const trackedEnvFiles = tracked.filter(
    (entry) => /^\.env($|\.|\/)/.test(entry) && entry !== ".env.example"
  );

  const checks = [
    {
      id: "root_app_present",
      ok: rootPathStatus.every((entry) => entry.exists),
      detail: rootPathStatus.filter((entry) => !entry.exists).map((entry) => entry.path),
    },
    {
      id: "root_app_tracked",
      ok: rootPathStatus.every((entry) => entry.tracked),
      detail: rootPathStatus
        .filter((entry) => entry.exists && !entry.tracked && entry.untracked)
        .map((entry) => entry.path),
    },
    {
      id: "old_root_deleted",
      ok: trackedOldRoot.length === 0 || deletedOldRootCount > 0 || stagedDeletedOldRootCount > 0,
      detail: `${trackedOldRoot.length} tracked mbti_test paths, ${deletedOldRootCount} unstaged deleted mbti_test paths, ${stagedDeletedOldRootCount} staged deleted mbti_test paths`,
    },
    {
      id: "tracked_db_data_removed",
      ok: !tracked.some((entry) => entry.startsWith("mbti_test/db_data/")),
      detail: `${tracked.filter((entry) => entry.startsWith("mbti_test/db_data/")).length} tracked mbti_test/db_data paths`,
    },
    {
      id: "db_data_ignored",
      ok:
        gitignore.includes("**/db_data/") ||
      gitignore.includes("/mbti_test/db_data/"),
      detail: "ignore rules should prevent new db_data directories from being added",
    },
    {
      id: "env_not_tracked",
      ok: trackedEnvFiles.length === 0,
      detail: trackedEnvFiles,
    },
  ];

  const deletedOldSource = deleted.filter((entry) => isOldRootPath(entry) && !isOldRootDbDataPath(entry));
  const stagedDeletedOldSource = stagedDeleted.filter(
    (entry) => isOldRootPath(entry) && !isOldRootDbDataPath(entry)
  );

  const oldRootSourceStatus = trackedOldSource.map((oldPath) => {
    const rootPath = stripOldRootPrefix(oldPath);

    return {
      oldPath,
      rootPath,
      oldPathDeleted: deleted.includes(oldPath),
      rootExists: exists(rootPath),
      rootTracked: tracked.includes(rootPath) || countByPrefix(tracked, rootPath) > 0,
      rootUntracked: untracked.includes(rootPath) || countByPrefix(untracked, rootPath) > 0,
      reviewedRetired: REVIEWED_RETIRED_OLD_ROOT_PATHS.has(oldPath),
      retireReason: REVIEWED_RETIRED_OLD_ROOT_PATHS.get(oldPath) ?? null,
    };
  });

  const missingRootCounterparts = oldRootSourceStatus.filter((entry) => !entry.rootExists);
  const unreviewedMissingRootCounterparts = missingRootCounterparts.filter((entry) => !entry.reviewedRetired);
  const reviewedRetiredMissingRootCounterparts = missingRootCounterparts.filter((entry) => entry.reviewedRetired);
  const sourceMoveReview = {
    trackedOldSourceCount: trackedOldSource.length,
    deletedOldSourceCount: deletedOldSource.length,
    oldSourceWithRootCounterpartCount: oldRootSourceStatus.length - missingRootCounterparts.length,
    oldSourceWithoutRootCounterpartCount: missingRootCounterparts.length,
    reviewedRetiredMissingRootCount: reviewedRetiredMissingRootCounterparts.length,
    unreviewedMissingRootCounterpartCount: unreviewedMissingRootCounterparts.length,
    missingRootCounterpartSamples: unreviewedMissingRootCounterparts.slice(0, 30),
    reviewedRetiredMissingRootCounterparts,
  };

  const warnings = [
    {
      id: "old_root_source_counterparts",
      ok: unreviewedMissingRootCounterparts.length === 0,
      detail:
        unreviewedMissingRootCounterparts.length === 0
          ? "all missing non-db_data old-root counterparts are reviewed retirements"
          : `${unreviewedMissingRootCounterparts.length} tracked non-db_data old-root files have no reviewed root counterpart`,
    },
  ];

  const blockers = checks.filter((check) => !check.ok);

  return {
    generatedAt: new Date().toISOString(),
    appRoot: APP_ROOT,
    summary: {
      trackedCount: tracked.length,
      untrackedCount: untracked.length,
      deletedCount: deleted.length,
      stagedDeletedCount: stagedDeleted.length,
      modifiedCount: modified.length,
      trackedOldRootCount: trackedOldRoot.length,
      trackedOldSourceCount: trackedOldSource.length,
      trackedDbDataCount: trackedOldDbData.length,
      stagedDeletedOldRootCount,
      stagedDeletedOldSourceCount: stagedDeletedOldSource.length,
      rootAppUntrackedCount: rootPathStatus.filter((entry) => entry.exists && !entry.tracked && entry.untracked).length,
      blockerCount: blockers.length,
      warningCount: warnings.filter((warning) => !warning.ok).length,
    },
    checks,
    rootPathStatus,
    sourceMoveReview,
    warnings,
    blockers,
    nextActions: [
      "Review this report before staging the root move.",
      "Remove tracked mbti_test/db_data paths from the index in a dedicated hygiene PR.",
      "Stage the root app move deliberately after confirming no real source files are stranded under mbti_test/.",
      "Keep .env files untracked and commit only .env.example placeholders.",
    ],
  };
}

function printText(report) {
  console.log("Repo hygiene audit");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Root: ${report.appRoot}`);
  console.log("");
  console.log("Summary:");
  for (const [key, value] of Object.entries(report.summary)) {
    console.log(`- ${key}: ${value}`);
  }
  console.log("");
  console.log("Checks:");
  for (const check of report.checks) {
    const status = check.ok ? "ok" : "blocker";
    const detail =
      Array.isArray(check.detail) && check.detail.length > 0
        ? ` (${check.detail.join(", ")})`
        : typeof check.detail === "string"
          ? ` (${check.detail})`
          : "";
    console.log(`- ${status}: ${check.id}${detail}`);
  }
  console.log("");
  console.log("Warnings:");
  for (const warning of report.warnings) {
    const status = warning.ok ? "ok" : "review";
    const detail = typeof warning.detail === "string" ? ` (${warning.detail})` : "";
    console.log(`- ${status}: ${warning.id}${detail}`);
  }
  console.log("");
  console.log("Source move review:");
  for (const [key, value] of Object.entries(report.sourceMoveReview)) {
    if (key === "missingRootCounterpartSamples" || key === "reviewedRetiredMissingRootCounterparts") {
      console.log(`- ${key}: ${value.length}`);
      for (const entry of value.slice(0, 10)) {
        const reason = entry.retireReason ? ` (${entry.retireReason})` : "";
        console.log(`  - ${entry.oldPath} -> ${entry.rootPath}${reason}`);
      }
      continue;
    }
    console.log(`- ${key}: ${value}`);
  }
  console.log("");
  console.log("Next actions:");
  for (const action of report.nextActions) {
    console.log(`- ${action}`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = collectHygieneStatus();

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printText(report);
  }

  if (options.strict && report.blockers.length > 0) {
    process.exitCode = 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
