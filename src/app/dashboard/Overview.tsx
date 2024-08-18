"use client"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { format, addDays, subDays } from 'date-fns';
import {  ChevronLeft , ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"
import Chart from "./components/Chart";
const chartData = [{ Daily: 1260, Actual: 570, date: (new Date()) }]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig



export function Overview() {
  

  const totalIntakes = chartData[0].Daily - chartData[0].Actual

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handlePrevDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  const formattedDate = format(currentDate, 'MMMM dd, yyyy');

  return (

    <>
    <Card className="flex-1">
    <div className="flex justify-end p-3">
      <ChevronLeft
        onClick={handlePrevDay}
        className="cursor-pointer hover:opacity-50"
        size={26} />
      <ChevronRight
        onClick={handleNextDay}
        className="cursor-pointer hover:opacity-50"
        size={26} />
    </div>
        <CardHeader className="items-center p-0">
          <CardTitle>Your Intakes</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="items-center">

          <Chart 
          chartConfig={chartConfig} 
          chartData={chartData}
          totalIntakes={totalIntakes} />

        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
        </CardFooter>
      </Card>
    </>
  )
}