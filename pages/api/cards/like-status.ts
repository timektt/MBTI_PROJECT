// /pages/api/card/like-status.ts

import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  const userId = session?.user?.id || null
  const { cardId } = req.query

  if (!cardId || typeof cardId !== "string") {
    console.warn("Invalid cardId received:", cardId)
    return res.status(400).json({ error: "Missing or invalid cardId" })
  }

  try {
    const [likeCount, hasLiked] = await Promise.all([
      prisma.cardLike.count({ where: { cardId } }),
      userId
        ? prisma.cardLike.findFirst({ where: { cardId, userId } })
        : Promise.resolve(null),
    ])

    return res.status(200).json({
      liked: Boolean(hasLiked),
      total: likeCount,
    })
  } catch (error) {
    console.error("Error in like-status:", error)
    return res.status(500).json({ error: "Something went wrong" })
  }
}
