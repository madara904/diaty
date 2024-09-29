import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma client
import { auth } from '@/auth';

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
    },
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

  const data = await request.json();
  const { name, email, weight, height, age, gender } = data;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, weight: parseFloat(weight), height: parseFloat(height), age: parseInt(age), gender },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error || "Error updating user" }, { status: 500 });
  }
}