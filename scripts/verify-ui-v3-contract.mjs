#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MBTI_Z_TYPE_ROUTE_SLUGS,
  getMbtiZTypeStaticPaths,
  mbtiZTypeDetails,
} from "../data/mbti/mbti-z-type-details.mjs";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(APP_ROOT, relativePath), "utf8");
}

function listFiles(relativeDirectory) {
  const directory = path.join(APP_ROOT, relativeDirectory);
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
  });
}

function requireCondition(condition, id) {
  if (!condition) failures.push(id);
}

function requireIncludes(source, fragment, id) {
  requireCondition(source.includes(fragment), id);
}

const navbarSource = read("components/Navbar.tsx");
const primaryNavBlock = navbarSource.match(
  /const primaryNavItems = \[([\s\S]*?)\];\s*\n\s*function isActive/
)?.[1];
const primaryHrefs = primaryNavBlock
  ? [...primaryNavBlock.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1])
  : [];

requireCondition(
  JSON.stringify(primaryHrefs) === JSON.stringify(["/", "/quiz", "/types"]),
  `navbar:primary_links:${primaryHrefs.join(",") || "missing"}`
);
requireIncludes(navbarSource, 'href="/login"', "navbar:login_command_missing");
requireIncludes(navbarSource, 'href="/dashboard"', "navbar:my_results_menu_missing");
requireIncludes(navbarSource, "setLocale(option)", "navbar:locale_menu_missing");
requireIncludes(navbarSource, 'event.key !== "Escape"', "navbar:escape_dismissal_missing");
requireIncludes(navbarSource, "menuButtonRef.current?.focus()", "navbar:focus_restore_missing");

const localeToggleConsumers = ["pages", "components"]
  .flatMap(listFiles)
  .filter((file) => file.endsWith(".tsx") && file !== "components/cyber/locale-toggle.tsx")
  .filter((file) => read(file).includes("LocaleToggle"));
requireCondition(
  localeToggleConsumers.length === 0,
  `locale:duplicate_consumers:${localeToggleConsumers.join(",")}`
);

const homeSource = read("components/marketing/premium-home.tsx");
const homeHouseOrderBlock = homeSource.match(
  /const houseOrder: HouseKey\[\] = \[([^\]]+)\]/
)?.[1];
const homeHouseKeys = homeHouseOrderBlock
  ? [...homeHouseOrderBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1])
  : [];
requireCondition(
  JSON.stringify(homeHouseKeys) ===
    JSON.stringify(["purple", "green", "yellow", "blue"]),
  `home:four_house_order:${homeHouseKeys.join(",") || "missing"}`
);
requireCondition(!homeSource.includes("ESTJ"), "home:estj_hardcode_present");
requireIncludes(
  homeSource,
  'const HOME_HERO_PATH = "/mbti-z/v4/fantasy-v2/home/living-archive-hero-v2.webp"',
  "home:fantasy_v2_hero_missing"
);
requireIncludes(homeSource, ">\n              MBTI Z\n            </h1>", "home:brand_h1_missing");
requireIncludes(homeSource, "group-hover:scale-110", "home:hover_interaction_missing");
requireIncludes(
  homeSource,
  "group-focus-visible:scale-110",
  "home:focus_interaction_missing"
);
requireIncludes(homeSource, "motion-reduce:", "home:reduced_motion_missing");

const atlasSource = read("pages/types.tsx");
const typeCardSource = read("components/mbti-z/type-card.tsx");
requireCondition(!/expanded|disclosure|aria-expanded/i.test(atlasSource), "atlas:inline_disclosure_present");
requireCondition(!/expanded|disclosure|aria-expanded/i.test(typeCardSource), "atlas:card_disclosure_present");
requireIncludes(typeCardSource, "<Link", "atlas:semantic_card_link_missing");
requireIncludes(atlasSource, "?from=", "atlas:return_context_missing");

const expectedSlugs = [
  "intj", "intp", "entj", "entp",
  "infj", "infp", "enfj", "enfp",
  "istj", "isfj", "estj", "esfj",
  "istp", "isfp", "estp", "esfp",
].sort();
const staticSlugs = getMbtiZTypeStaticPaths().map((entry) => entry.params.code).sort();
requireCondition(mbtiZTypeDetails.length === 16, `type_data:record_count:${mbtiZTypeDetails.length}`);
requireCondition(
  JSON.stringify([...MBTI_Z_TYPE_ROUTE_SLUGS].sort()) === JSON.stringify(expectedSlugs),
  "type_data:route_slug_coverage"
);
requireCondition(
  JSON.stringify(staticSlugs) === JSON.stringify(expectedSlugs),
  "type_data:static_path_coverage"
);

const typeRoutePath = "pages/types/[code].tsx";
requireCondition(fs.existsSync(path.join(APP_ROOT, typeRoutePath)), "type_route:file_missing");
if (fs.existsSync(path.join(APP_ROOT, typeRoutePath))) {
  const detailSource = [
    read(typeRoutePath),
    ...listFiles("components/types/type-detail")
      .filter((file) => /\.(?:ts|tsx)$/.test(file))
      .map(read),
  ].join("\n");

  for (const fragment of [
    "getStaticPaths",
    "getStaticProps",
    "fallback: false",
    "identitySentence",
    "letters",
    "strengths",
    "growthEdges",
    "decisionStyle",
    "communicationStyle",
    "relationships",
    "recoveryPractices",
    "movieProfileLens",
    "relatedCodes",
  ]) {
    requireIncludes(detailSource, fragment, `type_route:missing:${fragment}`);
  }
}

const dashboardSource = read("pages/dashboard.tsx");
requireIncludes(dashboardSource, "mbtiZMyResultsCopy", "results:shared_copy_missing");
requireIncludes(dashboardSource, "DownloadResultButton", "results:png_export_missing");
requireIncludes(dashboardSource, "ReconnectBundleActions", "results:reconnect_missing");
requireCondition(!dashboardSource.includes("LocaleToggle"), "results:local_locale_toggle_present");

const report = {
  ok: failures.length === 0,
  primaryLinks: primaryHrefs,
  localeToggleConsumers,
  homeHouseKeys,
  typeRecordCount: mbtiZTypeDetails.length,
  staticTypePathCount: staticSlugs.length,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 1;
