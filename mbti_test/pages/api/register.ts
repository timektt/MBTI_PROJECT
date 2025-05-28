// pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity";

// 👇 สร้าง type ชัดเจน
type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name }: RegisterPayload = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required." });
  }

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
      userId: newUser.id, // ✅ ตรงกับ schema
      type: "REGISTER",
      cardId: undefined, // หรือไม่ต้องใส่ถ้าไม่เกี่ยวกับการ์ด
      targetType: "User",
      message: `User registered with email "${email}"`,
    });

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
