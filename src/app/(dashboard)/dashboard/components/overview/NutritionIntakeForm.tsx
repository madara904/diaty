import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import { Search, Plus, ArrowLeft } from 'lucide-react'
import React from 'react'

const formSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  calories: z.number().min(0, 'Calories must be 0 or greater'),
  carbs: z.number().min(0, 'Carbs must be 0 or greater'),
  proteins: z.number().min(0, 'Proteins must be 0 or greater'),
  fats: z.number().min(0, 'Fats must be 0 or greater'),
})

type FormValues = z.infer<typeof formSchema>

const recentFoods = [
  { name: 'Chicken Breast', calories: 165, carbs: 0, proteins: 31, fats: 3.6 },
  { name: 'Brown Rice', calories: 216, carbs: 45, proteins: 5, fats: 1.6 },
  { name: 'Broccoli', calories: 55, carbs: 11, proteins: 3.7, fats: 0.6 },
]

const favoriteFoods = [
  { name: 'Salmon', calories: 206, carbs: 0, proteins: 22, fats: 13 },
  { name: 'Sweet Potato', calories: 180, carbs: 41, proteins: 2, fats: 0.1 },
  { name: 'Avocado', calories: 320, carbs: 17, proteins: 4, fats: 29 },
]

interface NutritionIntakeFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function NutritionIntakeForm({ isOpen, onClose }: NutritionIntakeFormProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFood, setSelectedFood] = useState<typeof recentFoods[0] | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodName: '',
      calories: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log(values)
    // Here you would typically send the data to your backend
    form.reset()
    setSelectedFood(null)
    onClose()
  }

  const handleFoodSelect = (food: typeof recentFoods[0]) => {
    setSelectedFood(food)
    form.reset({
      foodName: food.name,
      calories: food.calories,
      carbs: food.carbs,
      proteins: food.proteins,
      fats: food.fats,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full max-w-full max-h-[95%] m-0 p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Log Your Nutrition</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 max-w-5xl container">
          {!selectedFood ? (
            <>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for a food..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="recent" className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                <TabsContent value="recent">
                  <ScrollArea className="h-[40vh]">
                    {recentFoods.map((food, index) => (
                      <FoodItem key={index} food={food} onSelect={handleFoodSelect} />
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="favorites">
                  <ScrollArea className="h-[40vh]">
                    {favoriteFoods.map((food, index) => (
                      <FoodItem key={index} food={food} onSelect={handleFoodSelect} />
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <Accordion type="single" collapsible>
                <AccordionItem value="manual-entry">
                  <AccordionTrigger>Manual Entry</AccordionTrigger>
                  <AccordionContent>
                    <NutritionForm form={form} onSubmit={onSubmit} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <div>
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setSelectedFood(null)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to search
              </Button>
              <NutritionForm form={form} onSubmit={onSubmit} />
            </div>
          )}
                  <div className="px-6 py-4 w-min">
          <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Log Food
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface FoodItemProps {
  food: {
    name: string
    calories: number
    carbs: number
    proteins: number
    fats: number
  }
  onSelect: (food: FoodItemProps['food']) => void
}

function FoodItem({ food, onSelect }: FoodItemProps) {
  return (
    <Card className="mb-2 hover:bg-accent transition-colors">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          {food.name}
          <Button variant="ghost" size="sm" onClick={() => onSelect(food)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-muted-foreground">
          Calories: {food.calories} | Carbs: {food.carbs}g | Proteins: {food.proteins}g | Fats: {food.fats}g
        </p>
      </CardContent>
    </Card>
  )
}

interface NutritionFormProps {
  form: ReturnType<typeof useForm<FormValues>>
  onSubmit: (values: FormValues) => void
}

function NutritionForm({ form, onSubmit }: NutritionFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="foodName"
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
          {['calories', 'carbs', 'proteins', 'fats'].map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" className="w-full">
          Log
        </Button>
      </form>
    </Form>
  )
}
