// /pages/api/cards/list.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Zod schema for query params validation
const querySchema = z.object({
  mbti: z.string().optional(),
  search: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // Validate query params
    const parsed = querySchema.parse(req.query);

    // Setup pagination params
    const limit = parseInt(parsed.limit || "10", 10);
    const take = Math.min(limit, 50); // Max 50 per page
    const cursor = parsed.cursor ? { id: parsed.cursor } : undefined;

    // Build Prisma where filter
    const where: Prisma.CardWhereInput = {};

    if (parsed.mbti) {
      where.quizResult = { mbtiType: parsed.mbti };
    }

    if (parsed.search) {
      where.OR = [
        { title: { contains: parsed.search, mode: "insensitive" } },
        { user: { username: { contains: parsed.search, mode: "insensitive" } } },
      ];
    }

    // Fetch cards from Prisma
    const cards = await prisma.card.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: take + 1, // Fetch one extra to check nextCursor
      ...(cursor && { skip: 1, cursor }),
      include: {
        user: { select: { name: true, username: true, image: true } },
        quizResult: { select: { mbtiType: true } },
      },
    });

    // Calculate nextCursor
    let nextCursor: string | null = null;
    if (cards.length > take) {
      const nextItem = cards.pop(); // Remove extra item
      if (nextItem) nextCursor = nextItem.id;
    }

    // Return response
    res.status(200).json({
      items: cards,
      nextCursor,
      hasMore: !!nextCursor,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid query params." });
  }
}
