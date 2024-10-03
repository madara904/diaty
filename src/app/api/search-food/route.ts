import { NextResponse } from "next/server";

// Simple in-memory cache
const cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

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

export async function GET(req: Request) {
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
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&page=${page}&page_size=${pageSize}&sort_by=unique_scans_n`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    const validProducts = data.products?.filter((product: any) => {
      return product.product_name && product.image_url && !product.error;
    }) || [];

    if (validProducts.length === 0) {
      return NextResponse.json({ error: "No valid products found" }, { status: 404 });
    }

    const result = {
      products: validProducts,
      page,
      totalPages: Math.ceil(data.count / pageSize),
      totalCount: data.count
    };

    setCache(cacheKey, result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching product data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}