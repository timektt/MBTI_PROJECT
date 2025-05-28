import { prisma } from "./prisma";

export const logActivity = async ({
  userId,
  type,
  cardId,
  targetType,
  message,
}: {
  userId: string;
  type: string;
  cardId?: string;
  targetType?: string;
  message?: string;
}) => {
  return prisma.activity.create({
    data: {
      userId,
      type,
      cardId: cardId ?? null,
      targetType: targetType ?? null,
      message: message ?? "",
    },
  });
};
