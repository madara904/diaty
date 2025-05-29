import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Cache for search results
const cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

function getCacheKey(productName: string, page: number): string {
  return `${productName}-${page}`;
}

function getFromCache(key: string): any | null {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache[key] = { data, timestamp: Date.now() };
}

function formatNutriments(nutriments: any) {
  return {
    "energy-kcal_100g": nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || (nutriments.energy ? nutriments.energy / 4.184 : 0),
    "carbohydrates_100g": nutriments["carbohydrates_100g"] || nutriments.carbohydrates || 0,
    "proteins_100g": nutriments["proteins_100g"] || nutriments.proteins || 0,
    "fat_100g": nutriments["fat_100g"] || nutriments.fat || 0
  };
}

// Mock database as fallback
const mockFoodDatabase = [
  {
    product_name: "Nutella Hazelnut Spread",
    nutriments: {
      "energy-kcal_100g": 539,
      "carbohydrates_100g": 57.5,
      "proteins_100g": 6.3,
      "fat_100g": 30.9,
    },
    image_url: "https://images.openfoodfacts.org/images/products/301/762/042/2004/front_en.3.400.jpg",
    brand: "Ferrero"
  },
  // Add more mock items as needed
];

export async function GET(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productName = searchParams.get("productName");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  if (!productName) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const cacheKey = getCacheKey(productName, page);
  const cachedData = getFromCache(cacheKey);

  if (cachedData) {
    return NextResponse.json(cachedData, { status: 200 });
  }

  try {
    // Use the v1 API for strict search with correct params and sorting
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}&sort_by=unique_scans_n`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'DiatyApp/1.0 (beray@diaty.app)'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const searchTerm = productName.toLowerCase();

    let validProducts: any[] = [];
    if (Array.isArray(data.products)) {
      validProducts = data.products.map((product: any) => {
        try {
          // Defensive: skip if no product_name
          if (!product.product_name) return null;
          // Defensive: skip if no nutriments
          if (!product.nutriments || typeof product.nutriments !== 'object') return null;
          // Check if product name or brand includes the search term
          const name = product.product_name?.toLowerCase() || "";
          const brand = product.brands?.toLowerCase() || "";
          const hasValidNutrients = (
            product.nutriments["energy-kcal"] ||
            product.nutriments["energy-kcal_100g"] ||
            product.nutriments.energy ||
            product.nutriments.carbohydrates ||
            product.nutriments["carbohydrates_100g"] ||
            product.nutriments.proteins ||
            product.nutriments["proteins_100g"] ||
            product.nutriments.fat ||
            product.nutriments["fat_100g"]
          );
          if (
            (name.includes(searchTerm) || brand.includes(searchTerm)) &&
            !product.error &&
            hasValidNutrients
          ) {
            return {
              product_name: product.product_name,
              brand: product.brands,
              image_url: product.image_url || product.image_front_small_url,
              nutriments: formatNutriments(product.nutriments || {})
            };
          }
          return null;
        } catch (err) {
          console.error("Error processing product:", product, err);
          return null;
        }
      }).filter(Boolean);
    }

    // If no valid products, return empty array with 200
    const result = {
      products: validProducts,
      page,
      totalPages: Math.ceil(data.count / pageSize),
      totalCount: data.count
    };
    setCache(cacheKey, result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product data:", error);
    return NextResponse.json({ error: "Something went wrong", details: error?.message || error }, { status: 500 });
  }
}
