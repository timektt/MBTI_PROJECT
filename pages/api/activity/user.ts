// ✅ File: pages/api/activity/user.ts

import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing or invalid userId" });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: { userId }, // ✅ ใช้ชื่อ field ที่ถูกต้อง
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        user: { select: { name: true, image: true } }, // ✅ ดึงชื่อผู้กระทำ
        card: { select: { id: true, title: true } },   // ✅ ดึง card ถ้ามี
      },
    });

    return res.status(200).json(activities);
  } catch (error) {
    console.error("❌ Failed to fetch user activity", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
