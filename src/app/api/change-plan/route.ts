import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateOrCreatePlan } from '@/lib/planService'; // Import the helper function

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    const body = await req.json();
    const { plan } = body;

    if (!user || !plan) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (typeof user.email === 'string') {
      await updateOrCreatePlan(user.email, plan);
    } else {
      return NextResponse.json({ error: "Invalid user email" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}