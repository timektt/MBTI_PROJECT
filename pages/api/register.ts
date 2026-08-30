// ✅ /pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity, ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { RegisterUserSchema } from "@/lib/schema";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { sendEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Rate limit → 10 req/min per IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Validate request body
  const parseResult = RegisterUserSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { email, password, name } = parseResult.data;

  try {
    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Don't expose that email exists → use generic error
      return res.status(409).json({ error: "Conflict: Unable to process request." });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Generate email verification token
    const emailVerificationToken = randomBytes(32).toString("hex");
    const emailVerificationTokenExpires = addHours(new Date(), 24); // 24h expiry

    // ✅ Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerificationToken,
        emailVerificationTokenExpires,
        emailVerified: new Date(),
      },
    });

    // ✅ Log register activity
    await logActivity({
      userId: newUser.id,
      type: ActivityType.REGISTER,
      cardId: undefined,
      targetType: "User",
      message: `User registered`,
    });

    // ✅ Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${emailVerificationToken}`;

    await sendEmail({
      to: newUser.email,
      subject: "Verify your email",
      html: `
        <h1>Welcome to MBTI.AI!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return res
      .status(200)
      .json({
        message:
          "User registered successfully. Please check your email to verify your account.",
      });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
