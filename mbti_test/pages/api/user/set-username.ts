// ✅ /pages/api/user/set-username.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity,ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { SetUsernameSchema } from "@/lib/schema";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Rate limit: 10 requests/min
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parseResult = SetUsernameSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const username = parseResult.data.username.toLowerCase();

  try {
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      await logActivity({
        userId: session.user.id,
        type: ActivityType.SET_USERNAME_REJECTED,
        message: `Tried using taken username: "${username}"`,
      });
      return res.status(409).json({ error: "Conflict: Resource already exists" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    });

    if (user?.username) {
      return res.status(400).json({ error: "Username already set" });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    await logActivity({
      userId: session.user.id,
      type: ActivityType.SET_USERNAME,
      message: `Set username to "${username}"`,
    });

    return res.status(200).json({ message: "Username set successfully" });
  } catch (err) {
    console.error("Set username failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
