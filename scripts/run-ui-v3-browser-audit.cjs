/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { createHash } = require("node:crypto");

const playwrightModule =
  process.env.PLAYWRIGHT_MODULE ||
  "/Users/time/.npm/_npx/e41f203b7505f1fb/node_modules/playwright";
const { chromium } = require(playwrightModule);

const repoRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(repoRoot, "output/ui-redesign-v3");
const screenshotRoot = path.join(outputRoot, "screenshots");
const reportPath = path.join(outputRoot, "audit/browser-audit-report.json");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3030";
const chromeExecutable =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const viewports = {
  "320x800": { width: 320, height: 800 },
  "390x844": { width: 390, height: 844 },
  "768x1024": { width: 768, height: 1024 },
  "1024x768": { width: 1024, height: 768 },
  "1440x1000": { width: 1440, height: 1000 },
};
const fullViewportNames = Object.keys(viewports);
const smokeViewportNames = ["390x844", "1440x1000"];
const representativeTypes = new Set(["intj", "infj", "isfj", "istp"]);
const localeStorageKey = "mbti-z-locale";
const sourceRoots = ["components", "data", "lib", "pages", "styles"];

const routeOverrides = {
  "/quiz": { samplePath: "/quiz?lang=th", fixture: "quiz-first-core" },
  "/result/[id]": {
    samplePath: "/result/guest-fixture-result-house-purple-intj?lang=th",
    fixture: "result-house-purple",
  },
  "/dashboard": { samplePath: "/dashboard", fixture: "dashboard-many-results" },
};

function slugify(value) {
  return value
    .replace(/^\//, "")
    .replace(/[?#].*$/, "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll("/", "-") || "home";
}

function fixturePath(fixture) {
  return path.join(repoRoot, "scripts/ui-fixtures/generated/init", `${fixture}.js`);
}

function latestSourceModifiedAt() {
  let latest = 0;

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else latest = Math.max(latest, fs.statSync(entryPath).mtimeMs);
    }
  }

  sourceRoots.forEach((root) => visit(path.join(repoRoot, root)));
  return new Date(latest).toISOString();
}

function sourceFingerprint() {
  const hash = createHash("sha256");

  function visit(directory) {
    return fs
      .readdirSync(directory, { withFileTypes: true })
      .flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        return entry.isDirectory() ? visit(entryPath) : [entryPath];
      })
      .sort();
  }

  for (const root of sourceRoots) {
    for (const filePath of visit(path.join(repoRoot, root))) {
      const relativePath = path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
      hash.update(relativePath);
      hash.update("\0");
      hash.update(fs.readFileSync(filePath));
      hash.update("\0");
    }
  }

  return hash.digest("hex");
}

async function scrollForLazyAssets(page) {
  await page.evaluate(async () => {
    const distance = Math.max(320, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += distance) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 24));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(160);
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const controls = Array.from(document.querySelectorAll("a, button, input, select, textarea"))
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label:
            element.getAttribute("aria-label") ||
            element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ||
            element.tagName.toLowerCase(),
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        };
      });
    const clippedControls = controls.filter(
      (control) => control.left < -1 || control.right > window.innerWidth + 1
    );
    const brokenImages = Array.from(document.images)
      .filter(visible)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src || image.alt || "image");
    const assetFallbacks = Array.from(
      document.querySelectorAll("[data-ui-asset-fallback]")
    )
      .filter(visible)
      .map((element) => ({
        kind: element.getAttribute("data-ui-asset-fallback") || "unknown",
        label:
          element.getAttribute("aria-label") ||
          element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ||
          "unlabeled fallback",
      }));

    const nextPortal = document.querySelector("nextjs-portal");
    const nextPortalRoot = nextPortal?.shadowRoot;
    const frameworkOverlay = Boolean(
      nextPortalRoot?.querySelector(
        "[data-error='true'], [data-nextjs-dialog-overlay], [data-nextjs-dialog], [data-nextjs-error-overlay]"
      )
    );

    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      mainCount: document.querySelectorAll("main").length,
      h1Count: document.querySelectorAll("main h1").length,
      frameworkOverlay,
      clippedControls,
      brokenImages,
      assetFallbacks,
    };
  });
}

async function buildSamples() {
  const { UI_ROUTE_STATE_MANIFEST } = await import(
    path.join(repoRoot, "data/ui/route-state-manifest.mjs")
  );
  const { MBTI_Z_TYPE_ROUTE_SLUGS } = await import(
    path.join(repoRoot, "data/mbti/mbti-z-type-details.mjs")
  );
  const samples = [];

  for (const route of UI_ROUTE_STATE_MANIFEST) {
    if (route.routePattern === "/types/[code]") {
      for (const code of MBTI_Z_TYPE_ROUTE_SLUGS) {
        const from = representativeTypes.has(code)
          ? { intj: "purple", infj: "green", isfj: "yellow", istp: "blue" }[code]
          : undefined;
        samples.push({
          routePattern: route.routePattern,
          samplePath: `/types/${code}${from ? `?from=${from}` : ""}`,
          viewportNames: representativeTypes.has(code) ? fullViewportNames : smokeViewportNames,
          locale: "th",
        });
      }
      continue;
    }

    const override = routeOverrides[route.routePattern] || {};
    samples.push({
      routePattern: route.routePattern,
      samplePath: override.samplePath || route.samplePath,
      viewportNames:
        route.family === "active" || route.routePattern === "/login"
          ? fullViewportNames
          : smokeViewportNames,
      locale: "th",
      fixture: override.fixture,
    });
  }

  for (const samplePath of ["/", "/types", "/types/intj?from=purple", "/dashboard"] ) {
    samples.push({
      routePattern: samplePath.startsWith("/types/intj") ? "/types/[code]" : samplePath,
      samplePath,
      viewportNames: smokeViewportNames,
      locale: "en",
      fixture: samplePath === "/dashboard" ? "dashboard-many-results" : undefined,
    });
  }

  return samples;
}

async function main() {
  fs.mkdirSync(screenshotRoot, { recursive: true });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  const sampleGroups = await buildSamples();
  const browser = await chromium.launch({ executablePath: chromeExecutable, headless: true });
  const results = [];

  try {
    for (const sample of sampleGroups) {
      for (const viewportName of sample.viewportNames) {
        const viewport = viewports[viewportName];
        const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
        if (sample.fixture) {
          await context.addInitScript({ path: fixturePath(sample.fixture) });
        }
        await context.addInitScript(
          ({ key, locale }) => window.localStorage.setItem(key, locale),
          { key: localeStorageKey, locale: sample.locale }
        );

        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(String(error)));

        const response = await page.goto(`${baseUrl}${sample.samplePath}`, {
          waitUntil: "networkidle",
        });
        await scrollForLazyAssets(page);
        const metrics = await collectMetrics(page);
        const routeName = slugify(sample.samplePath);
        const screenshot = path.join(
          screenshotRoot,
          `${routeName}-${sample.locale}-${viewportName}.png`
        );
        await page.screenshot({ path: screenshot, fullPage: true });

        results.push({
          ...sample,
          viewportNames: undefined,
          viewport: { name: viewportName, ...viewport },
          statusCode: response?.status() ?? null,
          title: await page.title(),
          screenshot: path.relative(repoRoot, screenshot),
          ...metrics,
          consoleErrors,
          pageErrors,
        });
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  const failures = results.flatMap((result) => {
    const label = `${result.samplePath}:${result.locale}:${result.viewport.name}`;
    const sampleFailures = [];
    if (result.statusCode !== 200) sampleFailures.push(`${label}:status:${result.statusCode}`);
    if (result.horizontalOverflow) sampleFailures.push(`${label}:horizontal_overflow`);
    if (result.mainCount !== 1) sampleFailures.push(`${label}:main_count:${result.mainCount}`);
    if (result.h1Count !== 1) sampleFailures.push(`${label}:h1_count:${result.h1Count}`);
    if (result.frameworkOverlay) sampleFailures.push(`${label}:framework_overlay`);
    if (result.clippedControls.length) sampleFailures.push(`${label}:clipped_controls`);
    if (result.brokenImages.length) sampleFailures.push(`${label}:broken_images`);
    if (result.assetFallbacks.length) sampleFailures.push(`${label}:asset_fallbacks`);
    if (result.consoleErrors.length) sampleFailures.push(`${label}:console_errors`);
    if (result.pageErrors.length) sampleFailures.push(`${label}:page_errors`);
    return sampleFailures;
  });
  const report = {
    generatedAt: new Date().toISOString(),
    latestSourceModifiedAt: latestSourceModifiedAt(),
    sourceFingerprint: sourceFingerprint(),
    sourceHead: execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim(),
    baseUrl,
    browser: "Google Chrome (isolated headless)",
    routePatternCount: new Set(results.map((result) => result.routePattern)).size,
    concreteTypePathCount: new Set(
      results
        .filter((result) => result.routePattern === "/types/[code]" && result.locale === "th")
        .map((result) => result.samplePath.split("?")[0])
    ).size,
    sampleCount: results.length,
    passed: failures.length === 0,
    failures,
    results,
  };

  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        passed: report.passed,
        routePatternCount: report.routePatternCount,
        concreteTypePathCount: report.concreteTypePathCount,
        sampleCount: report.sampleCount,
        failures: report.failures,
      },
      null,
      2
    )
  );
  if (!report.passed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
