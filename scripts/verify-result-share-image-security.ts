import assert from "node:assert/strict";

import {
  resolveResultShareAssetOrigin,
  resolveResultShareRenderableAnimalPath,
  resultShareImageSchema,
} from "../lib/result-share-image";

const validPayload = {
  id: "guest-result-extra-field-is-stripped",
  locale: "th",
  mbtiType: "INTJ",
  createdAt: "2026-08-30T12:00:00.000Z",
  confidence: 84,
  archetypeName: "The Strategic Seer",
  tagline: "A bounded result tagline.",
  house: {
    title: "Purple House",
    description: "A bounded house description.",
    accentFrom: "#6d3bf5",
    accentTo: "#ba7eff",
  },
  animal: {
    name: "Obsidian Raven",
    imagePath: "/mbti-z/v4/fantasy-v2/animals/intj-obsidian-raven.webp",
  },
  movieProfile: {
    title: "Architectural mystery",
    summary: "A bounded movie profile summary.",
    tags: ["strategy", "mystery", "systems"],
  },
  summaryBody: "A bounded result summary.",
  dimensions: [
    { pair: "E/I", left: "E", right: "I", leftScore: 8, rightScore: 14, winner: "I" },
    { pair: "S/N", left: "S", right: "N", leftScore: 7, rightScore: 15, winner: "N" },
    { pair: "T/F", left: "T", right: "F", leftScore: 13, rightScore: 9, winner: "T" },
    { pair: "J/P", left: "J", right: "P", leftScore: 12, rightScore: 10, winner: "J" },
  ],
};

const validResult = resultShareImageSchema.safeParse(validPayload);
assert.equal(validResult.success, true, "The approved result payload should pass.");
assert.equal(
  validResult.success && "id" in validResult.data,
  false,
  "Unknown client fields should be stripped before rendering."
);
assert.equal(
  resolveResultShareRenderableAnimalPath(validPayload.animal.imagePath),
  "/mbti-z/animals/intj-obsidian-raven.png",
  "The OG renderer should use its compatible PNG counterpart for a V2 WebP asset."
);
assert.equal(
  resolveResultShareRenderableAnimalPath("https://example.com/animal.png"),
  null
);

const invalidPayloads = [
  {
    id: "absolute-url",
    value: {
      ...validPayload,
      animal: { ...validPayload.animal, imagePath: "https://example.com/animal.png" },
    },
  },
  {
    id: "protocol-relative-url",
    value: {
      ...validPayload,
      animal: { ...validPayload.animal, imagePath: "//169.254.169.254/latest/meta-data" },
    },
  },
  {
    id: "path-traversal",
    value: {
      ...validPayload,
      animal: {
        ...validPayload.animal,
        imagePath: "/mbti-z/v4/fantasy-v2/animals/../home/living-archive-hero-v2.webp",
      },
    },
  },
  {
    id: "css-url-injection",
    value: {
      ...validPayload,
      house: { ...validPayload.house, accentFrom: "red),url(http://127.0.0.1" },
    },
  },
  {
    id: "oversized-summary",
    value: { ...validPayload, summaryBody: "x".repeat(721) },
  },
  {
    id: "extra-dimension",
    value: {
      ...validPayload,
      dimensions: [...validPayload.dimensions, validPayload.dimensions[0]],
    },
  },
];

for (const fixture of invalidPayloads) {
  assert.equal(
    resultShareImageSchema.safeParse(fixture.value).success,
    false,
    `Security fixture should fail: ${fixture.id}`
  );
}

assert.equal(
  resolveResultShareAssetOrigin({
    nodeEnv: "development",
    requestHost: "127.0.0.1:3130",
  }),
  "http://127.0.0.1:3130"
);
assert.equal(
  resolveResultShareAssetOrigin({
    nodeEnv: "production",
    requestHost: "attacker.example",
    vercelUrl: "mbti-project-preview.vercel.app",
  }),
  "https://mbti-project-preview.vercel.app"
);
assert.equal(
  resolveResultShareAssetOrigin({
    configuredSiteUrl: "https://mbti.example/types?source=test",
    nodeEnv: "production",
    requestHost: "attacker.example",
  }),
  "https://mbti.example"
);
assert.equal(
  resolveResultShareAssetOrigin({
    nodeEnv: "production",
    requestHost: "169.254.169.254",
  }),
  null,
  "A production request host must never become an asset origin."
);

console.log(
  JSON.stringify(
    {
      ok: true,
      approvedPayload: true,
      rejectedPayloadCount: invalidPayloads.length,
      trustedOriginCases: 4,
    },
    null,
    2
  )
);
