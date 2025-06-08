import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity,ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { UpdateProfileSchema } from "@/lib/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parseResult = UpdateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { username, bio } = parseResult.data;

  try {
    const existing = await prisma.user.findFirst({
      where: { username, NOT: { id: session.user.id } },
    });

    if (existing) {
      return res.status(409).json({ error: "Conflict: Unable to process request" }); // ❗️ไม่เปิดเผยว่าชื่อซ้ำ
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { username, bio },
    });

    await logActivity({
      userId: session.user.id,
      type: ActivityType.UPDATE_PROFILE,
      message: `Updated profile`,
    });

    return res.status(200).json({ ok: true, user: updated });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
