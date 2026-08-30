import fs from "node:fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

type JsonBody = Record<string, unknown> | null;

type MockResponse = NextApiResponse & {
  body: JsonBody;
  statusCode: number;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function createRequest(method: string, ip: string): NextApiRequest {
  return {
    method,
    headers: { "x-forwarded-for": ip },
    query: {},
    body: {},
    cookies: {},
  } as unknown as NextApiRequest;
}

function createResponse(): MockResponse {
  const response = {
    body: null,
    statusCode: 200,
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(body: JsonBody) {
      response.body = body;
      return response;
    },
    end() {
      return response;
    },
  } as unknown as MockResponse;

  return response;
}

async function verifyHeldPagesApi(
  label: string,
  method: string,
  ip: string,
  handler: (request: NextApiRequest, response: NextApiResponse) => unknown
) {
  const response = createResponse();
  await handler(createRequest(method, ip), response);
  assert(response.statusCode === 503, `${label}: expected 503, received ${response.statusCode}`);
  assert(
    response.body?.code === "account_runtime_held",
    `${label}: missing account_runtime_held response code`
  );
  console.log(`PASS ${label} -> 503 account_runtime_held`);
}

async function main() {
  delete process.env.AUTH_SECRET;
  delete process.env.NEXTAUTH_SECRET;

  const serverAuthSource = fs.readFileSync("lib/server-auth.ts", "utf8");
  assert(
    !serverAuthSource.includes('import { auth } from "@/auth"'),
    "server auth must not load Auth.js before the guest-local runtime guard"
  );

  const [
    { default: register },
    { default: forgotPassword },
    { default: resetPassword },
    { default: verifyEmail },
    { default: checkUsername },
    { default: protectedResults },
  ] = await Promise.all([
    import("../pages/api/register"),
    import("../pages/api/forgot-password"),
    import("../pages/api/reset-password"),
    import("../pages/api/auth/verify-email"),
    import("../pages/api/check-username"),
    import("../pages/api/me/results"),
  ]);

  await verifyHeldPagesApi("register", "POST", "198.51.100.1", register);
  await verifyHeldPagesApi("forgot-password", "POST", "198.51.100.2", forgotPassword);
  await verifyHeldPagesApi("reset-password", "POST", "198.51.100.3", resetPassword);
  await verifyHeldPagesApi("verify-email", "POST", "198.51.100.4", verifyEmail);
  await verifyHeldPagesApi("check-username", "GET", "198.51.100.5", checkUsername);

  const protectedResponse = createResponse();
  await protectedResults(createRequest("GET", "198.51.100.6"), protectedResponse);
  assert(
    protectedResponse.statusCode === 401,
    `protected results: expected 401, received ${protectedResponse.statusCode}`
  );
  console.log("PASS protected results -> 401 without session");

  const authRoute = await import("../app/api/auth/[...nextauth]/route");
  for (const [method, handler] of [
    ["GET", authRoute.GET],
    ["POST", authRoute.POST],
  ] as const) {
    const response = await handler(
      new NextRequest("http://localhost/api/auth/session", { method })
    );
    const body = (await response.json()) as JsonBody;
    assert(response.status === 503, `auth ${method}: expected 503, received ${response.status}`);
    assert(body?.code === "account_runtime_held", `auth ${method}: missing held response code`);
    console.log(`PASS auth ${method} -> 503 account_runtime_held`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
