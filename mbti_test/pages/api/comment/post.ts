// ✅ /pages/api/comment/post.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notify";
import { logActivity } from "@/lib/activity";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).end();

  const { cardId, content } = req.body;
  if (!content || !cardId) {
    return res.status(400).json({ message: "Missing content or cardId" });
  }

  const comment = await prisma.comment.create({
    data: {
      userId,
      cardId,
      content,
    },
  });

  // ✅ ดึงข้อมูลผู้ใช้ การ์ด และเจ้าของการ์ด
  const [card, user, cardOwner] = await Promise.all([
    prisma.card.findUnique({
      where: { id: cardId },
      select: { title: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),
    prisma.card.findUnique({
      where: { id: cardId },
      select: { userId: true },
    }),
  ]);

  // ✅ สร้าง Activity log ด้วย logActivity
  await logActivity({
    userId: userId,
    type: "COMMENT_CARD",
    cardId: cardId,
    targetType: "COMMENT",
    message: `${user?.name ?? "Someone"} commented: "${content}" on card "${card?.title ?? "Untitled"}"`,
  });

  // ✅ สร้าง Notification หากไม่ใช่เจ้าของการ์ดเอง
  if (cardOwner && cardOwner.userId !== userId) {
    await createNotification({
      userId: cardOwner.userId,
      type: "COMMENT_CARD",
      message: `${user?.name ?? "Someone"} commented on your card "${card?.title ?? "Untitled"}"`,
      link: `/card/${cardId}`,
    });
  }

  return res.status(200).json(comment);
}
