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
    <div className="flex justify-end pb-1">
      <ChevronLeft
        onClick={handlePrevDay}
        className="cursor-pointer hover:opacity-50"
        size={26} />
      <ChevronRight
        onClick={handleNextDay}
        className="cursor-pointer hover:opacity-50"
        size={26} />
    </div>
    <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Your Intakes</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalIntakes.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Calories left
                          </tspan>
                        </text>
                      );
                    }
                  } } />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="Daily"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-desktop)"
                className="stroke-transparent stroke-2" />
              <RadialBar
                dataKey="Actual"
                fill="var(--color-mobile)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2" />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
        </CardFooter>
      </Card>
    </>
  )
}