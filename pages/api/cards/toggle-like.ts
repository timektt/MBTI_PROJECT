import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { logActivity,ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const { cardId, source } = req.body;

  if (!cardId || typeof cardId !== "string") {
    return res.status(400).json({ error: "Invalid cardId" });
  }

  try {
    // ✅ ตรวจสอบว่า Card นี้มีอยู่จริงไหม
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) return res.status(404).json({ error: "Card not found" });

    const existing = await prisma.cardLike.findUnique({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId,
        },
      },
    });

    if (existing) {
      await prisma.cardLike.delete({
        where: {
          userId_cardId: {
            userId: session.user.id,
            cardId,
          },
        },
      });
      // Log activity: Unlike
      await logActivity({
        userId: session.user.id,
        type: ActivityType.UNLIKE_CARD,
        cardId: cardId,
        targetType: "Card",
        message: `Unliked card: ${card.title}`,
      });
    } else {
      await prisma.cardLike.create({
        data: {
          userId: session.user.id,
          cardId,
          source: typeof source === "string" ? source : "unknown",
        },
      });
      // Log activity: Like
      await logActivity({
        userId: session.user.id,
        type: ActivityType.LIKE_CARD,
        cardId: cardId,
        targetType: "Card",
        message: `Liked card: ${card.title}`,
      });
    }

    const total = await prisma.cardLike.count({ where: { cardId } });

    res.status(200).json({ liked: !existing, total });
  } catch (err) {
    console.error("Toggle Like Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
