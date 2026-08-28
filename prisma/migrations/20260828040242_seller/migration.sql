-- CreateEnum
CREATE TYPE "SELLER_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "BUSINESS_TYPE" AS ENUM ('INDIVIDUAL', 'COMPANY', 'PARTNERSHIP');

-- CreateEnum
CREATE TYPE "VERIFICATION_STATUS" AS ENUM ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "sellers" (
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "status" "SELLER_STATUS" NOT NULL DEFAULT 'PENDING',
    "businessType" "BUSINESS_TYPE" NOT NULL DEFAULT 'INDIVIDUAL',
    "verificationStatus" "VERIFICATION_STATUS" NOT NULL DEFAULT 'PENDING',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "fraudScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "sellers_userId_key" ON "sellers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_businessName_key" ON "sellers"("businessName");

-- CreateIndex
CREATE INDEX "sellers_businessName_status_idx" ON "sellers"("businessName", "status");

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
