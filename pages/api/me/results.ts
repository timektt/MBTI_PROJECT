import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { buildResultArtifactPayload, normalizeLocale } from "@/lib/mbti-assessment";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 60 })) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const locale = normalizeLocale(
    typeof req.query.locale === "string"
      ? req.query.locale
      : session.user.preferredLocale
  );

  const results = await prisma.quizResult.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      premiumReport: true,
      shareCards: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      card: {
        select: { id: true },
      },
      personality: {
        include: {
          contents: true,
        },
      },
    },
  });

  return res.status(200).json({
    results: results.map((result) => {
      const premiumStatus = result.premiumReport?.status ?? "locked";
      const premiumReportId = result.premiumReport?.id ?? null;
      const shareSlug = result.shareCards[0]?.slug ?? null;
      const cardId = result.card?.id ?? null;
      const artifact = buildResultArtifactPayload({
        id: result.id,
        mbtiType: result.mbtiType,
        locale,
        createdAt: result.createdAt.toISOString(),
        personalityContents: result.personality?.contents ?? [],
        premiumStatus,
        premiumReportId,
        shareSlug,
        cardId,
        scoreDetail: result.scoreDetail,
      });

      return {
        id: result.id,
        mbtiType: result.mbtiType,
        locale: result.locale,
        createdAt: result.createdAt.toISOString(),
        summary: artifact.summaryBody,
        premiumStatus,
        premiumReportId,
        shareSlug,
        cardId,
        artifact,
      };
    }),
  });
}
