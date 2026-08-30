import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 60 })) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const shareCards = await prisma.shareCard.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      quizResult: {
        select: {
          id: true,
          mbtiType: true,
          createdAt: true,
        },
      },
    },
  });

  return res.status(200).json({
    shareCards: shareCards.map((shareCard) => ({
      id: shareCard.id,
      slug: shareCard.slug,
      locale: shareCard.locale,
      title: shareCard.title,
      subtitle: shareCard.subtitle,
      imageUrl: shareCard.imageUrl,
      isPublic: shareCard.isPublic,
      shareCount: shareCard.shareCount,
      lastSharedAt: shareCard.lastSharedAt?.toISOString() ?? null,
      createdAt: shareCard.createdAt.toISOString(),
      mbtiType: shareCard.quizResult.mbtiType,
      quizResultId: shareCard.quizResult.id,
      publicUrl: `/share/${shareCard.slug}`,
    })),
  });
}
