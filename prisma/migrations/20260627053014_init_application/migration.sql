-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('GERCEK_KISI', 'SAHIS_ISLETMESI', 'SIRKET', 'KOOPERATIF', 'DERNEK', 'KAMU_KURUMU', 'DIGER');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "applicationNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "applicantName" TEXT NOT NULL,
    "idOrTaxNo" TEXT NOT NULL,
    "activitySubject" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "businessTypeOther" TEXT,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "needsElectricity" BOOLEAN NOT NULL,
    "otherRequests" TEXT,
    "declarationAccepted" BOOLEAN NOT NULL,
    "kvkkAccepted" BOOLEAN NOT NULL,
    "kvkkAcceptedAt" TIMESTAMP(3) NOT NULL,
    "adminNote" TEXT,
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_applicationNo_key" ON "Application"("applicationNo");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");
