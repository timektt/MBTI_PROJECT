import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const cards = await prisma.card.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { username: true, image: true },
      },
    },
  });

  return res.json(cards);
}
