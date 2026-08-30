import {
  CLOUD_RUNTIME_READINESS,
  createCloudRuntimeAdapter,
  createCloudRuntimeServiceAdapter,
  getCloudRuntimeServiceStatus,
  type CloudRuntimeReadiness,
} from "@/lib/assessment-runtime-cloud";
import type { CloudRuntimeFetch } from "@/lib/assessment-runtime-cloud-client";

type CapturedRequest = {
  path: string;
  method: string;
};

const capturedRequests: CapturedRequest[] = [];

const resultArtifact = {
  id: "result_1",
  locale: "th",
  mbtiType: "ESTJ",
  createdAt: "2026-06-26T00:00:00.000Z",
  archetypeName: "ผู้ขับเคลื่อนการตัดสินใจ",
  tagline: "นักจัดระบบที่ชอบเปลี่ยนแผนให้กลายเป็นผลลัพธ์จริง",
  summaryTitle: "แกนหลักของ ESTJ",
  summaryBody: "ESTJ summary",
  house: {
    key: "yellow",
    title: "บ้านเหลือง",
    description: "กลุ่มผู้ดูแลโครงสร้าง",
    accentFrom: "#d8a623",
    accentTo: "#ffe082",
    surface: "rgba(216, 166, 35, 0.18)",
    imagePath: "/mbti-z/houses/yellow.png",
  },
  animal: {
    key: "golden-eagle",
    name: "อินทรีทอง",
    imagePath: "/mbti-z/animals/estj-golden-eagle.png",
  },
  movieProfile: {
    key: "worldBuilder",
    title: "Movie Profile: นักสำรวจโลกเรื่องเล่า",
    summary: "คุณถูกดึงดูดด้วยจักรวาลหนัง ระบบของโลก และรายละเอียดที่ทำให้สถานที่สมมติดูมีชีวิตจริง.",
    tags: ["โลกสมมติ", "บรรยากาศ", "รายละเอียดจักรวาล"],
    scores: {
      worldBuilder: 12,
      mindBender: 7,
      pulseRider: 5,
    },
    secondaryKeys: ["mindBender", "pulseRider"],
  },
  premiumSections: [
    {
      section: "strengths",
      title: "จุดแข็ง",
      body: "Premium preview",
    },
  ],
  premiumStatus: "locked",
  premiumReportId: "report_1",
  shareSlug: "estj-user-abc",
  publicSharePath: "/share/estj-user-abc",
  cardId: "card_1",
  coverage: {
    source: "cloud-core-v1",
    hasMovieProfile: true,
  },
} as const;

const guestResult = {
  id: "guest_result_1",
  locale: "th",
  mbtiType: "ESTJ",
  createdAt: "2026-06-26T00:00:00.000Z",
  confidence: 92,
  archetypeName: "ผู้ขับเคลื่อนการตัดสินใจ",
  tagline: "นักจัดระบบที่ชอบเปลี่ยนแผนให้กลายเป็นผลลัพธ์จริง",
  house: {
    key: "yellow",
    title: "บ้านเหลือง",
    description: "กลุ่มผู้ดูแลโครงสร้าง",
    accentFrom: "#d8a623",
    accentTo: "#ffe082",
    surface: "rgba(216, 166, 35, 0.18)",
  },
  animal: {
    key: "golden-eagle",
    name: "อินทรีทอง",
    imagePath: "/mbti-z/animals/estj-golden-eagle.png",
  },
  movieProfile: {
    key: "worldBuilder",
    title: "Movie Profile: นักสำรวจโลกเรื่องเล่า",
    summary: "คุณถูกดึงดูดด้วยจักรวาลหนัง ระบบของโลก และรายละเอียดที่ทำให้สถานที่สมมติดูมีชีวิตจริง.",
    tags: ["โลกสมมติ", "บรรยากาศ", "รายละเอียดจักรวาล"],
    scores: {
      worldBuilder: 12,
      mindBender: 7,
      pulseRider: 5,
    },
    secondaryKeys: ["mindBender", "pulseRider"],
  },
  summaryTitle: "แกนหลักของ ESTJ",
  summaryBody: "ESTJ summary",
  premiumSections: [
    {
      section: "strengths",
      title: "จุดแข็ง",
      body: "Premium preview",
    },
  ],
  dimensions: [
    {
      pair: "E/I",
      left: "E",
      right: "I",
      leftScore: 12,
      rightScore: 4,
      winner: "E",
      balance: 75,
    },
  ],
  answerSummary: [
    {
      questionKey: "q1",
      question: "เลือกคำตอบที่ใกล้คุณที่สุด",
      kind: "mbti",
      module: "core",
      dimension: "E/I",
      optionKey: "A",
      traitCode: "E",
      metaLabel: "strong E",
      label: "ออกไปเจอผู้คน",
    },
  ],
  answerMap: {
    q1: "A",
  },
  questionCount: 1,
  coreQuestionCount: 1,
  movieQuestionCount: 0,
} as const;

const reconnectBundle = {
  version: "guest-cloud-handoff-v1",
  exportedAt: "2026-06-26T00:05:00.000Z",
  mode: "guest-local",
  locale: "th",
  latestResult: guestResult,
  history: [guestResult],
  session: {
    version: "guest-v2",
    locale: "th",
    currentIndex: 1,
    answers: {
      q1: "A",
    },
    startedAt: "2026-06-26T00:00:00.000Z",
    updatedAt: "2026-06-26T00:04:00.000Z",
  },
  summary: {
    latestResultId: "guest_result_1",
    historyCount: 1,
    inProgressAnswerCount: 1,
    hasPendingSession: true,
    lastActivityAt: "2026-06-26T00:00:00.000Z",
  },
} as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const implementedReadiness = {
  ...CLOUD_RUNTIME_READINESS,
  implemented: true,
  status: "ready",
  blockers: [],
} as CloudRuntimeReadiness;

const fetcher: CloudRuntimeFetch = async (input, init) => {
  const url = new URL(input);
  const method = init?.method ?? "GET";

  capturedRequests.push({
    path: `${url.pathname}${url.search}`,
    method,
  });

  if (url.pathname === "/api/health/db") {
    return jsonResponse({
      ok: true,
      service: "database",
      environment: "test",
      timestamp: "2026-06-26T00:00:00.000Z",
    });
  }

  if (url.pathname === "/api/quiz/start") {
    return jsonResponse({
      sessionId: "session_1",
      locale: "th",
      progress: 0,
      answers: [],
      questions: [
        {
          id: "question_1",
          key: "q1",
          kind: "mbti",
          module: "core",
          dimension: "E/I",
          prompt: "เลือกคำตอบที่ใกล้คุณที่สุด",
          sortOrder: 1,
          poles: {
            left: {
              label: "พลังงานออกสู่ผู้คน",
              traitCode: "E",
            },
            right: {
              label: "พลังงานกลับเข้าตัวเอง",
              traitCode: "I",
            },
          },
          options: [
            {
              id: "option_1",
              key: "A",
              traitCode: "E",
              metaLabel: "strong E",
              label: "ออกไปเจอผู้คน",
              weights: { E: 4 },
              movieScores: null,
            },
          ],
        },
      ],
    });
  }

  if (url.pathname === "/api/quiz/answer") {
    return jsonResponse({
      ok: true,
      answeredCount: 1,
      totalQuestions: 60,
      progress: 2,
      isComplete: false,
    });
  }

  if (url.pathname === "/api/quiz/submit") {
    return jsonResponse({
      resultId: "result_1",
      mbtiType: "ESTJ",
      locale: "th",
      shareSlug: "estj-user-abc",
      premiumReportId: "report_1",
      redirectTo: "/result/result_1",
      artifact: resultArtifact,
    });
  }

  if (url.pathname === "/api/me/results") {
    return jsonResponse({
      results: [
        {
          id: "result_1",
          mbtiType: "ESTJ",
          locale: "th",
          createdAt: "2026-06-26T00:00:00.000Z",
          summary: "นักจัดระบบ",
          premiumStatus: "locked",
          premiumReportId: "report_1",
          shareSlug: "estj-user-abc",
          cardId: "card_1",
          artifact: resultArtifact,
        },
      ],
    });
  }

  if (url.pathname === "/api/me/reconnect-bundle/import") {
    if (init?.body && typeof init.body === "string") {
      const body = JSON.parse(init.body);

      if (body.dryRun === false) {
        return jsonResponse({
          ok: true,
          status: "imported",
          dryRun: false,
          summary: {
            bundleVersion: "guest-cloud-handoff-v1",
            mode: "guest-local",
            locale: "th",
            exportedAt: "2026-06-26T00:05:00.000Z",
            latestResultId: "guest_result_1",
            resultType: "ESTJ",
            historyCount: 1,
            hasPendingSession: true,
            inProgressAnswerCount: 1,
            lastActivityAt: "2026-06-26T00:00:00.000Z",
          },
          account: {
            existingResultCount: 0,
            requiresConflictResolution: false,
          },
          imported: {
            resultCount: 1,
            results: [
              {
                sourceResultId: "guest_result_1",
                resultId: "handoff_result_1",
                premiumReportId: "report_1",
                shareSlug: "estj-imported",
                isLatest: true,
              },
            ],
            pendingSession: {
              sessionId: "handoff_session_1",
              importedAnswerCount: 1,
              skippedAnswerCount: 0,
            },
          },
        });
      }
    }

    return jsonResponse({
      ok: true,
      status: "validated",
      dryRun: true,
      summary: {
        bundleVersion: "guest-cloud-handoff-v1",
        mode: "guest-local",
        locale: "th",
        exportedAt: "2026-06-26T00:05:00.000Z",
        latestResultId: "guest_result_1",
        resultType: "ESTJ",
        historyCount: 1,
        hasPendingSession: true,
        inProgressAnswerCount: 1,
        lastActivityAt: "2026-06-26T00:00:00.000Z",
      },
      account: {
        existingResultCount: 0,
        requiresConflictResolution: false,
      },
    });
  }

  return new Response(JSON.stringify({ error: "Unhandled route" }), {
    status: 404,
  });
};

async function main() {
  const publicRuntimeAdapter = createCloudRuntimeAdapter();
  assert(publicRuntimeAdapter === null, "Public cloud runtime adapter must stay disabled.");

  const blockedStatus = getCloudRuntimeServiceStatus(CLOUD_RUNTIME_READINESS);
  assert(blockedStatus.activeMode === "guest-local", "Blocked cloud service must fall back to guest-local.");
  assert(blockedStatus.cloudReady === false, "Blocked cloud service must report cloudReady=false.");

  const blockedServiceAdapter = createCloudRuntimeServiceAdapter({
    readiness: CLOUD_RUNTIME_READINESS,
    baseUrl: "https://mbti-z.test",
    fetcher,
  });
  assert(blockedServiceAdapter === null, "Blocked manifest must not create cloud service adapter.");

  const serviceAdapter = createCloudRuntimeServiceAdapter({
    readiness: implementedReadiness,
    baseUrl: "https://mbti-z.test",
    fetcher,
  });
  assert(serviceAdapter, "Implemented manifest should create cloud service adapter.");

  const status = serviceAdapter.getStatus();
  assert(status.activeMode === "cloud", "Implemented service adapter should be active in cloud mode.");
  assert(status.cloudReady === true, "Implemented service adapter should report cloudReady=true.");

  const health = await serviceAdapter.health();
  const bootState = await serviceAdapter.bootstrapSession("th");
  assert(bootState.sessionId === "session_1", "Expected cloud session ID.");
  assert(bootState.locale === "th", "Expected cloud session locale.");
  assert(bootState.answeredCount === 0, "Expected no answered cloud questions at boot.");
  assert(bootState.totalQuestions === 1, "Expected one cloud question in fixture.");
  const currentQuestion = bootState.currentQuestion;
  assert(currentQuestion, "Expected current cloud question.");
  assert(currentQuestion.id === "question_1", "Expected first unanswered cloud question.");
  assert(currentQuestion.kind === "mbti", "Expected cloud question kind metadata.");
  assert(currentQuestion.module === "core", "Expected cloud question module metadata.");
  assert(currentQuestion.poles?.left.traitCode === "E", "Expected cloud question poles metadata.");
  assert(currentQuestion.options[0]?.weights?.E === 4, "Expected cloud option weights metadata.");

  const answer = await serviceAdapter.saveSessionAnswer({
    sessionId: bootState.sessionId,
    questionId: currentQuestion.id,
    optionId: currentQuestion.options[0].id,
    locale: bootState.locale,
  });
  const submit = await serviceAdapter.submitSession({
    sessionId: bootState.sessionId,
    locale: bootState.locale,
  });
  const dashboard = await serviceAdapter.getDashboardState("th");
  const reconnectImport = await serviceAdapter.validateReconnectBundleImport({
    bundle: reconnectBundle,
  });
  const reconnectPersistence = await serviceAdapter.importReconnectBundle({
    bundle: reconnectBundle,
    overwrite: false,
  });

  assert(health.ok === true, "Expected health check ok=true.");
  assert(answer.sessionId === bootState.sessionId, "Expected answer state to retain session ID.");
  assert(answer.answeredCount === 1, "Expected answer response to round-trip.");
  assert(submit.resultId === "result_1", "Expected submit result ID.");
  assert(submit.sessionId === bootState.sessionId, "Expected submit state to retain session ID.");
  assert(submit.artifact.house?.key === "yellow", "Expected submit artifact house metadata.");
  assert(submit.artifact.movieProfile?.key === "worldBuilder", "Expected submit artifact movie profile.");
  assert(submit.artifact.coverage.hasMovieProfile === true, "Expected cloud-core movie coverage marker.");
  assert(dashboard.latestResult?.id === submit.resultId, "Expected dashboard latest result to match submitted result.");
  assert(dashboard.latestResult?.artifact.animal?.key === "golden-eagle", "Expected dashboard artifact animal metadata.");
  assert(dashboard.history.length === 1, "Expected dashboard history to include submitted result.");
  assert(reconnectImport.status === "validated", "Expected reconnect import dry-run validation.");
  assert(reconnectImport.summary.latestResultId === "guest_result_1", "Expected reconnect import latest result summary.");
  assert(reconnectPersistence.status === "imported", "Expected reconnect persistence import.");
  assert(reconnectPersistence.dryRun === false, "Expected reconnect persistence to disable dry-run.");
  assert(reconnectPersistence.imported?.resultCount === 1, "Expected one persisted reconnect result.");
  assert(
    reconnectPersistence.imported.pendingSession.importedAnswerCount === 1,
    "Expected pending reconnect session answer to persist."
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        publicRuntimeAdapter: "disabled",
        blockedStatus,
        implementedStatus: status,
        requestCount: capturedRequests.length,
        routes: capturedRequests,
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
