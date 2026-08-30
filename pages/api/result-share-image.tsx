/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CSSProperties, ReactNode } from "react";

import {
  resolveResultShareAssetOrigin,
  resolveResultShareRenderableAnimalPath,
  resultShareImageSchema,
  type ResultShareImagePayload,
} from "@/lib/result-share-image";
import { rateLimit } from "@/lib/rateLimit";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
    responseLimit: "8mb",
  },
};

const cardSize = {
  width: 1080,
  height: 1350,
} as const;

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).send("Method Not Allowed");
    return;
  }

  if (!rateLimit(request, response, { windowMs: 60_000, max: 12 })) return;

  let parsedBody: ResultShareImagePayload;

  try {
    const rawBody = request.body;
    const result = rawBody?.result ?? rawBody;
    parsedBody = resultShareImageSchema.parse(result);
  } catch {
    response.status(400).send("Invalid payload");
    return;
  }

  const assetOrigin = resolveResultShareAssetOrigin({
    configuredSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    nodeEnv: process.env.NODE_ENV,
    requestHost: request.headers.host,
    vercelUrl: process.env.VERCEL_URL,
  });

  if (!assetOrigin) {
    response.status(503).send("Result asset origin unavailable");
    return;
  }

  const renderableAnimalPath = resolveResultShareRenderableAnimalPath(
    parsedBody.animal.imagePath
  );

  if (!renderableAnimalPath) {
    response.status(400).send("Invalid animal asset path");
    return;
  }

  const locale = parsedBody.locale === "en" ? "en-US" : "th-TH";
  const createdAt = new Intl.DateTimeFormat(locale).format(
    new Date(parsedBody.createdAt)
  );
  const animalUrl = new URL(renderableAnimalPath, assetOrigin).toString();
  const summaryBody = parsedBody.summaryBody;
  const summaryBodyStyle = {
    ...bodyStyle,
    fontSize: summaryBody.length > 220 ? 14 : summaryBody.length > 160 ? 15 : 17,
    lineHeight: 1.5,
  };

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${parsedBody.house.accentFrom}, #05070f 38%, ${parsedBody.house.accentTo})`,
          color: "white",
          padding: "48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.15), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.08), transparent 30%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: "56px",
            display: "flex",
            borderRadius: "44px",
            border: "1px solid rgba(255,255,255,0.1)",
            background:
              "linear-gradient(180deg, rgba(6,10,21,0.78), rgba(8,12,24,0.94))",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={kickerStyle}>MBTI Z</span>
              <span
                style={{
                  marginTop: "18px",
                  fontSize: 132,
                  lineHeight: 0.92,
                  fontWeight: 700,
                }}
              >
                {parsedBody.mbtiType}
              </span>
              <span
                style={{
                  marginTop: "18px",
                  fontSize: 34,
                  lineHeight: 1.12,
                  color: "#f5c76d",
                }}
              >
                {parsedBody.archetypeName}
              </span>
            </div>

            <div style={chipStyle(false)}>Result Artifact</div>
          </div>

          <div
            style={{
              marginTop: "26px",
              display: "flex",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "425px",
                minWidth: 0,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <Panel>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <div style={chipStyle(true)}>{`House · ${parsedBody.house.title}`}</div>
                  <div style={chipStyle(true)}>{`Animal · ${parsedBody.animal.name}`}</div>
                </div>
                <p style={bodyStyle}>{parsedBody.tagline}</p>
              </Panel>

              <Panel>
                <span style={labelStyle}>Movie Profile</span>
                <span style={sectionTitleStyle}>{parsedBody.movieProfile.title}</span>
                <p style={bodyStyle}>{parsedBody.movieProfile.summary}</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {parsedBody.movieProfile.tags.slice(0, 3).map((tag) => (
                    <div key={tag} style={chipStyle(true)}>
                      {tag}
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <span style={labelStyle}>สรุปภาษาไทย</span>
                <p style={summaryBodyStyle}>{summaryBody}</p>
              </Panel>
            </div>

            <div
              style={{
                width: "541px",
                minWidth: 0,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  minHeight: 430,
                  display: "flex",
                  overflow: "hidden",
                  borderRadius: "32px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#060a13",
                }}
              >
                <img
                  alt={`${parsedBody.mbtiType} ${parsedBody.animal.name}`}
                  src={animalUrl}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    inset: 0,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(180deg, ${parsedBody.house.accentFrom}18 0%, rgba(5,7,15,0.16) 38%, rgba(5,7,15,0.94) 100%)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "28px",
                    right: "28px",
                    bottom: "28px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background:
                      "linear-gradient(180deg, rgba(8,12,24,0.26), rgba(8,12,24,0.9))",
                    padding: "24px",
                  }}
                >
                  <span style={labelStyle}>Animal Signature</span>
                  <span style={{ marginTop: "16px", fontSize: 42, lineHeight: 1.04 }}>
                    {parsedBody.animal.name}
                  </span>
                  <p style={{ ...bodyStyle, marginTop: "16px" }}>
                    {parsedBody.house.description}
                  </p>
                </div>
              </div>

              <Panel>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <span style={labelStyle}>Dimension Scores</span>
                  <span style={{ ...kickerStyle, color: "#ffe4aa" }}>{createdAt}</span>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "stretch",
                    gap: "14px",
                  }}
                >
                  {parsedBody.dimensions.slice(0, 4).map((dimension) => {
                    const total = Math.max(
                      dimension.leftScore + dimension.rightScore,
                      1
                    );
                    const leftPercent = Math.round(
                      (dimension.leftScore / total) * 100
                    );
                    const rightPercent = 100 - leftPercent;

                    return (
                      <div
                        key={dimension.pair}
                        style={{
                          width: "48.6%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "22px",
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(0,0,0,0.22)",
                          padding: "18px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span style={labelStyle}>{dimension.pair}</span>
                          <span style={{ ...kickerStyle, color: "rgba(255,255,255,0.64)" }}>
                            {dimension.winner}
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: "14px",
                            height: "10px",
                            display: "flex",
                            overflow: "hidden",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.1)",
                          }}
                        >
                          <div
                            style={{
                              width: `${leftPercent}%`,
                              background:
                                "linear-gradient(90deg,#7cc8ff,#ba7eff)",
                            }}
                          />
                          <div
                            style={{
                              width: `${rightPercent}%`,
                              background:
                                "linear-gradient(90deg,#f5c76d,#ff9b8f)",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            marginTop: "14px",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "16px",
                            fontSize: 14,
                            lineHeight: 1.4,
                            color: "rgba(255,255,255,0.68)",
                          }}
                        >
                          <span>{`${dimension.left} ${dimension.leftScore}`}</span>
                          <span>{`${dimension.right} ${dimension.rightScore}`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    ),
    cardSize
  );
  const buffer = Buffer.from(await imageResponse.arrayBuffer());

  response.setHeader("Content-Type", "image/png");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.status(200).send(buffer);
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        padding: "24px",
      }}
    >
      {children}
    </div>
  );
}

const kickerStyle: CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.64)",
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.44)",
};

const sectionTitleStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  marginTop: 16,
  fontSize: 28,
  lineHeight: 1.12,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  color: "white",
};

const bodyStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  marginTop: 16,
  fontSize: 17,
  lineHeight: 1.55,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  color: "rgba(255,255,255,0.72)",
};

function chipStyle(subdued: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: subdued ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.08)",
    padding: "8px 14px",
    fontSize: 10,
    lineHeight: 1,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: subdued ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.92)",
  };
}
