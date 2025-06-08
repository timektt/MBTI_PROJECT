// ✅ /pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity,ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { RegisterUserSchema } from "@/lib/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ จำกัดการยิง request: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parseResult = RegisterUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { email, password, name } = parseResult.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // ✅ เปลี่ยนข้อความ error ให้ไม่เปิดเผยว่า email ถูกใช้แล้ว
      return res.status(409).json({ error: "Conflict: Unable to process request." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await logActivity({
      userId: newUser.id,
      type: ActivityType.REGISTER,
      cardId: undefined,
      targetType: "User",
      message: `User registered`,
    });

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
