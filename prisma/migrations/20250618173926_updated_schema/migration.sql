/*
  Warnings:

  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateTable
CREATE TABLE "InterviewReport" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "areasForImprovement" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewReport_applicationId_key" ON "InterviewReport"("applicationId");

-- CreateIndex
CREATE INDEX "InterviewReport_applicationId_idx" ON "InterviewReport"("applicationId");

-- AddForeignKey
ALTER TABLE "InterviewReport" ADD CONSTRAINT "InterviewReport_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
