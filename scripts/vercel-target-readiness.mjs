#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TARGETS = new Set(["development", "preview", "production"]);

function parseArgs(argv) {
  const parsed = {
    target: "preview",
    projectFile: ".vercel/project.json",
    json: false,
    expectedProjectId: null,
    expectedOrgId: null,
  };

  for (const arg of argv) {
    if (arg.startsWith("--target=")) {
      parsed.target = arg.split("=").slice(1).join("=") || parsed.target;
      continue;
    }

    if (arg.startsWith("--project-file=")) {
      parsed.projectFile = arg.split("=").slice(1).join("=") || parsed.projectFile;
      continue;
    }

    if (arg.startsWith("--expected-project-id=")) {
      parsed.expectedProjectId = arg.split("=").slice(1).join("=") || null;
      continue;
    }

    if (arg.startsWith("--expected-org-id=")) {
      parsed.expectedOrgId = arg.split("=").slice(1).join("=") || null;
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

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function detectPackageManager() {
  const candidates = [
    { manager: "npm", lockfile: "package-lock.json" },
    { manager: "pnpm", lockfile: "pnpm-lock.yaml" },
    { manager: "yarn", lockfile: "yarn.lock" },
    { manager: "bun", lockfile: "bun.lock" },
    { manager: "bun", lockfile: "bun.lockb" },
  ];

  return candidates.filter((candidate) => exists(candidate.lockfile));
}

function inspectDeploymentContract(manifest) {
  const expected = manifest.requiredDeploymentContract ?? {};
  const packageJson = exists("package.json") ? readJson("package.json") : null;
  const detectedPackageManagers = detectPackageManager();
  const detectedPackageManager =
    detectedPackageManagers.length === 1 ? detectedPackageManagers[0].manager : null;
  const requiredFiles = Array.isArray(expected.requiredFiles)
    ? expected.requiredFiles
    : [];
  const requiredScripts = Array.isArray(expected.requiredScripts)
    ? expected.requiredScripts
    : [];
  const requiredFileStatus = requiredFiles.map((file) => ({
    file,
    present: exists(file),
  }));
  const requiredScriptStatus = requiredScripts.map((script) => ({
    script,
    present: Boolean(packageJson?.scripts?.[script]),
  }));
  const buildCommand =
    packageJson?.scripts?.build ? `${detectedPackageManager ?? "npm"} run build` : null;

  return {
    expected,
    packageJsonPresent: Boolean(packageJson),
    packageName: packageJson?.name ?? null,
    detectedPackageManagers,
    detectedPackageManager,
    buildCommand,
    frameworkFilePresent: exists("next.config.ts") || exists("next.config.js"),
    pagesRouterPresent: exists("pages/_app.tsx"),
    requiredFiles: requiredFileStatus,
    requiredScripts: requiredScriptStatus,
    missingRequiredFiles: requiredFileStatus
      .filter((entry) => !entry.present)
      .map((entry) => entry.file),
    missingRequiredScripts: requiredScriptStatus
      .filter((entry) => !entry.present)
      .map((entry) => entry.script),
  };
}

function inspectProjectBinding(projectFile) {
  const bindingPath = absolute(projectFile);

  if (!fs.existsSync(bindingPath)) {
    return {
      path: bindingPath,
      present: false,
      valid: false,
      projectId: null,
      orgId: null,
      failure: "missing",
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(bindingPath, "utf8"));

    if (!isPlainObject(parsed)) {
      return {
        path: bindingPath,
        present: true,
        valid: false,
        projectId: null,
        orgId: null,
        failure: "invalid_json_shape",
      };
    }

    return {
      path: bindingPath,
      present: true,
      valid: true,
      projectId: typeof parsed.projectId === "string" ? parsed.projectId : null,
      orgId: typeof parsed.orgId === "string" ? parsed.orgId : null,
      failure: null,
    };
  } catch {
    return {
      path: bindingPath,
      present: true,
      valid: false,
      projectId: null,
      orgId: null,
      failure: "invalid_json",
    };
  }
}

function collectVercelTargetReadiness(options = {}) {
  const target = options.target ?? "preview";

  if (!TARGETS.has(target)) {
    throw new Error(
      `Unsupported target "${target}". Use development, preview, or production.`
    );
  }

  const manifest = readJson("data/runtime/vercel-target-readiness.json");
  const targetConfig = manifest.targets?.[target] ?? {};
  const expectedProjectId =
    options.expectedProjectId ?? targetConfig.expectedProjectId ?? null;
  const expectedOrgId = options.expectedOrgId ?? targetConfig.expectedOrgId ?? null;
  const required = targetConfig.required ?? target !== "development";
  const blockDeploy = target !== "development" && required !== false;
  const binding = inspectProjectBinding(options.projectFile ?? ".vercel/project.json");
  const deploymentContract = inspectDeploymentContract(manifest);
  const knownBlockedProjectIds = new Map(
    (manifest.knownBlockedProjectIds ?? []).map((entry) => [entry.id, entry])
  );
  const blockers = [];
  const warnings = [];
  const expectedDeployment = deploymentContract.expected;

  if (!binding.present) {
    if (blockDeploy) {
      blockers.push({
        id: "missing_vercel_project_binding",
        path: binding.path,
        detail: `${binding.path} is required before ${target} Vercel target verification.`,
      });
    } else {
      warnings.push("Development target is not linked to Vercel; this is not deploy-ready.");
    }
  } else if (!binding.valid) {
    blockers.push({
      id: "invalid_vercel_project_binding",
      path: binding.path,
      detail: `${binding.path} could not be parsed as a Vercel project binding.`,
    });
  }

  if (binding.present && binding.valid) {
    if (!binding.projectId && blockDeploy) {
      blockers.push({
        id: "missing_vercel_project_id",
        path: binding.path,
        detail: "Vercel project binding is missing projectId.",
      });
    }

    if (!binding.orgId && blockDeploy) {
      blockers.push({
        id: "missing_vercel_org_id",
        path: binding.path,
        detail: "Vercel project binding is missing orgId.",
      });
    }

    if (binding.projectId && !/^prj_[A-Za-z0-9]+$/.test(binding.projectId)) {
      blockers.push({
        id: "invalid_vercel_project_id",
        projectId: binding.projectId,
        detail: "Vercel projectId does not use the expected prj_* shape.",
      });
    }

    if (binding.orgId && !/^(team|user)_[A-Za-z0-9]+$/.test(binding.orgId)) {
      blockers.push({
        id: "invalid_vercel_org_id",
        orgId: binding.orgId,
        detail: "Vercel orgId does not use the expected team_* or user_* shape.",
      });
    }
  }

  if (!deploymentContract.packageJsonPresent) {
    blockers.push({
      id: "missing_package_json",
      detail: "package.json is required for Vercel project import and build detection.",
    });
  }

  if (
    expectedDeployment.packageManager &&
    deploymentContract.detectedPackageManager !== expectedDeployment.packageManager
  ) {
    blockers.push({
      id: "vercel_package_manager_mismatch",
      expectedPackageManager: expectedDeployment.packageManager,
      detectedPackageManagers: deploymentContract.detectedPackageManagers,
      detail: `Expected ${expectedDeployment.packageManager} from ${expectedDeployment.lockfile}, but detected ${deploymentContract.detectedPackageManager ?? "none or multiple"}.`,
    });
  }

  if (
    expectedDeployment.lockfile &&
    !deploymentContract.detectedPackageManagers.some(
      (entry) => entry.lockfile === expectedDeployment.lockfile
    )
  ) {
    blockers.push({
      id: "vercel_lockfile_missing",
      expectedLockfile: expectedDeployment.lockfile,
      detail: `${expectedDeployment.lockfile} is required so Vercel uses the intended package manager.`,
    });
  }

  if (
    expectedDeployment.buildCommand &&
    deploymentContract.buildCommand !== expectedDeployment.buildCommand
  ) {
    blockers.push({
      id: "vercel_build_command_mismatch",
      expectedBuildCommand: expectedDeployment.buildCommand,
      actualBuildCommand: deploymentContract.buildCommand,
      detail: `Expected build command ${expectedDeployment.buildCommand}.`,
    });
  }

  for (const file of deploymentContract.missingRequiredFiles) {
    blockers.push({
      id: "vercel_required_file_missing",
      file,
      detail: `${file} is required before Vercel import/deploy handoff.`,
    });
  }

  for (const script of deploymentContract.missingRequiredScripts) {
    blockers.push({
      id: "vercel_required_script_missing",
      script,
      detail: `package.json script "${script}" is required before Vercel import/deploy handoff.`,
    });
  }

  if (!expectedProjectId && blockDeploy) {
    blockers.push({
      id: "approved_vercel_project_id_missing",
      detail: `No approved ${target} Vercel project id is declared in data/runtime/vercel-target-readiness.json.`,
    });
  }

  if (!expectedOrgId && blockDeploy) {
    blockers.push({
      id: "approved_vercel_org_id_missing",
      detail: `No approved ${target} Vercel org id is declared in data/runtime/vercel-target-readiness.json.`,
    });
  }

  if (
    expectedProjectId &&
    binding.projectId &&
    binding.projectId !== expectedProjectId &&
    blockDeploy
  ) {
    blockers.push({
      id: "vercel_project_id_not_approved",
      expectedProjectId,
      actualProjectId: binding.projectId,
      detail: `Vercel binding must point to approved ${target} project ${expectedProjectId}.`,
    });
  }

  if (expectedOrgId && binding.orgId && binding.orgId !== expectedOrgId && blockDeploy) {
    blockers.push({
      id: "vercel_org_id_not_approved",
      expectedOrgId,
      actualOrgId: binding.orgId,
      detail: `Vercel binding must point to approved ${target} org ${expectedOrgId}.`,
    });
  }

  const blockedProject = binding.projectId
    ? knownBlockedProjectIds.get(binding.projectId)
    : null;

  if (blockedProject) {
    blockers.push({
      id: "known_blocked_vercel_project",
      projectId: binding.projectId,
      detail: `${blockedProject.label}: ${blockedProject.reason}`,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    appRoot: APP_ROOT,
    target,
    expectedProjectId,
    expectedOrgId,
    ok: blockers.length === 0,
    summary: {
      bindingPresent: binding.present,
      bindingValid: binding.valid,
      requiredFileCount: deploymentContract.requiredFiles.length,
      missingRequiredFileCount: deploymentContract.missingRequiredFiles.length,
      requiredScriptCount: deploymentContract.requiredScripts.length,
      missingRequiredScriptCount: deploymentContract.missingRequiredScripts.length,
      blockerCount: blockers.length,
      warningCount: warnings.length,
    },
    manifest: {
      status: manifest.status,
      team: manifest.team,
      repository: manifest.repository,
      requiredDeploymentContract: manifest.requiredDeploymentContract,
      requiredPreDeployCommands: manifest.requiredPreDeployCommands ?? [],
      blockerIds: (manifest.blockers ?? []).map((blocker) => blocker.id),
    },
    binding,
    deploymentContract,
    blockers,
    warnings,
  };
}

function printHuman(status) {
  console.log(`MBTI Vercel target readiness target: ${status.target}`);
  console.log(`Project binding: ${status.binding.path}`);
  console.log("");

  if (!status.binding.present) {
    console.log("Binding: MISSING");
  } else if (!status.binding.valid) {
    console.log(`Binding: INVALID (${status.binding.failure})`);
  } else {
    console.log("Binding: OK");
    console.log(`  - projectId: ${status.binding.projectId ?? "missing"}`);
    console.log(`  - orgId: ${status.binding.orgId ?? "missing"}`);
  }

  console.log("");
  console.log("Deployment contract:");
  console.log(`  - package manager: ${status.deploymentContract.detectedPackageManager ?? "unresolved"}`);
  console.log(`  - build command: ${status.deploymentContract.buildCommand ?? "missing"}`);
  console.log(
    `  - required files: ${status.summary.requiredFileCount - status.summary.missingRequiredFileCount}/${status.summary.requiredFileCount} present`
  );
  console.log(
    `  - required scripts: ${status.summary.requiredScriptCount - status.summary.missingRequiredScriptCount}/${status.summary.requiredScriptCount} present`
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
      console.log(`  - ${blocker.id}: ${blocker.detail}`);
    }
    return;
  }

  console.log("");
  console.log("Vercel target is ready.");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const status = collectVercelTargetReadiness(options);

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

export { collectVercelTargetReadiness };
