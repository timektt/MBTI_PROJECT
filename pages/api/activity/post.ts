import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).end();

  const { type, message, cardId } = req.body;

  if (!type || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const activity = await prisma.activity.create({
    data: {
      type,
      message,
      userId: session.user.id,
      cardId: cardId || null,
    },
  });

  res.status(200).json(activity);
}
