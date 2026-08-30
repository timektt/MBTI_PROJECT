#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import { mbtiZProfiles } from "../data/mbti/mbti-z-data.mjs";
import {
  MBTI_Z_TYPE_ROUTE_SLUGS,
  getMbtiZTypeProfile,
  getMbtiZTypeStaticPaths,
  mbtiZTypeDetails,
  selectMbtiZTypeLocale,
} from "../data/mbti/mbti-z-type-details.mjs";

const EXPECTED_CODES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];
const EXPECTED_CODE_SET = new Set(EXPECTED_CODES);
const EXPECTED_LOCALES = ["th", "en"];

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function addError(errors, path, message) {
  errors.push(`${path}: ${message}`);
}

function requireRecord(errors, value, path) {
  if (!isRecord(value)) {
    addError(errors, path, "expected an object");
    return false;
  }
  return true;
}

function requireString(errors, value, path) {
  if (typeof value !== "string" || value.trim().length === 0) {
    addError(errors, path, "expected a non-empty string");
    return false;
  }
  return true;
}

function requireStringArray(errors, value, path, min, max) {
  if (!Array.isArray(value)) {
    addError(errors, path, `expected an array with ${min}-${max} items`);
    return false;
  }

  if (value.length < min || value.length > max) {
    addError(errors, path, `expected ${min}-${max} items, received ${value.length}`);
  }

  value.forEach((item, index) => requireString(errors, item, `${path}[${index}]`));
  return true;
}

function requireObjectArray(errors, value, path, min, max, fields) {
  if (!Array.isArray(value)) {
    addError(errors, path, `expected an array with ${min}-${max} items`);
    return false;
  }

  if (value.length < min || value.length > max) {
    addError(errors, path, `expected ${min}-${max} items, received ${value.length}`);
  }

  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (!requireRecord(errors, item, itemPath)) return;
    fields.forEach((field) => requireString(errors, item[field], `${itemPath}.${field}`));
  });
  return true;
}

function validateLocale(errors, profile, locale, profilePath) {
  const localePath = `${profilePath}.locales.${locale}`;
  const detail = profile.locales?.[locale];
  if (!requireRecord(errors, detail, localePath)) return;

  requireString(errors, detail.identitySentence, `${localePath}.identitySentence`);
  requireStringArray(errors, detail.introduction, `${localePath}.introduction`, 2, 3);

  if (requireObjectArray(errors, detail.letters, `${localePath}.letters`, 4, 4, ["letter", "title", "body"])) {
    const expectedLetters = typeof profile.code === "string" ? [...profile.code] : [];
    detail.letters.forEach((letter, index) => {
      if (isRecord(letter) && letter.letter !== expectedLetters[index]) {
        addError(
          errors,
          `${localePath}.letters[${index}].letter`,
          `expected ${expectedLetters[index] ?? "a letter from the profile code"}, received ${String(letter.letter)}`
        );
      }
    });
  }

  requireObjectArray(
    errors,
    detail.strengths,
    `${localePath}.strengths`,
    4,
    6,
    ["title", "body", "example"]
  );
  requireObjectArray(
    errors,
    detail.growthEdges,
    `${localePath}.growthEdges`,
    3,
    5,
    ["title", "body", "practice"]
  );
  requireString(errors, detail.decisionStyle, `${localePath}.decisionStyle`);
  requireString(errors, detail.communicationStyle, `${localePath}.communicationStyle`);
  requireString(errors, detail.relationships, `${localePath}.relationships`);

  const workPath = `${localePath}.work`;
  if (requireRecord(errors, detail.work, workPath)) {
    requireString(errors, detail.work.individual, `${workPath}.individual`);
    requireString(errors, detail.work.teamwork, `${workPath}.teamwork`);
    requireString(errors, detail.work.leadership, `${workPath}.leadership`);
    requireStringArray(errors, detail.work.environments, `${workPath}.environments`, 3, 6);
    requireStringArray(errors, detail.work.roleExamples, `${workPath}.roleExamples`, 3, 6);
    requireString(errors, detail.work.tendencyNote, `${workPath}.tendencyNote`);
  }

  const stressPath = `${localePath}.stress`;
  if (requireRecord(errors, detail.stress, stressPath)) {
    requireStringArray(errors, detail.stress.signals, `${stressPath}.signals`, 3, 5);
    requireStringArray(
      errors,
      detail.stress.recoveryPractices,
      `${stressPath}.recoveryPractices`,
      3,
      5
    );
  }

  const moviePath = `${localePath}.movieProfileLens`;
  if (requireRecord(errors, detail.movieProfileLens, moviePath)) {
    requireString(errors, detail.movieProfileLens.title, `${moviePath}.title`);
    requireString(errors, detail.movieProfileLens.body, `${moviePath}.body`);
    requireString(errors, detail.movieProfileLens.disclaimer, `${moviePath}.disclaimer`);
  }

  requireString(errors, detail.disclaimer, `${localePath}.disclaimer`);
}

export function collectMbtiZTypeDetailErrors(dataset = mbtiZTypeDetails) {
  const errors = [];

  if (!Array.isArray(dataset)) {
    return ["profiles: expected an array of 16 type detail records"];
  }

  if (dataset.length !== EXPECTED_CODES.length) {
    addError(
      errors,
      "profiles",
      `expected exactly ${EXPECTED_CODES.length} records, received ${dataset.length}`
    );
  }

  const seenCodes = new Set();

  dataset.forEach((profile, index) => {
    const provisionalPath = `profiles[${index}]`;
    if (!requireRecord(errors, profile, provisionalPath)) return;

    const hasCode = requireString(errors, profile.code, `${provisionalPath}.code`);
    const profilePath = hasCode ? profile.code : provisionalPath;

    if (hasCode) {
      if (!EXPECTED_CODE_SET.has(profile.code)) {
        addError(errors, `${profilePath}.code`, `unsupported type code ${profile.code}`);
      }
      if (seenCodes.has(profile.code)) {
        addError(errors, `${profilePath}.code`, `duplicate type code ${profile.code}`);
      }
      seenCodes.add(profile.code);
    }

    const expectedSlug = hasCode ? profile.code.toLowerCase() : null;
    if (profile.routeSlug !== expectedSlug) {
      addError(
        errors,
        `${profilePath}.routeSlug`,
        `expected ${expectedSlug ?? "a lowercase type code"}, received ${String(profile.routeSlug)}`
      );
    }

    if (!Array.isArray(profile.relatedCodes)) {
      addError(errors, `${profilePath}.relatedCodes`, "expected an array with 2-3 codes");
    } else {
      if (profile.relatedCodes.length < 2 || profile.relatedCodes.length > 3) {
        addError(
          errors,
          `${profilePath}.relatedCodes`,
          `expected 2-3 codes, received ${profile.relatedCodes.length}`
        );
      }
      const relatedSeen = new Set();
      profile.relatedCodes.forEach((relatedCode, relatedIndex) => {
        const relatedPath = `${profilePath}.relatedCodes[${relatedIndex}]`;
        if (!requireString(errors, relatedCode, relatedPath)) return;
        if (!EXPECTED_CODE_SET.has(relatedCode)) {
          addError(errors, relatedPath, `unsupported related type code ${relatedCode}`);
        }
        if (relatedCode === profile.code) {
          addError(errors, relatedPath, "related type must not reference itself");
        }
        if (relatedSeen.has(relatedCode)) {
          addError(errors, relatedPath, `duplicate related type code ${relatedCode}`);
        }
        relatedSeen.add(relatedCode);
      });
    }

    if (!requireRecord(errors, profile.locales, `${profilePath}.locales`)) return;
    const localeKeys = Object.keys(profile.locales);
    const unexpectedLocales = localeKeys.filter(
      (locale) => !EXPECTED_LOCALES.includes(locale)
    );
    unexpectedLocales.forEach((locale) =>
      addError(errors, `${profilePath}.locales.${locale}`, "unsupported locale")
    );
    EXPECTED_LOCALES.forEach((locale) =>
      validateLocale(errors, profile, locale, profilePath)
    );
  });

  EXPECTED_CODES.forEach((code) => {
    if (!seenCodes.has(code)) addError(errors, code, "missing type detail record");
  });

  return errors;
}

function collectReadApiErrors() {
  const errors = [];

  if (
    MBTI_Z_TYPE_ROUTE_SLUGS.length !== EXPECTED_CODES.length ||
    new Set(MBTI_Z_TYPE_ROUTE_SLUGS).size !== EXPECTED_CODES.length
  ) {
    addError(errors, "MBTI_Z_TYPE_ROUTE_SLUGS", "expected 16 unique route slugs");
  }

  const staticPaths = getMbtiZTypeStaticPaths();
  const staticSlugs = staticPaths.map((path) => path?.params?.code);
  if (JSON.stringify(staticSlugs) !== JSON.stringify(MBTI_Z_TYPE_ROUTE_SLUGS)) {
    addError(errors, "getMbtiZTypeStaticPaths()", "static path codes do not match route slugs");
  }

  for (const baseProfile of mbtiZProfiles) {
    const merged = getMbtiZTypeProfile(baseProfile.code.toLowerCase());
    if (!merged) {
      addError(errors, `${baseProfile.code}.readApi`, "lookup returned null");
      continue;
    }
    if (merged.slug !== baseProfile.slug) {
      addError(errors, `${baseProfile.code}.slug`, "legacy slug changed during merge");
    }
    for (const locale of EXPECTED_LOCALES) {
      if (!selectMbtiZTypeLocale(merged, locale)) {
        addError(errors, `${baseProfile.code}.locales.${locale}`, "locale selector returned null");
      }
    }
  }

  if (getMbtiZTypeProfile("UNKNOWN") !== null) {
    addError(errors, "getMbtiZTypeProfile(UNKNOWN)", "unsupported code must return null");
  }
  if (selectMbtiZTypeLocale(getMbtiZTypeProfile("INTJ"), "xx") !== null) {
    addError(errors, "selectMbtiZTypeLocale(INTJ,xx)", "unsupported locale must return null");
  }

  return errors;
}

function verifyMalformedFixture() {
  const malformed = structuredClone(mbtiZTypeDetails);
  delete malformed[0].locales.th.identitySentence;
  malformed[0].relatedCodes[0] = malformed[0].code;

  const errors = collectMbtiZTypeDetailErrors(malformed);
  const expectedPaths = [
    "INTJ.locales.th.identitySentence",
    "INTJ.relatedCodes[0]",
  ];
  const missingDetections = expectedPaths.filter(
    (path) => !errors.some((error) => error.startsWith(`${path}:`))
  );

  return { errors, expectedPaths, missingDetections };
}

function main() {
  const errors = [
    ...collectMbtiZTypeDetailErrors(),
    ...collectReadApiErrors(),
  ];
  const malformedProof = verifyMalformedFixture();

  if (malformedProof.missingDetections.length > 0) {
    errors.push(
      `malformedFixture: failed to report ${malformedProof.missingDetections.join(", ")}`
    );
  }

  if (errors.length > 0) {
    console.error(`MBTI Z type detail validation failed with ${errors.length} error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  const coverage = EXPECTED_CODES.map((code) => `${code}(th,en)`).join(", ");
  console.log("MBTI Z type detail validation passed");
  console.log("Coverage: 16 type records, 32 localized profiles");
  console.log(`Field coverage: ${coverage}`);
  console.log(
    `Malformed fixture proof passed: ${malformedProof.expectedPaths.join(", ")}`
  );
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL(`file://${process.argv[1]}`));

if (isDirectRun) main();
