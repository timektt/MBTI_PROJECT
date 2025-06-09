// /pages/api/auth/verify-email.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid token." });
  }

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });

  return res.status(200).json({ success: true });
}
