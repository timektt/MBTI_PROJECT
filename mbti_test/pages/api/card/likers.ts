// pages/api/card/likers.ts
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cardId } = req.query

  if (req.method !== "GET") return res.status(405).end()
  if (!cardId || typeof cardId !== "string") {
    return res.status(400).json({ error: "Missing cardId" })
  }

  try {
    const likers = await prisma.cardLike.findMany({
      where: { cardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    res.status(200).json(likers.map((like) => like.user))
  } catch (error) {
    console.error("Get Likers Error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
