import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { QuizAnswersSchema } from "@/lib/schema"; // ✅ ใช้ schema ใหม่
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id)
    return res.status(401).json({ error: "Unauthorized" });

  // ✅ Validate answers format
  const parseResult = QuizAnswersSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { answers } = parseResult.data;

  const count = await prisma.quizResult.count({
    where: { userId: session.user.id },
  });
  if (count > 0) {
    return res.status(400).json({ message: "You have already completed the quiz." });
  }

  const mbtiType = `${answers.q1[0]}${answers.q2[0]}${answers.q3[0]}${answers.q4[0]}`.toUpperCase();

  // สร้าง quizResult และ card พร้อมกัน
  const result = await prisma.quizResult.create({
    data: {
      userId: session.user.id,
      mbtiType,
      scoreDetail: answers,
      card: {
        create: {
          userId: session.user.id,
          title: `My MBTI Card`,
          description: `Official result: ${mbtiType}`,
          imageUrl: `https://source.unsplash.com/random/400x300/?mbti`,
        },
      },
    },
    include: {
      card: true,
    },
  });

  // Log activity
  await logActivity({
    userId: session.user.id,
    type: "SUBMIT_QUIZ",
    cardId: result.card?.id,
    targetType: "QuizResult",
    message: `Submitted MBTI quiz. Result: ${mbtiType}`,
  });

  return res.status(200).json({ resultId: result.id });
}
