import assert from "node:assert/strict";
import type { NextApiRequest, NextApiResponse } from "next";

import { rateLimit } from "../lib/rateLimit";

type JsonBody = Record<string, unknown> | null;

type MockResponse = NextApiResponse & {
  body: JsonBody;
  statusCode: number;
};

function createRequest(url: string, ip: string): NextApiRequest {
  return {
    method: "GET",
    url,
    headers: { "x-forwarded-for": ` ${ip}, 203.0.113.250` },
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
  } as unknown as MockResponse;

  return response;
}

const options = { windowMs: 60_000, max: 1 };
const sharedIp = "198.51.100.101";

assert.equal(
  rateLimit(createRequest("/api/register", sharedIp), createResponse(), options),
  true,
  "The first request to a route should be admitted."
);

const repeatedRouteResponse = createResponse();
assert.equal(
  rateLimit(createRequest("/api/register", sharedIp), repeatedRouteResponse, options),
  false,
  "The route should enforce its own request limit."
);
assert.equal(repeatedRouteResponse.statusCode, 429);
assert.deepEqual(repeatedRouteResponse.body, {
  error: "Too many requests. Please try again later.",
});

assert.equal(
  rateLimit(createRequest("/api/auth/verify-email", sharedIp), createResponse(), options),
  true,
  "A different route should receive an independent bucket for the same IP."
);

const queryIp = "198.51.100.102";
assert.equal(
  rateLimit(
    createRequest("/api/check-username?username=first", queryIp),
    createResponse(),
    options
  ),
  true
);
assert.equal(
  rateLimit(
    createRequest("/api/check-username/?username=second", queryIp),
    createResponse(),
    options
  ),
  false,
  "Query strings and trailing slashes must not create rate-limit bypass buckets."
);

const emptyForwardedRequest = createRequest("/api/register", "198.51.100.103");
emptyForwardedRequest.headers["x-forwarded-for"] = [];
assert.equal(
  rateLimit(emptyForwardedRequest, createResponse(), options),
  true,
  "An empty forwarded header array should fall back without throwing."
);

console.log(
  JSON.stringify(
    {
      ok: true,
      routeIsolation: true,
      queryBypassBlocked: true,
      forwardedIpNormalized: true,
      emptyForwardedFallback: true,
    },
    null,
    2
  )
);
