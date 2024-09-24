import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateOrCreatePlan } from '@/lib/planService';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    const body = await req.json();
    const { weight, height, age, gender, plan } = body;

    if (!user || !weight || !height || !age || !gender || !plan) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: user.email! },
      data: {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        gender,
        completeFlag: true,
      },
    });

    if (user.email) {
      await updateOrCreatePlan(user.email, plan);
    } else {
      throw new Error("User email is undefined");
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error submitting profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}