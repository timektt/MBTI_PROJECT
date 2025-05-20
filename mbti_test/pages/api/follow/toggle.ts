// pages/api/follow/toggle.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notify";
import { pusherServer } from "@/lib/pusher";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  const followerId = session?.user?.id;
  const { followingId } = req.body;

  if (!followerId || !followingId || followerId === followingId) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return res.status(200).json({ followed: false });
  }

  await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: followerId } });

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
