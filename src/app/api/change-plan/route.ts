import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth"; // Your authentication logic
import prisma from "@/lib/prisma"; // Your Prisma client

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    const user = session?.user;

    // Parse the request body (assuming JSON)
    const body = await req.json();
    const selectedPlanName = body.plan;

    if (!user || !selectedPlanName) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Find the selected plan in the database
    const selectedPlan = await prisma.planTemplate.findUnique({
      where: { name: selectedPlanName },
    });

    if (!selectedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Fetch the user and their current plan
    if (!user.email) {
      return NextResponse.json({ error: "User email is missing" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { plan: true },
    });

    let updatedPlan;
    if (dbUser?.plan) {
      // Update the existing plan
      updatedPlan = await prisma.plan.update({
        where: { id: dbUser.plan.id },
        data: {
          name: selectedPlan.name,
          dailyCalories: selectedPlan.dailyCalories,
          dailyCarbs: selectedPlan.dailyCarbs,
          dailyFats: selectedPlan.dailyFats,
          dailyProteins: selectedPlan.dailyProteins,
        },
      });
    } else {
      // Create a new plan if the user doesn't have one
      updatedPlan = await prisma.plan.create({
        data: {
          name: selectedPlan.name,
          dailyCalories: selectedPlan.dailyCalories,
          dailyCarbs: selectedPlan.dailyCarbs,
          dailyFats: selectedPlan.dailyFats,
          dailyProteins: selectedPlan.dailyProteins,
          user: { connect: { id: dbUser?.id } },
        },
      });
    }

    // Return the updated plan as a response
    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error) {
    console.error("Error changing the plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}