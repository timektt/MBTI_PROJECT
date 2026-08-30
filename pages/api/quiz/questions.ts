import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { localizeQuestion, normalizeLocale } from "@/lib/mbti-assessment";
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

  const sessionId = Array.isArray(req.query.sessionId)
    ? req.query.sessionId[0]
    : req.query.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  const assessmentSession = await prisma.assessmentSession.findFirst({
    where: {
      id: sessionId,
      userId: session.user.id,
    },
    include: {
      answers: {
        select: {
          questionId: true,
          optionId: true,
        },
      },
    },
  });

  if (!assessmentSession) {
    return res.status(404).json({ error: "Assessment session not found" });
  }

  const locale = normalizeLocale(
    (Array.isArray(req.query.locale) ? req.query.locale[0] : req.query.locale) ??
      assessmentSession.locale
  );

  const questions = await prisma.assessmentQuestion.findMany({
    where: {
      isActive: true,
      version: assessmentSession.version,
    },
    orderBy: { sortOrder: "asc" },
    include: {
      options: {
        orderBy: { key: "asc" },
      },
    },
  });

  return res.status(200).json({
    sessionId: assessmentSession.id,
    locale,
    status: assessmentSession.status,
    progress: assessmentSession.progress,
    answers: assessmentSession.answers,
    questions: questions.map((question) => localizeQuestion(question, locale)),
  });
}
