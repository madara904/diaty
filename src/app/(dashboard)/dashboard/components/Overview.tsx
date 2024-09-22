"use client";
import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/Button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from 'next-auth';
import { Plan } from '@/types/plan';
import DatePicker from './DatePicker';
import IntakeForm from './IntakeForm';
import Gauge from './Chart';

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

export function Overview({ user, plan }: OverviewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Calories: 0,
      Carbs: 0,
      Fats: 0,
      Proteins: 0,
    },
  });

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
      <h1 className='mt-24 text-4xl font-medium'>Overview</h1>
      <div className="flex flex-col md:flex-row mt-4 gap-4">
        <Card className="flex-1 shadow-md mb-5">
          <CardHeader className="flex justify-between items-center">
            <div>
              <Button variant="outline" onClick={() => changeDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} popoverOpen={popoverOpen} setPopoverOpen={setPopoverOpen} />
              <Button variant="outline" onClick={() => changeDate(1)} className="flex-shrink-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex justify-center py-12'>
              <Gauge remainingCalories={remainingCalories} data={data} gaugeColor={gaugeColor} percentage={percentage} plan={plan} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between py-5 text-sm">
            <div>
              <p>Carbs</p>
              <p><span className='font-bold'>{data.carbsConsumed}g</span> / {plan?.dailyCarbs}g</p>
            </div>
            <div>
              <p>Proteins</p>
              <p><span className='font-bold'>{data.proteinsConsumed}g</span> / {plan?.dailyProteins}g</p>
            </div>
            <div>
              <p>Fats</p>
              <p><span className='font-bold'>{data.fatsConsumed}g</span> / {plan?.dailyFats}g</p>
            </div>
          </CardFooter>
        </Card>
        <Card className="flex-1 shadow-md mb-5">
          <CardHeader>
            <CardTitle>Track Your Intakes</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add new Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add your intakes</DialogTitle>
                </DialogHeader>
                <IntakeForm form={form} onSubmit={onSubmit} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </>
  );
}