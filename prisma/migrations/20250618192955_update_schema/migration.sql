/*
  Warnings:

  - You are about to drop the column `preScreeningId` on the `Outreach` table. All the data in the column will be lost.
  - Added the required column `jobId` to the `Outreach` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Outreach" DROP CONSTRAINT "Outreach_preScreeningId_fkey";

-- DropIndex
DROP INDEX "Outreach_preScreeningId_idx";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "preScreeningId" TEXT;

-- AlterTable
ALTER TABLE "Outreach" DROP COLUMN "preScreeningId",
ADD COLUMN     "applicationId" TEXT,
ADD COLUMN     "jobId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Outreach_jobId_idx" ON "Outreach"("jobId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_preScreeningId_fkey" FOREIGN KEY ("preScreeningId") REFERENCES "PreScreening"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
