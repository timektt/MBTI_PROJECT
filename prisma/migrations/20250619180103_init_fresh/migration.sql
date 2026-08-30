-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasMbtiCard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mbtiType" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
