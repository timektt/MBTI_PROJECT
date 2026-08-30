-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "preferredLocale" TEXT NOT NULL DEFAULT 'th';

-- AlterTable
ALTER TABLE "QuizResult"
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'th',
ADD COLUMN     "typeCode" TEXT;

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "promptTh" TEXT NOT NULL,
    "promptEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "labelTh" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "traitCode" TEXT NOT NULL,
    "scoreValue" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "locale" TEXT NOT NULL DEFAULT 'th',
    "version" TEXT NOT NULL DEFAULT 'v1',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentQuestionOrder" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAnsweredAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "quizResultId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAnswer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'th',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalityProfile" (
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "archetypeNameTh" TEXT NOT NULL,
    "archetypeNameEn" TEXT NOT NULL,
    "taglineTh" TEXT,
    "taglineEn" TEXT,
    "summaryTh" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalityProfile_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "PersonalityContent" (
    "id" TEXT NOT NULL,
    "personalityCode" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "title" TEXT,
    "body" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalityContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizResultId" TEXT NOT NULL,
    "personalityCode" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'th',
    "status" TEXT NOT NULL DEFAULT 'locked',
    "teaserData" JSONB,
    "reportData" JSONB,
    "unlockedAt" TIMESTAMP(3),
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizResultId" TEXT NOT NULL,
    "personalityCode" TEXT,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'th',
    "title" TEXT,
    "subtitle" TEXT,
    "imageUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "lastSharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "assessmentSessionId" TEXT,
    "quizResultId" TEXT,
    "eventName" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "locale" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestion_key_key" ON "AssessmentQuestion"("key");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_dimension_sortOrder_idx" ON "AssessmentQuestion"("dimension", "sortOrder");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_version_isActive_idx" ON "AssessmentQuestion"("version", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentOption_questionId_key_key" ON "AssessmentOption"("questionId", "key");

-- CreateIndex
CREATE INDEX "AssessmentOption_traitCode_idx" ON "AssessmentOption"("traitCode");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSession_quizResultId_key" ON "AssessmentSession"("quizResultId");

-- CreateIndex
CREATE INDEX "AssessmentSession_userId_status_idx" ON "AssessmentSession"("userId", "status");

-- CreateIndex
CREATE INDEX "AssessmentSession_locale_version_idx" ON "AssessmentSession"("locale", "version");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentAnswer_sessionId_questionId_key" ON "AssessmentAnswer"("sessionId", "questionId");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_userId_createdAt_idx" ON "AssessmentAnswer"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalityProfile_slug_key" ON "PersonalityProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalityContent_personalityCode_locale_section_tier_sortOrd_key" ON "PersonalityContent"("personalityCode", "locale", "section", "tier", "sortOrder");

-- CreateIndex
CREATE INDEX "PersonalityContent_locale_section_tier_idx" ON "PersonalityContent"("locale", "section", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "PremiumReport_quizResultId_key" ON "PremiumReport"("quizResultId");

-- CreateIndex
CREATE INDEX "PremiumReport_userId_status_idx" ON "PremiumReport"("userId", "status");

-- CreateIndex
CREATE INDEX "PremiumReport_personalityCode_idx" ON "PremiumReport"("personalityCode");

-- CreateIndex
CREATE UNIQUE INDEX "ShareCard_slug_key" ON "ShareCard"("slug");

-- CreateIndex
CREATE INDEX "ShareCard_userId_createdAt_idx" ON "ShareCard"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ShareCard_quizResultId_idx" ON "ShareCard"("quizResultId");

-- CreateIndex
CREATE INDEX "EventLog_eventName_createdAt_idx" ON "EventLog"("eventName", "createdAt");

-- CreateIndex
CREATE INDEX "EventLog_userId_createdAt_idx" ON "EventLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "QuizResult_typeCode_idx" ON "QuizResult"("typeCode");

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_typeCode_fkey" FOREIGN KEY ("typeCode") REFERENCES "PersonalityProfile"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOption" ADD CONSTRAINT "AssessmentOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AssessmentSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "AssessmentOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalityContent" ADD CONSTRAINT "PersonalityContent_personalityCode_fkey" FOREIGN KEY ("personalityCode") REFERENCES "PersonalityProfile"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumReport" ADD CONSTRAINT "PremiumReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumReport" ADD CONSTRAINT "PremiumReport_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumReport" ADD CONSTRAINT "PremiumReport_personalityCode_fkey" FOREIGN KEY ("personalityCode") REFERENCES "PersonalityProfile"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareCard" ADD CONSTRAINT "ShareCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareCard" ADD CONSTRAINT "ShareCard_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareCard" ADD CONSTRAINT "ShareCard_personalityCode_fkey" FOREIGN KEY ("personalityCode") REFERENCES "PersonalityProfile"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_assessmentSessionId_fkey" FOREIGN KEY ("assessmentSessionId") REFERENCES "AssessmentSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;
