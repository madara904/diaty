import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function fetchNutritionData(date: Date) {
    const session = await auth();
  try {
    const nutritionData = await prisma.nutritionData.findMany({
      where: {
        userId: session?.user?.id,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      select: {
        calories: true,
        carbs: true,
        proteins: true,
        fats: true,
        mealType: true,
      },
    });

    const totalNutrition = nutritionData.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        carbs: acc.carbs + entry.carbs,
        proteins: acc.proteins + entry.proteins,
        fats: acc.fats + entry.fats,
      }),
      { calories: 0, carbs: 0, proteins: 0, fats: 0 }
    );

    return {
      date: date.toISOString().split('T')[0],
      totalNutrition,
      meals: nutritionData.reduce((acc, entry) => {
        if (!acc[entry.mealType]) {
          acc[entry.mealType] = [];
        }
        acc[entry.mealType].push(entry);
        return acc;
      }, {} as Record<string, typeof nutritionData>),
    };
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    throw error;
  }
}