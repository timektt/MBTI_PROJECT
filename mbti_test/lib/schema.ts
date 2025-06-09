import { z } from "zod";

// สำหรับสร้างการ์ด
export const CreateCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  quizResultId: z.string().min(1, "Quiz result ID is required"),
});

// สำหรับโพสต์คอมเมนต์
export const PostCommentSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  content: z.string().min(1, "Content is required"),
});

// สำหรับตั้ง username
export const SetUsernameSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

// สำหรับอัปเดตโปรไฟล์
export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  bio: z
    .string()
    .trim()
    .max(160, "Bio must be at most 160 characters")
    .optional(),

  image: z
    .string()
    .trim()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")),
});

// สำหรับเปลี่ยนรหัสผ่าน
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const QuizAnswersSchema = z.object({
  answers: z.object({
    q1: z.string().min(1, "Answer for Q1 is required"),
    q2: z.string().min(1, "Answer for Q2 is required"),
    q3: z.string().min(1, "Answer for Q3 is required"),
    q4: z.string().min(1, "Answer for Q4 is required"),
  }),
});

// สำหรับอัปโหลดรูปภาพ (Base64 string)
export const UploadImageSchema = z.object({
  imageBase64: z.string().min(10, "Image data is too short or missing"),
});

// สำหรับลงทะเบียนผู้ใช้ใหม่
export const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

// สำหรับ like/unlike คอมเมนต์
export const ToggleCommentLikeSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
});

// สำหรับ toggle follow ผู้ใช้
export const ToggleFollowSchema = z.object({
  followingId: z.string().min(1, "Following ID is required"),
});
