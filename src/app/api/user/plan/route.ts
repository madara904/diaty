import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userData = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { plan: true },
    });
    
    // If user has targetCalories set, use that instead of plan's dailyCalories
    let planData = userData?.plan || null;
    
    if (userData?.targetCalories) {
      console.log(`Using user's targetCalories: ${userData.targetCalories} instead of plan calories`);
      
      // If there's no plan, create a default plan object with the user's targetCalories
      if (!planData) {
        planData = {
          id: 'user-calculated',
          name: 'Custom Plan',
          dailyCalories: userData.targetCalories,
          dailyCarbs: Math.round(userData.targetCalories * 0.5 / 4), // 50% from carbs, 4 calories per gram
          dailyProteins: Math.round(userData.targetCalories * 0.25 / 4), // 25% from protein, 4 calories per gram
          dailyFats: Math.round(userData.targetCalories * 0.25 / 9), // 25% from fat, 9 calories per gram
        };
      } else {
        // If there is a plan, override its calories with the user's targetCalories
        planData = {
          ...planData,
          dailyCalories: userData.targetCalories
        };
      }
    }
    
    return NextResponse.json(planData);
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json({ 
      error: "Failed to fetch user plan" 
    }, { status: 500 });
  }
}