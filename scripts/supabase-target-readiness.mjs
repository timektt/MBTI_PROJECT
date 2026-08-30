#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TARGETS = new Set(["development", "preview", "production"]);
const CONNECTION_KEYS = ["DATABASE_URL", "DIRECT_URL"];

function parseArgs(argv) {
  const parsed = {
    target: "preview",
    file: null,
    json: false,
    expectedRef: null,
  };

  for (const arg of argv) {
    if (arg.startsWith("--target=")) {
      parsed.target = arg.split("=").slice(1).join("=") || parsed.target;
      continue;
    }

    if (arg.startsWith("--file=")) {
      parsed.file = arg.split("=").slice(1).join("=") || null;
      continue;
    }

    if (arg.startsWith("--expected-ref=")) {
      parsed.expectedRef = arg.split("=").slice(1).join("=") || null;
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

function absolute(relativePath) {
  return path.isAbsolute(relativePath)
    ? relativePath
    : path.join(APP_ROOT, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function listMigrationDirs() {
  const migrationsRoot = absolute("prisma/migrations");

  if (!fs.existsSync(migrationsRoot)) {
    return [];
  }

  return fs
    .readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
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
  const raw = read(filePath);
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

  return env;
}

function buildEnvMap(filePath) {
  const fromProcess = Object.fromEntries(
    Object.entries(process.env).filter(([, value]) => typeof value === "string")
  );

  if (!filePath) {
    return {
      source: null,
      values: fromProcess,
    };
  }

  return {
    source: absolute(filePath),
    values: {
      ...parseEnvFile(filePath),
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

function extractProjectRef(url) {
  const hostRef = url.hostname.match(/^db\.([a-z0-9]{20})\.supabase\.co$/i);
  if (hostRef) {
    return hostRef[1];
  }

  const usernameRef = decodeURIComponent(url.username || "").match(
    /^postgres\.([a-z0-9]{20})$/i
  );
  if (usernameRef && url.hostname.endsWith(".pooler.supabase.com")) {
    return usernameRef[1];
  }

  return null;
}

function inspectConnection(key, value) {
  if (!value) {
    return {
      key,
      present: false,
      valid: false,
      host: null,
      database: null,
      projectRef: null,
      isSupabase: false,
      isLocal: false,
      placeholder: false,
      failure: "missing",
    };
  }

  try {
    const url = new URL(value);
    const isSupabase =
      url.hostname.endsWith(".supabase.co") ||
      url.hostname.endsWith(".pooler.supabase.com");
    const isLocal = /^(localhost|127\.0\.0\.1)$/.test(url.hostname);

    return {
      key,
      present: true,
      valid: true,
      host: url.hostname,
      database: url.pathname.replace(/^\//, "") || null,
      projectRef: extractProjectRef(url),
      isSupabase,
      isLocal,
      placeholder: isPlaceholder(value),
      failure: null,
    };
  } catch {
    return {
      key,
      present: true,
      valid: false,
      host: null,
      database: null,
      projectRef: null,
      isSupabase: false,
      isLocal: false,
      placeholder: isPlaceholder(value),
      failure: "invalid_url",
    };
  }
}

function collectSupabaseTargetReadiness(options = {}) {
  const target = options.target ?? "preview";
  const manifest = readJson("data/runtime/supabase-target-readiness.json");
  const { source, values } = buildEnvMap(options.file ?? null);
  const targetConfig = manifest.targets?.[target] ?? {};
  const expectedProjectRef =
    options.expectedRef ?? targetConfig.expectedProjectRef ?? null;
  const connectionStatus = CONNECTION_KEYS.map((key) =>
    inspectConnection(key, values[key])
  );
  const migrationDirs = listMigrationDirs();
  const requiredMigrationDirs = Array.isArray(manifest.requiredMigrationDirs)
    ? manifest.requiredMigrationDirs
    : [];
  const missingRequiredMigrations = requiredMigrationDirs.filter(
    (migration) => !migrationDirs.includes(migration.name)
  );
  const projectRefs = [
    ...new Set(connectionStatus.map((entry) => entry.projectRef).filter(Boolean)),
  ];
  const knownBlockedRefs = new Map(
    (manifest.knownBlockedProjectRefs ?? []).map((entry) => [entry.ref, entry])
  );
  const blockers = [];
  const warnings = [];
  const blockDeploy = target !== "development";

  for (const entry of connectionStatus) {
    if (!entry.present) {
      blockers.push({
        id: "missing_database_connection",
        key: entry.key,
        detail: `${entry.key} is required before ${target} Supabase target verification.`,
      });
      continue;
    }

    if (!entry.valid) {
      blockers.push({
        id: "invalid_database_connection",
        key: entry.key,
        detail: `${entry.key} is not a valid URL connection string.`,
      });
      continue;
    }

    if (entry.placeholder) {
      blockers.push({
        id: "placeholder_database_connection",
        key: entry.key,
        detail: `${entry.key} still contains a placeholder value.`,
      });
    }

    if (entry.isLocal && blockDeploy) {
      blockers.push({
        id: "local_database_connection",
        key: entry.key,
        detail: `${entry.key} still points to a local database.`,
      });
    }

    if (!entry.isSupabase && blockDeploy) {
      blockers.push({
        id: "non_supabase_database_connection",
        key: entry.key,
        detail: `${entry.key} is not a Supabase Postgres or Supabase pooler host.`,
      });
    }

    if (entry.isSupabase && !entry.projectRef && blockDeploy) {
      blockers.push({
        id: "supabase_project_ref_unresolved",
        key: entry.key,
        detail: `${entry.key} is Supabase-shaped but the project ref could not be extracted.`,
      });
    }
  }

  if (projectRefs.length > 1 && blockDeploy) {
    blockers.push({
      id: "database_project_ref_mismatch",
      detail: `DATABASE_URL and DIRECT_URL resolve to different Supabase project refs: ${projectRefs.join(", ")}`,
    });
  }

  for (const ref of projectRefs) {
    const blocked = knownBlockedRefs.get(ref);
    if (blocked) {
      blockers.push({
        id: "known_blocked_supabase_project",
        projectRef: ref,
        detail: `${blocked.label}: ${blocked.reason}`,
      });
    }
  }

  if (!expectedProjectRef && blockDeploy) {
    blockers.push({
      id: "approved_supabase_project_ref_missing",
      detail: `No approved ${target} Supabase project ref is declared in data/runtime/supabase-target-readiness.json.`,
    });
  }

  if (
    expectedProjectRef &&
    projectRefs.length > 0 &&
    !projectRefs.every((ref) => ref === expectedProjectRef) &&
    blockDeploy
  ) {
    blockers.push({
      id: "database_project_ref_not_approved",
      expectedProjectRef,
      actualProjectRefs: projectRefs,
      detail: `Database URLs must point to approved ${target} Supabase ref ${expectedProjectRef}.`,
    });
  }

  if (!blockDeploy && connectionStatus.some((entry) => entry.isLocal)) {
    warnings.push("Development target may use a local database; this is not deploy-ready.");
  }

  for (const migration of missingRequiredMigrations) {
    blockers.push({
      id: "required_supabase_migration_missing",
      migration: migration.name,
      detail: `${migration.label ?? migration.name} is required before applying the schema to a fresh Supabase target.`,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    appRoot: APP_ROOT,
    source,
    target,
    expectedProjectRef,
    ok: blockers.length === 0,
    summary: {
      connectionCount: connectionStatus.length,
      validConnectionCount: connectionStatus.filter((entry) => entry.valid).length,
      supabaseConnectionCount: connectionStatus.filter((entry) => entry.isSupabase).length,
      projectRefs,
      requiredMigrationCount: requiredMigrationDirs.length,
      missingRequiredMigrationCount: missingRequiredMigrations.length,
      blockerCount: blockers.length,
      warningCount: warnings.length,
    },
    manifest: {
      status: manifest.status,
      organization: manifest.organization,
      blockerIds: (manifest.blockers ?? []).map((blocker) => blocker.id),
      requiredMigrationDirs,
      requiredPreApplyCommands: manifest.requiredPreApplyCommands ?? [],
    },
    connections: connectionStatus,
    migrations: {
      presentCount: migrationDirs.length,
      required: requiredMigrationDirs,
      missing: missingRequiredMigrations,
    },
    blockers,
    warnings,
  };
}

function printHuman(status) {
  console.log(`MBTI Supabase target readiness target: ${status.target}`);
  console.log(`Env source: ${status.source ?? "process.env"}`);
  console.log("");
  console.log("Connections:");

  for (const connection of status.connections) {
    const ref = connection.projectRef ? ` ref=${connection.projectRef}` : "";
    const host = connection.host ? ` host=${connection.host}` : "";
    const state = connection.valid ? "OK" : "INVALID";
    console.log(`  - ${connection.key}: ${state}${host}${ref}`);
  }

  console.log("");
  console.log(
    `Required migrations: ${status.summary.requiredMigrationCount - status.summary.missingRequiredMigrationCount}/${status.summary.requiredMigrationCount} present`
  );

  if (status.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of status.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  if (status.blockers.length > 0) {
    console.log("");
    console.log("Blockers:");
    for (const blocker of status.blockers) {
      const key = blocker.key ? `${blocker.key}: ` : "";
      console.log(`  - ${blocker.id}: ${key}${blocker.detail}`);
    }
    return;
  }

  console.log("");
  console.log("Supabase target is ready.");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const status = collectSupabaseTargetReadiness(options);

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

export { collectSupabaseTargetReadiness };
