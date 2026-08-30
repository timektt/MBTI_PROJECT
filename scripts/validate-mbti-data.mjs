#!/usr/bin/env node

import {
  assessmentQuestions,
  buildLocalizedContent,
  personalityProfiles,
} from "../data/mbti/foundation-data.mjs";
import {
  buildMbtiZLocalizedContent,
  mbtiZHouses,
  mbtiZMovieProfiles,
  mbtiZMovieQuestions,
  mbtiZProfiles,
  mbtiZQuestionBank,
} from "../data/mbti/mbti-z-data.mjs";

const PROFILE_CODES = new Set();
const VALID_DIMENSIONS = new Set(["E/I", "S/N", "T/F", "J/P"]);
const VALID_TRAITS = new Set(["E", "I", "S", "N", "T", "F", "J", "P"]);
const requiredPremiumSections = new Set(["strengths", "blind_spots", "growth_map"]);
const VALID_HOUSES = new Set(Object.keys(mbtiZHouses));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateProfiles() {
  assert(personalityProfiles.length === 16, "Expected 16 MBTI personality profiles.");

  for (const profile of personalityProfiles) {
    const [code, slug, archetypeNameTh, archetypeNameEn] = profile;
    assert(!PROFILE_CODES.has(code), `Duplicate personality code: ${code}`);
    PROFILE_CODES.add(code);
    assert(Boolean(slug), `Missing slug for ${code}`);
    assert(Boolean(archetypeNameTh), `Missing Thai archetype for ${code}`);
    assert(Boolean(archetypeNameEn), `Missing English archetype for ${code}`);

    const summaryTh = `${archetypeNameTh} (${code}) มีแนวโน้มตัดสินใจและจัดการชีวิตตามรูปแบบเฉพาะตัว ซึ่งส่งผลต่อพลังงาน การเรียนรู้ ความสัมพันธ์ และการทำงาน.`;
    const summaryEn = `${archetypeNameEn} (${code}) usually shows a distinctive pattern in energy, learning, decisions, relationships, and execution style.`;
    const localized = buildLocalizedContent({
      code,
      archetypeNameTh,
      archetypeNameEn,
      summaryTh,
      summaryEn,
    });

    const locales = new Set(localized.map((entry) => entry.locale));
    assert(locales.has("th") && locales.has("en"), `Missing locales for ${code}`);
    const sections = new Set(localized.map((entry) => entry.section));
    assert(sections.has("summary"), `Missing summary content for ${code}`);
    for (const premiumSection of requiredPremiumSections) {
      assert(sections.has(premiumSection), `Missing ${premiumSection} for ${code}`);
    }
  }
}

function validateMbtiZProfiles() {
  assert(mbtiZProfiles.length === 16, "Expected 16 MBTI Z profiles.");

  for (const profile of mbtiZProfiles) {
    assert(Boolean(profile.code), "MBTI Z profile missing code.");
    assert(VALID_HOUSES.has(profile.houseKey), `Invalid house for ${profile.code}`);
    assert(Boolean(profile.animalKey), `Missing animal key for ${profile.code}`);
    assert(Boolean(profile.animalNameTh), `Missing Thai animal name for ${profile.code}`);
    assert(Boolean(profile.animalNameEn), `Missing English animal name for ${profile.code}`);
    assert(Boolean(profile.taglineTh), `Missing Thai tagline for ${profile.code}`);
    assert(Boolean(profile.taglineEn), `Missing English tagline for ${profile.code}`);
    assert(Boolean(profile.summaryTh), `Missing Thai summary for ${profile.code}`);
    assert(Boolean(profile.summaryEn), `Missing English summary for ${profile.code}`);
    assert(Boolean(profile.strengthsTh), `Missing Thai strengths for ${profile.code}`);
    assert(Boolean(profile.strengthsEn), `Missing English strengths for ${profile.code}`);
    assert(Boolean(profile.growthTh), `Missing Thai growth note for ${profile.code}`);
    assert(Boolean(profile.growthEn), `Missing English growth note for ${profile.code}`);
    assert(Boolean(profile.fitTh), `Missing Thai fit note for ${profile.code}`);
    assert(Boolean(profile.fitEn), `Missing English fit note for ${profile.code}`);

    const localized = buildMbtiZLocalizedContent(profile);
    const locales = new Set(localized.map((entry) => entry.locale));
    assert(locales.has("th") && locales.has("en"), `Missing MBTI Z locales for ${profile.code}`);
  }
}

function validateQuestions() {
  const questionKeys = new Set();
  const dimensionCounts = new Map();

  for (const question of assessmentQuestions) {
    assert(!questionKeys.has(question.key), `Duplicate question key: ${question.key}`);
    questionKeys.add(question.key);
    assert(VALID_DIMENSIONS.has(question.dimension), `Invalid dimension for ${question.key}`);
    assert(Boolean(question.promptTh), `Missing Thai prompt for ${question.key}`);
    assert(Boolean(question.promptEn), `Missing English prompt for ${question.key}`);
    assert(question.options.length === 2, `Expected 2 options for ${question.key}`);

    const optionKeys = new Set();
    const traits = new Set();
    for (const option of question.options) {
      assert(!optionKeys.has(option.key), `Duplicate option key for ${question.key}`);
      optionKeys.add(option.key);
      assert(Boolean(option.labelTh), `Missing Thai option label for ${question.key}`);
      assert(Boolean(option.labelEn), `Missing English option label for ${question.key}`);
      assert(VALID_TRAITS.has(option.traitCode), `Invalid trait code for ${question.key}`);
      traits.add(option.traitCode);
    }

    assert(traits.size === 2, `Expected distinct trait options for ${question.key}`);
    dimensionCounts.set(
      question.dimension,
      (dimensionCounts.get(question.dimension) ?? 0) + 1
    );
  }

  for (const dimension of VALID_DIMENSIONS) {
    assert(
      (dimensionCounts.get(dimension) ?? 0) >= 2,
      `Expected at least 2 starter questions for dimension ${dimension}`
    );
  }
}

function validateMbtiZQuestionBank() {
  assert(
    Object.keys(mbtiZMovieProfiles).length >= 4,
    "Expected at least 4 MBTI Z movie profiles."
  );
  assert(
    mbtiZMovieQuestions.length >= 8,
    "Expected at least 8 MBTI Z movie questions."
  );
  assert(
    mbtiZQuestionBank.length === assessmentQuestions.length + mbtiZMovieQuestions.length,
    "MBTI Z question bank length does not match core + movie modules."
  );

  const questionKeys = new Set();

  for (const question of mbtiZQuestionBank) {
    assert(!questionKeys.has(question.key), `Duplicate MBTI Z question key: ${question.key}`);
    questionKeys.add(question.key);
    assert(Boolean(question.promptTh), `Missing Thai prompt for MBTI Z question ${question.key}`);
    assert(Boolean(question.promptEn), `Missing English prompt for MBTI Z question ${question.key}`);

    if (question.kind === "mbti") {
      assert(
        VALID_DIMENSIONS.has(question.dimension),
        `Invalid MBTI dimension for ${question.key}`
      );
      assert(question.options.length === 5, `Expected 5 scale options for ${question.key}`);
      for (const option of question.options) {
        assert(Boolean(option.labelTh), `Missing Thai scale label for ${question.key}`);
        assert(Boolean(option.labelEn), `Missing English scale label for ${question.key}`);
        assert(Boolean(option.weights), `Missing weights for ${question.key}:${option.key}`);
      }
      continue;
    }

    assert(question.kind === "movie", `Unexpected MBTI Z question kind for ${question.key}`);
    assert(question.options.length >= 4, `Expected at least 4 movie options for ${question.key}`);
    for (const option of question.options) {
      assert(Boolean(option.labelTh), `Missing Thai movie option label for ${question.key}`);
      assert(Boolean(option.labelEn), `Missing English movie option label for ${question.key}`);
      assert(
        option.movieScores && Object.keys(option.movieScores).length > 0,
        `Missing movie scores for ${question.key}:${option.key}`
      );
    }
  }
}

function main() {
  validateProfiles();
  validateMbtiZProfiles();
  validateQuestions();
  validateMbtiZQuestionBank();
  console.log("MBTI foundation data validation passed");
}

main();
