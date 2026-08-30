import { createHash } from "node:crypto";
import type { Prisma, PrismaClient } from "@prisma/client";

import type { GuestCloudReconnectBundle } from "@/lib/mbti-guest";
import {
  cardPlaceholderPath,
  normalizeLocale,
} from "@/lib/mbti-assessment";

type GuestReconnectResult = GuestCloudReconnectBundle["history"][number];
type ReconnectImportDatabase = Pick<PrismaClient, "$transaction">;

function getInProgressAnswerCount(bundle: GuestCloudReconnectBundle) {
  return bundle.session ? Object.keys(bundle.session.answers).length : 0;
}

export function getReconnectSummaryMismatches(
  bundle: GuestCloudReconnectBundle
) {
  const latestResultId = bundle.latestResult?.id ?? null;
  const hasPendingSession = bundle.session !== null;
  const inProgressAnswerCount = getInProgressAnswerCount(bundle);
  const mismatches: string[] = [];

  if (bundle.summary.latestResultId !== latestResultId) {
    mismatches.push("latestResultId");
  }

  if (bundle.summary.historyCount !== bundle.history.length) {
    mismatches.push("historyCount");
  }

  if (bundle.summary.hasPendingSession !== hasPendingSession) {
    mismatches.push("hasPendingSession");
  }

  if (bundle.summary.inProgressAnswerCount !== inProgressAnswerCount) {
    mismatches.push("inProgressAnswerCount");
  }

  return mismatches;
}

export function buildReconnectImportSummary(
  bundle: GuestCloudReconnectBundle
) {
  return {
    bundleVersion: bundle.version,
    mode: bundle.mode,
    locale: bundle.locale,
    exportedAt: bundle.exportedAt,
    latestResultId: bundle.latestResult?.id ?? null,
    resultType: bundle.latestResult?.mbtiType ?? null,
    historyCount: bundle.history.length,
    hasPendingSession: bundle.session !== null,
    inProgressAnswerCount: getInProgressAnswerCount(bundle),
    lastActivityAt: bundle.summary.lastActivityAt,
  };
}

export function stableReconnectImportId(prefix: string, ...parts: string[]) {
  const hash = createHash("sha256").update(parts.join(":")).digest("hex");
  return `${prefix}_${hash.slice(0, 24)}`;
}

function parseTimestamp(value: string, fallback = new Date()) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export function dedupeReconnectImportResults(
  bundle: GuestCloudReconnectBundle
) {
  const deduped: GuestReconnectResult[] = [];
  const seen = new Set<string>();
  const candidates = [
    ...(bundle.latestResult ? [bundle.latestResult] : []),
    ...bundle.history,
  ];

  for (const result of candidates) {
    if (!result.id || seen.has(result.id)) {
      continue;
    }

    seen.add(result.id);
    deduped.push(result);
  }

  return deduped;
}

function buildImportedScoreDetail(result: GuestReconnectResult) {
  return {
    mbtiType: result.mbtiType,
    locale: result.locale,
    confidence: result.confidence,
    dimensions: result.dimensions,
    answers: result.answerSummary,
    answerMap: result.answerMap,
    movieScores: result.movieProfile.scores,
    movieProfile: {
      key: result.movieProfile.key,
      scores: result.movieProfile.scores,
      secondaryKeys: result.movieProfile.secondaryKeys,
    },
    importedGuestResultId: result.id,
    importedFrom: "guest-cloud-handoff-v1",
  };
}

function buildImportedShareSlug(userId: string, result: GuestReconnectResult) {
  return `${result.mbtiType.toLowerCase()}-${stableReconnectImportId(
    "handoff",
    userId,
    result.id
  ).slice(-10)}`;
}

async function importPendingSession({
  tx,
  bundle,
  userId,
}: {
  tx: Prisma.TransactionClient;
  bundle: GuestCloudReconnectBundle;
  userId: string;
}) {
  if (!bundle.session) {
    return {
      sessionId: null,
      importedAnswerCount: 0,
      skippedAnswerCount: 0,
    };
  }

  const importedSessionId = stableReconnectImportId(
    "handoff_session",
    userId,
    bundle.session.startedAt,
    bundle.exportedAt
  );
  const answerEntries = Object.entries(bundle.session.answers);
  const progress = Math.min(
    100,
    Math.round(
      (answerEntries.length / Math.max(bundle.history[0]?.questionCount ?? 60, 1)) *
        100
    )
  );
  const questions = await tx.assessmentQuestion.findMany({
    where: {
      isActive: true,
      version: "v1",
      key: {
        in: answerEntries.map(([questionKey]) => questionKey),
      },
    },
    include: {
      options: true,
    },
  });
  const questionByKey = new Map(questions.map((question) => [question.key, question]));

  await tx.assessmentSession.upsert({
    where: { id: importedSessionId },
    update: {
      status: "draft",
      locale: bundle.session.locale,
      progress,
      currentQuestionOrder: bundle.session.currentIndex,
      lastAnsweredAt: parseTimestamp(bundle.session.updatedAt),
    },
    create: {
      id: importedSessionId,
      userId,
      status: "draft",
      locale: bundle.session.locale,
      version: "v1",
      progress,
      currentQuestionOrder: bundle.session.currentIndex,
      startedAt: parseTimestamp(bundle.session.startedAt),
      lastAnsweredAt: parseTimestamp(bundle.session.updatedAt),
    },
  });

  let importedAnswerCount = 0;
  let skippedAnswerCount = 0;

  for (const [questionKey, optionKey] of answerEntries) {
    const question = questionByKey.get(questionKey);
    const option = question?.options.find((entry) => entry.key === optionKey);

    if (!question || !option) {
      skippedAnswerCount += 1;
      continue;
    }

    await tx.assessmentAnswer.upsert({
      where: {
        sessionId_questionId: {
          sessionId: importedSessionId,
          questionId: question.id,
        },
      },
      update: {
        optionId: option.id,
        locale: bundle.session.locale,
      },
      create: {
        sessionId: importedSessionId,
        questionId: question.id,
        optionId: option.id,
        userId,
        locale: bundle.session.locale,
      },
    });
    importedAnswerCount += 1;
  }

  return {
    sessionId: importedSessionId,
    importedAnswerCount,
    skippedAnswerCount,
  };
}

export async function importReconnectBundleForUser({
  db,
  bundle,
  userId,
}: {
  db: ReconnectImportDatabase;
  bundle: GuestCloudReconnectBundle;
  userId: string;
}) {
  const importResults = dedupeReconnectImportResults(bundle);
  const latestResultId = bundle.latestResult?.id ?? importResults[0]?.id ?? null;

  return db.$transaction(async (tx) => {
    const importedResults = [];

    for (const result of importResults) {
      const importedResultId = stableReconnectImportId(
        "handoff_result",
        userId,
        result.id
      );
      const shareSlug = buildImportedShareSlug(userId, result);
      const createdAt = parseTimestamp(result.createdAt);
      const quizResult = await tx.quizResult.upsert({
        where: { id: importedResultId },
        update: {
          mbtiType: result.mbtiType,
          typeCode: result.mbtiType,
          locale: normalizeLocale(result.locale),
          scoreDetail: buildImportedScoreDetail(result),
          testVersion: "guest-cloud-handoff-v1",
        },
        create: {
          id: importedResultId,
          userId,
          mbtiType: result.mbtiType,
          typeCode: result.mbtiType,
          locale: normalizeLocale(result.locale),
          scoreDetail: buildImportedScoreDetail(result),
          testVersion: "guest-cloud-handoff-v1",
          createdAt,
        },
      });

      const premiumReport = await tx.premiumReport.upsert({
        where: { quizResultId: quizResult.id },
        update: {
          personalityCode: result.mbtiType,
          locale: normalizeLocale(result.locale),
          status: "locked",
          teaserData: {
            summary: {
              title: result.summaryTitle,
              body: result.summaryBody,
            },
            preview: result.premiumSections.slice(0, 2),
            importedGuestResultId: result.id,
          },
        },
        create: {
          userId,
          quizResultId: quizResult.id,
          personalityCode: result.mbtiType,
          locale: normalizeLocale(result.locale),
          status: "locked",
          teaserData: {
            summary: {
              title: result.summaryTitle,
              body: result.summaryBody,
            },
            preview: result.premiumSections.slice(0, 2),
            importedGuestResultId: result.id,
          },
        },
      });

      const shareCard = await tx.shareCard.upsert({
        where: { slug: shareSlug },
        update: {
          quizResultId: quizResult.id,
          personalityCode: result.mbtiType,
          locale: normalizeLocale(result.locale),
          title:
            result.locale === "en"
              ? `${result.mbtiType} imported personality snapshot`
              : `สรุปบุคลิกภาพ ${result.mbtiType}`,
          subtitle: result.summaryTitle,
          imageUrl: cardPlaceholderPath,
        },
        create: {
          userId,
          quizResultId: quizResult.id,
          personalityCode: result.mbtiType,
          slug: shareSlug,
          locale: normalizeLocale(result.locale),
          title:
            result.locale === "en"
              ? `${result.mbtiType} imported personality snapshot`
              : `สรุปบุคลิกภาพ ${result.mbtiType}`,
          subtitle: result.summaryTitle,
          imageUrl: cardPlaceholderPath,
        },
      });

      importedResults.push({
        sourceResultId: result.id,
        resultId: quizResult.id,
        premiumReportId: premiumReport.id,
        shareSlug: shareCard.slug,
        isLatest: result.id === latestResultId,
      });
    }

    const latestImported =
      importedResults.find((result) => result.isLatest) ?? importedResults[0];
    const latestSource =
      importResults.find((result) => result.id === latestImported?.sourceResultId) ??
      importResults[0] ??
      null;

    if (latestImported && latestSource) {
      await tx.card.upsert({
        where: { userId },
        update: {
          title:
            latestSource.locale === "en"
              ? `${latestSource.mbtiType} Premium Identity Card`
              : `การ์ดบุคลิกภาพ ${latestSource.mbtiType}`,
          description: latestSource.summaryBody,
          imageUrl: cardPlaceholderPath,
          quizResultId: latestImported.resultId,
        },
        create: {
          userId,
          title:
            latestSource.locale === "en"
              ? `${latestSource.mbtiType} Premium Identity Card`
              : `การ์ดบุคลิกภาพ ${latestSource.mbtiType}`,
          description: latestSource.summaryBody,
          imageUrl: cardPlaceholderPath,
          quizResultId: latestImported.resultId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          hasMbtiCard: true,
          mbtiType: latestSource.mbtiType,
          preferredLocale: normalizeLocale(bundle.locale),
        },
      });
    } else {
      await tx.user.update({
        where: { id: userId },
        data: {
          preferredLocale: normalizeLocale(bundle.locale),
        },
      });
    }

    const pendingSessionImport = await importPendingSession({
      tx,
      bundle,
      userId,
    });

    await tx.eventLog.create({
      data: {
        userId,
        assessmentSessionId: pendingSessionImport.sessionId,
        quizResultId: latestImported?.resultId ?? null,
        eventName: "reconnect_bundle_imported",
        eventCategory: "reconnect",
        locale: normalizeLocale(bundle.locale),
        payload: {
          bundleVersion: bundle.version,
          exportedAt: bundle.exportedAt,
          resultCount: importedResults.length,
          pendingSession: pendingSessionImport,
        },
      },
    });

    return {
      resultCount: importedResults.length,
      results: importedResults,
      pendingSession: pendingSessionImport,
    };
  });
}
