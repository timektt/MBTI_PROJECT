import assert from "node:assert/strict";
import type { Prisma, PrismaClient } from "@prisma/client";

import {
  computeGuestResult,
  getGuestQuestions,
  type GuestCloudReconnectBundle,
  type GuestLocale,
} from "../lib/mbti-guest";
import {
  buildReconnectImportSummary,
  dedupeReconnectImportResults,
  getReconnectSummaryMismatches,
  importReconnectBundleForUser,
  stableReconnectImportId,
} from "../lib/reconnect-bundle-cloud-import";

type QuestionRecord = {
  id: string;
  key: string;
  options: Array<{
    id: string;
    key: string;
  }>;
};

type UpsertArgs<TRecord extends Record<string, unknown>> = {
  where: Record<string, unknown>;
  update: Partial<TRecord>;
  create: TRecord;
};

function createGuestBundle(): GuestCloudReconnectBundle {
  const locale: GuestLocale = "th";
  const questions = getGuestQuestions(locale);
  const completeAnswers = Object.fromEntries(
    questions.map((question) => [question.key, question.options[0]?.key ?? "A"])
  );
  const latestResult = {
    ...computeGuestResult({
      version: "guest-v2",
      locale,
      currentIndex: questions.length - 1,
      answers: completeAnswers,
      startedAt: "2026-06-05T00:40:00.000Z",
      updatedAt: "2026-06-05T01:10:00.000Z",
    }),
    id: "guest_result_1",
    createdAt: "2026-06-05T01:20:00.000Z",
  };
  const session = {
    version: "guest-v2" as const,
    locale,
    currentIndex: 2,
    answers: {
      [questions[0].key]: questions[0].options[0]?.key ?? "A",
      missing_question: "A",
    },
    startedAt: "2026-06-05T01:25:00.000Z",
    updatedAt: "2026-06-05T01:28:00.000Z",
  };

  return {
    version: "guest-cloud-handoff-v1",
    exportedAt: "2026-06-05T01:30:00.000Z",
    mode: "guest-local",
    locale,
    latestResult,
    history: [latestResult],
    session,
    summary: {
      latestResultId: latestResult.id,
      historyCount: 1,
      inProgressAnswerCount: Object.keys(session.answers).length,
      hasPendingSession: true,
      lastActivityAt: latestResult.createdAt,
    },
  };
}

function getSingleString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function createMockDb() {
  const bundle = createGuestBundle();
  const firstQuestionKey = Object.keys(bundle.session?.answers ?? {})[0];
  const firstOptionKey = bundle.session?.answers[firstQuestionKey] ?? "A";
  const questionRecords: QuestionRecord[] = [
    {
      id: "question_1",
      key: firstQuestionKey,
      options: [
        {
          id: "option_1",
          key: firstOptionKey,
        },
      ],
    },
  ];
  const state = {
    quizResults: new Map<string, Record<string, unknown>>(),
    premiumReports: new Map<string, Record<string, unknown>>(),
    shareCards: new Map<string, Record<string, unknown>>(),
    cards: new Map<string, Record<string, unknown>>(),
    users: new Map<string, Record<string, unknown>>(),
    assessmentSessions: new Map<string, Record<string, unknown>>(),
    assessmentAnswers: new Map<string, Record<string, unknown>>(),
    eventLogs: [] as Array<Record<string, unknown>>,
  };

  function upsertRecord<TRecord extends Record<string, unknown>>({
    map,
    key,
    args,
    fallbackId,
  }: {
    map: Map<string, Record<string, unknown>>;
    key: string;
    args: UpsertArgs<TRecord>;
    fallbackId: string;
  }) {
    const existing = map.get(key);
    const next = existing
      ? {
          ...existing,
          ...args.update,
        }
      : {
          id: fallbackId,
          ...args.create,
        };

    map.set(key, next);
    return Promise.resolve(next);
  }

  const tx = {
    assessmentQuestion: {
      findMany(args: {
        where?: {
          key?: {
            in?: string[];
          };
        };
      }) {
        const keys = new Set(args.where?.key?.in ?? []);
        return Promise.resolve(
          questionRecords.filter((question) => keys.has(question.key))
        );
      },
    },
    assessmentSession: {
      upsert(args: UpsertArgs<Record<string, unknown>>) {
        const id = getSingleString(args.where.id);
        assert(id, "Expected assessmentSession.upsert where.id.");
        return upsertRecord({
          map: state.assessmentSessions,
          key: id,
          args,
          fallbackId: id,
        });
      },
    },
    assessmentAnswer: {
      upsert(args: UpsertArgs<Record<string, unknown>>) {
        const compound = args.where.sessionId_questionId as
          | { sessionId?: string; questionId?: string }
          | undefined;
        assert(compound?.sessionId, "Expected assessmentAnswer sessionId.");
        assert(compound?.questionId, "Expected assessmentAnswer questionId.");
        const key = `${compound.sessionId}:${compound.questionId}`;
        return upsertRecord({
          map: state.assessmentAnswers,
          key,
          args,
          fallbackId: key,
        });
      },
    },
    quizResult: {
      upsert(args: UpsertArgs<Record<string, unknown>>) {
        const id = getSingleString(args.where.id);
        assert(id, "Expected quizResult.upsert where.id.");
        return upsertRecord({
          map: state.quizResults,
          key: id,
          args,
          fallbackId: id,
        });
      },
    },
    premiumReport: {
      upsert(args: UpsertArgs<Record<string, unknown>>) {
        const quizResultId = getSingleString(args.where.quizResultId);
        assert(quizResultId, "Expected premiumReport.upsert where.quizResultId.");
        return upsertRecord({
          map: state.premiumReports,
          key: quizResultId,
          args,
          fallbackId: `premium_${quizResultId}`,
        });
      },
    },
    shareCard: {
      upsert(args: UpsertArgs<Record<string, unknown>>) {
        const slug = getSingleString(args.where.slug);
        assert(slug, "Expected shareCard.upsert where.slug.");
        return upsertRecord({
          map: state.shareCards,
          key: slug,
          args,
          fallbackId: `share_${slug}`,
        });
      },
    },
    card: {
      upsert(args: UpsertArgs<Record<string, unknown>>) {
        const userId = getSingleString(args.where.userId);
        assert(userId, "Expected card.upsert where.userId.");
        return upsertRecord({
          map: state.cards,
          key: userId,
          args,
          fallbackId: `card_${userId}`,
        });
      },
    },
    user: {
      update(args: {
        where: {
          id?: string;
        };
        data: Record<string, unknown>;
      }) {
        assert(args.where.id, "Expected user.update where.id.");
        const existing = state.users.get(args.where.id) ?? { id: args.where.id };
        const next = {
          ...existing,
          ...args.data,
        };
        state.users.set(args.where.id, next);
        return Promise.resolve(next);
      },
    },
    eventLog: {
      create(args: {
        data: Record<string, unknown>;
      }) {
        const next = {
          id: `event_${state.eventLogs.length + 1}`,
          ...args.data,
        };
        state.eventLogs.push(next);
        return Promise.resolve(next);
      },
    },
  } as unknown as Prisma.TransactionClient;

  const db = {
    $transaction<T>(callback: (transaction: Prisma.TransactionClient) => Promise<T>) {
      return callback(tx);
    },
  } as unknown as Pick<PrismaClient, "$transaction">;

  return {
    bundle,
    db,
    state,
  };
}

async function main() {
  const userId = "user_1";
  const { bundle, db, state } = createMockDb();
  const expectedResultId = stableReconnectImportId(
    "handoff_result",
    userId,
    "guest_result_1"
  );
  const summary = buildReconnectImportSummary(bundle);
  const mismatchedBundle = {
    ...bundle,
    summary: {
      ...bundle.summary,
      historyCount: 99,
    },
  };

  assert.deepEqual(getReconnectSummaryMismatches(bundle), []);
  assert.deepEqual(getReconnectSummaryMismatches(mismatchedBundle), [
    "historyCount",
  ]);
  assert.equal(summary.latestResultId, "guest_result_1");
  assert.equal(summary.inProgressAnswerCount, 2);
  assert.equal(dedupeReconnectImportResults(bundle).length, 1);

  const firstImport = await importReconnectBundleForUser({
    db,
    bundle,
    userId,
  });
  const secondImport = await importReconnectBundleForUser({
    db,
    bundle,
    userId,
  });
  const persistedResult = state.quizResults.get(expectedResultId);
  const persistedScoreDetail = persistedResult?.scoreDetail as
    | Record<string, unknown>
    | undefined;
  const user = state.users.get(userId);

  assert.equal(firstImport.resultCount, 1);
  assert.equal(firstImport.results[0]?.resultId, expectedResultId);
  assert.equal(firstImport.pendingSession.importedAnswerCount, 1);
  assert.equal(firstImport.pendingSession.skippedAnswerCount, 1);
  assert.equal(secondImport.results[0]?.resultId, firstImport.results[0]?.resultId);
  assert.equal(state.quizResults.size, 1);
  assert.equal(state.premiumReports.size, 1);
  assert.equal(state.shareCards.size, 1);
  assert.equal(state.cards.size, 1);
  assert.equal(state.assessmentSessions.size, 1);
  assert.equal(state.assessmentAnswers.size, 1);
  assert.equal(state.eventLogs.length, 2);
  assert.equal(persistedScoreDetail?.importedFrom, "guest-cloud-handoff-v1");
  assert.equal(persistedScoreDetail?.importedGuestResultId, "guest_result_1");
  assert.equal(user?.hasMbtiCard, true);
  assert.equal(user?.mbtiType, bundle.latestResult?.mbtiType);

  console.log(
    JSON.stringify(
      {
        ok: true,
        importedResultId: firstImport.results[0]?.resultId ?? null,
        reimportResultId: secondImport.results[0]?.resultId ?? null,
        resultCount: firstImport.resultCount,
        importedAnswerCount: firstImport.pendingSession.importedAnswerCount,
        skippedAnswerCount: firstImport.pendingSession.skippedAnswerCount,
        persistedCounts: {
          quizResults: state.quizResults.size,
          premiumReports: state.premiumReports.size,
          shareCards: state.shareCards.size,
          cards: state.cards.size,
          assessmentSessions: state.assessmentSessions.size,
          assessmentAnswers: state.assessmentAnswers.size,
          eventLogs: state.eventLogs.length,
        },
      },
      null,
      2
    )
  );
}

void main();
