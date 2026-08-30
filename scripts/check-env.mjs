#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const GROUPS = [
  {
    name: "App URLs",
    keys: ["NEXT_PUBLIC_SITE_URL", "NEXTAUTH_URL"],
  },
  {
    name: "Runtime",
    keys: ["NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME"],
  },
  {
    name: "Auth",
    keys: [
      "NEXTAUTH_SECRET",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GITHUB_ID",
      "GITHUB_SECRET",
    ],
  },
  {
    name: "Database",
    keys: ["DATABASE_URL", "DIRECT_URL"],
  },
  {
    name: "Email",
    keys: [
      "EMAIL_SERVER_HOST",
      "EMAIL_SERVER_PORT",
      "EMAIL_SERVER_SECURE",
      "EMAIL_SERVER_USER",
      "EMAIL_SERVER_PASSWORD",
      "EMAIL_FROM",
    ],
  },
  {
    name: "Realtime",
    keys: [
      "PUSHER_APP_ID",
      "PUSHER_KEY",
      "PUSHER_SECRET",
      "PUSHER_CLUSTER",
      "NEXT_PUBLIC_PUSHER_KEY",
      "NEXT_PUBLIC_PUSHER_CLUSTER",
    ],
  },
  {
    name: "Media",
    keys: [
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ],
  },
];

const TARGETS = new Set(["development", "preview", "production"]);
const OPTIONAL_BY_TARGET = {
  development: new Set(["DIRECT_URL", "NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME"]),
  preview: new Set(["NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME"]),
  production: new Set(["NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME"]),
};

function parseArgs(argv) {
  const parsed = {
    target: "development",
    file: null,
    json: false,
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

    if (arg === "--json") {
      parsed.json = true;
    }
  }

  if (!TARGETS.has(parsed.target)) {
    throw new Error(
      `Unsupported target "${parsed.target}". Use development, preview, or production.`
    );
  }

  return parsed;
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvFile(filePath) {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(APP_ROOT, filePath);

  const raw = fs.readFileSync(absolutePath, "utf8");
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!match) {
      continue;
    }

    env[match[1]] = stripQuotes(match[2]);
  }

  return { absolutePath, env };
}

function buildEnvMap(filePath) {
  const fromProcess = Object.fromEntries(
    Object.entries(process.env).filter(([, value]) => typeof value === "string")
  );

  if (!filePath) {
    return { source: null, values: fromProcess };
  }

  const { absolutePath, env } = parseEnvFile(filePath);

  return {
    source: absolutePath,
    values: {
      ...env,
      ...fromProcess,
    },
  };
}

function isPlaceholder(value) {
  if (!value) {
    return false;
  }

  const lowered = value.toLowerCase();
  return (
    lowered.startsWith("replace-with-") ||
    lowered.includes("example.com") ||
    lowered.includes("your-api-key") ||
    lowered.includes("your-api-url") ||
    lowered === "ci-secret"
  );
}

function looksLikeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeConnectionString(value) {
  return value.includes("://");
}

function parseUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isLocalHostName(hostname) {
  return /^(localhost|127\.0\.0\.1)$/.test(hostname);
}

function looksLikePostgresConnectionString(value) {
  const url = parseUrl(value);
  return Boolean(url && (url.protocol === "postgres:" || url.protocol === "postgresql:"));
}

function isIntegerPort(value) {
  if (!/^\d+$/.test(value)) {
    return false;
  }

  const port = Number(value);
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

function isBooleanString(value) {
  return value === "true" || value === "false";
}

function looksLikeEmailAddress(value) {
  const trimmed = value.trim();
  const addressMatch = trimmed.match(/<([^<>]+)>$/);
  const address = addressMatch ? addressMatch[1] : trimmed;

  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address);
}

function buildChecks(values, target) {
  const missing = [];
  const warnings = [];
  const blockingWarnings = [];
  const optionalKeys = OPTIONAL_BY_TARGET[target] ?? new Set();
  const blockDeployWarnings = target !== "development";

  function addWarning(message, { blocking = false } = {}) {
    warnings.push(message);

    if (blocking) {
      blockingWarnings.push(message);
    }
  }

  for (const group of GROUPS) {
    for (const key of group.keys) {
      if (!values[key] && !optionalKeys.has(key)) {
        missing.push({ key, group: group.name });
      }
    }
  }

  const siteUrl = values.NEXT_PUBLIC_SITE_URL;
  const authUrl = values.NEXTAUTH_URL;
  const databaseUrl = values.DATABASE_URL;
  const directUrl = values.DIRECT_URL;
  const runtimeMode = values.NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME;
  const emailServerPort = values.EMAIL_SERVER_PORT;
  const emailServerSecure = values.EMAIL_SERVER_SECURE;
  const emailFrom = values.EMAIL_FROM;
  const pusherKey = values.PUSHER_KEY;
  const publicPusherKey = values.NEXT_PUBLIC_PUSHER_KEY;
  const pusherCluster = values.PUSHER_CLUSTER;
  const publicPusherCluster = values.NEXT_PUBLIC_PUSHER_CLUSTER;
  const nextAuthSecret = values.NEXTAUTH_SECRET;

  if (siteUrl && !looksLikeUrl(siteUrl)) {
    addWarning("NEXT_PUBLIC_SITE_URL should be a valid http/https URL.", {
      blocking: blockDeployWarnings,
    });
  }

  if (authUrl && !looksLikeUrl(authUrl)) {
    addWarning("NEXTAUTH_URL should be a valid http/https URL.", {
      blocking: blockDeployWarnings,
    });
  }

  if (databaseUrl && !looksLikeConnectionString(databaseUrl)) {
    addWarning("DATABASE_URL should be a valid connection string.", {
      blocking: blockDeployWarnings,
    });
  }

  if (
    databaseUrl &&
    looksLikeConnectionString(databaseUrl) &&
    !looksLikePostgresConnectionString(databaseUrl)
  ) {
    addWarning("DATABASE_URL should use postgres:// or postgresql://.", {
      blocking: blockDeployWarnings,
    });
  }

  if (directUrl && !looksLikeConnectionString(directUrl)) {
    addWarning("DIRECT_URL should be a valid connection string.", {
      blocking: blockDeployWarnings,
    });
  }

  if (
    directUrl &&
    looksLikeConnectionString(directUrl) &&
    !looksLikePostgresConnectionString(directUrl)
  ) {
    addWarning("DIRECT_URL should use postgres:// or postgresql://.", {
      blocking: blockDeployWarnings,
    });
  }

  if (
    runtimeMode &&
    runtimeMode !== "guest-local" &&
    runtimeMode !== "cloud"
  ) {
    addWarning(
      "NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME should be guest-local or cloud.",
      { blocking: blockDeployWarnings }
    );
  }

  if (target !== "development" && runtimeMode === "cloud") {
    addWarning(
      "NEXT_PUBLIC_MBTI_ASSESSMENT_RUNTIME=cloud is blocked until the Supabase-backed adapter is implemented and verified.",
      { blocking: true }
    );
  }

  if (target !== "development") {
    const parsedSiteUrl = siteUrl ? parseUrl(siteUrl) : null;
    const parsedAuthUrl = authUrl ? parseUrl(authUrl) : null;

    if (siteUrl && /localhost|127\.0\.0\.1/.test(siteUrl)) {
      addWarning("NEXT_PUBLIC_SITE_URL still points to localhost.", {
        blocking: true,
      });
    }

    if (authUrl && /localhost|127\.0\.0\.1/.test(authUrl)) {
      addWarning("NEXTAUTH_URL still points to localhost.", {
        blocking: true,
      });
    }

    if (databaseUrl && /localhost|127\.0\.0\.1/.test(databaseUrl)) {
      addWarning("DATABASE_URL still points to a local database.", {
        blocking: true,
      });
    }

    if (directUrl && /localhost|127\.0\.0\.1/.test(directUrl)) {
      addWarning("DIRECT_URL still points to a local database.", {
        blocking: true,
      });
    }

    if (
      parsedSiteUrl &&
      parsedAuthUrl &&
      parsedSiteUrl.origin !== parsedAuthUrl.origin
    ) {
      addWarning(
        "NEXT_PUBLIC_SITE_URL and NEXTAUTH_URL should share the same origin for deploy targets.",
        { blocking: true }
      );
    }

    if (
      parsedSiteUrl &&
      parsedSiteUrl.protocol !== "https:" &&
      !isLocalHostName(parsedSiteUrl.hostname)
    ) {
      addWarning("NEXT_PUBLIC_SITE_URL should use https for deploy targets.", {
        blocking: true,
      });
    }

    if (
      parsedAuthUrl &&
      parsedAuthUrl.protocol !== "https:" &&
      !isLocalHostName(parsedAuthUrl.hostname)
    ) {
      addWarning("NEXTAUTH_URL should use https for deploy targets.", {
        blocking: true,
      });
    }
  }

  if (emailServerPort && !isIntegerPort(emailServerPort)) {
    addWarning("EMAIL_SERVER_PORT should be an integer from 1 to 65535.", {
      blocking: blockDeployWarnings,
    });
  }

  if (emailServerSecure && !isBooleanString(emailServerSecure)) {
    addWarning("EMAIL_SERVER_SECURE should be true or false.", {
      blocking: blockDeployWarnings,
    });
  }

  if (emailFrom && !looksLikeEmailAddress(emailFrom)) {
    addWarning("EMAIL_FROM should be an email address or Name <email> value.", {
      blocking: blockDeployWarnings,
    });
  }

  if (
    nextAuthSecret &&
    !isPlaceholder(nextAuthSecret) &&
    nextAuthSecret.length < 32
  ) {
    addWarning("NEXTAUTH_SECRET should be at least 32 characters.", {
      blocking: blockDeployWarnings,
    });
  }

  if (
    pusherKey &&
    publicPusherKey &&
    !isPlaceholder(pusherKey) &&
    !isPlaceholder(publicPusherKey) &&
    pusherKey !== publicPusherKey
  ) {
    addWarning("PUSHER_KEY and NEXT_PUBLIC_PUSHER_KEY should match.", {
      blocking: blockDeployWarnings,
    });
  }

  if (
    pusherCluster &&
    publicPusherCluster &&
    pusherCluster !== publicPusherCluster
  ) {
    addWarning("PUSHER_CLUSTER and NEXT_PUBLIC_PUSHER_CLUSTER should match.", {
      blocking: blockDeployWarnings,
    });
  }

  const placeholderKeys = [];

  for (const group of GROUPS) {
    for (const key of group.keys) {
      if (isPlaceholder(values[key])) {
        placeholderKeys.push(key);
      }
    }
  }

  if (placeholderKeys.length > 0) {
    addWarning(`Placeholder values detected for: ${placeholderKeys.join(", ")}`, {
      blocking: blockDeployWarnings,
    });
  }

  return { missing, warnings, blockingWarnings };
}

export function collectEnvStatus({ file, target }) {
  const { source, values } = buildEnvMap(file);
  const { missing, warnings, blockingWarnings } = buildChecks(values, target);
  const optionalKeys = OPTIONAL_BY_TARGET[target] ?? new Set();

  const groups = GROUPS.map((group) => ({
    name: group.name,
    keys: group.keys.map((key) => ({
      key,
      present: Boolean(values[key]),
      optional: optionalKeys.has(key),
      placeholder: isPlaceholder(values[key] || ""),
    })),
  }));

  return {
    ok: missing.length === 0 && blockingWarnings.length === 0,
    source,
    target,
    missing,
    warnings,
    blockingWarnings,
    groups,
  };
}

function printHuman(status) {
  const sourceLabel = status.source ? status.source : "process.env";

  console.log(`MBTI env check target: ${status.target}`);
  console.log(`Env source: ${sourceLabel}`);
  console.log("");

  for (const group of status.groups) {
    console.log(`${group.name}:`);
    for (const entry of group.keys) {
      const state = entry.present
        ? "OK"
        : entry.optional
          ? "OPTIONAL"
          : "MISSING";
      const suffix = entry.placeholder ? " (placeholder)" : "";
      console.log(`  - ${entry.key}: ${state}${suffix}`);
    }
    console.log("");
  }

  if (status.warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of status.warnings) {
      console.log(`  - ${warning}`);
    }
    console.log("");
  }

  if (status.blockingWarnings.length > 0) {
    console.log("Blocking warnings:");
    for (const warning of status.blockingWarnings) {
      console.log(`  - ${warning}`);
    }
    console.log("");
  }

  if (status.missing.length > 0) {
    console.log("Missing required keys:");
    for (const item of status.missing) {
      console.log(`  - ${item.key} (${item.group})`);
    }
    process.exitCode = 1;
    return;
  }

  if (status.blockingWarnings.length > 0) {
    console.log("Environment is not deploy-ready for this target.");
    process.exitCode = 1;
    return;
  }

  console.log("All required keys are present.");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const status = collectEnvStatus(options);

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
