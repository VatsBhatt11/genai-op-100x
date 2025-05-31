-- AlterTable
ALTER TABLE "CandidateProfile" ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "education" JSONB,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "workHistory" JSONB;

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "location" TEXT,
    "industry" TEXT,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreScreening" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "questions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreScreening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "CompanyProfile"("userId");

-- CreateIndex
CREATE INDEX "CompanyProfile_userId_idx" ON "CompanyProfile"("userId");

-- CreateIndex
CREATE INDEX "PreScreening_companyId_idx" ON "PreScreening"("companyId");

-- CreateIndex
CREATE INDEX "CandidateProfile_employmentType_idx" ON "CandidateProfile"("employmentType");

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreScreening" ADD CONSTRAINT "PreScreening_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
