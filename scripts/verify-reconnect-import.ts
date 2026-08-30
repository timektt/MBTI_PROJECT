import assert from "node:assert/strict";

type MemoryStorageShape = {
  clear: () => void;
  getItem: (key: string) => string | null;
  key: (index: number) => string | null;
  readonly length: number;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
};

class MemoryStorage implements MemoryStorageShape {
  private store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }

  get length() {
    return this.store.size;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

const localStorage = new MemoryStorage();

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: {
    localStorage,
  },
});

async function main() {
  const { assessmentRuntime } = await import("../lib/assessment-runtime");
  const {
    computeGuestResult,
    getGuestQuestions,
    readGuestCloudReconnectBundle,
    readGuestHistory,
    readGuestResult,
    readGuestSession,
  } = await import("../lib/mbti-guest");

  const locale = "th" as const;
  const questions = getGuestQuestions(locale);
  assert.ok(questions.length > 0);

  const completeAnswers = Object.fromEntries(
    questions.map((question) => {
      const option = question.options[0];
      assert.ok(option, `Question ${question.key} has no options`);
      return [question.key, option.key];
    })
  );
  const pendingAnswers = Object.fromEntries(
    questions.slice(0, 2).map((question) => {
      const option = question.options[0];
      assert.ok(option, `Question ${question.key} has no options`);
      return [question.key, option.key];
    })
  );
  const startedAt = "2026-06-05T00:40:00.000Z";
  const updatedAt = "2026-06-05T01:10:00.000Z";
  const latestResult = computeGuestResult({
    version: "guest-v2",
    locale,
    currentIndex: questions.length - 1,
    answers: completeAnswers,
    startedAt,
    updatedAt,
  });
  const pendingSession = {
    version: "guest-v2" as const,
    locale,
    currentIndex: 2,
    answers: pendingAnswers,
    startedAt,
    updatedAt,
  };

  const syntheticBundle = {
    version: "guest-cloud-handoff-v1" as const,
    exportedAt: "2026-06-05T01:23:45.000Z",
    mode: "guest-local" as const,
    locale,
    latestResult,
    history: [latestResult],
    session: pendingSession,
    summary: {
      latestResultId: latestResult.id,
      historyCount: 1,
      inProgressAnswerCount: 2,
      hasPendingSession: true,
      lastActivityAt: latestResult.createdAt,
    },
  };

  const invalidJsonResult = assessmentRuntime.importReconnectBundle("{");
  assert.equal(invalidJsonResult.ok, false);
  assert.equal(invalidJsonResult.code, "invalid_json");

  const invalidShapeResult = assessmentRuntime.importReconnectBundle(
    JSON.stringify({ version: "wrong" })
  );
  assert.equal(invalidShapeResult.ok, false);
  assert.equal(invalidShapeResult.code, "invalid_bundle");

  const importResult = assessmentRuntime.importReconnectBundle(
    JSON.stringify(syntheticBundle)
  );
  assert.equal(importResult.ok, true);
  assert.equal(importResult.code, "imported");
  assert.equal(importResult.overwritten, false);

  const restoredBundle = readGuestCloudReconnectBundle();
  const restoredResult = readGuestResult();
  const restoredHistory = readGuestHistory();
  const restoredSession = readGuestSession();

  assert.ok(restoredBundle);
  assert.equal(restoredBundle?.latestResult?.id, latestResult.id);
  assert.equal(restoredResult?.id, latestResult.id);
  assert.equal(restoredHistory.length, 1);
  assert.equal(restoredHistory[0]?.id, latestResult.id);
  assert.equal(restoredSession?.currentIndex, 2);
  assert.equal(Object.keys(restoredSession?.answers ?? {}).length, 2);

  const overwriteResult = assessmentRuntime.importReconnectBundle(
    JSON.stringify(syntheticBundle)
  );
  assert.equal(overwriteResult.ok, true);
  assert.equal(overwriteResult.overwritten, true);

  console.log(
    JSON.stringify(
      {
        invalidJsonCode: invalidJsonResult.code,
        invalidBundleCode: invalidShapeResult.code,
        importCode: importResult.code,
        overwriteCode: overwriteResult.code,
        restoredType: restoredResult?.mbtiType ?? null,
        restoredResultId: restoredResult?.id ?? null,
        restoredHistoryCount: restoredHistory.length,
        restoredPendingAnswers: Object.keys(restoredSession?.answers ?? {}).length,
        bundleVersion: restoredBundle?.version ?? null,
      },
      null,
      2
    )
  );
}

void main();
