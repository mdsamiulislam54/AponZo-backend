-- CreateEnum
CREATE TYPE "PRODUCT_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'OUT_OF_STOCK', 'ARCHIVED', 'DRAFT');

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "tags" TEXT[],
    "basePrice" DOUBLE PRECISION NOT NULL,
    "discountPrice" DOUBLE PRECISION,
    "features" TEXT[],
    "images" TEXT[],
    "shippingFee" DOUBLE PRECISION NOT NULL,
    "isShippingFree" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "PRODUCT_STATUS" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_specifications" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");

-- CreateIndex
CREATE INDEX "products_specifications_productId_idx" ON "products_specifications"("productId");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
