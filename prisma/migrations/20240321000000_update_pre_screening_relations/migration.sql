-- CreateTable
CREATE TABLE "PreScreeningQuestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "preScreeningId" TEXT NOT NULL,

    CONSTRAINT "PreScreeningQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreScreeningQuestion_preScreeningId_idx" ON "PreScreeningQuestion"("preScreeningId");

-- AddForeignKey
ALTER TABLE "PreScreeningQuestion" ADD CONSTRAINT "PreScreeningQuestion_preScreeningId_fkey" FOREIGN KEY ("preScreeningId") REFERENCES "PreScreening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing questions
INSERT INTO "PreScreeningQuestion" ("id", "createdAt", "updatedAt", "text", "preScreeningId")
SELECT 
    gen_random_uuid()::text,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    unnest(ps."questions"),
    ps.id
FROM "PreScreening" ps
WHERE array_length(ps."questions", 1) > 0;

-- Add unique constraint
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_preScreeningId_key" UNIQUE ("preScreeningId");

-- Rename column
ALTER TABLE "PreScreening" RENAME COLUMN "questions" TO "questionTexts"; 