#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildLocalizedContent,
  personalityProfiles,
} from "../data/mbti/foundation-data.mjs";
import { mbtiZQuestionBank } from "../data/mbti/mbti-z-data.mjs";
import cloudRuntimeReadiness from "../data/runtime/cloud-runtime-readiness.json" with { type: "json" };

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FOUNDATION_MIGRATION = "prisma/migrations/20260604190000_add_premium_mbti_foundation/migration.sql";
const QUESTION_METADATA_MIGRATION = "prisma/migrations/20260629040000_add_mbti_z_question_metadata/migration.sql";
const REQUIRED_SEED_UPSERTS = [
  "prisma.personalityProfile.upsert",
  "prisma.personalityContent.upsert",
  "prisma.assessmentQuestion.upsert",
  "prisma.assessmentOption.upsert",
];
const REQUIRED_SEED_UNIQUE_SELECTORS = [
  "where: { code }",
  "where: { key: question.key }",
  "personalityCode_locale_section_tier_sortOrder",
  "questionId_key",
];

function absolute(relativePath) {
  return path.join(APP_ROOT, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function schemaHasModel(schema, model) {
  return new RegExp(`model\\s+${model}\\s+\\{`).test(schema);
}

function collectSchemaStatus(schema) {
  const requiredModels = cloudRuntimeReadiness.requiredDataModels ?? [];
  const missingModels = requiredModels.filter((model) => !schemaHasModel(schema, model));
  const requiredConstraints = [
    {
      id: "AssessmentQuestion.key_unique",
      ok: /model\s+AssessmentQuestion\s+\{[\s\S]*key\s+String\s+@unique/.test(schema),
    },
    {
      id: "AssessmentQuestion.mbti_z_metadata_fields",
      ok:
        /model\s+AssessmentQuestion\s+\{[\s\S]*kind\s+String\s+@default\("mbti"\)/.test(schema) &&
        /model\s+AssessmentQuestion\s+\{[\s\S]*module\s+String\s+@default\("core"\)/.test(schema) &&
        /model\s+AssessmentQuestion\s+\{[\s\S]*poles\s+Json\?/.test(schema),
    },
    {
      id: "AssessmentOption.questionId_key_unique",
      ok: /model\s+AssessmentOption\s+\{[\s\S]*@@unique\(\[questionId,\s*key\]\)/.test(schema),
    },
    {
      id: "AssessmentOption.mbti_z_metadata_fields",
      ok:
        /model\s+AssessmentOption\s+\{[\s\S]*traitCode\s+String\?/.test(schema) &&
        /model\s+AssessmentOption\s+\{[\s\S]*metaLabel\s+String\?/.test(schema) &&
        /model\s+AssessmentOption\s+\{[\s\S]*weights\s+Json\?/.test(schema) &&
        /model\s+AssessmentOption\s+\{[\s\S]*movieScores\s+Json\?/.test(schema),
    },
    {
      id: "AssessmentAnswer.sessionId_questionId_unique",
      ok: /model\s+AssessmentAnswer\s+\{[\s\S]*@@unique\(\[sessionId,\s*questionId\]\)/.test(schema),
    },
    {
      id: "PremiumReport.quizResultId_unique",
      ok: /model\s+PremiumReport\s+\{[\s\S]*quizResultId\s+String\s+@unique/.test(schema),
    },
    {
      id: "ShareCard.slug_unique",
      ok: /model\s+ShareCard\s+\{[\s\S]*slug\s+String\s+@unique/.test(schema),
    },
    {
      id: "PersonalityContent.seed_unique",
      ok: /model\s+PersonalityContent\s+\{[\s\S]*@@unique\(\[personalityCode,\s*locale,\s*section,\s*tier,\s*sortOrder\]\)/.test(schema),
    },
  ];

  return {
    requiredModelCount: requiredModels.length,
    missingModels,
    constraints: requiredConstraints,
  };
}

function collectMigrationStatus(foundationMigration, metadataMigration) {
  const createdTables = [
    "AssessmentQuestion",
    "AssessmentOption",
    "AssessmentSession",
    "AssessmentAnswer",
    "PersonalityProfile",
    "PersonalityContent",
    "PremiumReport",
    "ShareCard",
    "EventLog",
  ];
  const missingCreateTables = createdTables.filter(
    (table) => !foundationMigration.includes(`CREATE TABLE "${table}"`)
  );
  const requiredFragments = [
    'ALTER TABLE "User"',
    '"preferredLocale" TEXT NOT NULL DEFAULT',
    'ALTER TABLE "QuizResult"',
    '"locale" TEXT NOT NULL DEFAULT',
    '"typeCode" TEXT',
    'CREATE UNIQUE INDEX "AssessmentQuestion_key_key"',
    'CREATE UNIQUE INDEX "AssessmentOption_questionId_key_key"',
    'CREATE UNIQUE INDEX "AssessmentAnswer_sessionId_questionId_key"',
    'CREATE UNIQUE INDEX "PremiumReport_quizResultId_key"',
    'CREATE UNIQUE INDEX "ShareCard_slug_key"',
    'ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_typeCode_fkey"',
  ];
  const missingFragments = requiredFragments.filter(
    (fragment) => !foundationMigration.includes(fragment)
  );
  const requiredMetadataFragments = [
    'ALTER TABLE "AssessmentQuestion"',
    'ADD COLUMN "kind" TEXT NOT NULL DEFAULT',
    'ADD COLUMN "module" TEXT NOT NULL DEFAULT',
    'ADD COLUMN "poles" JSONB',
    'ALTER TABLE "AssessmentOption"',
    'ALTER COLUMN "traitCode" DROP NOT NULL',
    'ADD COLUMN "metaLabel" TEXT',
    'ADD COLUMN "weights" JSONB',
    'ADD COLUMN "movieScores" JSONB',
    'CREATE INDEX "AssessmentQuestion_module_sortOrder_idx"',
    'CREATE INDEX "AssessmentQuestion_kind_isActive_idx"',
  ];
  const missingMetadataFragments = requiredMetadataFragments.filter(
    (fragment) => !metadataMigration.includes(fragment)
  );

  return {
    migration: FOUNDATION_MIGRATION,
    metadataMigration: QUESTION_METADATA_MIGRATION,
    createdTableCount: createdTables.length - missingCreateTables.length,
    missingCreateTables,
    missingFragments,
    missingMetadataFragments,
  };
}

function collectSeedStatus(seedSource) {
  const missingUpserts = REQUIRED_SEED_UPSERTS.filter(
    (marker) => !seedSource.includes(marker)
  );
  const missingUniqueSelectors = REQUIRED_SEED_UNIQUE_SELECTORS.filter(
    (marker) => !seedSource.includes(marker)
  );
  const destructiveMarkers = ["deleteMany(", "drop", "truncate"].filter((marker) =>
    seedSource.toLowerCase().includes(marker.toLowerCase())
  );

  return {
    missingUpserts,
    missingUniqueSelectors,
    destructiveMarkers,
    importsFoundationData:
      seedSource.includes("buildLocalizedContent") &&
      seedSource.includes("personalityProfiles"),
    importsMbtiZQuestionBank: seedSource.includes("mbtiZQuestionBank"),
    writesQuestionMetadata:
      seedSource.includes("kind: question.kind") &&
      seedSource.includes("module: question.module") &&
      seedSource.includes("poles: question.poles") &&
      seedSource.includes("metaLabel: option.metaLabel") &&
      seedSource.includes("weights: option.weights") &&
      seedSource.includes("movieScores: option.movieScores"),
  };
}

function collectDataStatus() {
  const questionKeys = new Set();
  const optionPairs = new Set();
  const coreDimensions = new Set();
  const profileCodes = new Set();
  let localizedContentCount = 0;
  let coreQuestionCount = 0;
  let movieQuestionCount = 0;

  for (const profile of personalityProfiles) {
    const [code, , archetypeNameTh, archetypeNameEn] = profile;
    profileCodes.add(code);
    localizedContentCount += buildLocalizedContent({
      code,
      archetypeNameTh,
      archetypeNameEn,
      summaryTh: `${archetypeNameTh} (${code}) มีแนวโน้มตัดสินใจและจัดการชีวิตตามรูปแบบเฉพาะตัว ซึ่งส่งผลต่อพลังงาน การเรียนรู้ ความสัมพันธ์ และการทำงาน.`,
      summaryEn: `${archetypeNameEn} (${code}) usually shows a distinctive pattern in energy, learning, decisions, relationships, and execution style.`,
    }).length;
  }

  for (const question of mbtiZQuestionBank) {
    questionKeys.add(question.key);
    if (question.module === "core") {
      coreQuestionCount += 1;
      coreDimensions.add(question.dimension);
    }
    if (question.module === "movie") {
      movieQuestionCount += 1;
    }
    for (const option of question.options) {
      optionPairs.add(`${question.key}:${option.key}`);
    }
  }

  return {
    personalityProfileCount: personalityProfiles.length,
    uniquePersonalityProfileCount: profileCodes.size,
    assessmentQuestionCount: mbtiZQuestionBank.length,
    uniqueAssessmentQuestionCount: questionKeys.size,
    assessmentOptionCount: optionPairs.size,
    coreQuestionCount,
    movieQuestionCount,
    coreDimensionCount: coreDimensions.size,
    localizedContentCount,
  };
}

function main() {
  const schema = read("prisma/schema.prisma");
  const foundationMigration = read(FOUNDATION_MIGRATION);
  const metadataMigration = read(QUESTION_METADATA_MIGRATION);
  const seedSource = read("prisma/seed.ts");
  const schemaStatus = collectSchemaStatus(schema);
  const migrationStatus = collectMigrationStatus(foundationMigration, metadataMigration);
  const seedStatus = collectSeedStatus(seedSource);
  const dataStatus = collectDataStatus();
  const failures = [
    ...schemaStatus.missingModels.map((model) => `schema_missing_model:${model}`),
    ...schemaStatus.constraints
      .filter((constraint) => !constraint.ok)
      .map((constraint) => `schema_missing_constraint:${constraint.id}`),
    ...migrationStatus.missingCreateTables.map((table) => `migration_missing_table:${table}`),
    ...migrationStatus.missingFragments.map((fragment) => `migration_missing_fragment:${fragment}`),
    ...migrationStatus.missingMetadataFragments.map((fragment) => `migration_missing_metadata_fragment:${fragment}`),
    ...seedStatus.missingUpserts.map((marker) => `seed_missing_upsert:${marker}`),
    ...seedStatus.missingUniqueSelectors.map((marker) => `seed_missing_unique_selector:${marker}`),
    ...seedStatus.destructiveMarkers.map((marker) => `seed_destructive_marker:${marker}`),
  ];

  if (!seedStatus.importsFoundationData) {
    failures.push("seed_missing_foundation_data_import");
  }

  if (!seedStatus.importsMbtiZQuestionBank) {
    failures.push("seed_missing_mbti_z_question_bank_import");
  }

  if (!seedStatus.writesQuestionMetadata) {
    failures.push("seed_missing_mbti_z_question_metadata_writes");
  }

  if (dataStatus.personalityProfileCount !== 16 || dataStatus.uniquePersonalityProfileCount !== 16) {
    failures.push("data_invalid_personality_profile_count");
  }

  if (dataStatus.assessmentQuestionCount !== 60 || dataStatus.uniqueAssessmentQuestionCount !== 60) {
    failures.push("data_invalid_assessment_question_count");
  }

  if (dataStatus.assessmentOptionCount !== 288) {
    failures.push("data_invalid_assessment_option_count");
  }

  if (dataStatus.coreQuestionCount !== 48 || dataStatus.movieQuestionCount !== 12) {
    failures.push("data_invalid_question_module_count");
  }

  if (dataStatus.coreDimensionCount !== 4) {
    failures.push("data_invalid_core_dimension_count");
  }

  assert(fs.existsSync(absolute(FOUNDATION_MIGRATION)), "Foundation migration file is missing.");
  assert(fs.existsSync(absolute(QUESTION_METADATA_MIGRATION)), "Question metadata migration file is missing.");

  const result = {
    ok: failures.length === 0,
    failures,
    schema: schemaStatus,
    migration: migrationStatus,
    seed: seedStatus,
    data: dataStatus,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main();
