import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany({
    take: 50,
    orderBy: {
      cardLikes: {
        _count: "desc",
      },
    },
    include: {
      cardLikes: true,
      quizResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const result = users.map((u) => ({
    id: u.id,
    name: u.name || "Anonymous",
    username: u.username || u.id,
    image: u.image,
    mbtiType: u.quizResults[0]?.mbtiType || "Unknown",
    likeCount: u.cardLikes.length,
  }));

  res.status(200).json(result);
}
