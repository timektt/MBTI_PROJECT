import { prisma } from "./prisma";

export const logActivity = async ({
  actorId,
  type,
  targetId,
  targetType,
  message,
}: {
  actorId: string;
  type: string;
  targetId?: string;
  targetType?: string;
  message?: string;
}) => {
  return prisma.activity.create({
    data: {
      actorId,
      type,
      targetId,
      targetType,
      message,
    },
  });
};
