"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Heart, AlertCircle } from "lucide-react"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import { Badge } from "@/app/components/ui/badge"
import Image from "next/image"

interface ProductModalProps {
  productName: string
  onClose: () => void
}

interface Product {
  allergens_tags: any
  product_name: string
  image_url: string
  image_small_url: string
  image_thumb_url: string
  nutriments: {
    [key: string]: number
    proteins: number
    carbohydrates: number
    fat: number
    "energy-kcal": number
  }
  allergen: string
  categories?: string
  labels?: string
  organic?: number
}

const ProductModal = ({ productName, onClose }: ProductModalProps) => {
  const [productData, setProductData] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [grams, setGrams] = useState<number>(100)

  const renderTags = (product: Product) => {
    const tags = []
    if (product.organic === 1) tags.push("Organic")
    if (product.labels?.toLowerCase().includes("gluten")) tags.push("Gluten-Free")
    if (product.labels?.toLowerCase().includes("vegan")) tags.push("Vegan")
    if (product.labels?.toLowerCase().includes("vegetarian")) tags.push("Vegetarian")

    const sugarThreshold = 3;
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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/search-food?productName=${encodeURIComponent(productName)}`)
        const data = await res.json()
        if (res.ok && data.products.length > 0) {
          setProductData(data.products[0])
        } else {
          throw new Error(data.error || "Failed to fetch product data")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }
    if (productName) {
      fetchProduct()
    }
  }, [productName])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  const calculateNutrition = (nutrientValue: number) => {
    return ((nutrientValue / 100) * grams).toFixed(1) || "0"
  }

  const featuredRecipes = [
    { id: "1", title: "Healthy Salad", image: "/placeholder.svg?height=128&width=256" },
    { id: "2", title: "Fruit Smoothie", image: "/placeholder.svg?height=128&width=256" },
    { id: "3", title: "Veggie Wrap", image: "/placeholder.svg?height=128&width=256" },
  ]

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
      >
        <div className="max-w-4xl sm:max-w-7xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={onClose} className="mb-8">
            <ChevronLeft size={32} className="mr-4" />
            <span className="font-semibold text-xl">Back</span>
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
    >
      <div className="max-w-4xl sm:max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onClose} className="mb-8">
          <ChevronLeft size={32} className="mr-4" />
          <span className="font-semibold text-xl">Back</span>
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          productData && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={productData.image_url}
                      alt={productData.product_name}
                      height={300}
                      width={300}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold mb-4">{productData.product_name}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                  </div>
                  <div className="mb-6">
                    <label htmlFor="grams" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Serving size (grams):
                    </label>
                    <Input
                      type="number"
                      id="grams"
                      value={grams}
                      onChange={(e) => setGrams(Math.max(1, Number(e.target.value)))}
                      min="1"
                      className="w-32"
                    />
                  </div>
                  <Tabs defaultValue="nutrition" className="w-full">
                    <TabsList>
                      <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                      <TabsTrigger value="allergens">Allergens & Dietary Info</TabsTrigger>
                    </TabsList>
                    <TabsContent value="nutrition" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Nutritional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Calories</span>
                              <span>{calculateNutrition(productData.nutriments["energy-kcal"]) || "0"} kcal</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Proteins</span>
                              <span>{calculateNutrition(productData.nutriments.proteins) || "0"} g</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Carbs</span>
                              <span>{calculateNutrition(productData.nutriments.carbohydrates) || "0"} g</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Fats</span>
                              <span>{calculateNutrition(productData.nutriments.fat) || "0"} g</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-bold">Carbohydrate Units</span>
                              <span className="font-semibold text-red-500">
                                {(Number(calculateNutrition(productData.nutriments.carbohydrates)) / 10).toFixed(1) || "0"} KE
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="allergens" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Allergens & Dietary Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <h3 className="font-semibold mb-2">Allergens:</h3>
                          {productData?.allergens_tags && productData?.allergens_tags.length > 0 ? (
                            <ul>
                              {productData?.allergens_tags.map((allergen: string, index: number) => (
                                <li key={index}>{allergen.replace('en:', '')}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>No allergen information available</p>
                          )}
                          <h3 className="font-semibold mt-4 mb-2">Dietary Tags:</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {renderTags(productData).map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Featured Recipes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {featuredRecipes.map((recipe) => (
                    <Card key={recipe.id}>
                      <div className="aspect-video overflow-hidden">
                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      </div>
                      <CardContent>
                        <h4 className="font-semibold">{recipe.title}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </motion.div>
  )
}

export default ProductModal