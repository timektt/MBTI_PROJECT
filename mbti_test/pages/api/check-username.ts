import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const username = (req.query.username as string)?.toLowerCase()

  if (!username || username.length < 3) {
    return res.status(400).json({ available: false })
  }

  const existing = await prisma.user.findFirst({
    where: { username },
  })

  res.status(200).json({ available: !existing })
}
