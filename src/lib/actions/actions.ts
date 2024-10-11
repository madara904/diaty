'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { MealType } from "@prisma/client"

export async function fetchNutritionData(date: Date) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const nutritionData = await prisma.nutritionData.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  })

  const totalNutrition = nutritionData.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    carbs: acc.carbs + item.carbs,
    proteins: acc.proteins + item.proteins,
    fats: acc.fats + item.fats,
  }), { calories: 0, carbs: 0, proteins: 0, fats: 0 })

  const meals = nutritionData.reduce((acc, item) => {
    if (!acc[item.mealType]) {
      acc[item.mealType] = []
    }
    acc[item.mealType].push(item)
    return acc
  }, {} as Record<string, typeof nutritionData>)

  return {
    date,
    totalNutrition,
    meals,
  }
}

export async function addNutritionData(data: {
    calories: number
    carbs: number
    proteins: number
    fats: number
    mealType: string
    date: string
  }) {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" }
    }
  
    try {
      const validMealType = validateMealType(data.mealType)
      if (!validMealType) {
        return { success: false, error: "Invalid meal type" }
      }
  
      await prisma.nutritionData.create({
        data: {
          calories: data.calories,
          carbs: data.carbs,
          proteins: data.proteins,
          fats: data.fats,
          mealType: validMealType,
          date: new Date(data.date),
          userId: session.user.id,
        },
      })
  
      revalidatePath('/dashboard')
      return { success: true }
    } catch (error) {
      console.error("Error adding nutrition data:", error)
      return { success: false, error: "Failed to add nutrition data" }
    }
  }
  
  function validateMealType(mealType: string): MealType | null {
    const upperCaseMealType = mealType.toUpperCase()
    if (upperCaseMealType in MealType) {
      return upperCaseMealType as MealType
    }
    return null
  }