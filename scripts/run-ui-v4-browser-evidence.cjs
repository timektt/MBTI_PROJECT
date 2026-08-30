#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const PLAYWRIGHT_MODULE =
  process.env.PLAYWRIGHT_MODULE ??
  "/Users/time/.npm/_npx/e41f203b7505f1fb/node_modules/playwright";
const CHROME_EXECUTABLE =
  process.env.CHROME_EXECUTABLE ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3130";
const OUTPUT_ROOT =
  process.env.OUTPUT_ROOT ??
  path.join(process.cwd(), "output", "ui-redesign-v4", new Date().toISOString().slice(0, 10), "home");
const VIEWPORTS = process.env.VIEWPORTS
  ? JSON.parse(process.env.VIEWPORTS)
  : [
      { name: "320x568", width: 320, height: 568 },
      { name: "390x844", width: 390, height: 844 },
      { name: "768x1024", width: 768, height: 1024 },
      { name: "1024x768", width: 1024, height: 768 },
      { name: "1440x1000", width: 1440, height: 1000 },
    ];
const LOCALES = process.env.LOCALES ? process.env.LOCALES.split(",") : ["th", "en"];
const SOURCE_ROOTS = ["components", "data", "lib", "pages", "public/mbti-z/v4", "styles"];
const { chromium } = require(PLAYWRIGHT_MODULE);

function sourceFingerprint() {
  const files = execFileSync("rg", ["--files", ...SOURCE_ROOTS], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .sort();
  const hash = crypto.createHash("sha256");

  for (const file of files) {
    hash.update(file).update("\0").update(fs.readFileSync(file));
  }

  return hash.digest("hex");
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const isVisible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const targets = [...document.querySelectorAll("main a, main button")]
      .filter(isVisible)
      .map((element, index) => {
        const rect = element.getBoundingClientRect();
        return {
          index,
          label: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        };
      });
    const overlaps = [];

    for (let leftIndex = 0; leftIndex < targets.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < targets.length; rightIndex += 1) {
        const left = targets[leftIndex];
        const right = targets[rightIndex];
        const overlapWidth = Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x);
        const overlapHeight = Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y);
        if (overlapWidth > 2 && overlapHeight > 2) {
          overlaps.push({ left: left.label, right: right.label, overlapWidth, overlapHeight });
        }
      }
    }

    const firstSection = document.querySelector("main > section");
    const firstSectionRect = firstSection?.getBoundingClientRect();
    const textOverflow = [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main button")]
      .filter(isVisible)
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => ({
        tag: element.tagName,
        text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
      }));

    return {
      pageHeight: document.documentElement.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      mainCount: document.querySelectorAll("main").length,
      h1Count: document.querySelectorAll("main h1").length,
      heroBottom: firstSectionRect?.bottom ?? null,
      nextSectionHintPx:
        firstSectionRect === undefined ? null : Math.max(0, window.innerHeight - firstSectionRect.bottom),
      brokenImages: [...document.images]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.alt),
      targetCount: targets.length,
      overlaps,
      textOverflow,
    };
  });
}

async function main() {
  fs.mkdirSync(path.join(OUTPUT_ROOT, "after"), { recursive: true });
  const browser = await chromium.launch({
    executablePath: CHROME_EXECUTABLE,
    headless: true,
  });
  const results = [];

  try {
    for (const locale of LOCALES) {
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          reducedMotion: "reduce",
          deviceScaleFactor: 1,
          locale: locale === "th" ? "th-TH" : "en-US",
        });
        await context.addInitScript((selectedLocale) => {
          localStorage.setItem("mbti-z-locale", selectedLocale);
        }, locale);

        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(String(error)));

        const response = await page.goto(`${BASE_URL}/?lang=${locale}`, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += 480) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 24));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(200);

        const metrics = await inspectPage(page);
        const screenshotPath = path.join(
          OUTPUT_ROOT,
          "after",
          `home-populated-${locale}-${viewport.name}.png`
        );
        await page.screenshot({ path: screenshotPath, fullPage: true });

        if (locale === "th" && viewport.width === 1440) {
          const firstHouse = page.locator('a[href^="/types?house="]').first();
          await firstHouse.hover();
          await page.screenshot({
            path: path.join(OUTPUT_ROOT, "after", "home-house-hover-th-1440x1000.png"),
            fullPage: false,
          });
        }

        results.push({
          route: "/",
          state: "populated",
          locale,
          viewport,
          statusCode: response?.status() ?? null,
          screenshotPath,
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

  const report = {
    generatedAt: new Date().toISOString(),
    sourceHead: execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim(),
    sourceFingerprint: sourceFingerprint(),
    baseUrl: BASE_URL,
    browser: "Google Chrome, isolated headless Playwright context",
    results,
  };
  report.passed = results.every(
    (result) =>
      result.statusCode === 200 &&
      !result.horizontalOverflow &&
      result.mainCount === 1 &&
      result.h1Count === 1 &&
      result.brokenImages.length === 0 &&
      result.overlaps.length === 0 &&
      result.textOverflow.length === 0 &&
      result.nextSectionHintPx >= 24 &&
      result.consoleErrors.length === 0 &&
      result.pageErrors.length === 0
  );

  fs.writeFileSync(
    path.join(OUTPUT_ROOT, "audit-report.json"),
    `${JSON.stringify(report, null, 2)}\n`
  );
  console.log(
    JSON.stringify(
      {
        passed: report.passed,
        captures: results.length,
        failures: results
          .filter(
            (result) =>
              result.statusCode !== 200 ||
              result.horizontalOverflow ||
              result.mainCount !== 1 ||
              result.h1Count !== 1 ||
              result.brokenImages.length > 0 ||
              result.overlaps.length > 0 ||
              result.textOverflow.length > 0 ||
              result.nextSectionHintPx < 24 ||
              result.consoleErrors.length > 0 ||
              result.pageErrors.length > 0
          )
          .map((result) => ({
            locale: result.locale,
            viewport: result.viewport.name,
            nextSectionHintPx: result.nextSectionHintPx,
            horizontalOverflow: result.horizontalOverflow,
            overlaps: result.overlaps,
            textOverflow: result.textOverflow,
            consoleErrors: result.consoleErrors,
            pageErrors: result.pageErrors,
          })),
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
