-- CreateEnum
CREATE TYPE "ADDRESS_TYPE" AS ENUM ('PICKUP', 'RETURN');

-- CreateEnum
CREATE TYPE "DOCUMENT_TYPE" AS ENUM ('NID', 'PASSPORT', 'TRADE_LICENSE', 'TIN', 'BIN', 'OTHER');

-- CreateEnum
CREATE TYPE "DOCUMENT_STATUS" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- CreateTable
CREATE TABLE "seller_addresses" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "type" "ADDRESS_TYPE" NOT NULL DEFAULT 'PICKUP',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_documents" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "documentType" "DOCUMENT_TYPE" NOT NULL DEFAULT 'OTHER',
    "status" "DOCUMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "documentUrl" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seller_addresses_sellerId_key" ON "seller_addresses"("sellerId");

-- AddForeignKey
ALTER TABLE "seller_addresses" ADD CONSTRAINT "seller_addresses_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_documents" ADD CONSTRAINT "seller_documents_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
