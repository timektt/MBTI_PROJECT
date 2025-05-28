import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity } from "@/lib/activity";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, description, imageUrl, quizResultId } = req.body;

  // ✅ ตรวจว่า field สำคัญไม่ว่าง
  if (!title || !description || !quizResultId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

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
      imageUrl,
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
