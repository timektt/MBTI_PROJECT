import {
  CloudRuntimeApiError,
  createCloudRuntimeApiClient,
  type CloudRuntimeFetch,
} from "@/lib/assessment-runtime-cloud-client";

type CapturedRequest = {
  path: string;
  method: string;
  body: unknown;
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

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function readBody(init?: RequestInit) {
  if (!init?.body) {
    return null;
  }

  assert(typeof init.body === "string", "Expected JSON request body string.");
  return JSON.parse(init.body);
}

const fetcher: CloudRuntimeFetch = async (input, init) => {
  const url = new URL(input);
  const path = `${url.pathname}${url.search}`;
  const method = init?.method ?? "GET";
  const body = await readBody(init);

  capturedRequests.push({
    path,
    method,
    body,
  });

  if (url.pathname === "/api/health/db") {
    assert(method === "GET", "Health check must use GET.");

    return jsonResponse({
      ok: true,
      service: "database",
      environment: "test",
      timestamp: "2026-06-26T00:00:00.000Z",
    });
  }

  if (url.pathname === "/api/quiz/start") {
    assert(method === "POST", "Quiz start must use POST.");
    assert(body && typeof body === "object", "Quiz start body is required.");
    assert("locale" in body && body.locale === "th", "Quiz start must send locale.");

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
    assert(method === "POST", "Quiz answer must use POST.");
    assert(body && typeof body === "object", "Quiz answer body is required.");
    assert("sessionId" in body && body.sessionId === "session_1", "Quiz answer must send sessionId.");
    assert("questionId" in body && body.questionId === "question_1", "Quiz answer must send questionId.");
    assert("optionId" in body && body.optionId === "option_1", "Quiz answer must send optionId.");

    return jsonResponse({
      ok: true,
      answeredCount: 1,
      totalQuestions: 60,
      progress: 2,
      isComplete: false,
    });
  }

  if (url.pathname === "/api/quiz/submit") {
    assert(method === "POST", "Quiz submit must use POST.");
    assert(body && typeof body === "object", "Quiz submit body is required.");
    assert("sessionId" in body && body.sessionId === "session_1", "Quiz submit must send sessionId.");

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
    assert(method === "GET", "Result list must use GET.");
    assert(url.searchParams.get("locale") === "th", "Result list must preserve locale query.");

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
    assert(method === "POST", "Reconnect bundle import must use POST.");
    assert(body && typeof body === "object", "Reconnect import body is required.");
    assert("bundle" in body && body.bundle, "Reconnect import must send a bundle.");

    if ("dryRun" in body && body.dryRun === false) {
      assert("overwrite" in body, "Reconnect import must send overwrite intent.");

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

    assert("dryRun" in body && body.dryRun === true, "Reconnect validation must stay in dry-run mode.");

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

  return jsonResponse({ error: "Unhandled route" }, 404);
};

async function verifyErrorHandling() {
  const client = createCloudRuntimeApiClient({
    baseUrl: "https://mbti-z.test",
    fetcher: async () => jsonResponse({ error: "Unauthorized" }, 401),
  });

  try {
    await client.listResults("th");
  } catch (error) {
    assert(error instanceof CloudRuntimeApiError, "Expected CloudRuntimeApiError.");
    assert(error.status === 401, "Expected 401 status on CloudRuntimeApiError.");
    assert(error.route === "/api/me/results?locale=th", "Expected failed route to be preserved.");
    assert(error.message === "Unauthorized", "Expected sanitized API error message.");
    return;
  }

  throw new Error("Expected cloud API client to reject non-2xx responses.");
}

async function main() {
  const client = createCloudRuntimeApiClient({
    baseUrl: "https://mbti-z.test",
    fetcher,
  });

  const health = await client.health();
  const start = await client.startQuiz("th");
  const answer = await client.saveAnswer({
    sessionId: start.sessionId,
    questionId: start.questions[0].id,
    optionId: start.questions[0].options[0].id,
    locale: start.locale,
  });
  const submit = await client.submitQuiz({
    sessionId: start.sessionId,
    locale: start.locale,
  });
  const resultList = await client.listResults("th");
  const reconnectImport = await client.validateReconnectBundleImport({
    bundle: reconnectBundle,
  });
  const reconnectPersist = await client.importReconnectBundle({
    bundle: reconnectBundle,
    overwrite: false,
  });

  assert(health.ok === true, "Expected health response ok=true.");
  assert(start.questions.length === 1, "Expected start response questions.");
  assert(start.questions[0]?.kind === "mbti", "Expected start question kind metadata.");
  assert(start.questions[0]?.module === "core", "Expected start question module metadata.");
  assert(start.questions[0]?.poles?.left.traitCode === "E", "Expected start question poles metadata.");
  assert(start.questions[0]?.options[0]?.weights?.E === 4, "Expected option weights metadata.");
  assert(answer.progress === 2, "Expected answer progress to round-trip.");
  assert(submit.redirectTo === "/result/result_1", "Expected submit redirectTo.");
  assert(submit.artifact.house?.key === "yellow", "Expected submit artifact house.");
  assert(submit.artifact.movieProfile?.key === "worldBuilder", "Expected submit artifact movie profile.");
  assert(submit.artifact.coverage.hasMovieProfile === true, "Expected cloud-core movie coverage marker.");
  assert(resultList.results[0]?.id === submit.resultId, "Expected result list to include submitted result.");
  assert(resultList.results[0]?.artifact.animal?.key === "golden-eagle", "Expected result artifact animal.");
  assert(reconnectImport.status === "validated", "Expected reconnect import dry-run validation.");
  assert(reconnectImport.dryRun === true, "Expected reconnect import to stay dry-run.");
  assert(reconnectImport.summary.latestResultId === "guest_result_1", "Expected reconnect summary latest result.");
  assert(reconnectImport.account.requiresConflictResolution === false, "Expected reconnect account conflict summary.");
  assert(reconnectPersist.status === "imported", "Expected reconnect persistence import.");
  assert(reconnectPersist.dryRun === false, "Expected reconnect persistence to disable dry-run.");
  assert(reconnectPersist.imported?.resultCount === 1, "Expected one imported reconnect result.");
  assert(reconnectPersist.imported.pendingSession.importedAnswerCount === 1, "Expected pending session answers to import.");
  assert(capturedRequests.length === 7, "Expected seven cloud API contract requests.");

  await verifyErrorHandling();

  console.log(
    JSON.stringify(
      {
        ok: true,
        requestCount: capturedRequests.length,
        routes: capturedRequests.map((request) => ({
          method: request.method,
          path: request.path,
        })),
        errorHandling: "non_2xx_rejected_with_sanitized_error",
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
