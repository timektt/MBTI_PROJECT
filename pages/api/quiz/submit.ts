import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { ActivityType, logActivity } from "@/lib/activity";
import { readJsonBody } from "@/lib/api-request";
import {
  buildShareSlug,
  buildResultArtifactPayload,
  cardPlaceholderPath,
  computeAssessmentResult,
  getPersonalitySections,
  normalizeLocale,
} from "@/lib/mbti-assessment";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { QuizSubmitSchema } from "@/lib/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 20 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = readJsonBody(req);
  if (!body.ok) {
    return res.status(400).json({ error: body.error });
  }

  const parsed = QuizSubmitSchema.safeParse(body.data);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const locale = normalizeLocale(parsed.data.locale);
  const latestResult = await prisma.quizResult.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, mbtiType: true },
  });

  if (latestResult) {
    await logActivity({
      userId: session.user.id,
      type: ActivityType.QUIZ_REJECTED,
      targetType: "QuizResult",
      message: "User attempted to submit the MBTI quiz again.",
    });

    return res.status(409).json({
      error: "Conflict: Resource already exists",
      resultId: latestResult.id,
      mbtiType: latestResult.mbtiType,
      redirectTo: `/result/${latestResult.id}`,
    });
  }

  const assessmentSession = await prisma.assessmentSession.findFirst({
    where: {
      id: parsed.data.sessionId,
      userId: session.user.id,
      status: "draft",
    },
    include: {
      answers: {
        include: {
          question: true,
          option: true,
        },
      },
    },
  });

  if (!assessmentSession) {
    return res.status(404).json({ error: "Active assessment session not found" });
  }

  const totalQuestions = await prisma.assessmentQuestion.count({
    where: {
      isActive: true,
      version: assessmentSession.version,
    },
  });

  if (assessmentSession.answers.length < totalQuestions) {
    return res.status(400).json({
      error: "Please answer all quiz questions before submitting.",
    });
  }

  const computed = computeAssessmentResult(assessmentSession.answers, locale);
  const personality = await prisma.personalityProfile.findUnique({
    where: { code: computed.mbtiType },
    include: {
      contents: true,
    },
  });

  const localizedContent = personality
    ? getPersonalitySections(personality.contents, locale)
    : [];

  const freeSummary = localizedContent.find(
    (content) => content.section === "summary" && content.tier === "free"
  );

  const premiumPreview = localizedContent
    .filter((content) => content.tier === "premium")
    .slice(0, 2)
    .map((content) => ({
      section: content.section,
      title: content.title,
      body: content.body,
    }));

  const shareSlug = buildShareSlug(session.user.id, computed.mbtiType);

  const submission = await prisma.$transaction(async (tx) => {
    const quizResult = await tx.quizResult.create({
      data: {
        userId: session.user.id,
        mbtiType: computed.mbtiType,
        typeCode: computed.mbtiType,
        locale,
        scoreDetail: computed,
        testVersion: assessmentSession.version,
      },
    });

    const card = await tx.card.upsert({
      where: { userId: session.user.id },
      update: {
        title:
          locale === "en"
            ? `${computed.mbtiType} Premium Identity Card`
            : `การ์ดบุคลิกภาพ ${computed.mbtiType}`,
        description:
          freeSummary?.body ??
          (locale === "en"
            ? `${computed.mbtiType} personality result`
            : `ผลลัพธ์บุคลิกภาพ ${computed.mbtiType}`),
        imageUrl: cardPlaceholderPath,
        quizResultId: quizResult.id,
      },
      create: {
        userId: session.user.id,
        title:
          locale === "en"
            ? `${computed.mbtiType} Premium Identity Card`
            : `การ์ดบุคลิกภาพ ${computed.mbtiType}`,
        description:
          freeSummary?.body ??
          (locale === "en"
            ? `${computed.mbtiType} personality result`
            : `ผลลัพธ์บุคลิกภาพ ${computed.mbtiType}`),
        imageUrl: cardPlaceholderPath,
        quizResultId: quizResult.id,
      },
    });

    const premiumReport = await tx.premiumReport.create({
      data: {
        userId: session.user.id,
        quizResultId: quizResult.id,
        personalityCode: computed.mbtiType,
        locale,
        status: "locked",
        teaserData: {
          summary: freeSummary
            ? {
                title: freeSummary.title,
                body: freeSummary.body,
              }
            : null,
          preview: premiumPreview,
        },
      },
    });

    const shareCard = await tx.shareCard.create({
      data: {
        userId: session.user.id,
        quizResultId: quizResult.id,
        personalityCode: computed.mbtiType,
        slug: shareSlug,
        locale,
        title:
          locale === "en"
            ? `${computed.mbtiType} personality snapshot`
            : `สรุปบุคลิกภาพ ${computed.mbtiType}`,
        subtitle:
          freeSummary?.title ??
          (locale === "en" ? "Premium self-discovery preview" : "ตัวอย่างผลลัพธ์ระดับพรีเมียม"),
        imageUrl: cardPlaceholderPath,
      },
    });

    await tx.user.update({
      where: { id: session.user.id },
      data: {
        hasMbtiCard: true,
        mbtiType: computed.mbtiType,
        preferredLocale: locale,
      },
    });

    await tx.assessmentSession.update({
      where: { id: assessmentSession.id },
      data: {
        status: "completed",
        locale,
        progress: 100,
        completedAt: new Date(),
        quizResultId: quizResult.id,
      },
    });

    await tx.eventLog.createMany({
      data: [
        {
          userId: session.user.id,
          assessmentSessionId: assessmentSession.id,
          quizResultId: quizResult.id,
          eventName: "assessment_completed",
          eventCategory: "quiz",
          locale,
          payload: computed,
        },
        {
          userId: session.user.id,
          quizResultId: quizResult.id,
          eventName: "premium_report_initialized",
          eventCategory: "premium_report",
          locale,
          payload: {
            premiumReportId: premiumReport.id,
            status: premiumReport.status,
          },
        },
        {
          userId: session.user.id,
          quizResultId: quizResult.id,
          eventName: "share_card_initialized",
          eventCategory: "share_card",
          locale,
          payload: {
            shareCardId: shareCard.id,
            shareSlug: shareCard.slug,
          },
        },
      ],
    });

    return {
      cardId: card.id,
      premiumReportId: premiumReport.id,
      quizResult,
      shareCard,
    };
  });

  await logActivity({
    userId: session.user.id,
    type: ActivityType.SUBMIT_QUIZ,
    cardId: submission.cardId,
    targetType: "QuizResult",
    message: `Submitted MBTI quiz. Result: ${computed.mbtiType}`,
  });

  return res.status(200).json({
    resultId: submission.quizResult.id,
    mbtiType: submission.quizResult.mbtiType,
    locale: submission.quizResult.locale,
    shareSlug: submission.shareCard.slug,
    premiumReportId: submission.premiumReportId,
    redirectTo: `/result/${submission.quizResult.id}`,
    artifact: buildResultArtifactPayload({
      id: submission.quizResult.id,
      mbtiType: submission.quizResult.mbtiType,
      locale,
      createdAt: submission.quizResult.createdAt.toISOString(),
      personalityContents: personality?.contents ?? [],
      premiumStatus: "locked",
      premiumReportId: submission.premiumReportId,
      shareSlug: submission.shareCard.slug,
      cardId: submission.cardId,
      scoreDetail: computed,
    }),
  });
}
