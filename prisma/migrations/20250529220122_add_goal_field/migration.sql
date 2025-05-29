-- AlterTable
ALTER TABLE "nutrition_data" ADD COLUMN     "sharedItemId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "goal" TEXT;

-- CreateTable
CREATE TABLE "shared_nutrition_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "proteins" DOUBLE PRECISION NOT NULL,
    "fats" DOUBLE PRECISION NOT NULL,
    "carbUnits" DOUBLE PRECISION NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "createdBy" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shared_nutrition_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "nutrition_data" ADD CONSTRAINT "nutrition_data_sharedItemId_fkey" FOREIGN KEY ("sharedItemId") REFERENCES "shared_nutrition_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
