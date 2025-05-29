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
    const { name, calories, carbs, proteins, fats, mealType, date, isManualEntry } = body;
    
    // Ensure we have a valid date
    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const mealTypeEnum = mealType.toUpperCase() as MealType;

    // If this is a manual entry, create it in SharedNutritionItem first
    let sharedItemId = null;
    if (isManualEntry) {
      const sharedItem = await prisma.sharedNutritionItem.create({
        data: {
          name,
          calories: Number(calories) || 0,
          carbs: Number(carbs) || 0,
          proteins: Number(proteins) || 0,
          fats: Number(fats) || 0,
          carbUnits: Number(carbs) / 10 || 0,
          createdBy: user.id,
          isVerified: false
        }
      });
      sharedItemId = sharedItem.id;
    }

    // Create the nutrition data entry
    const newNutritionData = await prisma.nutritionData.create({
      data: {
        userId: user.id,
        name: name || "Custom Food Item",
        date: new Date(date),
        calories: Number(calories) || 0,
        carbs: Number(carbs) || 0,
        proteins: Number(proteins) || 0,
        fats: Number(fats) || 0,
        carbUnits: Number(carbs) / 10 || 0,
        mealType: mealTypeEnum,
        sharedItemId: sharedItemId // This will be null for API-sourced items
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
    const mealType = searchParams.get("mealType")?.toUpperCase();
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    
    if (!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }
  
    const date = new Date(dateParam);
  
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
  
    try {
      const nutritionData = await fetchNutritionData(date, mealType, limit);
      return NextResponse.json(nutritionData, { status: 200 });
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }

// This is a catch-all route handler for DELETE requests with an ID in the path
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Extract the ID from the URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.nutritionData.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting nutrition data:", error);
    return NextResponse.json({ error: "Failed to delete nutrition data" }, { status: 500 });
  }
}
