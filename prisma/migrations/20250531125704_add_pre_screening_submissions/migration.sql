-- CreateTable
CREATE TABLE "PreScreeningSubmission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "preScreeningId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "answers" TEXT[],

    CONSTRAINT "PreScreeningSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreScreeningSubmission_preScreeningId_idx" ON "PreScreeningSubmission"("preScreeningId");

-- CreateIndex
CREATE INDEX "PreScreeningSubmission_candidateId_idx" ON "PreScreeningSubmission"("candidateId");

-- AddForeignKey
ALTER TABLE "PreScreeningSubmission" ADD CONSTRAINT "PreScreeningSubmission_preScreeningId_fkey" FOREIGN KEY ("preScreeningId") REFERENCES "PreScreening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreScreeningSubmission" ADD CONSTRAINT "PreScreeningSubmission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
