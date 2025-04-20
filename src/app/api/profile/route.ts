import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma client
import { auth } from '@/auth';
import { calculateTargetCalories } from '@/lib/calculateCalories';

export async function GET() {
  // Retrieve the current session
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user data from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      weight: true,
      height: true,
      age: true,
      gender: true,
      activityLevel: true,
      // @ts-ignore - field exists in database but not in TypeScript definitions
      targetCalories: true,
      // @ts-ignore - field exists in database but not in TypeScript definitions
      goal: true,
    } as any,
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: NextRequest) {
  const session = await auth(); // Use your authentication method here
  const userId = session?.user?.id; // Get user ID from the session

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const { name, email, weight, height, age, gender, activityLevel, goal, targetCalories: providedTargetCalories, completeFlag } = data;

    // Parse numeric values
    const parsedWeight = weight ? parseFloat(weight) : null;
    const parsedHeight = height ? parseFloat(height) : null;
    const parsedAge = age ? parseInt(age) : null;
    
    // Check if user exists and get current data
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        weight: true,
        height: true,
        age: true,
        gender: true,
        activityLevel: true,
        // @ts-ignore - field exists in database but not in TypeScript definitions
        goal: true,
      } as any,
    }) as unknown as {
      weight: number | null;
      height: number | null;
      age: number | null;
      gender: string | null;
      activityLevel: string | null;
      goal: string | null;
    };
    
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Determine if we need to recalculate calories
    const metricsChanged = 
      (parsedWeight !== null && existingUser.weight !== null && parsedWeight !== existingUser.weight) ||
      (parsedHeight !== null && existingUser.height !== null && parsedHeight !== existingUser.height) ||
      (parsedAge !== null && existingUser.age !== null && parsedAge !== existingUser.age) ||
      (gender !== undefined && gender !== existingUser.gender) ||
      (activityLevel !== undefined && activityLevel !== existingUser.activityLevel) ||
      (goal !== undefined && goal !== existingUser.goal);
    
    // Calculate target calories if metrics changed and all required data is present
    let calculatedTargetCalories = providedTargetCalories ? parseInt(String(providedTargetCalories)) : null;
    
    if (metricsChanged && parsedWeight && parsedHeight && parsedAge && gender) {
      try {
        // Use the current values if not provided in the update
        const effectiveActivityLevel = activityLevel || existingUser.activityLevel;
        const effectiveGoal = goal || existingUser.goal || 'MAINTENANCE'; // Default to maintenance if no goal
        
        if (effectiveActivityLevel) {
          calculatedTargetCalories = calculateTargetCalories({
            weight: parsedWeight,
            height: parsedHeight,
            age: parsedAge,
            gender,
            activityLevel: effectiveActivityLevel,
            goal: effectiveGoal,
          });
        }
      } catch (error) {
        // Continue with the update even if calculation fails
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        name, 
        email, 
        weight: parsedWeight, 
        height: parsedHeight, 
        age: parsedAge, 
        gender,
        activityLevel,
        // @ts-ignore - field exists in database but not in TypeScript definitions
        goal,
        targetCalories: calculatedTargetCalories,
        completeFlag: completeFlag === true ? true : undefined, // Only set if explicitly true
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}