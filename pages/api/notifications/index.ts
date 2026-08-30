// pages/api/notifications/index.ts
import { getServerAuthSession } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession(req, res);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  res.status(200).json(notifications);
}
