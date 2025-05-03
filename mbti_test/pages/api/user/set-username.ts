// pages/api/user/set-username.ts

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { username } = req.body

  if (!username || username.length < 3) {
    return res.status(400).json({ message: "Username too short" })
  }

  const exists = await prisma.user.findUnique({ where: { username } })
  if (exists) {
    return res.status(409).json({ message: "Username already taken" })
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { username },
  })

  res.status(200).json({ message: "Username set" })
}
