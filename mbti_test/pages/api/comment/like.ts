// ✅ ใช้ Zod validation สำหรับ commentId
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { logActivity } from "@/lib/activity";
import { rateLimit } from "@/lib/rateLimit";
import { ToggleCommentLikeSchema } from "@/lib/schema"; // ✅ เพิ่ม

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ เพิ่ม rate-limit: 10 ครั้ง/นาที ต่อ IP
  if (!rateLimit(req, res, { windowMs: 60_000, max: 10 })) return;

  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  // ✅ validate req.body
  const parseResult = ToggleCommentLikeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.flatten() });
  }

  const { commentId } = parseResult.data;

  const existing = await prisma.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId: session.user.id,
        commentId,
      },
    },
  });

  if (existing) {
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
    });
    await logActivity({
      userId: session.user.id,
      type: "UNLIKE_COMMENT",
      cardId: commentId,
      targetType: "Comment",
      message: "Unliked a comment",
    });
    return res.status(200).json({ liked: false });
  } else {
    await prisma.commentLike.create({
      data: {
        userId: session.user.id,
        commentId,
      },
    });
    await logActivity({
      userId: session.user.id,
      type: "LIKE_COMMENT",
      cardId: commentId,
      targetType: "Comment",
      message: "Liked a comment",
    });
    return res.status(200).json({ liked: true });
  }
}
