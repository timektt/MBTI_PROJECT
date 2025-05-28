// pages/api/profile/updateBio.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { validateUsername } from "@/lib/validateUsername";
import { logActivity } from "@/lib/activity";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const { username, bio } = req.body as { username: string; bio: string };

  const error = validateUsername(username);
  if (error) return res.status(400).json({ error });

  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: session.user.id } },
  });
  if (existing) {
    return res.status(409).json({ error: "Username is already taken." });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      username,
      bio,
    },
  });

  // Log activity: Update profile
  await logActivity({
    userId: session.user.id,
    type: "UPDATE_PROFILE",
    message: `Updated profile: username "${username}", bio "${bio}"`,
  });

  return res.status(200).json({ ok: true, user: updated });
}
