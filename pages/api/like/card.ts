// ✅ /pages/api/like/card.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notify";
import { logActivity,ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const { cardId } = req.body;
  if (!cardId || typeof cardId !== "string") {
    return res.status(400).json({ error: "Missing or invalid cardId" });
  }

  const existing = await prisma.cardLike.findUnique({
    where: {
      userId_cardId: {
        userId,
        cardId,
      },
    },
  });

  if (existing) {
    await prisma.cardLike.delete({
      where: {
        userId_cardId: {
          userId,
          cardId,
        },
      },
    });

    // Log activity: Unlike
    const [card, user] = await Promise.all([
      prisma.card.findUnique({
        where: { id: cardId },
        select: { title: true },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      }),
    ]);

    await logActivity({
      userId: userId,
      type: ActivityType.UNLIKE_CARD,
      cardId: cardId,
      targetType: "CARD",
      message: `${user?.name ?? "Someone"} unliked the card "${card?.title ?? "Untitled"}"`,
    });

    return res.status(200).json({ liked: false });
  }

  // ✅ สร้าง Like ใหม่
  await prisma.cardLike.create({
    data: {
      userId,
      cardId,
    },
  });

  // ✅ ดึงข้อมูลเพื่อแสดงใน activity และแจ้งเตือน
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

  // ✅ Log Activity ด้วย logActivity
  await logActivity({
    userId: userId,
    type: ActivityType.LIKE_CARD,
    cardId: cardId,
    targetType: "CARD",
    message: `${user?.name ?? "Someone"} liked the card "${card?.title ?? "Untitled"}"`,
  });

  // ✅ สร้าง Notification หากไม่ใช่เจ้าของเอง
  if (cardOwner && cardOwner.userId !== userId) {
    await createNotification({
      userId: cardOwner.userId,
      type: "LIKE_CARD",
      message: `${user?.name ?? "Someone"} liked your card "${card?.title ?? "Untitled"}"`,
      link: `/card/${cardId}`,
    });
  }

  return res.status(200).json({ liked: true });
}
