"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, Plus, X, Loader2, Check } from "lucide-react"
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
import { motion } from "framer-motion"

const recentItems = [
  { id: 1, name: "Apple", brand: "Nature's Best", calories: 95 },
  { id: 2, name: "Chicken Breast", brand: "Organic Farms", calories: 165 },
]

const favoriteItems = [
  { id: 3, name: "Banana", brand: "Chiquita", calories: 105 },
  { id: 4, name: "Greek Yogurt", brand: "Fage", calories: 120 },
]

const manualEntrySchema = z.object({
  calories: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(1, "Calories must be a non-negative number")
  ),
  carbs: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(1, "Carbs must be a non-negative number")
  ),
  proteins: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(1, "Proteins must be a non-negative number")
  ),
  fats: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(1, "Fat must be a non-negative number")
  ),
})

type ManualEntryForm = z.infer<typeof manualEntrySchema>

type FoodIntakeTrackerProps = {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  onClose: () => void;
  onSave: () => void;
  selectedDate: Date;
}

interface AnimatedSubmitButtonProps {
  isSubmitting: boolean
  isSuccess: boolean
  children: React.ReactNode
}

const AnimatedSubmitButton = ({ isSubmitting, isSuccess, children }: AnimatedSubmitButtonProps) => (
  <motion.button
    className="w-full relative overflow-hidden bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md"
    initial={false}
    animate={isSuccess ? "success" : isSubmitting ? "submitting" : "idle"}
    disabled={isSubmitting || isSuccess}
  >
    <motion.div
      className="absolute inset-0 bg-primary"
      variants={{
        idle: { opacity: 1 },
        submitting: { opacity: 1 },
        success: { opacity: 0 },
      }}
      transition={{ duration: 0.3 }}
    />
    <motion.span
      className="relative z-10 flex items-center justify-center"
      variants={{
        idle: { opacity: 1 },
        submitting: { opacity: 0 },
        success: { opacity: 0 },
      }}
    >
      {children}
    </motion.span>
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      variants={{
        idle: { opacity: 0 },
        submitting: { opacity: 1 },
        success: { opacity: 0 },
      }}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
    </motion.div>
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      variants={{
        idle: { opacity: 0 },
        submitting: { opacity: 0 },
        success: { opacity: 1 },
      }}
    >
      <motion.div
        className="bg-green-500 rounded-full p-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 10 }}
      >
        <Check className="h-4 w-4 text-white" />
      </motion.div>
    </motion.div>
  </motion.button>
)

export default function FoodIntakeTracker({ mealType, onClose, onSave, selectedDate }: FoodIntakeTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { toast } = useToast()

  const form = useForm<ManualEntryForm>({
    resolver: zodResolver(manualEntrySchema),
  })

  const onSubmit = async (data: ManualEntryForm) => {
    setIsSubmitting(true)
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
        setTimeout(() => {
          onSave();
          onClose();
        }, 1500)
        setIsSuccess(true)
      } else {
        const errorData = await response.json();
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
    } finally {
      setIsSubmitting(false)
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
                            <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                            <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                            <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
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
                            <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <AnimatedSubmitButton isSubmitting={isSubmitting} isSuccess={isSuccess}>
                      Add to {mealType.toLowerCase()} Intake
                    </AnimatedSubmitButton>
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