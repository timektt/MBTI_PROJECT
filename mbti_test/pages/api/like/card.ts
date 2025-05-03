// ✅ API: /pages/api/like/card.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" })

  const { cardId } = req.body
  if (!cardId) return res.status(400).json({ error: "Missing cardId" })

  const existing = await prisma.cardLike.findUnique({
    where: {
      userId_cardId: {
        userId: session.user.id,
        cardId,
      },
    },
  })

  if (existing) {
    await prisma.cardLike.delete({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId,
        },
      },
    })
    return res.status(200).json({ liked: false })
  } else {
    await prisma.cardLike.create({
      data: {
        userId: session.user.id,
        cardId,
      },
    })
    return res.status(200).json({ liked: true })
  }
}
