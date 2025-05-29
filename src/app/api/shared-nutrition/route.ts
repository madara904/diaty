import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    // Get user's custom foods
    const userCustomFoods = await prisma.nutritionData.groupBy({
      by: ['name', 'calories', 'carbs', 'proteins', 'fats'],
      where: {
        userId: session.user.id,
        name: {
          contains: query,
          mode: 'insensitive'
        },
        sharedItemId: null // This indicates it's a custom food
      },
      _count: true,
      orderBy: {
        name: 'desc'
      },
      take: limit
    });

    // Get other users' custom foods
    const otherUsersCustomFoods = await prisma.nutritionData.groupBy({
      by: ['name', 'calories', 'carbs', 'proteins', 'fats'],
      where: {
        userId: {
          not: session.user.id
        },
        name: {
          contains: query,
          mode: 'insensitive'
        },
        sharedItemId: null // This indicates it's a custom food
      },
      _count: true,
      orderBy: {
        name: 'desc'
      },
      take: limit
    });

    // Format user's custom foods
    const userFormattedResults = userCustomFoods.map(item => ({
      id: `user-${Buffer.from(item.name || "").toString('base64')}`,
      name: item.name || "Unnamed Food",
      calories: item.calories,
      carbs: item.carbs,
      proteins: item.proteins,
      fats: item.fats,
      carbUnits: item.carbs / 10,
      frequency: item._count,
      grams: 100,
      isCustom: true,
      isUserData: true
    }));

    // Format other users' custom foods
    const otherUsersFormattedResults = otherUsersCustomFoods.map(item => ({
      id: `other-${Buffer.from(item.name || "").toString('base64')}`,
      name: item.name || "Unnamed Food",
      calories: item.calories,
      carbs: item.carbs,
      proteins: item.proteins,
      fats: item.fats,
      carbUnits: item.carbs / 10,
      frequency: item._count,
      grams: 100,
      isCustom: true,
      isOtherUserData: true
    }));

    // Combine results, prioritizing user's own custom foods
    const combinedResults = [
      ...userFormattedResults,
      ...otherUsersFormattedResults
    ];

    return NextResponse.json(combinedResults);
    
  } catch (error) {
    console.error("Error searching nutrition items:", error);
    return NextResponse.json(
      { error: "Failed to search nutrition items", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    const { name, calories, carbs, proteins, fats } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Food name is required" }, { status: 400 });
    }
    
    // Create a new custom food entry
    const newFood = await prisma.nutritionData.create({
      data: {
        userId: session.user.id,
        name,
        calories: parseFloat(calories),
        carbs: parseFloat(carbs),
        proteins: parseFloat(proteins),
        fats: parseFloat(fats),
        date: new Date(),
        mealType: "BREAKFAST",
        sharedItemId: null // This indicates it's a custom food
      }
    });
    
    return NextResponse.json(newFood);
    
  } catch (error) {
    console.error("Error saving custom food:", error);
    return NextResponse.json(
      { error: "Failed to save custom food", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 