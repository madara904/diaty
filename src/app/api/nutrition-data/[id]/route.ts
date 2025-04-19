import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { MealType } from "@prisma/client";

// PUT /api/nutrition-data/[id] - Update a nutrition data entry
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    // Get the request body
    const body = await req.json();
    
    const { name, calories, carbs, proteins, fats, grams, mealType, date } = body;
    const mealTypeEnum = mealType?.toUpperCase() as MealType;

    // Update the nutrition data entry
    const updatedItem = await prisma.nutritionData.update({
      where: { id },
      data: {
        name: name || null,
        calories: Number(calories) || 0,
        carbs: Number(carbs) || 0,
        proteins: Number(proteins) || 0,
        fats: Number(fats) || 0,
        carbUnits: Number(carbs) / 10 || 0,
        ...(mealTypeEnum ? { mealType: mealTypeEnum } : {}),
        ...(date ? { date: new Date(date) } : {}),
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating nutrition data:", error);
    return NextResponse.json({ error: "Failed to update nutrition data" }, { status: 500 });
  }
}

// DELETE /api/nutrition-data/[id] - Delete a nutrition data entry
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.nutritionData.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting nutrition data:", error);
    return NextResponse.json({ error: "Failed to delete nutrition data" }, { status: 500 });
  }
}
