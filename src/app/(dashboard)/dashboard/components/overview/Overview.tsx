"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, History, TrendingUp, Settings, Utensils, Calendar as CalendarIcon, ArrowRight, User, Plus, Coffee, Moon, LightbulbIcon } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button"
import { Progress } from "@/app/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Calendar } from "@/app/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/app/components/ui/carousel"
import { Session } from 'next-auth'
import { Plan } from '@/types/plan'
import { capitalizeFirstLetter, cn } from '@/lib/utils'
import { useKeyboardNavigation } from '@/lib/hooks/use-date-navigation'
import useSWR, { preload } from 'swr'
import FoodSearchModal from './FoodSearchModal'

interface NutritionData {
  date: Date
  totalNutrition: {
    calories: number
    carbs: number
    proteins: number
    fats: number
  }
  meals:
    | {
        [key: string]: Array<{
          calories: number
          carbs: number
          proteins: number
          fats: number
          mealType: string
        }>
      }
    | undefined
}

type MealType = "BREAKFAST" | "LUNCH" | "DINNER"

const mealTypes: { type: MealType; icon: React.ElementType }[] = [
  { type: "BREAKFAST", icon: Coffee },
  { type: "LUNCH", icon: Utensils },
  { type: "DINNER", icon: Moon },
]

interface OverviewProps {
  user: Session["user"]
  plan: Plan | undefined | null
  initialNutritionData: NutritionData
}

const AnimatedDateContent: React.FC<{
  date: Date
  direction: number
  children: React.ReactNode
}> = ({ date, direction, children }) => {
  return (
    <motion.div
      key={date.toISOString()}
      initial={{ opacity: 0, x: direction * 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -direction * 300 }}
      transition={{ type: "tween", stiffness: 700, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Global SWR configuration to reduce redundant requests
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 10000, // 10 seconds
  focusThrottleInterval: 5000, // 5 seconds
}

const preloadAdjacentDates = (date: Date) => {
  const prevDate = subDays(date, 1)
  const nextDate = addDays(date, 1)
  preload(`/api/nutrition-data?date=${format(prevDate, "yyyy-MM-dd")}`, fetcher)
  preload(`/api/nutrition-data?date=${format(nextDate, "yyyy-MM-dd")}`, fetcher)
}

export default function Overview({ user, plan, initialNutritionData }: OverviewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [direction, setDirection] = useState<number>(1) // 1 for right, -1 for left
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [foodModalOpen, setFoodModalOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST")

  const { data: nutritionData, mutate: mutateNutritionData } = useSWR<NutritionData>(
    `/api/nutrition-data?date=${format(currentDate, "yyyy-MM-dd")}`,
    fetcher,
    {
      fallbackData: initialNutritionData,
      ...swrConfig,
    },
  )
  // Body scroll lock no longer needed as we're using page navigation

  useEffect(() => {
    preloadAdjacentDates(currentDate)
  }, [currentDate])

  const changeDate = (days: number) => {
    const newDate = days > 0 ? addDays(currentDate, 1) : subDays(currentDate, 1)
    setCurrentDate(newDate)
    setDirection(days > 0 ? 1 : -1)
  }

  useKeyboardNavigation(changeDate)

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setDirection(date > currentDate ? 1 : -1)
        setCurrentDate(date)
        preloadAdjacentDates(date)
      }
      setPopoverOpen(false)
    },
    [currentDate],
  )

  // No need for a navigation function with Next.js Link component

  // TODO: For full SWR migration, refactor all fetches (add/edit/delete) to call mutateNutritionData after success.

  const totalCalories = nutritionData?.totalNutrition.calories || 0
  const totalNutrition = nutritionData?.totalNutrition || { calories: 0, carbs: 0, proteins: 0, fats: 0 }

  // Get target calories from plan, with fallback to user's targetCalories if available
  const targetCalories = plan?.dailyCalories || user?.targetCalories || 2000;
  
  const gaugeColor = totalCalories > targetCalories ? "text-destructive" : "text-primary"
  const remainingCalories = targetCalories - totalCalories

  const calculateMealCalories = useCallback(
    (mealType: MealType) => {
      return nutritionData?.meals![mealType]?.reduce((sum, meal) => sum + meal.calories, 0) || 0
    },
    [nutritionData],
  )

  const macroSplit: Record<MealType, { calories: number; target: number }> = {
    BREAKFAST: { calories: calculateMealCalories("BREAKFAST"), target: 600 },
    LUNCH: { calories: calculateMealCalories("LUNCH"), target: 800 },
    DINNER: { calories: calculateMealCalories("DINNER"), target: 700 },
  }

  const nutritionTips = [
    {
      title: `Tips for ${user?.goal?.replace('_', ' ').toLowerCase() || 'healthy eating'}`,
      description: user?.goal === 'WEIGHT_LOSS' 
        ? "Focus on high-protein, low-calorie foods like lean meats, eggs, and leafy greens to stay full longer."
        : user?.goal === 'WEIGHT_GAIN' 
        ? "Include calorie-dense foods like nuts, avocados, and healthy oils to boost your daily intake."
        : user?.goal === 'MUSCLE_GAIN'
        ? "Aim for 1.6-2.2g of protein per kg of bodyweight and time protein intake around workouts."
        : "Balance your plate with 50% vegetables, 25% protein, and 25% whole grains for optimal nutrition.",
      icon: LightbulbIcon,
      bgColor: "bg-blue-100",
    },
    {
      title: "Timing Matters",
      description: "Try to eat your last meal at least 3 hours before bedtime to improve sleep quality and digestion.",
      icon: LightbulbIcon,
      bgColor: "bg-green-100",
    },
    {
      title: "Smart Swaps",
      description: "Replace sugary drinks with water, soda with sparkling water, or white bread with whole grain options.",
      icon: LightbulbIcon,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Weekly Meal Prep",
      description: "Spend 1-2 hours on weekends preparing healthy meals to save time and avoid unhealthy choices.",
      icon: LightbulbIcon,
      bgColor: "bg-purple-100",
    },
    {
      title: "80/20 Rule",
      description: "Aim to eat nutritious foods 80% of the time, allowing yourself treats for the other 20%.",
      icon: LightbulbIcon,
      bgColor: "bg-pink-100",
    },
  ]

  return (
    <div className={cn("bg-background text-foreground")}>
      <AnimatePresence mode="wait">
        <AnimatedDateContent date={currentDate} direction={direction}>
          <Card className="w-full mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <motion.h2
                      className="text-lg md:text-2xl font-semibold"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Welcome back,{" "}
                      {user?.name
                        ? user.name.split(" ")[0].charAt(0).toUpperCase() + user.name.split(" ")[0].slice(1)
                        : "User"}
                    </motion.h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Let's continue your nutrition journey today.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => changeDate(-1)} aria-label="Previous day">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <DatePicker
                    currentDate={currentDate}
                    setCurrentDate={handleDateSelect}
                    popoverOpen={popoverOpen}
                    setPopoverOpen={setPopoverOpen}
                  />
                  <Button variant="outline" onClick={() => changeDate(1)} aria-label="Next day">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Nutrition Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="calories" className="h-[300px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calories">Calories</TabsTrigger>
                    <TabsTrigger value="macros">Macros</TabsTrigger>
                  </TabsList>
                  <div className="pt-8">
                    <TabsContent value="calories">
                      <div className="flex items-center justify-center space-x-6">
                        <div className="text-center">
                          <div className="sm:text-2xl font-bold">{targetCalories}</div>
                          <div className="text-sm text-muted-foreground">Target</div>
                        </div>
                        <CalorieGauge
                          consumed={totalCalories}
                          target={targetCalories}
                          gaugeColor={gaugeColor}
                          remainingCalories={remainingCalories}
                        />
                        <div className="text-center">
                          <div className="sm:text-2xl font-bold">{totalCalories}</div>
                          <div className="text-sm text-muted-foreground">Consumed</div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="macros">
                      <div className="space-y-4 max-w-xl mx-auto pt-10">
                        <MacroProgress label="Carbs" consumed={totalNutrition.carbs} total={plan?.dailyCarbs ?? 0} />
                        <MacroProgress
                          label="Protein"
                          consumed={totalNutrition.proteins}
                          total={plan?.dailyProteins ?? 0}
                        />
                        <MacroProgress label="Fat" consumed={totalNutrition.fats} total={plan?.dailyFats ?? 0} />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Meal Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mealTypes.map(({ type, icon: Icon }) => (
                    <div key={type} className="flex justify-between items-center p-2 bg-secondary rounded">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5" />
                          <span>{capitalizeFirstLetter(type)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {macroSplit[type].calories} / {macroSplit[type].target} calories
                        </div>
                      </div>
                      <Button size="sm" onClick={() => {
                        setSelectedMealType(type)
                        setFoodModalOpen(true)
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/profile" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Update Profile
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => {
                    // Set date to tomorrow
                    setCurrentDate(addDays(currentDate, 1));
                  }}
                >
                  <span className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Plan Tomorrow
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Weekly Summary
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {user?.goal === 'WEIGHT_LOSS' && (
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Weight Loss Tips
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                {user?.goal === 'WEIGHT_GAIN' && (
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Weight Gain Tips
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                {user?.goal === 'MUSCLE_GAIN' && (
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Muscle Building Tips
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                {user?.goal === 'MAINTENANCE' && (
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Maintenance Tips
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Did you know?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full flex justify-center">
                  <Carousel className="w-5/6">
                    <CarouselContent>
                      {nutritionTips.map((tip, index) => (
                        <CarouselItem key={index}>
                          <Card className={tip.bgColor}>
                            <CardContent className="flex flex-col items-center p-6">
                              <tip.icon className="h-12 w-12 text-muted-foreground mb-4" />
                              <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{tip.title}</h3>
                              <p className="text-sm text-center text-muted-foreground">{tip.description}</p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedDateContent>
      </AnimatePresence>
      <FoodSearchModal
        isOpen={foodModalOpen}
        onClose={() => setFoodModalOpen(false)}
        currentDate={currentDate}
        onFoodAdded={() => mutateNutritionData()}
        defaultMealType={selectedMealType}
      />
    </div>
  )
}

interface MacroProgressProps {
  label: string
  consumed: number
  total: number
}

function MacroProgress({ label, consumed, total }: MacroProgressProps) {
  const percentage = Math.min((consumed / total) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {consumed}g / {total}g
        </span>
      </div>
      <Progress value={percentage} className="h-2 bg-secondary" />
    </div>
  )
}

interface CalorieGaugeProps {
  consumed: number
  target: number
  gaugeColor: string
  remainingCalories: number
}

function CalorieGauge({ consumed, target, gaugeColor, remainingCalories }: CalorieGaugeProps) {
  const percentage = Math.min((consumed / target) * 100, 100)
  return (
    <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-54 lg:w-54">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray="282.7"
          strokeDashoffset={282.7 - (282.7 * percentage) / 100}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className={`transition-all duration-1000 ease-in-out ${gaugeColor}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{Math.abs(remainingCalories)}</div>
        <div className="text-sm sm:text-base text-muted-foreground">
          {remainingCalories >= 0 ? "remaining" : "over"}
        </div>
      </div>
    </div>
  )
}

interface DatePickerProps {
  currentDate: Date
  setCurrentDate: (date: Date | undefined) => void
  popoverOpen: boolean
  setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DatePicker = ({ currentDate, setCurrentDate, popoverOpen, setPopoverOpen }: DatePickerProps) => (
  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(currentDate, "PPP")}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="end">
      <Calendar mode="single" selected={currentDate} onSelect={setCurrentDate} initialFocus />
    </PopoverContent>
  </Popover>
)
