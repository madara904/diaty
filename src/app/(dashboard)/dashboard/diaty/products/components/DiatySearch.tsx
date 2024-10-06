"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Filter, ChevronLeft, ChevronRight, Grid, List, MoreHorizontal, EllipsisVertical, Eye, PlusCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ProductModal from "./ProductModal"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Skeleton } from "@/app/components/ui/skeleton"
import React from "react"
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip"
import { useBodyScrollLock } from "@/app/components/hooks/use-body-scroll-lock"
import { Badge } from "@/app/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"

const DiatySearch = () => {
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

  useBodyScrollLock(!!selectedProduct)

  const filterOptions = [
    { id: "organic", label: "Organic", icon: "🌿" },
    { id: "gluten", label: "Gluten-Free", icon: "🌾" },
    { id: "vegan", label: "Vegan", icon: "🥬" },
    { id: "vegetarian", label: "Vegetarian", icon: "🥕" },
    { id: "low_sugars", label: "Low Sugar", icon: "🍬" },
    { id: "low_fat", label: "Low Fat", icon: "💪" },
  ];

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
      setTotalPages(data.totalPages)
      console.log(data)
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
      return activeFilters.every(filter => {
        if (filter === 'low_sugars') {
          return product.nutriments && product.nutriments.sugars_100g < 5
        }
        if (filter === 'low_fat') {
          return product.nutriments && product.nutriments.fat_100g < 3
        }
        return product[filter] === 1 || product.labels?.toLowerCase().includes(filter)
      })
    })

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortOption === "name_asc") return a.product_name.localeCompare(b.product_name)
      if (sortOption === "name_desc") return b.product_name.localeCompare(a.product_name)
      return 0
    })

    setFilteredProducts(sorted)
  }, [products, sortOption, activeFilters])

  const handlePageChange = (newPage: number) => {
    setIsLoading(true)
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

  const renderTags = (product: any) => {
    const tags = []
    if (product.organic === 1) tags.push("Organic")
    if (product.labels?.toLowerCase().includes("gluten")) tags.push("Gluten-Free")
    if (product.labels?.toLowerCase().includes("vegan")) tags.push("Vegan")
    if (product.labels?.toLowerCase().includes("vegetarian")) tags.push("Vegetarian")

    const sugarThreshold = 5;
    const fatThreshold = 3;

    const isSnackFood = product.categories?.toLowerCase().includes("chips") ||
      product.categories?.toLowerCase().includes("snack") ||
      product.categories?.toLowerCase().includes("fries") || 
      product.categories?.toLowerCase().includes("burger")
    if (!isSnackFood && product.nutriments?.sugars_100g !== undefined && product.nutriments.sugars_100g < sugarThreshold) {
      tags.push("Low Sugar");
    }
    if (!isSnackFood && product.nutriments?.fat_100g !== undefined && product.nutriments.fat_100g < fatThreshold) {
      tags.push("Low Fat");
    }
    return tags
  }

  const renderProductActions = (product: any) => (
    <div className="flex justify-end">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleProductClick(product.product_name)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Intake
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )

  const renderSkeletonLoader = () => {
    if (viewMode === "tile") {
      return (
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
      )
    } else {
      return (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(8)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-16 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }
  }

  return (
    <div className="px-4 mt-24 mb-6">
      <div className="p-8 rounded-lg hover:shadow-sm mb-12 text-foreground">
        <h1 className="text-4xl font-bold mb-4 text-center">Discover Healthy Foods</h1>
        <p className="text-foreground/70 text-center mb-8">Search, explore, and learn about nutritious options for your diet</p>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex sm:space-x-2 flex-col space-y-5 sm:flex-row sm:space-y-0">
            <div className="relative sm:flex-grow">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-2 w-full bg-background text-foreground"
                placeholder="Search for a food item"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/70 w-full sm:w-min">
              Search
            </Button>
          </div>
        </form>
      </div>

      {products.length > 0 && (
        <ScrollArea className="">
          <div className="flex justify-center space-x-2 p-2">
            {filterOptions.map((filter) => (
              <TooltipProvider key={filter.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => toggleFilter(filter.id)}
                      variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                      className="rounded-full text-xs py-1 px-3 h-auto"
                    >
                      {filter.icon} {filter.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter by {filter.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {filteredProducts.length > 0 && (
        <div className="flex flex-col-reverse justify-around sm:flex-row sm:justify-between sm:items-center mb-6 space-x-2 sm:space-x-0">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {filteredProducts.length} results
          </p>
          <div className="flex items-center justify-center sm:justify-start space-x-4">
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
          renderSkeletonLoader()
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
                    className="hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                  >
                    <CardHeader className="p-0">
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={product.image_url || "/placeholder.svg?height=200&width=300"}
                          alt={product.product_name}
                          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-lg font-bold truncate mr-2">{product.product_name}</CardTitle>
                        {renderProductActions(product)}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.brands}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-wrap gap-1">
                      {renderTags(product).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <Table className="mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: any) => (
                    <TableRow key={product.code}>
                      <TableCell>
                        <Image
                          src={product.image_url || "/placeholder.svg?height=64&width=64"}
                          alt={product.product_name}
                          width={64}
                          height={64}
                          className="object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.brands}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {renderTags(product).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderProductActions(product)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">No products found.</div>
        )}
      </AnimatePresence>

      {filteredProducts.length > 0 && !isLoading && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            variant="ghost"
          >
            <ChevronLeft className="mr-2" /> Previous
          </Button>
          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            variant="ghost"
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      )}

      {selectedProduct && (
        <ProductModal productName={selectedProduct} onClose={closeModal} />
      )}
    </div>
  )
}

export default DiatySearch