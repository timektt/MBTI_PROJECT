// ✅ /pages/api/profile/updateBio.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { UpdateProfileSchema } from "@/lib/schema"; // ✅ ใช้ schema เดิม
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  // ✅ validate ด้วย schema
  const parseResult = UpdateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { username, bio } = parseResult.data;

  // ✅ ตรวจสอบว่าชื่อไม่ซ้ำกับ user อื่น
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
