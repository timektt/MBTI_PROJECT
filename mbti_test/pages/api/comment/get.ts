// pages/api/comment/get.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end()

  const { cardId } = req.query

  if (!cardId || typeof cardId !== "string") {
    return res.status(400).json({ error: "Missing or invalid cardId" })
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: true, // ✅ ดึงข้อมูล Like มาด้วย
      },
    })

    // ✅ ปรับให้ส่งเฉพาะข้อมูลจำเป็น
    const formatted = comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: c.user,
      likeCount: c.likes.length,
    }))

    return res.status(200).json(formatted)
  } catch (error) {
    console.error("Failed to load comments:", error)
    return res.status(500).json({ error: "Failed to load comments" })
  }
}
