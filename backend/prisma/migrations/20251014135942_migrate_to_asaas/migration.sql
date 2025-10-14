/*
  Warnings:

  - You are about to drop the column `preferenceId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `mercadoPagoId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asaasPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[asaasSubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[asaasCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_mercadoPagoId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "preferenceId",
ADD COLUMN     "asaasPaymentId" TEXT,
ADD COLUMN     "invoiceUrl" TEXT;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "mercadoPagoId",
ADD COLUMN     "asaasSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "asaasCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_asaasPaymentId_key" ON "Payment"("asaasPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_asaasSubscriptionId_key" ON "Subscription"("asaasSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_asaasCustomerId_key" ON "User"("asaasCustomerId");
