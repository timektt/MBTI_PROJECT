ALTER TABLE "AssessmentQuestion"
  ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'mbti',
  ADD COLUMN "module" TEXT NOT NULL DEFAULT 'core',
  ADD COLUMN "poles" JSONB;

ALTER TABLE "AssessmentOption"
  ALTER COLUMN "traitCode" DROP NOT NULL,
  ADD COLUMN "metaLabel" TEXT,
  ADD COLUMN "weights" JSONB,
  ADD COLUMN "movieScores" JSONB;

CREATE INDEX "AssessmentQuestion_module_sortOrder_idx" ON "AssessmentQuestion"("module", "sortOrder");
CREATE INDEX "AssessmentQuestion_kind_isActive_idx" ON "AssessmentQuestion"("kind", "isActive");
