/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER');

-- AlterTable
ALTER TABLE "nutrition_data" ADD COLUMN     "mealType" "MealType" NOT NULL DEFAULT 'BREAKFAST',
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "completeFlag" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "plan_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyCalories" DOUBLE PRECISION NOT NULL,
    "dailyCarbs" DOUBLE PRECISION NOT NULL,
    "dailyProteins" DOUBLE PRECISION NOT NULL,
    "dailyFats" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_templates_name_key" ON "plan_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "plans_userId_key" ON "plans"("userId");
