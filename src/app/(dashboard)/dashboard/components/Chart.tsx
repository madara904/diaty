import { ChartContainer } from '@/components/ui/chart';
import React from 'react'
import { RadialBarChart, PolarRadiusAxis, Label, RadialBar } from 'recharts';



interface ChartConfigItem {
    label: string;
    color: string;
  }
  

  interface ChartConfig {
    [key: string]: ChartConfigItem; 
  }
  

  interface ChartProps {
    chartData: ChartDataItem[];
    chartConfig: ChartConfig;
    totalIntakes: number
  }
  

  interface ChartDataItem {
    Daily: number;
    Actual: number;
    date: Date;
  }


const Chart = ( {chartConfig, chartData, totalIntakes} : ChartProps ) => {
  return (
    <ChartContainer
    config={chartConfig}
    className="mx-auto aspect-square w-full max-w-[200px]"
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
  )
}

export default Chart