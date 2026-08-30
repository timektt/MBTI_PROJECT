import { prisma } from "./prisma";

export enum ActivityType {
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  FOLLOW = "FOLLOW",
  UNFOLLOW = "UNFOLLOW", // ✅ เพิ่มเผื่อใช้
  SET_USERNAME = "SET_USERNAME",
  FOLLOW_USER = "FOLLOW_USER",     // ✅ เพิ่มอันนี้
  UNFOLLOW_USER = "UNFOLLOW_USER", // ✅ เพิ่มอันนี้
  CREATE_CARD = "CREATE_CARD",
  UNLIKE_CARD = "UNLIKE_CARD",
  LIKE_CARD = "LIKE_CARD",
  DELETE_CARD = "DELETE_CARD",
  UPDATE_PROFILE = "UPDATE_PROFILE",
  SUBMIT_QUIZ = "SUBMIT_QUIZ",
  UPDATE_CARD = "UPDATE_CARD",
  UPDATE_PROFILE_PICTURE = "UPDATE_PROFILE_PICTURE",
  REGISTER = "REGISTER",
  UNLIKE_COMMENT = "UNLIKE_COMMENT",
  LIKE_COMMENT = "LIKE_COMMENT",
  COMMENT_CARD = "COMMENT_CARD",
  QUIZ_REJECTED = "QUIZ_REJECTED",
  UPDATE_PROFILE_REJECTED = "UPDATE_PROFILE_REJECTED",
  SET_USERNAME_REJECTED = "SET_USERNAME_REJECTED",
  // เพิ่มอื่น ๆ ได้ตามต้องการ
}

interface LogActivityParams {
  userId: string;                // ผู้กระทำ
  type: ActivityType;            // ประเภทกิจกรรม
  cardId?: string | null;        // การ์ดที่เกี่ยวข้อง (ถ้ามี)
  targetUserId?: string | null;  // ผู้ถูกกระทำ (ถ้ามี)
  targetType?: string | null;    // ประเภทของ target เช่น "User", "Card"
  message?: string;              // ข้อความแสดง
}

export const logActivity = async ({
  userId,
  type,
  cardId = null,
  targetUserId = null,
  targetType = null,
  message = "",
}: LogActivityParams) => {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        cardId,
        targetUserId,
        targetType,
        message,
      },
    });
  } catch (error) {
    console.error("❌ Failed to log activity:", error);
    // หากต้องการไม่ให้ throw ก็ไม่ต้องโยน error ออกไป
  }
};
