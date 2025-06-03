// ✅ /pages/api/user/set-username.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { SetUsernameSchema } from "@/lib/schema"; // ✅ เพิ่ม schema validation
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email || !session.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // ✅ Validate req.body ด้วย schema
  const parseResult = SetUsernameSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { username } = parseResult.data;

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    return res.status(409).json({ message: "Username already taken" });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { username },
  });

  // ✅ Log activity: Set username
  await logActivity({
    userId: session.user.id,
    type: "SET_USERNAME",
    message: `Set username to "${username}"`,
  });

  res.status(200).json({ message: "Username set" });
}
