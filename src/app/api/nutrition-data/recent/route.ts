import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get parameters
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
    const mealType = searchParams.get("mealType")?.toUpperCase();
    const dateParam = searchParams.get("date");
    
    // Build the where clause
    const whereClause: any = {
      userId: session.user.id,
    };
    
    // Add mealType filter if provided
    if (mealType) {
      whereClause.mealType = mealType as any;
    }
    
    // Add date filter if provided
    if (dateParam) {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        whereClause.date = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    }
    
    // Fetch recent nutrition data
    const recentItems = await prisma.nutritionData.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        calories: true,
        carbs: true,
        proteins: true,
        fats: true,
        mealType: true,
        date: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
    });
    
    return NextResponse.json(recentItems);
    
  } catch (error) {
    console.error("Error fetching recent nutrition data:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent nutrition data" },
      { status: 500 }
    );
  }
} 