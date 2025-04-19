'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function fetchNutritionData(date: Date, mealType?: string, limit?: number) {

    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }
  
    // Create date range for the query (start and end of the specified day)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    
    try {
      const nutritionData = await prisma.nutritionData.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          ...(mealType ? { mealType: mealType as any } : {}),
        },
        select: {
          id: true, // For frontend editing/deleting
          name: true, // For food label
          calories: true,
          carbs: true,
          proteins: true,
          fats: true,
          mealType: true,
        },
        orderBy: {
          date: 'desc'
        },
        take: limit,
      })
  
      const totalNutrition = nutritionData.reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.calories,
          carbs: acc.carbs + entry.carbs,
          proteins: acc.proteins + entry.proteins,
          fats: acc.fats + entry.fats,
        }),
        { calories: 0, carbs: 0, proteins: 0, fats: 0 }
      )
  
      return {
        date,
        totalNutrition,
        meals: nutritionData.reduce((acc, entry) => {
          if (!acc[entry.mealType]) {
            acc[entry.mealType] = []
          }
          acc[entry.mealType].push(entry)
          return acc
        }, {} as Record<string, typeof nutritionData>),
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
      throw error
    }
  }