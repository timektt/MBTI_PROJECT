#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { collectUiRouteSweepStatus } from "./verify-ui-route-sweep.mjs";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DEFAULT_RECONNECT_AUDIT_PATH =
  "output/ui-skills-router/2026-06-29/reconnect-controls-compact/audit-report.json";
const REQUIRED_RECONNECT_ROUTES = new Set(["/dashboard", "/login"]);
const REQUIRED_RECONNECT_VIEWPORTS = new Set(["mobile", "desktop"]);
const REQUIRED_DOC_FRAGMENTS = [
  {
    file: "docs/mbti-z-execution-board.md",
    fragments: [
      "npm run ui:completion",
      "reconnect-controls-compact",
      "Historical live deltas from this planning pass",
      "This section is retained as execution history.",
    ],
  },
  {
    file: "docs/mbti-page-ux-sprint-plan.md",
    fragments: ["npm run ui:completion", "reconnect-controls-compact"],
  },
  {
    file: "docs/execution-status.md",
    fragments: ["npm run ui:completion", "reconnect-controls-compact"],
  },
  {
    file: "docs/vibe-to-prod-readiness.md",
    fragments: ["npm run ui:completion", "reconnect-controls-compact"],
  },
  {
    file: "docs/platform-setup-runbook.md",
    fragments: ["npm run ui:completion"],
  },
];
const FORBIDDEN_CURRENT_BOARD_FRAGMENTS = [
  "remaining QA gap is still",
  "remains the tallest remaining route-risk",
  "the remaining route-risk is",
  "the next P0 packet therefore needs",
  "keep `MBTIZ-0602` open",
  "continue `MBTIZ-0602`",
  "finish `MBTIZ-0602` and verify fallback copy",
  "remaining structural risk is",
];

function parseArgs(argv) {
  const parsed = {
    reconnectAudit: DEFAULT_RECONNECT_AUDIT_PATH,
  };

  for (const arg of argv) {
    if (arg.startsWith("--reconnect-audit=")) {
      parsed.reconnectAudit =
        arg.split("=").slice(1).join("=") || parsed.reconnectAudit;
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

function readText(relativeOrAbsolutePath) {
  return fs.readFileSync(absolutePath(relativeOrAbsolutePath), "utf8");
}

function routeViewportKey(result) {
  return `${result?.route ?? "unknown"}:${result?.viewport?.name ?? "unknown"}`;
}

function hasHorizontalOverflow(state) {
  const scrollWidth = Number(state?.scrollWidth);
  const clientWidth = Number(state?.clientWidth);

  return Number.isFinite(scrollWidth) && Number.isFinite(clientWidth)
    ? scrollWidth > clientWidth
    : true;
}

function collectReconnectControlsStatus(reconnectAuditPath) {
  const report = readJson(reconnectAuditPath);
  const results = Array.isArray(report.results) ? report.results : [];
  const failures = [];
  const resultKeys = new Set(results.map(routeViewportKey));

  if (report.ok !== true) {
    failures.push("reconnect_report_not_ok");
  }

  if (report.routeCount !== REQUIRED_RECONNECT_ROUTES.size) {
    failures.push(
      `reconnect_route_count:${report.routeCount ?? "missing"}:${REQUIRED_RECONNECT_ROUTES.size}`
    );
  }

  if (report.sampleCount !== REQUIRED_RECONNECT_ROUTES.size * REQUIRED_RECONNECT_VIEWPORTS.size) {
    failures.push(
      `reconnect_sample_count:${report.sampleCount ?? "missing"}:${
        REQUIRED_RECONNECT_ROUTES.size * REQUIRED_RECONNECT_VIEWPORTS.size
      }`
    );
  }

  if (report.issueCount !== 0) {
    failures.push(`reconnect_issue_count:${report.issueCount ?? "missing"}`);
  }

  if (results.length !== REQUIRED_RECONNECT_ROUTES.size * REQUIRED_RECONNECT_VIEWPORTS.size) {
    failures.push(
      `reconnect_result_count:${results.length}:${
        REQUIRED_RECONNECT_ROUTES.size * REQUIRED_RECONNECT_VIEWPORTS.size
      }`
    );
  }

  for (const route of REQUIRED_RECONNECT_ROUTES) {
    for (const viewport of REQUIRED_RECONNECT_VIEWPORTS) {
      const key = `${route}:${viewport}`;

      if (!resultKeys.has(key)) {
        failures.push(`reconnect_sample_missing:${key}`);
      }
    }
  }

  for (const result of results) {
    const label = routeViewportKey(result);
    const defaultState = result?.defaultState ?? {};
    const recoveryOpenState = result?.recoveryOpenState ?? {};

    if (!REQUIRED_RECONNECT_ROUTES.has(result?.route)) {
      failures.push(`${label}:unexpected_route`);
    }

    if (!REQUIRED_RECONNECT_VIEWPORTS.has(result?.viewport?.name)) {
      failures.push(`${label}:unexpected_viewport`);
    }

    if (result?.status !== 200) {
      failures.push(`${label}:status:${result?.status ?? "missing"}`);
    }

    if (result?.ok !== true) {
      failures.push(`${label}:not_ok`);
    }

    if (Array.isArray(result?.errors) ? result.errors.length > 0 : true) {
      failures.push(`${label}:errors`);
    }

    if (result?.route === "/dashboard" && result?.openedCloudTab !== true) {
      failures.push(`${label}:cloud_tab_not_opened`);
    }

    if (defaultState?.textareas !== 0) {
      failures.push(`${label}:default_textareas:${defaultState?.textareas ?? "missing"}`);
    }

    if (defaultState?.recoveryButtonFound !== true) {
      failures.push(`${label}:recovery_button_missing`);
    }

    if (defaultState?.statusTextHasOpenRecovery !== true) {
      failures.push(`${label}:open_recovery_copy_missing`);
    }

    if (defaultState?.statusTextHasCloseRecovery !== false) {
      failures.push(`${label}:close_recovery_copy_visible_by_default`);
    }

    if (hasHorizontalOverflow(defaultState)) {
      failures.push(`${label}:default_horizontal_overflow`);
    }

    if (recoveryOpenState?.textareas !== 1) {
      failures.push(`${label}:open_textareas:${recoveryOpenState?.textareas ?? "missing"}`);
    }

    if (recoveryOpenState?.textareaVisible !== true) {
      failures.push(`${label}:open_textarea_not_visible`);
    }

    if (recoveryOpenState?.statusTextHasCloseRecovery !== true) {
      failures.push(`${label}:close_recovery_copy_missing`);
    }

    if (hasHorizontalOverflow(recoveryOpenState)) {
      failures.push(`${label}:open_horizontal_overflow`);
    }
  }

  return {
    ok: failures.length === 0,
    auditPath: path.relative(APP_ROOT, absolutePath(reconnectAuditPath)),
    routeCount: report.routeCount ?? null,
    sampleCount: report.sampleCount ?? null,
    issueCount: report.issueCount ?? null,
    failures,
  };
}

function collectDocsStatus() {
  const failures = [];
  let requiredFragmentCount = 0;

  for (const entry of REQUIRED_DOC_FRAGMENTS) {
    const content = readText(entry.file);

    for (const fragment of entry.fragments) {
      requiredFragmentCount += 1;

      if (!content.includes(fragment)) {
        failures.push(`${entry.file}:missing:${fragment}`);
      }
    }
  }

  const executionBoard = readText("docs/mbti-z-execution-board.md");

  for (const fragment of FORBIDDEN_CURRENT_BOARD_FRAGMENTS) {
    if (executionBoard.includes(fragment)) {
      failures.push(`docs/mbti-z-execution-board.md:stale_current_claim:${fragment}`);
    }
  }

  return {
    ok: failures.length === 0,
    checkedFileCount: REQUIRED_DOC_FRAGMENTS.length,
    requiredFragmentCount,
    forbiddenCurrentBoardFragmentCount: FORBIDDEN_CURRENT_BOARD_FRAGMENTS.length,
    failures,
  };
}

export function collectUiCompletionStatus(options = {}) {
  const reconnectAuditPath = options.reconnectAudit ?? DEFAULT_RECONNECT_AUDIT_PATH;
  const routeSweep = collectUiRouteSweepStatus();
  const reconnectControls = collectReconnectControlsStatus(reconnectAuditPath);
  const docs = collectDocsStatus();
  const failures = [
    ...routeSweep.failures.map((failure) => `route_sweep:${failure}`),
    ...reconnectControls.failures.map((failure) => `reconnect_controls:${failure}`),
    ...docs.failures.map((failure) => `docs:${failure}`),
  ];

  return {
    ok: routeSweep.ok && reconnectControls.ok && docs.ok && failures.length === 0,
    generatedAt: new Date().toISOString(),
    uiSkillsRouter: {
      scope: "project-wide",
      commands: [
        "npx ui-skills start",
        "npx ui-skills categories",
        "npx ui-skills list --category testing",
        "npx ui-skills list --category frontend",
        "npx ui-skills list --category craft",
        "npx ui-skills get pbakaus/audit",
        "npx ui-skills get pbakaus/harden",
      ],
      selected: ["pbakaus/audit", "pbakaus/harden"],
      usedFor: "completion guard and hardening validation checklist",
    },
    routeSweep,
    reconnectControls,
    docs,
    failures,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = collectUiCompletionStatus(args);

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
