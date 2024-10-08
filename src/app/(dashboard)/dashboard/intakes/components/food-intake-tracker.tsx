"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, Plus, X } from "lucide-react"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { useToast } from "@/app/components/hooks/use-toast"
import { format } from 'date-fns'

const recentItems = [
  { id: 1, name: "Apple", brand: "Nature's Best", calories: 95 },
  { id: 2, name: "Chicken Breast", brand: "Organic Farms", calories: 165 },
]

const favoriteItems = [
  { id: 3, name: "Banana", brand: "Chiquita", calories: 105 },
  { id: 4, name: "Greek Yogurt", brand: "Fage", calories: 120 },
]

const manualEntrySchema = z.object({
  calories: z.coerce.number().min(1, "Calories must be a non-negative number"),
  carbs: z.coerce.number().min(1, "Carbs must be a non-negative number"),
  proteins: z.coerce.number().min(1, "Proteins must be a non-negative number"),
  fats: z.coerce.number().min(1, "Fat must be a non-negative number"),
})

type ManualEntryForm = z.infer<typeof manualEntrySchema>

type FoodIntakeTrackerProps = {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  onClose: () => void;
  onSave: () => void;
  selectedDate: Date;
}

export default function FoodIntakeTracker({ mealType, onClose, onSave, selectedDate }: FoodIntakeTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const { toast } = useToast()

  const form = useForm<ManualEntryForm>({
    resolver: zodResolver(manualEntrySchema),
  })

  const onSubmit = async (data: ManualEntryForm) => {
    try {
      const response = await fetch("/api/nutrition-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          mealType: mealType.toLocaleUpperCase(),
          date: format(selectedDate, 'yyyy-MM-dd'),
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        toast({
          title: "Success",
          description: "Nutrition data saved successfully",
          duration: 100,
        })
        onSave();
        onClose();
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          title: "Error",
          description: errorData.error || "Failed to save nutrition data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  };

  const handleSearch = () => {
    setSearchResults([
      { id: 5, name: "Pizza Slice", brand: "Domino's", calories: 285 },
      { id: 6, name: "Caesar Salad", brand: "Fresh & Green", calories: 180 },
    ])
  }

  const renderFoodItems = (items: any[]) => (
    <div className="grid gap-4 md:grid-row-2 lg:grid-row-3">
      {items.map((item) => (
        <Card key={item.id} className="border-none shadow-none">
          <CardHeader className="p-0 space-y-0 border-b pb-3">
            <CardTitle className="text-md">{item.name}</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs">{item.brand}</CardDescription>
              <div className="flex items-center gap-5">
                <p className="text-xs">{item.calories} calories</p>
                <Button size="icon_small" className="rounded-full bg-primary/60 hover:bg-primary/40">
                  <Plus size={20} />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-background shadow-lg rounded-lg p-6 w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Add {mealType.toLowerCase()} Intake</h2>
            <p className="text-sm text-muted-foreground">{format(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            {renderFoodItems(searchResults)}
          </div>
        )}

        <Tabs defaultValue="recent">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <h2 className="text-sm font-semibold mb-4">Recent Items</h2>
            {renderFoodItems(recentItems)}
          </TabsContent>
          <TabsContent value="favorites">
            <h2 className="text-sm font-semibold mb-4">Favorite Items</h2>
            {renderFoodItems(favoriteItems)}
          </TabsContent>
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry for {mealType.toLowerCase()}</CardTitle>
                <CardDescription>Enter nutritional information manually</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
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
                            <Input type="number" {...field} />
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
                            <Input type="number" {...field} />
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
                          <FormLabel>Fat (g)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Add to {mealType.toLowerCase()} Intake</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}