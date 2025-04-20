import { auth } from '@/auth';
import prisma from './prisma'; // Prisma client

export async function getUserData() {
  const session = await auth();

  const image = session?.user?.image

  if (!session || !session.user?.email) {
    throw new Error('Unauthorized');
  }

  // Use type assertion to work around TypeScript errors
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
      goal: true,
    } as any,
  }) as unknown as {
    name: string | null;
    email: string | null;
    weight: number | null;
    height: number | null;
    age: number | null;
    gender: string | null;
    activityLevel: string | null;
    goal: string | null;
  };

  if (!user) {
    throw new Error('User not found');
  }
  
  // Use type assertion to handle the goal field
  return {
    ...user,
    image,
    // Use the correct enum values from the database
    gender: user.gender as "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null,
    activityLevel: user.activityLevel as "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE" | null,
    goal: user.goal as "WEIGHT_LOSS" | "WEIGHT_GAIN" | "MAINTENANCE" | "MUSCLE_GAIN" | null,
  }
}