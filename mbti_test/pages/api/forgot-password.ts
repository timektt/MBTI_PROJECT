// pages/api/forgot-password.ts

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email." });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // For security → always return success even if user not found
  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiry = addHours(new Date(), 1); // Token valid for 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset your MBTI.AI password",
      html: `
        <p>Hi,</p>
        <p>You requested to reset your password. Click the link below to reset:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });
  }

  return res.status(200).json({ message: "If this email is registered, a reset link has been sent." });
}
