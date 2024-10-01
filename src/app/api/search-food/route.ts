import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productName = searchParams.get("productName");

  if (!productName) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  try {
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1&page_size=10&sort_by=unique_scans_n`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Error fetching data from API" }, { status: response.status });
    }

    const data = await response.json();


    const validProducts = data.products?.filter((product: any) => {
      return product.product_name && product.image_url && !product.error; 
    }) || [];

    if (validProducts.length === 0) {
      return NextResponse.json({ error: "No valid products found" }, { status: 404 });
    }

    return NextResponse.json({ products: validProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
