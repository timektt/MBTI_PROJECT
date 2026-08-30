/*
  Warnings:

  - You are about to drop the column `likes` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `mbtiType` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quizResultId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "likes",
ADD COLUMN     "quizResultId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mbtiType";

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "CommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_quizResultId_key" ON "Card"("quizResultId");

-- CreateIndex
CREATE INDEX "Card_userId_idx" ON "Card"("userId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_cardId_idx" ON "Comment"("cardId");

-- CreateIndex
CREATE INDEX "QuizResult_userId_idx" ON "QuizResult"("userId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
