import { Prisma, PrismaClient } from "@prisma/client";

import {
  buildLocalizedContent,
  personalityProfiles,
} from "../data/mbti/foundation-data.mjs";
import { mbtiZQuestionBank } from "../data/mbti/mbti-z-data.mjs";

const prisma = new PrismaClient();

type SeedQuestionOption = {
  key: string;
  labelTh: string;
  labelEn: string;
  traitCode?: string | null;
  metaLabel?: string | null;
  weights?: Prisma.InputJsonValue;
  movieScores?: Prisma.InputJsonValue;
};

type SeedQuestion = {
  key: string;
  kind: string;
  module: string;
  dimension: string;
  promptTh: string;
  promptEn: string;
  sortOrder: number;
  poles?: Prisma.InputJsonValue;
  options: SeedQuestionOption[];
};

async function seedPersonalityProfiles() {
  for (const [code, slug, archetypeNameTh, archetypeNameEn] of personalityProfiles) {
    const summaryTh = `${archetypeNameTh} (${code}) มีแนวโน้มตัดสินใจและจัดการชีวิตตามรูปแบบเฉพาะตัว ซึ่งส่งผลต่อพลังงาน การเรียนรู้ ความสัมพันธ์ และการทำงาน.`;
    const summaryEn = `${archetypeNameEn} (${code}) usually shows a distinctive pattern in energy, learning, decisions, relationships, and execution style.`;

    await prisma.personalityProfile.upsert({
      where: { code },
      update: {
        slug,
        archetypeNameTh,
        archetypeNameEn,
        taglineTh: `${archetypeNameTh} ที่มองตัวเองอย่างลึกและเดินเกมอย่างมีทิศทาง`,
        taglineEn: `${archetypeNameEn} with reflective self-awareness and intentional momentum`,
        summaryTh,
        summaryEn,
      },
      create: {
        code,
        slug,
        archetypeNameTh,
        archetypeNameEn,
        taglineTh: `${archetypeNameTh} ที่มองตัวเองอย่างลึกและเดินเกมอย่างมีทิศทาง`,
        taglineEn: `${archetypeNameEn} with reflective self-awareness and intentional momentum`,
        summaryTh,
        summaryEn,
      },
    });

    for (const content of buildLocalizedContent({
      code,
      archetypeNameTh,
      archetypeNameEn,
      summaryTh,
      summaryEn,
    })) {
      await prisma.personalityContent.upsert({
        where: {
          personalityCode_locale_section_tier_sortOrder: {
            personalityCode: code,
            locale: content.locale,
            section: content.section,
            tier: content.tier,
            sortOrder: content.sortOrder,
          },
        },
        update: {
          title: content.title,
          body: content.body,
        },
        create: {
          personalityCode: code,
          locale: content.locale,
          section: content.section,
          tier: content.tier,
          title: content.title,
          body: content.body,
          sortOrder: content.sortOrder,
        },
      });
    }
  }
}

async function seedAssessmentQuestions() {
  for (const question of mbtiZQuestionBank as SeedQuestion[]) {
    const createdQuestion = await prisma.assessmentQuestion.upsert({
      where: { key: question.key },
      update: {
        kind: question.kind,
        module: question.module,
        dimension: question.dimension,
        promptTh: question.promptTh,
        promptEn: question.promptEn,
        sortOrder: question.sortOrder,
        poles: question.poles ?? Prisma.DbNull,
        version: "v1",
        isActive: true,
      },
      create: {
        key: question.key,
        kind: question.kind,
        module: question.module,
        dimension: question.dimension,
        promptTh: question.promptTh,
        promptEn: question.promptEn,
        sortOrder: question.sortOrder,
        poles: question.poles ?? Prisma.DbNull,
        version: "v1",
        isActive: true,
      },
    });

    for (const option of question.options) {
      await prisma.assessmentOption.upsert({
        where: {
          questionId_key: {
            questionId: createdQuestion.id,
            key: option.key,
          },
        },
        update: {
          labelTh: option.labelTh,
          labelEn: option.labelEn,
          traitCode: option.traitCode ?? null,
          metaLabel: option.metaLabel ?? null,
          weights: option.weights ?? Prisma.DbNull,
          movieScores: option.movieScores ?? Prisma.DbNull,
          scoreValue: 1,
        },
        create: {
          questionId: createdQuestion.id,
          key: option.key,
          labelTh: option.labelTh,
          labelEn: option.labelEn,
          traitCode: option.traitCode ?? null,
          metaLabel: option.metaLabel ?? null,
          weights: option.weights ?? Prisma.DbNull,
          movieScores: option.movieScores ?? Prisma.DbNull,
          scoreValue: 1,
        },
      });
    }
  }
}

async function main() {
  await seedPersonalityProfiles();
  await seedAssessmentQuestions();

  console.log("Seeded MBTI product foundation data");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
