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
    
    return NextResponse.json(userData?.plan || null);
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json({ 
      error: "Failed to fetch user plan" 
    }, { status: 500 });
  }
} 