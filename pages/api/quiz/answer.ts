import type { NextApiRequest, NextApiResponse } from "next";
import { readJsonBody } from "@/lib/api-request";
import { getServerAuthSession } from "@/lib/server-auth";
import { normalizeLocale } from "@/lib/mbti-assessment";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { QuizAnswerSchema } from "@/lib/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 120 })) return;

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

  const parsed = QuizAnswerSchema.safeParse(body.data);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { sessionId, questionId, optionId } = parsed.data;
  const locale = normalizeLocale(parsed.data.locale);

  const assessmentSession = await prisma.assessmentSession.findFirst({
    where: {
      id: sessionId,
      userId: session.user.id,
      status: "draft",
    },
    select: {
      id: true,
      version: true,
    },
  });

  if (!assessmentSession) {
    return res.status(404).json({ error: "Active assessment session not found" });
  }

  const question = await prisma.assessmentQuestion.findFirst({
    where: {
      id: questionId,
      isActive: true,
      version: assessmentSession.version,
    },
    select: {
      id: true,
      sortOrder: true,
      options: {
        where: { id: optionId },
        select: { id: true },
      },
    },
  });

  if (!question || question.options.length === 0) {
    return res.status(400).json({ error: "Question and option do not match" });
  }

  await prisma.assessmentAnswer.upsert({
    where: {
      sessionId_questionId: {
        sessionId,
        questionId,
      },
    },
    update: {
      optionId,
      locale,
    },
    create: {
      sessionId,
      questionId,
      optionId,
      userId: session.user.id,
      locale,
    },
  });

  const totalQuestions = await prisma.assessmentQuestion.count({
    where: {
      isActive: true,
      version: assessmentSession.version,
    },
  });

  const answeredCount = await prisma.assessmentAnswer.count({
    where: { sessionId },
  });

  const progress = Math.min(
    100,
    Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100)
  );

  await prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      locale,
      progress,
      currentQuestionOrder: question.sortOrder,
      lastAnsweredAt: new Date(),
    },
  });

  await prisma.eventLog.create({
    data: {
      userId: session.user.id,
      assessmentSessionId: sessionId,
      eventName: "assessment_answered",
      eventCategory: "quiz",
      locale,
      payload: {
        questionId,
        optionId,
        answeredCount,
        totalQuestions,
      },
    },
  });

  return res.status(200).json({
    ok: true,
    answeredCount,
    totalQuestions,
    progress,
    isComplete: answeredCount === totalQuestions,
  });
}
