// /pages/api/cards/list.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const cards = await prisma.card.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, username: true, image: true } },
        quizResult: { select: { mbtiType: true } },
      },
    });

    const total = await prisma.card.count();

    res.status(200).json({
      cards,
      hasMore: skip + cards.length < total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load cards." });
  }
}
