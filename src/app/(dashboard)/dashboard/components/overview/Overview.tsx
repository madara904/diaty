"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, History, TrendingUp, Settings, Utensils, Calendar as CalendarIcon, ArrowRight, User, Plus, Coffee, Moon, LightbulbIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button"
import { Progress } from "@/app/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Calendar } from "@/app/components/ui/calendar"
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/app/components/ui/carousel"
import { Session } from 'next-auth'
import { Plan } from '@/types/plan'
import { capitalizeFirstLetter, cn } from '@/lib/utils'
import { Toaster } from "@/app/components/ui/toaster"
import { useBodyScrollLock } from '@/app/components/hooks/use-body-scroll-lock'
import { useKeyboardNavigation } from '@/lib/hooks/use-date-navigation'
import FoodIntakeTracker from './food-intake-tracker'
import useSWR, { preload, useSWRConfig } from 'swr'

interface NutritionData {
  date: Date;
  totalNutrition: {
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
  } 
  meals: {
    [key: string]: Array<{
      calories: number;
      carbs: number;
      proteins: number;
      fats: number;
      mealType: string;
    }>
  }  | undefined
}

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

const mealTypes: { type: MealType; icon: React.ElementType }[] = [
  { type: 'BREAKFAST', icon: Coffee },
  { type: 'LUNCH', icon: Utensils },
  { type: 'DINNER', icon: Moon },
];

interface OverviewProps {
  user: Session['user']
  plan: Plan | undefined | null
  initialNutritionData: NutritionData
}

const AnimatedDateContent: React.FC<{
  date: Date;
  direction: number;
  children: React.ReactNode;
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
  );
};

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const preloadAdjacentDates = (date: Date) => {
  const prevDate = subDays(date, 1)
  const nextDate = addDays(date, 1)
  preload(`/api/nutrition-data?date=${format(prevDate, 'yyyy-MM-dd')}`, fetcher)
  preload(`/api/nutrition-data?date=${format(nextDate, 'yyyy-MM-dd')}`, fetcher)
}

export default function Overview({ user, plan, initialNutritionData }: OverviewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null)
  const [direction, setDirection] = useState(0)

  const { data: nutritionData, mutate: mutateNutritionData } = useSWR<NutritionData>(
    `/api/nutrition-data?date=${format(currentDate, 'yyyy-MM-dd')}`,
    fetcher,
    {
      fallbackData: initialNutritionData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )
  useBodyScrollLock(isModalOpen)

  useEffect(() => {
    preloadAdjacentDates(currentDate)
  }, [currentDate])

  const changeDate = (days: number) => {
    const newDate = days > 0 ? addDays(currentDate, 1) : subDays(currentDate, 1)
    setCurrentDate(newDate)
    setDirection(days)
  }

  useKeyboardNavigation(changeDate)

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      setDirection(date > currentDate ? 1 : -1)
      setCurrentDate(date)
      preloadAdjacentDates(date)
    }
    setPopoverOpen(false)
  }, [currentDate])

  const openModal = useCallback((meal: MealType) => {
    setSelectedMeal(meal)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedMeal(null)
  }, [])

  const totalCalories = nutritionData?.totalNutrition.calories || 0
  const totalNutrition = nutritionData?.totalNutrition || { calories: 0, carbs: 0, proteins: 0, fats: 0 }

  const gaugeColor = totalCalories > (plan?.dailyCalories ?? 0) ? 'text-destructive' : 'text-primary'
  const remainingCalories = (plan?.dailyCalories ?? 0) - totalCalories

  const calculateMealCalories = useCallback((mealType: MealType) => {
    return nutritionData?.meals![mealType]?.reduce((sum, meal) => sum + meal.calories, 0) || 0
  }, [nutritionData])

  const macroSplit: Record<MealType, { calories: number; target: number }> = {
    BREAKFAST: { calories: calculateMealCalories('BREAKFAST'), target: 600 },
    LUNCH: { calories: calculateMealCalories('LUNCH'), target: 800 },
    DINNER: { calories: calculateMealCalories('DINNER'), target: 700 },
  };

  const nutritionTips = [
    {
      title: "Balanced Diet",
      description: "Aim for a variety of fruits, vegetables, whole grains, and lean proteins.",
      icon: LightbulbIcon,
      bgColor: "bg-blue-100",
    },
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water per day.",
      icon: LightbulbIcon,
      bgColor: "bg-green-100",
    },
    {
      title: "Healthy Fats",
      description: "Include avocados, nuts, and olive oil in your diet.",
      icon: LightbulbIcon,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Portion Control",
      description: "Use smaller plates to help control portion sizes.",
      icon: LightbulbIcon,
      bgColor: "bg-purple-100",
    },
  ]


  const optimisticUpdateNutritionData = (newData: Partial<NutritionData>) => {
    mutateNutritionData((currentData) => {
      if (!currentData) return currentData
      return {
        ...currentData,
        totalNutrition: {
          ...currentData.totalNutrition,
          ...newData.totalNutrition,
        },
        meals: {
          ...currentData.meals,
          ...newData.meals,
        },
      }
    }, false)
  }

  return (
    <div className={cn("mt-24 bg-background text-foreground")}>
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
                      Welcome back,{' '}
                      {user?.name
                        ? user.name.split(' ')[0].charAt(0).toUpperCase() + user.name.split(' ')[0].slice(1)
                        : 'User'}
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
                  <DatePicker currentDate={currentDate} setCurrentDate={handleDateSelect} popoverOpen={popoverOpen} setPopoverOpen={setPopoverOpen} />
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
                          <div className="sm:text-2xl font-bold">{plan?.dailyCalories ?? 0}</div>
                          <div className="text-sm text-muted-foreground">Target</div>
                        </div>
                        <CalorieGauge
                          consumed={totalCalories}
                          target={plan?.dailyCalories ?? 0}
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
                        <MacroProgress label="Protein" consumed={totalNutrition.proteins} total={plan?.dailyProteins ?? 0} />
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
                      <Button size="sm" onClick={() => openModal(type)}>
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
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Progress Report
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Adjust Plan
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Did you know?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='w-full flex justify-center'>
                  <Carousel className="w-5/6">
                    <CarouselContent>
                      {nutritionTips.map((tip, index) => (
                        <CarouselItem key={index}>
                          <Card className={`${tip.bgColor} border-none shadow-none`}>
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
      {isModalOpen && selectedMeal && (
        <FoodIntakeTracker
          mealType={selectedMeal}
          onClose={closeModal}
          onSave={async (newData) => {
            optimisticUpdateNutritionData(newData)
            await mutateNutritionData()
          }}
          selectedDate={currentDate}
        />
      )}
      <Toaster />
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
        <span>{consumed}g / {total}g</span>
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
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted"
        />
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
          {remainingCalories >= 0 ? 'remaining' : 'over'}
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
        {format(currentDate, 'PPP')}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="end">
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={setCurrentDate}
        initialFocus
      />
    </PopoverContent>
  </Popover>
)