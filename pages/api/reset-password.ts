import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimit(req, res, { windowMs: 60_000, max: 5 })) return;

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { token, password } = req.body;

  if (
    !token ||
    typeof token !== "string" ||
    !password ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    return res.status(400).json({ error: "Invalid token or password." });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return res
    .status(200)
    .json({ message: "Password has been reset successfully." });
}
