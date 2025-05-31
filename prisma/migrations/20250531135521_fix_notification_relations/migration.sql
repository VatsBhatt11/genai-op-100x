-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "outreachId" TEXT;

-- CreateIndex
CREATE INDEX "Notification_senderId_idx" ON "Notification"("senderId");
