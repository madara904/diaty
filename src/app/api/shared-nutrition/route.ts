import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

// Define interfaces for our query results
interface SharedItem {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  carbUnits?: number;
  grams?: number;
  createdBy?: string;
  isVerified?: boolean;
  createdAt?: Date;
}

interface NutritionDataItem {
  name: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  frequency: number;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get parameters
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;
    
    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }
    
    // Validate prisma object
    if (!prisma) {
      console.error("Prisma client is undefined");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    // Since we can't directly access the model due to typing issues, use $queryRaw
    // Search the shared nutrition items table
    const sharedItems = await prisma.$queryRaw<SharedItem[]>`
      SELECT 
        id,
        name,
        calories,
        carbs,
        proteins,
        fats,
        "carbUnits",
        grams,
        "createdBy",
        "isVerified",
        "createdAt"
      FROM "shared_nutrition_items"
      WHERE 
        name ILIKE ${`%${query}%`}
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `;
    
    // Search for user's custom foods from their nutrition data
    const nutritionDataItems = await prisma.$queryRaw<NutritionDataItem[]>`
      SELECT 
        name, 
        calories, 
        carbs, 
        proteins, 
        fats, 
        COUNT(*) as frequency
      FROM "nutrition_data"
      WHERE 
        "userId" = ${session.user.id} AND
        name IS NOT NULL AND
        name ILIKE ${`%${query}%`}
      GROUP BY name, calories, carbs, proteins, fats
      ORDER BY frequency DESC
      LIMIT ${limit}
    `;
    
    // Convert grouped items to a standardized format
    const formattedResults = nutritionDataItems.map(item => ({
      id: `custom-${Buffer.from(item.name || "").toString('base64')}`, // Generate a stable ID
      name: item.name || "Unnamed Food",
      calories: parseFloat(item.calories.toString()),
      carbs: parseFloat(item.carbs.toString()),
      proteins: parseFloat(item.proteins.toString()),
      fats: parseFloat(item.fats.toString()),
      carbUnits: parseFloat(item.carbs.toString()) / 10,
      frequency: parseInt(item.frequency.toString()),
      grams: 100,
      isCustom: true, // Flag to indicate this is from user entries
    }));
    
    // Combine both result sets, prioritizing shared items
    const combinedResults = [
      ...sharedItems,
      ...formattedResults
    ];
    
    // Filter out duplicates (items might appear in both tables)
    const uniqueResults = combinedResults.filter((item, index, self) => 
      index === self.findIndex(t => t.name === item.name && 
        Math.abs(t.calories - item.calories) < 0.01 && 
        Math.abs(t.carbs - item.carbs) < 0.01 &&
        Math.abs(t.proteins - item.proteins) < 0.01 && 
        Math.abs(t.fats - item.fats) < 0.01
      )
    );
    
    return NextResponse.json(uniqueResults);
    
  } catch (error) {
    console.error("Error searching nutrition items:", error);
    return NextResponse.json(
      { error: "Failed to search nutrition items", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Endpoint to save an item to SharedNutritionItems for future use
export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Validate prisma object
    if (!prisma) {
      console.error("Prisma client is undefined");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }
    
    const body = await req.json();
    const { name, calories, carbs, proteins, fats } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Food name is required" }, { status: 400 });
    }
    
    // Create a new shared nutrition item using raw query to avoid model name issues
    await prisma.$executeRaw`
      INSERT INTO "shared_nutrition_items" 
        (id, name, calories, carbs, proteins, fats, "carbUnits", grams, "createdBy", "isVerified", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), ${name}, ${Number(calories) || 0}, ${Number(carbs) || 0}, ${Number(proteins) || 0}, 
         ${Number(fats) || 0}, ${Number(carbs) / 10 || 0}, 100, ${session.user.id}, false, now(), now())
    `;
    
    // Fetch the created item to return
    const createdItem = await prisma.$queryRaw<SharedItem[]>`
      SELECT * FROM "shared_nutrition_items"
      WHERE "createdBy" = ${session.user.id}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;
    
    return NextResponse.json(createdItem[0] || {});
    
  } catch (error) {
    console.error("Error creating shared nutrition item:", error);
    return NextResponse.json(
      { error: "Failed to create shared item", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 