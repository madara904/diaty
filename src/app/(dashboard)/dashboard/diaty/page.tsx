"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductModal from "./products/components/ProductModal";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("relevance");
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedProduct = searchParams.get("product");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/search-food?productName=${encodeURIComponent(searchTerm)}`);
    const data = await res.json();
    if (res.ok) {
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    }
  };

  const handleProductClick = (productName: string) => {
    router.push(`?product=${productName}`);
  };

  const closeModal = () => {
    router.push(window.location.pathname);
  };

  useEffect(() => {
    const filtered = products.filter((product: any) => {
      return true; // Adjust filtering logic if needed
    });

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortOption === "name_asc") return a.product_name.localeCompare(b.product_name);
      if (sortOption === "name_desc") return b.product_name.localeCompare(a.product_name);
      return 0;
    });

    setFilteredProducts(sorted);
  }, [products, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-24">
      <div className="bg-gradient-to-r from-[#00ffa3] to-[#00cc82] p-8 rounded-lg shadow-lg mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white text-center">Discover Healthy Foods</h1>
        <p className="text-white text-center mb-8">Search, explore, and learn about nutritious options for your diet</p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-white text-gray-800"
                placeholder="Search for a product"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
              Search
            </Button>
          </div>
        </form>
      </div>

      {filteredProducts.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Showing {filteredProducts.length} results</p>
          <Select onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <AnimatePresence>
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product: any) => (
              <Card
                key={product.code}
                onClick={() => handleProductClick(product.product_name)}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <CardHeader className="p-0 relative">
                  <img
                    src={product.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={product.product_name}
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-95"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" variant="secondary">
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.product_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.brands}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <Button onClick={closeModal} className="absolute top-4 right-4 z-10" variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
              <ProductModal productName={selectedProduct} onClose={closeModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPage;
