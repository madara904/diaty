"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, PlusCircle, History, TrendingUp, Settings, Utensils, Activity, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/Button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from 'next-auth';
import { Plan } from '@/types/plan';
import DatePicker from './DatePicker';
import IntakeForm from './IntakeForm';
import Gauge from './Chart';
import { Progress } from "@/app/components/ui/progress";
import { Separator } from '@/app/components/ui/separator';

const mockData = {
  "2024-09-20": { caloriesConsumed: 3200, carbsConsumed: 150, proteinsConsumed: 100, fatsConsumed: 70 },
  "2024-09-21": { caloriesConsumed: 2100, carbsConsumed: 170, proteinsConsumed: 110, fatsConsumed: 80 },
  "2024-09-22": { caloriesConsumed: 2050, carbsConsumed: 160, proteinsConsumed: 105, fatsConsumed: 75 },
  "2024-09-23": { caloriesConsumed: 1750, carbsConsumed: 140, proteinsConsumed: 95, fatsConsumed: 65 },
  "2024-09-25": { caloriesConsumed: 1750, carbsConsumed: 140, proteinsConsumed: 95, fatsConsumed: 65 },
};

interface OverviewProps {
  user: Session['user'];
  plan: Plan | undefined | null;
}

const formSchema = z.object({
  Calories: z.coerce.number().positive(),
  Carbs: z.coerce.number().positive(),
  Fats: z.coerce.number().positive(),
  Proteins: z.coerce.number().positive(),
});

export default function Overview({ user, plan }: OverviewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [recentIntakes, setRecentIntakes] = useState<Array<{ date: string; calories: number }>>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Calories: 0,
      Carbs: 0,
      Fats: 0,
      Proteins: 0,
    },
  });

  useEffect(() => {
    const recent = Object.entries(mockData)
      .map(([date, data]) => ({ date, calories: data.caloriesConsumed }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentIntakes(recent);
  }, []);

  const changeDate = (days: number) => {
    setCurrentDate(prevDate => days > 0 ? addDays(prevDate, 1) : subDays(prevDate, 1));
  };

  const dateKey = format(currentDate, 'yyyy-MM-dd');
  const data = mockData[dateKey as keyof typeof mockData] || { caloriesConsumed: 0, carbsConsumed: 0, proteinsConsumed: 0, fatsConsumed: 0 };

  const gaugeColor = data.caloriesConsumed > (plan?.dailyCalories ?? 0) ? 'coral' : 'LightSkyBlue';
  const percentage = Math.min((data.caloriesConsumed / (plan?.dailyCalories ?? 1)) * 100, 100);
  const remainingCalories = (plan?.dailyCalories ?? 0) - data.caloriesConsumed;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <h1 className='mt-24 text-4xl font-medium'>Nutrition Overview</h1>
      <div className="flex flex-col lg:flex-row mt-4 gap-4">
        <Card className="flex-1 shadow-md mb-5">
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => changeDate(-1)} aria-label="Previous day">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} popoverOpen={popoverOpen} setPopoverOpen={setPopoverOpen} />
              <Button variant="outline" onClick={() => changeDate(1)} className="flex-shrink-0" aria-label="Next day">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="macros">Macros</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="flex justify-center py-8">
                  <Gauge
                    remainingCalories={remainingCalories}
                    data={data}
                    gaugeColor={gaugeColor}
                    percentage={percentage}
                    plan={plan}
                  />
                </div>
                <div className="mt-4 text-center space-y-2">
                  <p className="text-sm font-medium">
                    You've consumed <span className="font-semibold">{data.caloriesConsumed}</span> calories out of your daily goal of <span className="font-semibold">{plan?.dailyCalories ?? 0}</span>.
                  </p>
                  <p className={`text-sm ${remainingCalories > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remainingCalories > 0
                      ? `You have ${remainingCalories} calories remaining for today.`
                      : `You've exceeded your daily caloric intake by ${Math.abs(remainingCalories)} calories.`}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="macros">
                <div className="space-y-4 py-4">
                  <MacroProgress label="Carbs" consumed={data.carbsConsumed} total={plan?.dailyCarbs ?? 0} />
                  <MacroProgress label="Proteins" consumed={data.proteinsConsumed} total={plan?.dailyProteins ?? 0} />
                  <MacroProgress label="Fats" consumed={data.fatsConsumed} total={plan?.dailyFats ?? 0} />
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-4 py-4">
                  <DetailItem icon={<Utensils className="h-5 w-5" />} label="Total Calories" value={`${data.caloriesConsumed} / ${plan?.dailyCalories ?? 0}`} />
                  <DetailItem icon={<Activity className="h-5 w-5" />} label="Remaining" value={`${remainingCalories} calories`} />
                  <DetailItem icon={<Scale className="h-5 w-5" />} label="Macro Split" value={`${plan?.carbPercentage ?? 0}/${plan?.proteinPercentage ?? 0}/${plan?.fatPercentage ?? 0}`} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="flex-1 shadow-md mb-5">
          <CardHeader>
            <CardTitle className='py-2'>Nutrition Tracker</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recent Intakes</h3>
              {recentIntakes.map((intake, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{intake.date}</span>
                  <span>{intake.calories} calories</span>
                </div>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Intake
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add your intakes</DialogTitle>
                </DialogHeader>
                <IntakeForm form={form} onSubmit={onSubmit} />
              </DialogContent>
            </Dialog>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full">
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress Report
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Adjust Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

interface MacroProgressProps {
  label: string;
  consumed: number;
  total: number;
}

function MacroProgress({ label, consumed, total }: MacroProgressProps) {
  const percentage = Math.min((consumed / total) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {consumed}g / {total}g
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  );
}