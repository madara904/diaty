"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Filter, ChevronLeft, ChevronRight, Grid, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ProductModal from "./products/components/ProductModal"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Skeleton } from "@/app/components/ui/skeleton"
import React from "react"
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area"

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState("relevance")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"tile" | "table">("tile")
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedProduct = searchParams.get("product")

  const filterOptions = [
    { id: "organic", label: "Organic" },
    { id: "gluten_free", label: "Gluten-Free" },
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "low_sugar", label: "Low Sugar" },
    { id: "low_fat", label: "Low Fat" },
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setCurrentPage(1)
    await fetchProducts(1)
  }

  const fetchProducts = async (page: number) => {
    const res = await fetch(`/api/search-food?productName=${encodeURIComponent(searchTerm)}&page=${page}`)
    const data = await res.json()
    if (res.ok) {
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
      setTotalPages(data.totalPages)
    }
    setIsLoading(false)
  }

  const handleProductClick = (productName: string) => {
    router.push(`?product=${encodeURIComponent(productName)}`)
  }

  const closeModal = () => {
    router.push(window.location.pathname)
  }

  useEffect(() => {
    const filtered = products.filter((product: any) => {
      return activeFilters.every(filter => product[filter])
    })

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortOption === "name_asc") return a.product_name.localeCompare(b.product_name)
      if (sortOption === "name_desc") return b.product_name.localeCompare(a.product_name)
      return 0
    })

    setFilteredProducts(sorted)
  }, [products, sortOption, activeFilters])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchProducts(newPage)
  }

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    )
  }

  return (
    <div className="px-4 py-8 mt-24">
      <div className="bg-gradient-to-r from-primary to-primary-foreground p-8 rounded-lg shadow-lg mb-12">
        <h1 className="text-4xl font-bold mb-4 text-background text-center">Discover Healthy Foods</h1>
        <p className="text-background text-center mb-8">Search, explore, and learn about nutritious options for your diet</p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-background text-foreground"
                placeholder="Search for a food item"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            </div>
            <Button type="submit" className="bg-background hover:bg-background/90">
              Search
            </Button>
          </div>
        </form>
      </div>

      <ScrollArea className="w-full whitespace-nowrap mb-6">
        <div className="flex w-max space-x-2 p-2">
          {filterOptions.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              variant={activeFilters.includes(filter.id) ? "default" : "outline"}
              className="rounded-full text-xs py-1 px-3 h-auto"
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {filteredProducts.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Showing {filteredProducts.length} results</p>
          <div className="flex items-center space-x-4">
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
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "tile" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("tile")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <>
            {viewMode === "tile" ? (
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
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder.svg?height=200&width=300"}
                          alt={product.product_name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                        <Button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" variant="secondary">
                          View Details
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2">{product.product_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.brands}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.is_organic && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Organic
                          </span>
                        )}
                        {product.is_gluten_free && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Gluten-Free
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: any) => (
                    <TableRow key={product.code} onClick={() => handleProductClick(product.product_name)} className="cursor-pointer hover:bg-muted">
                      <TableCell>
                        <img
                          src={product.image_url || "/placeholder.svg?height=50&width=50"}
                          alt={product.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.brands}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {product.is_organic && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Organic
                            </span>
                          )}
                          {product.is_gluten_free && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Gluten-Free
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-8 flex justify-center items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-xl text-muted-foreground">No food items found. Try adjusting your search or filters.</p>
            </motion.div>
          )
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
              <ProductModal productName={selectedProduct} onClose={closeModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchPage