"use client"
import SimpleGauge from './ui/Chart';
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const calorieGoal = 2000;

const mockData: Record<string, { caloriesConsumed: number; calorieGoal: number }> = {
  "2024-08-20": { caloriesConsumed: 1800, calorieGoal },
  "2024-08-21": { caloriesConsumed: 2100, calorieGoal },
  "2024-08-22": { caloriesConsumed: 2050, calorieGoal },
  "2024-08-23": { caloriesConsumed: 1750, calorieGoal },
};

export function Overview() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handlePrevDay = () => triggerDateChange(() => subDays(currentDate, 1));
  const handleNextDay = () => triggerDateChange(() => addDays(currentDate, 1));

  const triggerDateChange = (dateUpdater: () => Date) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(dateUpdater());
      setIsTransitioning(false);
    }, 200);
  };

  const formattedDate = format(currentDate, 'MMMM dd, yyyy');
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  const data = mockData[dateKey] || { caloriesConsumed: 0, calorieGoal: 0 };
  const { caloriesConsumed, calorieGoal } = data;

  const gaugeColor = caloriesConsumed > calorieGoal ? 'coral' : 'LightSkyBlue';

  return (
    <>
      <h1 className='mt-24 text-4xl font-medium'>Overview</h1>
      <div className={cn("md:flex mt-4 gap-4 transition-all duration-300", isTransitioning ? 'opacity-0' : 'opacity-100')} >
        <Card className="flex-1 shadow-md md:w-1/2 mb-5 sm:m-0" >
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
          <CardContent className="items-center">
            <SimpleGauge
              value={caloriesConsumed}
              valueMin={0}
              valueMax={calorieGoal}
              color={gaugeColor}
            />
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between py-5 text-sm">
            <div>
              <p>Carbs</p>
              <p>0 / 240g</p>
            </div>
            <div>
              <p>Proteins</p>
              <p>0 / 120g</p>
            </div>
            <div>
              <p>Fat</p>
              <p>0 / 60g</p>
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