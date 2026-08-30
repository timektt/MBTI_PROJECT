#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const heldRoutes = [
  ["/login", "pages/login.tsx", "AccountHold", "mode", "login", null],
  ["/register", "pages/register.tsx", "AccountHold", "mode", "register", null],
  ["/forgot-password", "pages/forgot-password.tsx", "AccountHold", "mode", "recovery", null],
  ["/profile", "pages/profile.tsx", "RelaunchState", "intent", "profile-home", "profile"],
  ["/profile/demo", "pages/profile/[username]/index.tsx", "RelaunchState", "intent", "public-profile", "profile"],
  ["/profile/demo/followers", "pages/profile/[username]/followers.tsx", "RelaunchState", "intent", "followers", "profile"],
  ["/profile/demo/following", "pages/profile/[username]/following.tsx", "RelaunchState", "intent", "following", "profile"],
  ["/u/demo", "pages/u/[username].tsx", "RelaunchState", "intent", "user-alias", "profile"],
  ["/settings", "pages/settings/index.tsx", "RelaunchState", "intent", "account-settings", "settings"],
  ["/settings/password", "pages/settings/password.tsx", "RelaunchState", "intent", "password-settings", "settings"],
  ["/setup-profile", "pages/setup-profile.tsx", "RelaunchState", "intent", "profile-setup", "settings"],
  ["/setup-username", "pages/setup-username.tsx", "RelaunchState", "intent", "username-setup", "settings"],
  ["/reset-password", "pages/reset-password.tsx", "RelaunchState", "intent", "password-reset", "verification"],
  ["/verify-email", "pages/verify-email.tsx", "RelaunchState", "intent", "email-verification", "verification"],
  ["/explore", "pages/explore.tsx", "RelaunchState", "intent", "community-explore", "community"],
  ["/leaderboard", "pages/leaderboard.tsx", "RelaunchState", "intent", "community-leaderboard", "community"],
  ["/card/demo-card", "pages/card/[id].tsx", "RelaunchState", "intent", "community-card", "community"],
  ["/card/me", "pages/card/me.tsx", "RelaunchState", "intent", "personal-card", "community"],
  ["/profile/demo/cards", "pages/profile/[username]/cards.tsx", "RelaunchState", "intent", "profile-cards", "community"],
  ["/share/demo", "pages/share/[slug].tsx", "RelaunchState", "intent", "public-share", "share"],
  ["/admin", "pages/admin/index.tsx", "RelaunchState", "intent", "admin-overview", "operations"],
  ["/admin/cards", "pages/admin/cards.tsx", "RelaunchState", "intent", "admin-cards", "operations"],
  ["/admin/comments", "pages/admin/comments.tsx", "RelaunchState", "intent", "admin-comments", "operations"],
  ["/admin/settings", "pages/admin/settings.tsx", "RelaunchState", "intent", "admin-settings", "operations"],
  ["/admin/users", "pages/admin/users.tsx", "RelaunchState", "intent", "admin-users", "operations"],
].map(([route, file, component, prop, value, scenario]) => ({
  route,
  file,
  component,
  prop,
  value,
  scenario,
}));

function jsxTagName(node) {
  return ts.isIdentifier(node.tagName) ? node.tagName.text : node.tagName.getText();
}

function literalAttributeValue(attribute) {
  if (!attribute.initializer) return true;
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

function inspectRoute(entry) {
  const absolutePath = path.join(APP_ROOT, entry.file);
  const source = fs.readFileSync(absolutePath, "utf8");
  const sourceFile = ts.createSourceFile(
    entry.file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const failures = [];
  const componentNodes = [];
  const imports = [];

  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier.text);
    }

    if (ts.isCallExpression(node)) {
      const called = node.expression.getText(sourceFile);
      if (called === "fetch" || called.startsWith("axios.") || called === "axios") {
        failures.push(`network_call:${called}`);
      }
    }

    if (ts.isStringLiteralLike(node) && node.text.includes("/api/")) {
      failures.push("api_path_literal");
    }

    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tagName = jsxTagName(node);
      if (tagName === entry.component) componentNodes.push(node);
      if (tagName.toLowerCase() === "form") failures.push("form_surface");
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (componentNodes.length !== 1) {
    failures.push(`hold_component_count:${componentNodes.length}`);
  } else {
    const attribute = componentNodes[0].attributes.properties.find(
      (candidate) => ts.isJsxAttribute(candidate) && candidate.name.text === entry.prop
    );
    const actual = attribute && ts.isJsxAttribute(attribute)
      ? literalAttributeValue(attribute)
      : undefined;
    if (actual !== entry.value) {
      failures.push(`${entry.prop}:${actual ?? "missing"}:${entry.value}`);
    }

    if (entry.scenario) {
      const scenarioAttribute = componentNodes[0].attributes.properties.find(
        (candidate) => ts.isJsxAttribute(candidate) && candidate.name.text === "scenario"
      );
      const actualScenario =
        scenarioAttribute && ts.isJsxAttribute(scenarioAttribute)
          ? literalAttributeValue(scenarioAttribute)
          : undefined;
      if (actualScenario !== entry.scenario) {
        failures.push(`scenario:${actualScenario ?? "missing"}:${entry.scenario}`);
      }
    }
  }

  const expectedImport =
    entry.component === "AccountHold"
      ? "@/components/cyber/account-hold"
      : "@/components/cyber/relaunch-state";
  if (!imports.includes(expectedImport)) failures.push(`shared_import_missing:${expectedImport}`);
  if (imports.some((sourcePath) => sourcePath.includes("api-request") || sourcePath === "axios")) {
    failures.push("network_import");
  }

  return { ...entry, failures };
}

const results = heldRoutes.map(inspectRoute);
const failures = results.flatMap((result) =>
  result.failures.map((failure) => `${result.route}:${failure}`)
);
const report = {
  ok: failures.length === 0,
  routeCount: results.length,
  accountRouteCount: results.filter((entry) => entry.component === "AccountHold").length,
  relaunchRouteCount: results.filter((entry) => entry.component === "RelaunchState").length,
  failures,
};

console.log(JSON.stringify(report, null, 2));

if (!report.ok) process.exitCode = 1;
