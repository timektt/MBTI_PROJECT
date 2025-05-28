import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import type { NextApiRequest, NextApiResponse } from "next"
import { logActivity } from "@/lib/activity"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" })

  const { commentId } = req.body

  const existing = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId,
      },
    },
  })

  if (existing) {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
    })
    await logActivity({
      userId: session.user.id,
      type: "UNLIKE_COMMENT",
      cardId: commentId,
      targetType: "Comment",
      message: "Unliked a comment",
    })
    return res.status(200).json({ liked: false })
  } else {
    await prisma.commentLike.create({
      data: {
        userId: session.user.id,
        commentId,
      },
    })
    await logActivity({
      userId: session.user.id,
      type: "LIKE_COMMENT",
      cardId: commentId,
      targetType: "Comment",
      message: "Liked a comment",
    })
    return res.status(200).json({ liked: true })
  }
}
