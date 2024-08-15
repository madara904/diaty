"use client"
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { format, addDays, subDays } from 'date-fns';
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react';
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
const chartData = [{ Daily: 1260, Actual: 570 }]
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



export function OverviewChart() {
  

  const totalIntakes = chartData[0].Daily - chartData[0].Actual

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Function to move to the previous day
  const handlePrevDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  // Function to move to the next day
  const handleNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  // Format the date to display it nicely
  const formattedDate = format(currentDate, 'MMMM dd, yyyy');

  return (

    <>
    <div className="flex w-full justify-end">
      <CircleArrowLeft
        onClick={handlePrevDay}
        style={{ cursor: 'pointer' }}
        size={24} />
      <CircleArrowRight
        onClick={handleNextDay}
        style={{ cursor: 'pointer' }}
        size={24} />
    </div>
    <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Your Intakes</CardTitle>
          <span>{formattedDate}</span>
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />} />
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