import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { logActivity, ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { UpdateProfileSchema } from "@/lib/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ Limit request (ป้องกัน spam)
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  // ✅ Method check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Auth check
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ✅ Parse body → handle string or object
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const parseResult = UpdateProfileSchema.safeParse(body);
  console.log("Body received:", body);
  console.log("Parse result:", parseResult);
  if (!parseResult.success) {
  const fieldErrors = parseResult.error.flatten().fieldErrors;
  const errorMsg =
    fieldErrors.username?.[0] ||
    fieldErrors.bio?.[0] ||
    fieldErrors.image?.[0] ||
    "Invalid request payload";

  return res.status(400).json({
    error: errorMsg,
    fieldErrors,
  });
}

  const { username, bio, image } = parseResult.data;

  try {
    // ✅ Check duplicate username
    const existing = await prisma.user.findFirst({
      where: {
        username,
        NOT: { email: session.user.email },
      },
    });

    if (existing) {
      return res.status(409).json({ error: "Username is already taken." });
    }

    // ✅ Update user
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        bio,
        image,
      },
    });

    // ✅ Log activity → ต้อง query user.id มาก่อน
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    await logActivity({
      userId: user.id,
      type: ActivityType.UPDATE_PROFILE,
      message: `Updated profile`,
    });

    // ✅ Success response
    return res.status(200).json({
      ok: true,
      user: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        image: updated.image,
        bio: updated.bio,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
