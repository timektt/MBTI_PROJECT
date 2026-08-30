import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "@/lib/server-auth";
import { normalizeLocale } from "@/lib/mbti-assessment";
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

  const session = await getServerAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const locale = normalizeLocale(
    typeof req.query.locale === "string"
      ? req.query.locale
      : session.user.preferredLocale
  );

  const reports = await prisma.premiumReport.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      quizResult: {
        select: {
          id: true,
          mbtiType: true,
          createdAt: true,
        },
      },
      personality: {
        include: {
          contents: true,
        },
      },
    },
  });

  return res.status(200).json({
    reports: reports.map((report) => ({
      id: report.id,
      status: report.status,
      locale: report.locale,
      unlockedAt: report.unlockedAt?.toISOString() ?? null,
      generatedAt: report.generatedAt?.toISOString() ?? null,
      createdAt: report.createdAt.toISOString(),
      mbtiType: report.quizResult.mbtiType,
      quizResultId: report.quizResult.id,
      teaserData: report.teaserData,
      previewSections:
        report.personality?.contents
          .filter(
            (content) =>
              content.locale === locale &&
              content.tier === "premium"
          )
          .sort((left, right) => left.sortOrder - right.sortOrder)
          .slice(0, 3)
          .map((content) => ({
            section: content.section,
            title: content.title,
            body: content.body,
          })) ?? [],
    })),
  });
}
