import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";



export async function POST(req: NextRequest) {

  const session = await auth();
  const user = session?.user;

  try {

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const body = await req.json();
    const { calories, carbs, proteins, fats } = body;


    const newNutritionData = await prisma.nutritionData.create({
      data: {
        userId: user.id,
        date: new Date(),
        calories,
        carbs,
        proteins,
        fats,
        carbUnits: carbs / 10,
      },
    });

    return NextResponse.json(newNutritionData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save nutrition data" }, { status: 500 });
  }
}

export async function GET(res: NextResponse) {

}
