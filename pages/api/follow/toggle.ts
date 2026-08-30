import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notify";
import { pusherServer } from "@/lib/pusher";
import { logActivity,ActivityType } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { ToggleFollowSchema } from "@/lib/schema"; // ✅ เพิ่ม
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const followerId = session?.user?.id;
  if (!followerId) return res.status(401).json({ error: "Unauthorized" });

  // ✅ validate body
  const parseResult = ToggleFollowSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { followingId } = parseResult.data;

  // ❌ ห้าม follow ตัวเอง
  if (followerId === followingId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  const user = await prisma.user.findUnique({ where: { id: followerId } });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    await logActivity({
      userId: followerId,
      type: ActivityType.UNFOLLOW_USER,
      cardId: followingId,
      targetType: "User",
      message: `${user?.name ?? "Someone"} unfollowed a user`,
    });
    return res.status(200).json({ followed: false });
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  await logActivity({
    userId: followerId,
    type: ActivityType.FOLLOW_USER,
    cardId: followingId,
    targetType: "User",
    message: `${user?.name ?? "Someone"} followed a user`,
  });

  await createNotification({
    userId: followingId,
    type: "FOLLOW_USER",
    message: `${user?.name ?? "Someone"} followed you`,
    link: `/profile/${followerId}`,
  });

  await pusherServer.trigger(`private-user-${followingId}`, "new-notification", {
    type: "FOLLOW_USER",
    message: `${user?.name ?? "Someone"} followed you`,
    link: `/profile/${followerId}`,
  });

  return res.status(200).json({ followed: true });
}
