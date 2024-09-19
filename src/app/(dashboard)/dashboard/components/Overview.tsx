"use client";
import SimpleGauge from './ui/Chart';
import React, { useState, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { cn } from '@/lib/utils';
import { Separator } from '@/app/components/ui/separator';

// Constants for goals
const CALORIE_GOAL = 2000;
const CARBS_TARGET = 240; 
const PROTEINS_TARGET = 120;  
const FATS_TARGET = 60; 

// Mock data
const mockData: Record<string, {
  caloriesConsumed: number;
  calorieGoal: number;
  carbsConsumed: number;
  carbsTarget: number;
  proteinsConsumed: number;
  proteinsTarget: number;
  fatsConsumed: number;
  fatsTarget: number;
}> = {
  "2024-08-20": {
    caloriesConsumed: 1800,
    calorieGoal: CALORIE_GOAL,
    carbsConsumed: 150,
    carbsTarget: CARBS_TARGET,
    proteinsConsumed: 100,
    proteinsTarget: PROTEINS_TARGET,
    fatsConsumed: 70,
    fatsTarget: FATS_TARGET,
  },
  "2024-08-21": {
    caloriesConsumed: 2100,
    calorieGoal: CALORIE_GOAL,
    carbsConsumed: 170,
    carbsTarget: CARBS_TARGET,
    proteinsConsumed: 110,
    proteinsTarget: PROTEINS_TARGET,
    fatsConsumed: 80,
    fatsTarget: FATS_TARGET,
  },
  "2024-08-22": {
    caloriesConsumed: 2050,
    calorieGoal: CALORIE_GOAL,
    carbsConsumed: 160,
    carbsTarget: CARBS_TARGET,
    proteinsConsumed: 105,
    proteinsTarget: PROTEINS_TARGET,
    fatsConsumed: 75,
    fatsTarget: FATS_TARGET,
  },
  "2024-08-23": {
    caloriesConsumed: 1750,
    calorieGoal: CALORIE_GOAL,
    carbsConsumed: 140,
    carbsTarget: CARBS_TARGET,
    proteinsConsumed: 95,
    proteinsTarget: PROTEINS_TARGET,
    fatsConsumed: 65,
    fatsTarget: FATS_TARGET,
  },
  "2024-08-25": {
    caloriesConsumed: 1750,
    calorieGoal: CALORIE_GOAL,
    carbsConsumed: 140,
    carbsTarget: CARBS_TARGET,
    proteinsConsumed: 95,
    proteinsTarget: PROTEINS_TARGET,
    fatsConsumed: 65,
    fatsTarget: FATS_TARGET,
  },
};

export function Overview() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Handles date change with animation
  const changeDate = useCallback((dateUpdater: () => Date) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(dateUpdater());
      setIsTransitioning(false);
    }, 200);
  }, []);

  const handlePrevDay = () => changeDate(() => subDays(currentDate, 1));
  const handleNextDay = () => changeDate(() => addDays(currentDate, 1));

  // Format current date and fetch data
  const formattedDate = format(currentDate, 'MMMM dd, yyyy');
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const data = mockData[dateKey] || {
    caloriesConsumed: 0,
    calorieGoal: CALORIE_GOAL,
    carbsConsumed: 0,
    carbsTarget: CARBS_TARGET,
    proteinsConsumed: 0,
    proteinsTarget: PROTEINS_TARGET,
    fatsConsumed: 0,
    fatsTarget: FATS_TARGET,
  };

  const {
    caloriesConsumed,
    calorieGoal,
    carbsConsumed,
    carbsTarget,
    proteinsConsumed,
    proteinsTarget,
    fatsConsumed,
    fatsTarget,
  } = data;

  // Determine gauge color
  const gaugeColor = caloriesConsumed > calorieGoal ? 'coral' : 'LightSkyBlue';

  return (
    <>
      <h1 className='mt-24 text-4xl font-medium'>Overview</h1>
      <div className={cn("md:flex mt-4 gap-4 transition-all duration-300", isTransitioning ? 'opacity-0' : 'opacity-100')}>
        <Card className="flex-1 shadow-md md:w-1/2 mb-5 sm:m-0">
          <div className="flex justify-end m-3">
            <ChevronLeft
              onClick={handlePrevDay}
              className="cursor-pointer hover:opacity-50"
              size={26}
            />
            <ChevronRight
              onClick={handleNextDay}
              className="cursor-pointer hover:opacity-50"
              size={26}
            />
          </div>
          <CardHeader className="items-center p-0">
            <CardTitle>Your Intakes</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex justify-center py-12'>
              <SimpleGauge
                value={caloriesConsumed}
                valueMin={0}
                valueMax={calorieGoal}
                color={gaugeColor}
              />
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between py-5 text-sm">
            <div>
              <p>Carbs</p>
              <p><span className='font-bold'>{carbsConsumed}g</span> / {carbsTarget}g</p>
            </div>
            <div>
              <p>Proteins</p>
              <p><span className='font-bold'>{proteinsConsumed}g</span> / {proteinsTarget}g</p>
            </div>
            <div>
              <p>Fats</p>
              <p><span className='font-bold'>{fatsConsumed}g</span> / {fatsTarget}g</p>
            </div>
          </CardFooter>
        </Card>
        <Card className="shadow-md md:w-1/2">
          <CardHeader className="items-center">
            <CardTitle></CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
