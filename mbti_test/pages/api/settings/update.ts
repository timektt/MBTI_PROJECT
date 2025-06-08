// ✅ /pages/api/settings/update.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { UpdateProfileSchema } from "@/lib/schema";
import { logActivity, ActivityType } from "@/lib/activity";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsed = UpdateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    console.warn("Validation failed:", parsed.error.format());
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { username, bio, image } = parsed.data;
  const normalizedUsername = username.trim().toLowerCase();
  const cleanedBio = bio?.trim() || "";
  const cleanedImage = image?.trim() || null;

  try {
    const isTaken = await prisma.user.findFirst({
      where: {
        username: normalizedUsername,
        NOT: { id: userId },
      },
    });

    if (isTaken) {
      await logActivity({
        userId,
        type: ActivityType.UPDATE_PROFILE_REJECTED,
        message: `Tried using taken username: "${normalizedUsername}"`,
      });
      return res.status(409).json({ error: "Username already taken" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: normalizedUsername, bio: cleanedBio, image: cleanedImage },
    });

    await logActivity({
      userId,
      type: ActivityType.UPDATE_PROFILE,
      message: `Updated profile: username "${normalizedUsername}"`,
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
