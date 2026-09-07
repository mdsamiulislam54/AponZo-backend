-- CreateEnum
CREATE TYPE "Stores_Type" AS ENUM ('PHYSICAL', 'ONLINE', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "Store_Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'SUSPENDED', 'BANDED');

-- CreateTable
CREATE TABLE "Stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "type" "Stores_Type" NOT NULL DEFAULT 'INDIVIDUAL',
    "status" "Store_Status" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalProducts" INTEGER NOT NULL DEFAULT 0,
    "totalSoldItems" INTEGER NOT NULL DEFAULT 0,
    "insideDeliveryFee" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "outsideDeliveryFee" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "insideDeliveryDay" INTEGER NOT NULL DEFAULT 0,
    "outsideDeliveryDay" INTEGER NOT NULL DEFAULT 0,
    "totalSales" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stores_slug_key" ON "Stores"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_sellerId_key" ON "Stores"("sellerId");

-- AddForeignKey
ALTER TABLE "Stores" ADD CONSTRAINT "Stores_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
