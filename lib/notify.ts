// lib/notify.ts
import { prisma } from "./prisma";

export async function createNotification({
  userId,
  type,
  message,
  link,
}: {
  userId: string;
  type: string;
  message: string;
  link: string;
}) {
  if (!userId || !message || !link) return;

  return await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      link,
    },
  });
}
