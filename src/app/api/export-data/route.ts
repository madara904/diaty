import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get format from query parameter
    const format = req.nextUrl.searchParams.get("format") || "json";
    
    // Get user ID from session
    const userId = user.id;

    // Fetch all user data
    const userData = await fetchUserData(userId);

    // Return data in requested format
    if (format === "csv") {
      const csvData = convertToCSV(userData);
      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=diaty-export-${new Date().toISOString().split("T")[0]}.csv`,
        },
      });
    } else {
      // Default to JSON
      return new NextResponse(JSON.stringify(userData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename=diaty-export-${new Date().toISOString().split("T")[0]}.json`,
        },
      });
    }
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

async function fetchUserData(userId: string) {
  // Fetch user profile
  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      weight: true,
      height: true,
      age: true,
      gender: true,
    },
  });

  // Fetch nutrition data
  const nutritionData = await prisma.nutritionData.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  // Return combined data
  return {
    profile: userProfile,
    nutritionData,
    exportDate: new Date().toISOString(),
  };
}

function convertToCSV(data: any) {
  // Extract nutrition data for CSV
  const nutritionData = data.nutritionData || [];
  
  if (nutritionData.length === 0) {
    return "No data available";
  }
  
  // Get headers from first item
  const headers = Object.keys(nutritionData[0]).join(",");
  
  // Convert each row to CSV
  const rows = nutritionData.map((item: any) => {
    return Object.values(item)
      .map((value: any) => {
        // Handle different value types
        if (value === null || value === undefined) return "";
        if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
        if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        return value;
      })
      .join(",");
  });
  
  // Combine headers and rows
  return [headers, ...rows].join("\n");
}
