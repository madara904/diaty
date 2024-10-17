import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { MealType } from "@prisma/client";
import { fetchNutritionData } from "@/lib/fetch-nutrition-data";

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
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
  
    if (!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }
  
    const date = new Date(dateParam);
  
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
  
    try {
      const nutritionData = await fetchNutritionData(date, limit);
      return NextResponse.json(nutritionData, { status: 200 });
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }