// ✅ /pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { RegisterUserSchema } from "@/lib/schema"; // ✅ ใช้ schema

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Validate req.body ด้วย schema
  const parseResult = RegisterUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { email, password, name } = parseResult.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Log activity: Register
    await logActivity({
      userId: newUser.id,
      type: "REGISTER",
      cardId: undefined,
      targetType: "User",
      message: `User registered with email "${email}"`,
    });

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
