#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { collectUiRouteStateManifestStatus } from "./verify-ui-route-state-manifest.mjs";
import { collectUiRouteSweepStatus } from "./verify-ui-route-sweep.mjs";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS = [
  ["interaction", "output/ui-redesign-v3/audit/interaction-audit-report.json", 17],
  ["my-results", "output/ui-redesign-v3/audit/my-results-state-report.json", 10],
  ["webkit-png", "output/ui-redesign-v3/audit/webkit-png-report.json", null],
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(APP_ROOT, relativePath), "utf8"));
}

export function collectUiV3QualityStatus() {
  const manifest = collectUiRouteStateManifestStatus();
  const routeSweep = collectUiRouteSweepStatus();
  const failures = [
    ...manifest.failures.map((failure) => `manifest:${failure}`),
    ...routeSweep.failures.map((failure) => `route_sweep:${failure}`),
  ];
  const reports = {};

  for (const [name, relativePath, expectedCheckCount] of REPORTS) {
    try {
      const report = readJson(relativePath);
      reports[name] = {
        path: relativePath,
        passed: report.passed === true,
        checkCount: report.checkCount ?? null,
        generatedAt: report.generatedAt ?? null,
      };
      if (report.passed !== true) failures.push(`${name}:not_passed`);
      if (name === "webkit-png") {
        if (report.status !== 200) failures.push(`${name}:status:${report.status}`);
        if (report.overflow !== false) failures.push(`${name}:horizontal_overflow`);
        if (!report.downloadName?.endsWith(".png")) failures.push(`${name}:download_invalid`);
        if (!Array.isArray(report.consoleErrors) || report.consoleErrors.length) {
          failures.push(`${name}:console_errors`);
        }
        if (!Array.isArray(report.pageErrors) || report.pageErrors.length) {
          failures.push(`${name}:page_errors`);
        }
      } else if (!Array.isArray(report.failures)) {
        failures.push(`${name}:failures_invalid`);
      } else if (report.failures.length) {
        failures.push(`${name}:failures:${report.failures.length}`);
      }
      if (expectedCheckCount !== null && report.checkCount !== expectedCheckCount) {
        failures.push(`${name}:check_count:${report.checkCount}:${expectedCheckCount}`);
      }
    } catch (error) {
      failures.push(`${name}:report_unreadable:${error.message}`);
    }
  }

  return {
    ok: manifest.ok && routeSweep.ok && failures.length === 0,
    generatedAt: new Date().toISOString(),
    manifest,
    routeSweep,
    reports,
    failures,
  };
}

const result = collectUiV3QualityStatus();
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
