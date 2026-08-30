#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const HOLD_PAGE_RULES = [
  { file: "pages/login.tsx", component: "AccountHold" },
  { file: "pages/register.tsx", component: "AccountHold" },
  { file: "pages/forgot-password.tsx", component: "AccountHold" },
  { file: "pages/profile.tsx", component: "RelaunchState", scenario: "profile" },
  { file: "pages/u/[username].tsx", component: "RelaunchState", scenario: "profile" },
  { file: "pages/profile/[username]/index.tsx", component: "RelaunchState", scenario: "profile" },
  { file: "pages/profile/[username]/followers.tsx", component: "RelaunchState", scenario: "profile" },
  { file: "pages/profile/[username]/following.tsx", component: "RelaunchState", scenario: "profile" },
  { file: "pages/profile/[username]/cards.tsx", component: "RelaunchState", scenario: "community" },
  { file: "pages/settings/index.tsx", component: "RelaunchState", scenario: "settings" },
  { file: "pages/settings/password.tsx", component: "RelaunchState", scenario: "settings" },
  { file: "pages/setup-profile.tsx", component: "RelaunchState", scenario: "settings" },
  { file: "pages/setup-username.tsx", component: "RelaunchState", scenario: "settings" },
  { file: "pages/reset-password.tsx", component: "RelaunchState", scenario: "verification" },
  { file: "pages/verify-email.tsx", component: "RelaunchState", scenario: "verification" },
  { file: "pages/explore.tsx", component: "RelaunchState", scenario: "community" },
  { file: "pages/leaderboard.tsx", component: "RelaunchState", scenario: "community" },
  { file: "pages/card/[id].tsx", component: "RelaunchState", scenario: "community" },
  { file: "pages/card/me.tsx", component: "RelaunchState", scenario: "community" },
  { file: "pages/share/[slug].tsx", component: "RelaunchState", scenario: "share" },
  { file: "pages/admin/index.tsx", component: "RelaunchState", scenario: "operations" },
  { file: "pages/admin/cards.tsx", component: "RelaunchState", scenario: "operations" },
  { file: "pages/admin/comments.tsx", component: "RelaunchState", scenario: "operations" },
  { file: "pages/admin/settings.tsx", component: "RelaunchState", scenario: "operations" },
  { file: "pages/admin/users.tsx", component: "RelaunchState", scenario: "operations" },
];

const API_RULES = [
  {
    file: "pages/api/admin/cards/list.ts",
    method: "GET",
    required: ["getServerSession", "authOptions", 'role !== "admin"', "res.status(403)", "rateLimit("],
  },
  {
    file: "pages/api/admin/cards/delete.ts",
    method: "DELETE",
    required: ["getServerSession", "authOptions", 'role !== "admin"', "res.status(403)", "rateLimit("],
  },
  {
    file: "pages/api/upload-image.ts",
    method: "POST",
    required: [
      "getServerSession",
      "authOptions",
      "session?.user?.id",
      "res.status(401)",
      "rateLimit(",
      "maxFileSize",
      "allowedTypes",
    ],
  },
  {
    file: "pages/api/register.ts",
    method: "POST",
    required: ["rateLimit(", "RegisterUserSchema.safeParse"],
  },
  {
    file: "pages/api/forgot-password.ts",
    method: "POST",
    required: ["rateLimit("],
  },
  {
    file: "pages/api/reset-password.ts",
    method: "POST",
    required: ["rateLimit(", "bcrypt.hash"],
  },
  {
    file: "pages/api/activity/post.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/cards/create.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/cards/toggle-like.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/comment/post.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/comment/like.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/follow.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/follow/toggle.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/like/card.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/profile/updateBio.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.email", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/settings/update.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/settings/changePassword.tsx",
    method: "POST",
    required: ["getServerSession", "authOptions", "session.user?.email", "res.status(401)", "rateLimit("],
  },
  {
    file: "pages/api/user/set-username.ts",
    method: "POST",
    required: ["getServerSession", "authOptions", "session?.user?.id", "res.status(401)", "rateLimit("],
  },
];

function parseArgs(argv) {
  return {
    json: argv.includes("--json"),
  };
}

function absolute(relativePath) {
  return path.join(APP_ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function methodGuardPresent(source, method) {
  return source.includes(`req.method !== "${method}"`);
}

function literalJsxAttribute(node, name) {
  const attribute = node.attributes.properties.find(
    (candidate) => ts.isJsxAttribute(candidate) && candidate.name.text === name
  );
  if (!attribute || !ts.isJsxAttribute(attribute) || !attribute.initializer) return null;
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer.text;
  if (
    ts.isJsxExpression(attribute.initializer) &&
    attribute.initializer.expression &&
    ts.isStringLiteral(attribute.initializer.expression)
  ) {
    return attribute.initializer.expression.text;
  }
  return null;
}

function collectJsxComponents(source, file, component) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const matches = [];

  function visit(node) {
    if (
      (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) &&
      ts.isIdentifier(node.tagName) &&
      node.tagName.text === component
    ) {
      matches.push(node);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return matches;
}

function collectHoldPageStatus() {
  return HOLD_PAGE_RULES.map((rule) => {
    if (!exists(rule.file)) {
      return {
        file: rule.file,
        ok: false,
        failures: ["file_missing"],
      };
    }

    const source = read(rule.file);
    const failures = [];
    const surfaces = collectJsxComponents(source, rule.file, rule.component);

    if (surfaces.length !== 1) {
      failures.push(`expected_surface_count:${rule.component}:${surfaces.length}`);
    } else if (rule.scenario) {
      const actualScenario = literalJsxAttribute(surfaces[0], "scenario");
      if (actualScenario !== rule.scenario) {
        failures.push(`scenario:${actualScenario ?? "missing"}:${rule.scenario}`);
      }
    }

    return {
      file: rule.file,
      ok: failures.length === 0,
      failures,
    };
  });
}

function collectApiStatus() {
  return API_RULES.map((rule) => {
    if (!exists(rule.file)) {
      return {
        file: rule.file,
        ok: false,
        failures: ["file_missing"],
      };
    }

    const source = read(rule.file);
    const failures = [];

    if (!methodGuardPresent(source, rule.method)) {
      failures.push(`method_guard:${rule.method}`);
    }

    for (const required of rule.required) {
      if (!source.includes(required)) {
        failures.push(`missing:${required}`);
      }
    }

    return {
      file: rule.file,
      ok: failures.length === 0,
      failures,
    };
  });
}

export function collectAuthSurfaceIsolationStatus() {
  const holdPages = collectHoldPageStatus();
  const apiContracts = collectApiStatus();
  const middlewareFiles = ["middleware.ts", "middleware.js"].filter(exists);
  const checks = [
    {
      id: "legacy_ui_surfaces_are_hold_states",
      ok: holdPages.every((entry) => entry.ok),
      detail: `${holdPages.filter((entry) => entry.ok).length}/${holdPages.length} hold surfaces match expected components`,
    },
    {
      id: "high_risk_api_routes_are_guarded",
      ok: apiContracts.every((entry) => entry.ok),
      detail: `${apiContracts.filter((entry) => entry.ok).length}/${apiContracts.length} high-risk API routes match expected guards`,
    },
    {
      id: "next_middleware_absent_until_auth_reconnect",
      ok: middlewareFiles.length === 0,
      detail: middlewareFiles.length === 0
        ? "no active Next middleware"
        : middlewareFiles.join(", "),
    },
  ];
  const blockers = [
    ...holdPages.filter((entry) => !entry.ok).map((entry) => ({
      id: "hold_page_drift",
      file: entry.file,
      failures: entry.failures,
    })),
    ...apiContracts.filter((entry) => !entry.ok).map((entry) => ({
      id: "api_guard_drift",
      file: entry.file,
      failures: entry.failures,
    })),
    ...middlewareFiles.map((file) => ({
      id: "active_middleware_present",
      file,
      failures: ["middleware should stay absent until auth reconnect is deliberate"],
    })),
  ];

  return {
    generatedAt: new Date().toISOString(),
    appRoot: APP_ROOT,
    ok: blockers.length === 0,
    summary: {
      holdPageCount: holdPages.length,
      holdPageFailureCount: holdPages.filter((entry) => !entry.ok).length,
      apiRouteCount: apiContracts.length,
      apiRouteFailureCount: apiContracts.filter((entry) => !entry.ok).length,
      middlewareCount: middlewareFiles.length,
      blockerCount: blockers.length,
    },
    checks,
    holdPages,
    apiContracts,
    blockers,
  };
}

function printHuman(status) {
  console.log("Auth surface isolation audit");
  console.log(`Generated: ${status.generatedAt}`);
  console.log(`Root: ${status.appRoot}`);
  console.log("");
  console.log("Checks:");

  for (const check of status.checks) {
    console.log(`  - ${check.id}: ${check.ok ? "OK" : "BLOCKER"} (${check.detail})`);
  }

  if (status.blockers.length > 0) {
    console.log("");
    console.log("Blockers:");
    for (const blocker of status.blockers) {
      console.log(`  - ${blocker.id}: ${blocker.file} (${blocker.failures.join(", ")})`);
    }
    return;
  }

  console.log("");
  console.log("Auth surface isolation is ready.");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const status = collectAuthSurfaceIsolationStatus();

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
