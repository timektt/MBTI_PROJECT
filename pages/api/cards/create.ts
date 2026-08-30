import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity, ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { CreateCardSchema } from "@/lib/schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Limit to 10 requests per minute per IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ✅ Validate schema
  const parseResult = CreateCardSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { title, description, imageUrl, quizResultId } = parseResult.data;

  try {
    const quizResult = await prisma.quizResult.findUnique({ where: { id: quizResultId } });

    if (!quizResult || quizResult.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: Invalid ownership" });
    }

    const [existingByResult, existingByUser] = await Promise.all([
      prisma.card.findFirst({ where: { quizResultId } }),
      prisma.card.findFirst({ where: { userId } }),
    ]);

    if (existingByResult || existingByUser) {
      return res.status(409).json({ error: "Conflict: Unable to process request" });
    }

    const card = await prisma.card.create({
      data: {
        title,
        description,
        imageUrl: imageUrl ?? "",
        userId,
        quizResultId,
      },
    });

    await logActivity({
      userId,
      type: ActivityType.CREATE_CARD,
      cardId: card.id,
      targetType: "Card",
      message: `Created card`,
    });

    return res.status(200).json({ cardId: card.id });
  } catch (error) {
    // ✅ Handle known Prisma constraint errors
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ error: "Conflict: Card already exists." });
    }

    console.error("❌ Card creation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
