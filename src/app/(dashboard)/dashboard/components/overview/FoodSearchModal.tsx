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
  brand?: string
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

// Update the view type definition
type ViewType = "search" | "detail" | "custom" | "edit";

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
  const [view, setView] = useState<ViewType>("search")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchError, setSearchError] = useState("")
  const { toast } = useToast()
  const [communityResults, setCommunityResults] = useState<SavedFoodItem[]>([])
  const [showSuccess, setShowSuccess] = useState(false);
  
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
      dedupingInterval: 60000, // 1 minute
      revalidateIfStale: false,
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

  const fetchOpenFoodFacts = async (query: string) => {
    const response = await fetch(`/api/search-food?productName=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.products || [];
  };

  const fetchCommunityFoods = async (query: string) => {
    const response = await fetch(`/api/shared-nutrition?query=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

  // Handle searching for foods
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setOpenFoodResults([]);
    setCommunityResults([]);
    setSearchError("");

    try {
      const [openFoodData, communityData] = await Promise.all([
        fetchOpenFoodFacts(searchQuery),
        fetchCommunityFoods(searchQuery),
      ]);

      setOpenFoodResults(openFoodData);
      setCommunityResults(communityData);

      if (openFoodData.length === 0 && communityData.length === 0) {
        setSearchError("No results found.");
      }
    } catch (err) {
      setSearchError("An error occurred while searching.");
      setOpenFoodResults([]);
      setCommunityResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Calculate nutrition based on grams
  const calculateNutrition = (value: number | undefined) => {
    return value ? ((value / 100) * grams).toFixed(1) : "0"
  }
  
  // Handle selecting a food item from search results
  const handleSelectFood = (food: OpenFoodProduct | SavedFoodItem) => {
    setSelectedFood(food)
    setView("detail")
    setGrams(100)
    
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
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setView("search");
        setSearchQuery("");
        setSelectedFood(null);
        setGrams(100);
        form.reset({
          name: "",
          calories: 0,
          carbs: 0,
          proteins: 0,
          fats: 0,
          mealType: defaultMealType,
          date: format(currentDate, "yyyy-MM-dd"),
        });
        onFoodAdded();
      }, 1200);
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
      console.log("Fetching saved items for date:", formattedDate);
    }
  }, [currentDate, form, isOpen, recentItemsUrl, mutate, formattedDate]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <div className="overflow-y-auto flex-1 p-6">
          {view === "search" && (
            <>
              <DialogHeader className="mb-4">
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
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
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
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
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
                                <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                                  {item.mealType.charAt(0) + item.mealType.slice(1).toLowerCase()}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleEditFood(item)} className="hover:bg-accent">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFood(item.id);
                                  }}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleSelectFood(item)}
                                  className="text-emerald-600 border-emerald-300 hover:bg-accent/50 transition-colors"
                                >
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
                <div className="mt-4">
                  {searchQuery && (
                    <>
                      {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                          <p className="text-sm text-muted-foreground text-center">
                            Searching OpenFoodFacts database...<br />
                            This may take a few seconds
                          </p>
                        </div>
                      ) : (
                        <>
                          {searchError && (
                            <div className="py-8 text-center">
                              <p className="text-muted-foreground">{searchError}</p>
                              <Button variant="link" onClick={showCustomFoodForm}>
                                Add as a custom food
                              </Button>
                            </div>
                          )}
                          {!searchError && (openFoodResults.length > 0 || communityResults.length > 0) && (
                            <div className="space-y-2 mt-4">
                              <h3 className="text-sm font-medium">Search Results</h3>
                              {[...communityResults, ...openFoodResults].map((product, index) => {
                                const isCommunity = (product as any).id !== undefined;
                                return (
                                  <Card key={isCommunity ? `community-${(product as SavedFoodItem).id}` : `open-${index}`} className="cursor-pointer hover:bg-accent/50 transition-colors">
                                    <CardContent className="p-3" onClick={() => handleSelectFood(product)}>
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <h4 className="font-medium flex items-center gap-2">
                                            {isCommunity ? (product as SavedFoodItem).name : (product as OpenFoodProduct).product_name}
                                            {isCommunity && (
                                              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 ml-2">Community</Badge>
                                            )}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {isCommunity
                                              ? null
                                              : (product as OpenFoodProduct).brand && <span className="mr-2">{(product as OpenFoodProduct).brand}</span>}
                                            <span className="font-medium">
                                              {isCommunity
                                                ? Math.round(Number((product as SavedFoodItem).calories))
                                                : Math.round(Number((product as OpenFoodProduct).nutriments["energy-kcal_100g"]))} kcal/100g
                                            </span>
                                          </p>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          variant="default"
                                          className="border-emerald-300 hover:bg-emerald-600"
                                        >
                                          Select
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
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
                      value={isNaN(grams) ? '' : grams}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === "" || isNaN(Number(val))) {
                          setGrams(NaN);
                        } else {
                          setGrams(Number(val));
                        }
                      }}
                      min={1}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Calories</Label>
                      <div className="font-medium">{Math.round(Number(form.watch("calories")))} kcal</div>
                    </div>
                    <div>
                      <Label>Carbs</Label>
                      <div className="font-medium">{Math.round(Number(form.watch("carbs")))} g</div>
                    </div>
                    <div>
                      <Label>Proteins</Label>
                      <div className="font-medium">{Math.round(Number(form.watch("proteins")))} g</div>
                    </div>
                    <div>
                      <Label>Fats</Label>
                      <div className="font-medium">{Math.round(Number(form.watch("fats")))} g</div>
                    </div>
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
                        (view as string) === "edit"
                          ? "Update Food"
                          : (view as string) === "custom"
                            ? "Add to Tracker"
                            : "Add Food"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
              {showSuccess && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                  <div className="bg-emerald-600/90 rounded-full p-6 animate-bounce-in">
                    <svg width="48" height="48" fill="none" stroke="white" strokeWidth="3"><circle cx="24" cy="24" r="22"/><polyline points="16 26 22 32 34 18" strokeWidth="4"/></svg>
                  </div>
                </div>
              )}
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
        </div>
      </DialogContent>
    </Dialog>
  )
} 