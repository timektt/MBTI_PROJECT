// pages/api/comment/post.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) return res.status(401).end()

  const { cardId, content } = req.body
  if (!content || !cardId) return res.status(400).json({ message: "Missing content or cardId" })

  const comment = await prisma.comment.create({
    data: {
      userId: session.user.id,
      cardId,
      content,
    },
  })

  res.status(200).json(comment)
}
