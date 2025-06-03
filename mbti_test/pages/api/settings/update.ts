// ✅ /pages/api/settings/update.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { UpdateProfileSchema } from "@/lib/schema"; // ✅ เพิ่ม schema validation

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ✅ Validate req.body ด้วย schema
  const parseResult = UpdateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { bio, username, image } = parseResult.data;

  // ✅ ตรวจสอบว่า username ไม่ซ้ำกับคนอื่น (ยกเว้นตัวเอง)
  const existing = await prisma.user.findFirst({
    where: {
      username: username.toLowerCase(),
      NOT: { email: session.user.email },
    },
  });

  if (existing) {
    return res.status(409).json({ error: "Username is already taken" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: username.toLowerCase(),
        bio,
        image,
      },
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Failed to update profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
