import type { NextApiRequest, NextApiResponse } from "next";
import { readJsonBody } from "@/lib/api-request";
import { getServerAuthSession } from "@/lib/server-auth";
import { localizeQuestion, normalizeLocale } from "@/lib/mbti-assessment";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { QuizStartSchema } from "@/lib/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 30 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerAuthSession(req, res);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = readJsonBody(req);
  if (!body.ok) {
    return res.status(400).json({ error: body.error });
  }

  const parsed = QuizStartSchema.safeParse(body.data);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      preferredLocale: true,
      hasMbtiCard: true,
      quizResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.hasMbtiCard && user.quizResults[0]) {
    return res.status(409).json({
      error: "Quiz already completed",
      resultId: user.quizResults[0].id,
      redirectTo: `/result/${user.quizResults[0].id}`,
    });
  }

  const locale = normalizeLocale(parsed.data.locale ?? user.preferredLocale);
  const existingSession = await prisma.assessmentSession.findFirst({
    where: {
      userId: session.user.id,
      status: "draft",
    },
    orderBy: { updatedAt: "desc" },
    include: {
      answers: {
        select: {
          questionId: true,
          optionId: true,
        },
      },
    },
  });

  const version = existingSession?.version ?? "v1";
  const questions = await prisma.assessmentQuestion.findMany({
    where: {
      isActive: true,
      version,
    },
    orderBy: { sortOrder: "asc" },
    include: {
      options: {
        orderBy: { key: "asc" },
      },
    },
  });

  if (questions.length === 0) {
    return res.status(500).json({ error: "No active quiz questions found" });
  }

  const activeSession =
    existingSession ??
    (await prisma.assessmentSession.create({
      data: {
        userId: session.user.id,
        status: "draft",
        locale,
        version,
        progress: 0,
      },
      include: {
        answers: {
          select: {
            questionId: true,
            optionId: true,
          },
        },
      },
    }));

  return res.status(200).json({
    sessionId: activeSession.id,
    locale,
    progress: activeSession.progress,
    answers: activeSession.answers,
    questions: questions.map((question) => localizeQuestion(question, locale)),
  });
}
