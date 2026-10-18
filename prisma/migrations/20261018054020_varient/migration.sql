/*
  Warnings:

  - You are about to drop the column `stock` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "stock";

-- CreateTable
CREATE TABLE "products_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "color" TEXT,
    "size" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_variants_sku_key" ON "products_variants"("sku");

-- CreateIndex
CREATE INDEX "products_variants_productId_idx" ON "products_variants"("productId");

-- CreateIndex
CREATE INDEX "products_variants_sku_idx" ON "products_variants"("sku");

-- AddForeignKey
ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
