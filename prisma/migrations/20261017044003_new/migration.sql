/*
  Warnings:

  - You are about to alter the column `insideDeliveryFee` on the `Stores` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `outsideDeliveryFee` on the `Stores` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalSales` on the `Stores` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Stores" ALTER COLUMN "insideDeliveryFee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "outsideDeliveryFee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalSales" SET DATA TYPE DOUBLE PRECISION;
