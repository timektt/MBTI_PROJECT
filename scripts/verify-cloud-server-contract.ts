import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

import cloudRuntimeReadiness from "../data/runtime/cloud-runtime-readiness.json";

type RouteContract = {
  method: string;
  path: string;
  file: string;
  auth: "public" | "authenticated-user";
  rateLimit: boolean;
  requestSchema?: string;
  userScopedPrisma: boolean;
  responseKeys: string[];
};

type RouteStatus = {
  path: string;
  file: string;
  ok: boolean;
  failures: string[];
  successPayloads: string[][];
  shapeChecks: ContractShapeCheck[];
};

type ContractShapeCheck = {
  id: string;
  ok: boolean;
  missingMarkers: string[];
};

const APP_ROOT = process.cwd();

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relativePath: string) {
  return fs.readFileSync(path.join(APP_ROOT, relativePath), "utf8");
}

function exists(relativePath: string) {
  return fs.existsSync(path.join(APP_ROOT, relativePath));
}

function propertyNameText(name: ts.PropertyName) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return null;
}

function collectObjectKeys(node: ts.Expression) {
  if (!ts.isObjectLiteralExpression(node)) {
    return [];
  }

  return node.properties.flatMap((property) => {
    if (ts.isPropertyAssignment(property) || ts.isMethodDeclaration(property)) {
      const key = propertyNameText(property.name);
      return key ? [key] : [];
    }

    if (ts.isShorthandPropertyAssignment(property)) {
      return [property.name.text];
    }

    return [];
  });
}

function statusCodeForJsonCall(node: ts.CallExpression) {
  if (!ts.isPropertyAccessExpression(node.expression)) {
    return null;
  }

  if (node.expression.name.text !== "json") {
    return null;
  }

  const statusCall = node.expression.expression;
  if (!ts.isCallExpression(statusCall)) {
    return null;
  }

  if (!ts.isPropertyAccessExpression(statusCall.expression)) {
    return null;
  }

  if (statusCall.expression.name.text !== "status") {
    return null;
  }

  if (!ts.isIdentifier(statusCall.expression.expression) || statusCall.expression.expression.text !== "res") {
    return null;
  }

  const statusArgument = statusCall.arguments[0];
  if (!statusArgument || !ts.isNumericLiteral(statusArgument)) {
    return null;
  }

  return Number(statusArgument.text);
}

function collectSuccessPayloads(sourceFile: ts.SourceFile) {
  const payloads: string[][] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && statusCodeForJsonCall(node) === 200) {
      const payload = node.arguments[0];
      if (payload) {
        payloads.push(collectObjectKeys(payload));
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return payloads;
}

function routeHasSuccessPayload(payloads: string[][], expectedKeys: string[]) {
  return payloads.some((keys) =>
    expectedKeys.every((expectedKey) => keys.includes(expectedKey))
  );
}

function collectMarkerCheck(id: string, source: string, markers: string[]): ContractShapeCheck {
  const missingMarkers = markers.filter((marker) => !source.includes(marker));

  return {
    id,
    ok: missingMarkers.length === 0,
    missingMarkers,
  };
}

function collectShapeChecks(route: RouteContract, source: string) {
  const mbtiAssessmentSource = read("lib/mbti-assessment.ts");
  const reconnectImportSource = exists("lib/reconnect-bundle-cloud-import.ts")
    ? read("lib/reconnect-bundle-cloud-import.ts")
    : "";
  const routeWithReconnectImportSource = `${source}\n${reconnectImportSource}`;

  if (route.path === "/api/quiz/start") {
    return [
      collectMarkerCheck("quiz_start_localizes_mbti_z_question_metadata", source, [
        "questions.map((question) => localizeQuestion(question, locale))",
        "include: {",
        "options: {",
        'orderBy: { key: "asc" }',
      ]),
      collectMarkerCheck("localize_question_returns_ui_metadata", mbtiAssessmentSource, [
        "kind: normalizeQuestionKind",
        "module: normalizeQuestionModule",
        "poles: localizeQuestionPoles",
        "metaLabel: optionMetadata.metaLabel ?? null",
        "weights: readNumericRecord",
        "movieScores: readNumericRecord",
      ]),
    ];
  }

  if (route.path === "/api/quiz/submit") {
    return [
      collectMarkerCheck("quiz_submit_persists_and_returns_score_detail", source, [
        "const computed = computeAssessmentResult",
        "scoreDetail: computed",
        "artifact: buildResultArtifactPayload",
      ]),
      collectMarkerCheck("result_artifact_supports_movie_profile", mbtiAssessmentSource, [
        "const movieProfile = extractMovieProfileFromScoreDetail(scoreDetail, locale)",
        "movieProfile,",
        "hasMovieProfile: movieProfile !== null",
      ]),
    ];
  }

  if (route.path === "/api/me/results") {
    return [
      collectMarkerCheck("results_replay_artifact_from_persisted_score_detail", source, [
        "const artifact = buildResultArtifactPayload",
        "scoreDetail: result.scoreDetail",
        "summary: artifact.summaryBody",
      ]),
      collectMarkerCheck("result_artifact_relocalizes_movie_profile", mbtiAssessmentSource, [
        "function extractMovieProfileFromScoreDetail",
        "buildLocalizedMovieProfile",
        "locale: SupportedLocale",
      ]),
    ];
  }

  if (route.path === "/api/me/reconnect-bundle/import") {
    return [
      collectMarkerCheck("reconnect_import_validates_guest_handoff_bundle", source, [
        "parseReconnectBundlePayload",
        "getReconnectSummaryMismatches",
        'status: "validated"',
        "dryRun: true",
      ]),
      collectMarkerCheck("reconnect_import_persists_with_conflict_guard", source, [
        "parsed.data.dryRun !== false",
        "status: \"imported\"",
        "importReconnectBundleForUser",
        "existingResultCount",
        "requiresConflictResolution",
        "overwrite",
        "status: \"conflict\"",
      ]),
      collectMarkerCheck("reconnect_import_persists_guest_result_artifacts", routeWithReconnectImportSource, [
        "buildImportedScoreDetail",
        "importPendingSession",
        "premiumReport.upsert",
        "shareCard.upsert",
        "eventName: \"reconnect_bundle_imported\"",
        "stableReconnectImportId",
        "prisma.quizResult.count",
      ]),
    ];
  }

  return [];
}

function verifyRoute(route: RouteContract): RouteStatus {
  if (!exists(route.file)) {
    return {
      path: route.path,
      file: route.file,
      ok: false,
      failures: ["route_file_missing"],
      successPayloads: [],
      shapeChecks: [],
    };
  }

  const source = read(route.file);
  const sourceFile = ts.createSourceFile(
    route.file,
    source,
    ts.ScriptTarget.Latest,
    true,
    route.file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const successPayloads = collectSuccessPayloads(sourceFile);
  const failures: string[] = [];

  if (!source.includes(`req.method !== "${route.method}"`)) {
    failures.push(`method_guard:${route.method}`);
  }

  if (route.auth === "authenticated-user") {
    if (!source.includes("getServerAuthSession")) {
      failures.push("server_session_auth");
    }

    if (!source.includes("session?.user?.id")) {
      failures.push("authenticated_user_id_guard");
    }

    if (!source.includes("res.status(401)")) {
      failures.push("unauthorized_response");
    }
  }

  if (route.rateLimit && !source.includes("rateLimit(")) {
    failures.push("rate_limit");
  }

  if (route.requestSchema) {
    if (!source.includes("readJsonBody(req)")) {
      failures.push("safe_json_body_guard");
    }

    if (!source.includes("res.status(400)")) {
      failures.push("bad_request_response");
    }

    if (!source.includes(`${route.requestSchema}.safeParse`)) {
      failures.push(`request_schema:${route.requestSchema}`);
    }
  }

  if (route.userScopedPrisma && !source.includes("userId: session.user.id")) {
    failures.push("user_scoped_prisma");
  }

  if (!routeHasSuccessPayload(successPayloads, route.responseKeys)) {
    failures.push(`success_response_keys:${route.responseKeys.join(",")}`);
  }

  const shapeChecks = collectShapeChecks(route, source);
  failures.push(
    ...shapeChecks
      .filter((check) => !check.ok)
      .map((check) => `shape_check:${check.id}:${check.missingMarkers.join("|")}`)
  );

  return {
    path: route.path,
    file: route.file,
    ok: failures.length === 0,
    failures,
    successPayloads,
    shapeChecks,
  };
}

function main() {
  const routes = cloudRuntimeReadiness.requiredApiRoutes as RouteContract[];
  assert(Array.isArray(routes), "Cloud runtime readiness manifest is missing requiredApiRoutes.");

  const routeStatuses = routes.map(verifyRoute);
  const failedRoutes = routeStatuses.filter((route) => !route.ok);
  const result = {
    ok: failedRoutes.length === 0,
    routeCount: routeStatuses.length,
    failedRouteCount: failedRoutes.length,
    routes: routeStatuses,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main();
