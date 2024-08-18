"use client"
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
} from "@/components/ui/chart"
import { useState } from "react"
import Chart from "./Chart";


const chartData = [{ Daily: 1260, Actual: 570, date: (new Date()) }]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "green",
  },
  mobile: {
    label: "Mobile",
    color: "secondary",
  },
} satisfies ChartConfig



export function Overview() {
  

  const totalIntakes =  chartData[0].Daily - chartData[0].Actual

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
    <h1 className='mt-24 text-4xl font-medium'>Overview</h1>
    <div className='md:flex mt-4 gap-4'>
      <Card className="flex-1 shadow-md md:w-1/2 mb-5 sm:m-0">
        <div className="flex justify-end m-3">
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
      </Card>

      <Card className="shadow-md md:w-1/2">
        <CardHeader className="items-center ">
          <CardTitle>Nutrition</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
      </Card>

    </div>
    </>
      
  )
}