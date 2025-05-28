// /pages/api/settings/update.ts

import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { bio, username, image } = req.body

  if (typeof username !== "string" || username.length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters long." })
  }

  // ✅ ตรวจสอบว่า username ไม่ซ้ำกับคนอื่น (ยกเว้นตัวเอง)
  const existing = await prisma.user.findFirst({
    where: {
      username: username.toLowerCase(),
      NOT: { email: session.user.email },
    },
  })

  if (existing) {
    return res.status(409).json({ error: "Username is already taken" })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: username.toLowerCase(),
        bio: typeof bio === "string" ? bio : undefined,
        image: typeof image === "string" ? image : undefined,
      },
    })

    res.status(200).json({ success: true, user: updatedUser })
  } catch (err) {
    console.error("Failed to update profile:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
