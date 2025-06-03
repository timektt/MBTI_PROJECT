import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { CreateCardSchema } from "@/lib/schema"; // ✅ เพิ่ม schema
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parseResult = CreateCardSchema.safeParse(req.body); // ✅ validate ด้วย schema
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { title, description, imageUrl, quizResultId } = parseResult.data;

  // ✅ ตรวจสอบว่า quizResult นี้เป็นของ user คนนี้จริงไหม
  const quizResult = await prisma.quizResult.findUnique({
    where: { id: quizResultId },
  });

  if (!quizResult || quizResult.userId !== session.user.id) {
    return res.status(403).json({ error: "Invalid quiz result ownership." });
  }

  // ✅ ป้องกันการสร้าง Card ซ้ำจาก quizResult เดิม
  const existingCardByResult = await prisma.card.findFirst({
    where: { quizResultId },
  });

  if (existingCardByResult) {
    return res.status(400).json({ message: "Card already exists for this quiz result." });
  }

  // ✅ ป้องกันการสร้างมากกว่า 1 card ต่อ user
  const existingCardByUser = await prisma.card.findFirst({
    where: { userId: session.user.id },
  });

  if (existingCardByUser) {
    return res.status(400).json({ message: "You already have a card." });
  }

  // ✅ สร้างการ์ดใหม่
  const card = await prisma.card.create({
    data: {
      title,
      description,
      imageUrl: imageUrl ?? "",
      userId: session.user.id,
      quizResultId,
    },
  });

  // ✅ Log activity: Create card
  await logActivity({
    userId: session.user.id,
    type: "CREATE_CARD",
    cardId: card.id,
    targetType: "Card",
    message: `Created card "${title}"`,
  });

  return res.status(200).json({ cardId: card.id });
}
