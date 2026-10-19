-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "products_variants" ADD COLUMN     "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK';
