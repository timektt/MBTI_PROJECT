#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const PLAYWRIGHT_MODULE =
  process.env.PLAYWRIGHT_MODULE ??
  "/Users/time/.npm/_npx/e41f203b7505f1fb/node_modules/playwright";
const CHROME_EXECUTABLE =
  process.env.CHROME_EXECUTABLE ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3130";
const OUTPUT_ROOT =
  process.env.OUTPUT_ROOT ??
  path.join(process.cwd(), "output", "ui-redesign-v4", new Date().toISOString().slice(0, 10), "shell");
const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x1000", width: 1440, height: 1000 },
];
const LOCALES = ["th", "en"];
const { chromium } = require(PLAYWRIGHT_MODULE);

async function headerGeometry(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 2 && rect.height > 2 && getComputedStyle(element).visibility !== "hidden";
    };
    const targets = [...document.querySelectorAll("header a, header button")]
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " "),
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        };
      });
    const overlaps = [];

    for (let leftIndex = 0; leftIndex < targets.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < targets.length; rightIndex += 1) {
        const left = targets[leftIndex];
        const right = targets[rightIndex];
        const overlapWidth = Math.min(left.right, right.right) - Math.max(left.left, right.left);
        const overlapHeight = Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top);
        if (overlapWidth > 2 && overlapHeight > 2) {
          overlaps.push({ left: left.label, right: right.label, overlapWidth, overlapHeight });
        }
      }
    }

    return {
      viewportWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      targetCount: targets.length,
      outOfBounds: targets.filter(
        (target) => target.left < -1 || target.right > document.documentElement.clientWidth + 1
      ),
      overlaps,
    };
  });
}

async function visibleFocusables(page) {
  return page.evaluate(() => {
    const panel = document.querySelector("#site-navigation-menu");
    return [...(panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
      .filter((element) => element.getClientRects().length > 0)
      .map((element, index) => ({
        index,
        label: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " "),
      }));
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
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
        const closedGeometry = await headerGeometry(page);
        await page.screenshot({
          path: path.join(OUTPUT_ROOT, `shell-${locale}-${viewport.name}-closed.png`),
          fullPage: false,
        });

        const trigger = page.locator('button[aria-controls="site-navigation-menu"]');
        await trigger.click();
        await page.waitForSelector("#site-navigation-menu");
        await page.waitForTimeout(50);
        const focusables = await visibleFocusables(page);
        const initialFocus = await page.evaluate(
          () =>
            document.activeElement?.getAttribute("aria-label") ||
            document.activeElement?.textContent?.trim().replace(/\s+/g, " ")
        );
        const openGeometry = await headerGeometry(page);
        await page.screenshot({
          path: path.join(OUTPUT_ROOT, `shell-${locale}-${viewport.name}-open.png`),
          fullPage: false,
        });

        await page.evaluate(() => {
          const panel = document.querySelector("#site-navigation-menu");
          const items = [...(panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
            .filter((element) => element.getClientRects().length > 0);
          items[items.length - 1]?.focus();
        });
        await page.keyboard.press("Tab");
        const forwardTrapPassed = await page.evaluate(() => {
          const panel = document.querySelector("#site-navigation-menu");
          const items = [...(panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
            .filter((element) => element.getClientRects().length > 0);
          return document.activeElement === items[0];
        });

        await page.evaluate(() => {
          const panel = document.querySelector("#site-navigation-menu");
          const items = [...(panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
            .filter((element) => element.getClientRects().length > 0);
          items[0]?.focus();
        });
        await page.keyboard.press("Shift+Tab");
        const backwardTrapPassed = await page.evaluate(() => {
          const panel = document.querySelector("#site-navigation-menu");
          const items = [...(panel?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
            .filter((element) => element.getClientRects().length > 0);
          return document.activeElement === items[items.length - 1];
        });

        await page.keyboard.press("Escape");
        const escapeRestored = await page.evaluate(() => {
          const triggerElement = document.querySelector('button[aria-controls="site-navigation-menu"]');
          return !document.querySelector("#site-navigation-menu") && document.activeElement === triggerElement;
        });

        await trigger.click();
        const otherLocale = locale === "th" ? "en" : "th";
        await page.locator(`#site-navigation-menu button[lang="${otherLocale}"]`).click();
        await page.waitForTimeout(100);
        const routePreservedAfterLocaleSwitch = new URL(page.url()).pathname === "/";

        results.push({
          locale,
          viewport,
          statusCode: response?.status() ?? null,
          closedGeometry,
          openGeometry,
          focusables,
          initialFocus,
          forwardTrapPassed,
          backwardTrapPassed,
          escapeRestored,
          routePreservedAfterLocaleSwitch,
          consoleErrors,
          pageErrors,
        });
        await context.close();
      }
    }

    const zoomContext = await browser.newContext({
      viewport: { width: 720, height: 500 },
      reducedMotion: "reduce",
      locale: "th-TH",
    });
    await zoomContext.addInitScript(() => localStorage.setItem("mbti-z-locale", "th"));
    const zoomPage = await zoomContext.newPage();
    await zoomPage.goto(`${BASE_URL}/?lang=th`, { waitUntil: "networkidle", timeout: 60_000 });
    await zoomPage.locator('button[aria-controls="site-navigation-menu"]').click();
    const zoomGeometry = await headerGeometry(zoomPage);
    await zoomPage.screenshot({
      path: path.join(OUTPUT_ROOT, "shell-th-1440-equivalent-200-percent-open.png"),
      fullPage: false,
    });
    await zoomContext.close();

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      zoomMethod: "720 CSS px viewport as the reflow equivalent of 1440px at 200% browser zoom",
      zoomGeometry,
      results,
    };
    report.passed =
      !zoomGeometry.horizontalOverflow &&
      zoomGeometry.overlaps.length === 0 &&
      zoomGeometry.outOfBounds.length === 0 &&
      results.every(
        (result) =>
          result.statusCode === 200 &&
          !result.closedGeometry.horizontalOverflow &&
          result.closedGeometry.overlaps.length === 0 &&
          result.closedGeometry.outOfBounds.length === 0 &&
          !result.openGeometry.horizontalOverflow &&
          result.openGeometry.overlaps.length === 0 &&
          result.openGeometry.outOfBounds.length === 0 &&
          result.focusables.length >= 3 &&
          result.initialFocus === result.focusables[0]?.label &&
          result.forwardTrapPassed &&
          result.backwardTrapPassed &&
          result.escapeRestored &&
          result.routePreservedAfterLocaleSwitch &&
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
          samples: results.length,
          failures: results
            .filter(
              (result) =>
                result.statusCode !== 200 ||
                result.closedGeometry.horizontalOverflow ||
                result.closedGeometry.overlaps.length ||
                result.closedGeometry.outOfBounds.length ||
                result.openGeometry.horizontalOverflow ||
                result.openGeometry.overlaps.length ||
                result.openGeometry.outOfBounds.length ||
                result.initialFocus !== result.focusables[0]?.label ||
                !result.forwardTrapPassed ||
                !result.backwardTrapPassed ||
                !result.escapeRestored ||
                !result.routePreservedAfterLocaleSwitch ||
                result.consoleErrors.length ||
                result.pageErrors.length
            )
            .map((result) => ({
              locale: result.locale,
              viewport: result.viewport.name,
              initialFocus: result.initialFocus,
              expectedFocus: result.focusables[0]?.label,
              closedGeometry: result.closedGeometry,
              openGeometry: result.openGeometry,
              forwardTrapPassed: result.forwardTrapPassed,
              backwardTrapPassed: result.backwardTrapPassed,
              escapeRestored: result.escapeRestored,
              routePreservedAfterLocaleSwitch: result.routePreservedAfterLocaleSwitch,
              consoleErrors: result.consoleErrors,
              pageErrors: result.pageErrors,
            })),
          zoomGeometry,
        },
        null,
        2
      )
    );
    if (!report.passed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
