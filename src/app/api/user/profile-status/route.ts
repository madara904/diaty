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
      select: { completeFlag: true },
    });
    
    return NextResponse.json({ 
      completed: !!userData?.completeFlag 
    });
  } catch (error) {
    console.error("Error checking profile status:", error);
    return NextResponse.json({ 
      error: "Failed to check profile status" 
    }, { status: 500 });
  }
} 