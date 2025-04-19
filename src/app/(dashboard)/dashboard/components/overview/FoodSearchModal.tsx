"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Search, Plus, X, Utensils, ArrowLeft, Loader2, Edit, Trash } from "lucide-react"
import { format } from "date-fns"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/app/components/ui/dialog"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/app/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/app/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { useToast } from "@/app/components/hooks/use-toast"
import { foodIntakeSchema, searchFoodSchema, FoodIntakeFormData } from "@/lib/validators/food-intake"
import useSWR, { mutate } from "swr"

interface FoodSearchModalProps {
  isOpen: boolean
  onClose: () => void
  currentDate: Date
  onFoodAdded: () => void
  defaultMealType?: "BREAKFAST" | "LUNCH" | "DINNER"
}

interface OpenFoodProduct {
  product_name: string
  nutriments: {
    "energy-kcal_100g"?: number
    "energy-kcal"?: number
    energy?: number
    carbohydrates_100g?: number
    carbohydrates?: number
    proteins_100g?: number
    proteins?: number
    fat_100g?: number
    fat?: number
  }
  image_url?: string
}

interface SavedFoodItem {
  id: string
  name: string
  calories: number
  carbs: number
  proteins: number
  fats: number
  mealType: string
  date: string
  createdAt: string
  isVerified: boolean
  isUserData: boolean
  isOtherUserData: boolean
}

export default function FoodSearchModal({ 
  isOpen, 
  onClose, 
  currentDate,
  onFoodAdded,
  defaultMealType = "BREAKFAST"
}: FoodSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openFoodResults, setOpenFoodResults] = useState<OpenFoodProduct[]>([])
  const [savedFoodResults, setSavedFoodResults] = useState<SavedFoodItem[]>([])
  const [selectedFood, setSelectedFood] = useState<OpenFoodProduct | SavedFoodItem | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [grams, setGrams] = useState(100)
  const [view, setView] = useState<"search" | "detail" | "custom" | "edit">("search")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Use SWR for fetching recent food items
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const recentItemsUrl = `/api/nutrition-data/recent?limit=10&date=${formattedDate}`;
  
  const { data: recentItems, isLoading: isLoadingRecent } = useSWR(
    isOpen ? recentItemsUrl : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch recent items');
      }
      return response.json();
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Initialize form with default values
  const form = useForm<FoodIntakeFormData>({
    resolver: zodResolver(foodIntakeSchema),
    defaultValues: {
      name: "",
      calories: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
      mealType: defaultMealType,
      date: format(currentDate, "yyyy-MM-dd"),
    },
  })

  // Handle searching for foods
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    try {
      // Search OpenFood API
      const openFoodRes = await fetch(`/api/search-food?productName=${encodeURIComponent(searchQuery)}`)
      const openFoodData = await openFoodRes.json()
      
      if (openFoodRes.ok && openFoodData.products) {
        setOpenFoodResults(openFoodData.products)
      } else {
        setOpenFoodResults([])
      }
      
      // Search saved foods in our database
      const savedFoodRes = await fetch(`/api/shared-nutrition?query=${encodeURIComponent(searchQuery)}`)
      const savedFoodData = await savedFoodRes.json()
      
      if (savedFoodRes.ok) {
        setSavedFoodResults(savedFoodData)
      } else {
        setSavedFoodResults([])
      }
      
      // Removed all toast notifications related to searching
    } catch (err) {
      console.error("Error searching for food:", err)
      // Removed toast notification for search errors
    } finally {
      setIsSearching(false)
    }
  }
  
  // Calculate nutrition based on grams
  const calculateNutrition = (value: number | undefined) => {
    return value ? ((value / 100) * grams).toFixed(1) : "0"
  }
  
  // Handle selecting a food item from search results
  const handleSelectFood = (food: OpenFoodProduct | SavedFoodItem) => {
    setSelectedFood(food)
    setView("detail")
    
    if ('product_name' in food) {
      // OpenFood product
      const calories = food.nutriments["energy-kcal_100g"] || 
                       food.nutriments["energy-kcal"] || 
                       (food.nutriments.energy ? food.nutriments.energy / 4.184 : 0)
      
      const carbs = food.nutriments.carbohydrates_100g || food.nutriments.carbohydrates || 0
      const proteins = food.nutriments.proteins_100g || food.nutriments.proteins || 0
      const fats = food.nutriments.fat_100g || food.nutriments.fat || 0
      
      form.setValue("name", food.product_name)
      form.setValue("calories", parseFloat(calculateNutrition(calories)))
      form.setValue("carbs", parseFloat(calculateNutrition(carbs)))
      form.setValue("proteins", parseFloat(calculateNutrition(proteins)))
      form.setValue("fats", parseFloat(calculateNutrition(fats)))
      // Always use the defaultMealType
      form.setValue("mealType", defaultMealType)
    } else {
      // Saved food item
      form.setValue("name", food.name)
      form.setValue("calories", parseFloat(calculateNutrition(food.calories)))
      form.setValue("carbs", parseFloat(calculateNutrition(food.carbs)))
      form.setValue("proteins", parseFloat(calculateNutrition(food.proteins)))
      form.setValue("fats", parseFloat(calculateNutrition(food.fats)))
      // Always use the defaultMealType
      form.setValue("mealType", defaultMealType)
    }
  }
  
  // Handle adding a custom food
  const showCustomFoodForm = () => {
    setView("custom")
    form.reset({
      name: "",
      calories: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
      mealType: defaultMealType,
      date: format(currentDate, "yyyy-MM-dd"),
    })
  }
  
  // Handle editing a food item
  const handleEditFood = (item: SavedFoodItem) => {
    setEditingItemId(item.id)
    setView("edit")
    
    // Set form values with the item's data, but use currentDate for consistency
    form.reset({
      name: item.name,
      calories: item.calories,
      carbs: item.carbs,
      proteins: item.proteins,
      fats: item.fats,
      mealType: defaultMealType,
      date: format(currentDate, "yyyy-MM-dd"),
    })
  }

  // Handle deleting a food item
  const handleDeleteFood = async (id: string) => {
    try {
      const response = await fetch(`/api/nutrition-data/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete food item")
      }
      
      toast({
        title: "Success",
        description: "Food item deleted successfully",
      })
      
      // Revalidate data with SWR
      mutate(recentItemsUrl);
      
      // Call the onFoodAdded callback to refresh the dashboard
      onFoodAdded()
      
    } catch (error) {
      console.error("Error deleting food item:", error)
      toast({
        title: "Error",
        description: "Failed to delete food item",
        variant: "destructive",
      })
    }
  }
  
  // Handle form submission to add food intake
  const onSubmit = async (data: FoodIntakeFormData) => {
    setIsSubmitting(true)
    try {
      // If we're editing, use PUT request to update the item
      if (view === "edit" && editingItemId) {
        const response = await fetch(`/api/nutrition-data/${editingItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        
        if (!response.ok) {
          throw new Error("Failed to update food item")
        }
        
        toast({
          title: "Success",
          description: "Food item updated successfully",
        })
      } else {
        // Otherwise, create a new item
        const response = await fetch("/api/nutrition-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        
        if (!response.ok) {
          throw new Error("Failed to add food intake")
        }
        
        toast({
          title: "Success",
          description: "Food added to your intake",
        })
      }
      
      // Reset the form and close the modal
      form.reset()
      
      // Revalidate SWR cache
      mutate(recentItemsUrl);
      
      // Always call onFoodAdded to refresh the dashboard
      onFoodAdded()
      onClose()
    } catch (error) {
      console.error("Error with food intake:", error)
      toast({
        title: "Error",
        description: view === "edit" ? "Failed to update food item" : "Failed to add food intake",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Update nutrition values when grams change
  useEffect(() => {
    if (selectedFood && view === "detail") {
      if ('product_name' in selectedFood) {
        // OpenFood product
        const calories = selectedFood.nutriments["energy-kcal_100g"] || 
                         selectedFood.nutriments["energy-kcal"] || 
                         (selectedFood.nutriments.energy ? selectedFood.nutriments.energy / 4.184 : 0)
        
        const carbs = selectedFood.nutriments.carbohydrates_100g || selectedFood.nutriments.carbohydrates || 0
        const proteins = selectedFood.nutriments.proteins_100g || selectedFood.nutriments.proteins || 0
        const fats = selectedFood.nutriments.fat_100g || selectedFood.nutriments.fat || 0
        
        form.setValue("calories", parseFloat(calculateNutrition(calories)))
        form.setValue("carbs", parseFloat(calculateNutrition(carbs)))
        form.setValue("proteins", parseFloat(calculateNutrition(proteins)))
        form.setValue("fats", parseFloat(calculateNutrition(fats)))
      } else {
        // Saved food item
        form.setValue("calories", parseFloat(calculateNutrition(selectedFood.calories)))
        form.setValue("carbs", parseFloat(calculateNutrition(selectedFood.carbs)))
        form.setValue("proteins", parseFloat(calculateNutrition(selectedFood.proteins)))
        form.setValue("fats", parseFloat(calculateNutrition(selectedFood.fats)))
      }
    }
  }, [grams, selectedFood, view, form])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setView("search")
      setSearchQuery("")
      setSelectedFood(null)
      setGrams(100)
    }
  }, [isOpen])

  // When form values change (e.g., when switching forms), ensure date is updated
  useEffect(() => {
    // Update the date field whenever the currentDate prop changes
    form.setValue("date", format(currentDate, "yyyy-MM-dd"));
    
    // Revalidate the recent items data when the date changes
    if (isOpen) {
      mutate(recentItemsUrl);
    }
  }, [currentDate, form, recentItemsUrl, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {view === "search" && (
          <>
            <DialogHeader>
              <DialogTitle>Add Food Intake</DialogTitle>
              <DialogDescription>
                Search for food or add a custom entry.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </form>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={showCustomFoodForm}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Food
                </Button>
              </div>
              
              {/* Recent Items (always shown) */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Recently Added</h3>
                {isLoadingRecent ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : recentItems && recentItems.length > 0 ? (
                  <div className="space-y-2">
                    {recentItems.map((item: SavedFoodItem) => (
                      <Card key={item.id} className="hover:bg-accent/50 transition-colors">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="cursor-pointer" onClick={() => handleSelectFood(item)}>
                              <h4 className="font-medium">{item.name || "Unnamed Food"}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.calories} kcal • {format(new Date(item.date), "MMM d")}
                              </p>
                              <Badge variant="outline" className="mt-1">
                                {item.mealType.charAt(0) + item.mealType.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditFood(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFood(item.id);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleSelectFood(item)}>
                                Select
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Your recently added foods will appear here.
                  </p>
                )}
              </div>
              
              {/* Search Results (shown only when searching) */}
              {isSearching ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {searchQuery && (
                    <>
                      {openFoodResults.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Search Results - External Foods</h3>
                          {openFoodResults.slice(0, 5).map((product, index) => (
                            <Card key={`open-${index}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
                              <CardContent className="p-3" onClick={() => handleSelectFood(product)}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{product.product_name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {product.nutriments["energy-kcal_100g"] || 
                                      product.nutriments["energy-kcal"] || 
                                      (product.nutriments.energy ? (product.nutriments.energy / 4.184).toFixed(0) : 0)} kcal/100g
                                    </p>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    Select
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      {savedFoodResults.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Search Results - Saved Foods</h3>
                          {savedFoodResults.map((item, idx) => (
                            <Card key={`saved-${idx}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
                              <CardContent className="p-3" onClick={() => handleSelectFood(item)}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {item.calories} kcal | {item.carbs}g C | {item.proteins}g P | {item.fats}g F
                                    </p>
                                    <div className="flex gap-1 mt-1">
                                      {item.isVerified && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                          Verified
                                        </Badge>
                                      )}
                                      {item.isUserData && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          Your Food
                                        </Badge>
                                      )}
                                      {item.isOtherUserData && (
                                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                          Community
                                        </Badge>
                                      )}
                                      {!item.isUserData && !item.isOtherUserData && !item.isVerified && (
                                        <Badge variant="outline">
                                          Database
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button size="sm" variant="ghost">
                                    Select
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      {openFoodResults.length === 0 && savedFoodResults.length === 0 && (
                        <div className="py-8 text-center">
                          <p className="text-muted-foreground">No results found</p>
                          <Button variant="link" onClick={showCustomFoodForm}>
                            Add as a custom food
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
        
        {view === "detail" && selectedFood && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setView("search")}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>
                    {'product_name' in selectedFood 
                      ? selectedFood.product_name 
                      : selectedFood.name}
                  </DialogTitle>
                  <Badge className="mt-1">
                    Adding to {defaultMealType.charAt(0) + defaultMealType.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Serving Size (g)</Label>
                  <Input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(parseInt(e.target.value) || 100)}
                    min={1}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="proteins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proteins (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fats (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Food'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        
        {view === "custom" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setView("search")}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Add Custom Food</DialogTitle>
                  <Badge className="mt-1">
                    Adding to {defaultMealType.charAt(0) + defaultMealType.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., Chicken Salad" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="proteins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proteins (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fats (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add to Tracker'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
        
        {view === "edit" && (
          <>
            <DialogHeader>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => setView("search")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Edit Food</DialogTitle>
                  <div className="flex items-center gap-2">
                    <DialogDescription>
                      Update the food information.
                    </DialogDescription>
                    <Badge className="mt-1">
                      {defaultMealType.charAt(0) + defaultMealType.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="proteins"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proteins (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fats (g)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} step={0.1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Update Food'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 