import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id)
    return res.status(401).json({ error: "Unauthorized" })

  const { answers } = req.body

  // Logic แปลงคำตอบเป็น MBTI type อย่างง่าย
  const mbtiType = `${answers.q1[0]}${answers.q2[0]}${answers.q3[0]}${answers.q4[0]}`.toUpperCase()

  const result = await prisma.quizResult.create({
    data: {
      userId: session.user.id,
      mbtiType,
      scoreDetail: answers,
    },
  })

  res.status(200).json({ resultId: result.id })
}
