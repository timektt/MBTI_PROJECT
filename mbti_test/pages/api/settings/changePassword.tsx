// ✅ /pages/api/user/change-password.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";
import { ChangePasswordSchema } from "@/lib/schema"; // ✅ เพิ่ม schema validation

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // ✅ Validate req.body ด้วย schema
  const parseResult = ChangePasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { currentPassword, newPassword } = parseResult.data;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !user.password) {
    return res.status(400).json({ error: "User does not have a password set." });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashed },
  });

  return res.status(200).json({ message: "Password updated" });
}
