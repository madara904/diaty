"use client"

import React, { useState, useEffect } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight, History, TrendingUp, Settings, Utensils, Calendar as CalendarIcon, ArrowRight, User, Plus, Coffee, Moon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button"
import { useForm, UseFormReturn } from 'react-hook-form'
import { Session } from 'next-auth'
import { Plan } from '@/types/plan'
import { Progress } from "@/app/components/ui/progress"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form'
import { Input } from "@/app/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Calendar } from "@/app/components/ui/calendar"
import { motion } from 'framer-motion'
import FoodIntakeTracker from '../../intakes/components/food-intake-tracker'
import { cn } from '@/lib/utils'

const mockData = {
  "2024-10-01": { caloriesConsumed: 3200, carbsConsumed: 150, proteinsConsumed: 100, fatsConsumed: 70 },
  "2024-10-02": { caloriesConsumed: 2100, carbsConsumed: 170, proteinsConsumed: 110, fatsConsumed: 80 },
  "2024-10-03": { caloriesConsumed: 2050, carbsConsumed: 160, proteinsConsumed: 105, fatsConsumed: 75 },
  "2024-10-04": { caloriesConsumed: 1750, carbsConsumed: 140, proteinsConsumed: 95, fatsConsumed: 65 },
  "2024-10-05": { caloriesConsumed: 1750, carbsConsumed: 140, proteinsConsumed: 95, fatsConsumed: 65 },
}

interface OverviewProps {
  user: Session['user']
  plan: Plan | undefined | null
}

export default function EnhancedNutritionDashboard({ user, plan }: OverviewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [recentIntakes, setRecentIntakes] = useState<Array<{ date: string; calories: number }>>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner' | null>(null)

  const openModal = (meal: 'Breakfast' | 'Lunch' | 'Dinner') => {
    setSelectedMeal(meal)
    setIsModalOpen(true)
    setIsPopoverOpen(false)
  }

  useEffect(() => {
    const recent = Object.entries(mockData)
      .map(([date, data]) => ({ date, calories: data.caloriesConsumed }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
    setRecentIntakes(recent)
  }, [])

  const changeDate = (days: number) => {
    setCurrentDate(prevDate => days > 0 ? addDays(prevDate, 1) : subDays(prevDate, 1))
  }

  const dateKey = format(currentDate, 'yyyy-MM-dd')
  const data = mockData[dateKey as keyof typeof mockData] || { caloriesConsumed: 0, carbsConsumed: 0, proteinsConsumed: 0, fatsConsumed: 0 }

  const gaugeColor = data.caloriesConsumed > (plan?.dailyCalories ?? 0) ? 'text-red-500' : 'text-green-500'
  const remainingCalories = (plan?.dailyCalories ?? 0) - data.caloriesConsumed


  return (
    <div className={cn("mt-24")}>
<Card className="w-full mb-6">
  <CardContent className="p-4 md:p-6">
    <div className="flex flex-col md:flex-row items-center justify-between w-full">
      <div className="flex items-center space-x-4 mb-4 md:mb-0"> 
        <User className="h-12 w-12 text-muted-foreground" />
        <div>
          <motion.h2
            className="text-lg md:text-2xl font-semibold text-foreground" 
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
      <div className='flex w-full sm:block sm:max-w-fit mt-4 sm:mt-0'>
        <div>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="font-bold p-4 md:p-6">
            <Plus size={20} className="mr-2 text-foreground" />
            Add intakes
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 ml-12 sm:m-0">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Nutrition</h4>
              <p className="text-sm text-muted-foreground">
                Select from below
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coffee className="mr-2 h-4 w-4" />
                  <span>Breakfast</span>
                </div>
                <Button size="sm" onClick={() => openModal('Breakfast')}>Add</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Utensils className="mr-2 h-4 w-4" />
                  <span>Lunch</span>
                </div>
                <Button size="sm" onClick={() => openModal('Lunch')}>Add</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dinner</span>
                </div>
                <Button size="sm" onClick={() => openModal('Dinner')}>Add</Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {isModalOpen && selectedMeal && (
        <FoodIntakeTracker
          mealType={selectedMeal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
      </div>
    </div>
  </CardContent>
</Card>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Nutrition Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => changeDate(-1)} aria-label="Previous day">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} popoverOpen={popoverOpen} setPopoverOpen={setPopoverOpen} />
          <Button variant="outline" onClick={() => changeDate(1)} aria-label="Next day">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calorie Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="sm:text-2xl font-bold">{plan?.dailyCalories ?? 0}</div>
                <div className="text-sm text-gray-500">Target</div>
              </div>
              <CalorieGauge
                consumed={data.caloriesConsumed}
                target={plan?.dailyCalories ?? 0}
                gaugeColor={gaugeColor}
                remainingCalories={remainingCalories}
              />
              <div className="text-center">
                <div className="sm:text-2xl font-bold">{data.caloriesConsumed}</div>
                <div className="text-sm text-gray-500">Consumed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Macro Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <MacroProgress label="Carbs" consumed={data.carbsConsumed} total={plan?.dailyCarbs ?? 0} color="bg-blue-500" />
            <MacroProgress label="Protein" consumed={data.proteinsConsumed} total={plan?.dailyProteins ?? 0} color="bg-red-500" />
            <MacroProgress label="Fat" consumed={data.fatsConsumed} total={plan?.dailyFats ?? 0} color="bg-yellow-500" />
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
            <CardTitle>Recent Intakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentIntakes.map((intake, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>{intake.date}</span>
                  <span className="font-medium">{intake.calories} calories</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>                
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

interface MacroProgressProps {
  label: string
  consumed: number
  total: number
  color: string
}

function MacroProgress({ label, consumed, total, color }: MacroProgressProps) {
  const percentage = Math.min((consumed / total) * 100, 100)
  return (
    <div className="space-y-1 mb-4">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{consumed}g / {total}g</span>
      </div>
      <Progress value={percentage} className="h-2" />
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
          stroke="#e2e8f0"
          strokeWidth="6"
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
        <div className="text-sm sm:text-base text-gray-500">
          {remainingCalories >= 0 ? 'remaining' : 'over'}
        </div>
      </div>
    </div>
  )
}

interface IntakeFormProps {
  form: UseFormReturn<{
    Calories: number
    Carbs: number
    Fats: number
    Proteins: number
  }>
  onSubmit: (values: {
    Calories: number
    Carbs: number
    Fats: number
    Proteins: number
  }) => void
}

const IntakeForm = ({ form, onSubmit }: IntakeFormProps) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {['Calories', 'Carbs', 'Proteins', 'Fats'].map((field) => (
        <FormField
          key={field}
          control={form.control}
          name={field as 'Calories' | 'Carbs' | 'Proteins' | 'Fats'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  </Form>
)

interface DatePickerProps {
  currentDate: Date
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
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
        onSelect={(date) => {
          setCurrentDate(date || new Date())
          setPopoverOpen(false)
        }}
        initialFocus
      />
    </PopoverContent>
  </Popover>
)