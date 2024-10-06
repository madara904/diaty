import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { MealType } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;

  try {
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { calories, carbs, proteins, fats, mealType, date } = body;


    const mealTypeEnum = mealType.toUpperCase() as MealType;

    const newNutritionData = await prisma.nutritionData.create({
      data: {
        userId: user.id,
        date: new Date(date),
        calories: Number(calories),
        carbs: Number(carbs),
        proteins: Number(proteins),
        fats: Number(fats),
        carbUnits: Number(carbs) / 10,
        mealType: mealTypeEnum,
      },
    });


    return NextResponse.json(newNutritionData, { status: 200 });
  } catch (error) {
    console.error("Error saving nutrition data:", error);
    return NextResponse.json({ error: "Failed to save nutrition data" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");

  if (!dateParam) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  const date = new Date(dateParam);

  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  try {
    const nutritionData = await prisma.nutritionData.findMany({
      where: {
        userId: session.user.id,
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

    const response = {
      date: dateParam,
      totalNutrition,
      meals: nutritionData.reduce((acc, entry) => {
        if (!acc[entry.mealType]) {
          acc[entry.mealType] = [];
        }
        acc[entry.mealType].push(entry);
        return acc;
      }, {} as Record<string, typeof nutritionData>),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}