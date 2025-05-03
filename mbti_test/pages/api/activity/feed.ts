import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const feed = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { name: true, image: true } },
      card: { select: { id: true, title: true } },
    },
  })

  res.status(200).json(feed)
}
