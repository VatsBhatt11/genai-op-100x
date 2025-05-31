-- CreateTable
CREATE TABLE "Outreach" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "preScreeningId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Outreach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Outreach_senderId_idx" ON "Outreach"("senderId");

-- CreateIndex
CREATE INDEX "Outreach_receiverId_idx" ON "Outreach"("receiverId");

-- CreateIndex
CREATE INDEX "Outreach_preScreeningId_idx" ON "Outreach"("preScreeningId");

-- AddForeignKey
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outreach" ADD CONSTRAINT "Outreach_preScreeningId_fkey" FOREIGN KEY ("preScreeningId") REFERENCES "PreScreening"("id") ON DELETE SET NULL ON UPDATE CASCADE;
