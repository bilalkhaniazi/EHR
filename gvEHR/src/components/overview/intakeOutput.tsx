"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import StyledTitle from "./styledTitle"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "0000-0800", intake: 886, output: 400 },
  { month: "0801-1600", intake: 405, output: 290 },
  { month: "1601-0000", intake: 837, output: 420 },
  { month: "0001-0800", intake: 730, output: 390 },
]

const chartConfig = {
  intake: {
    label: "Intake",
    color: "#fef08a",
  },
  output: {
    label: "Output",
    color: "#bae6fd",
  },
} satisfies ChartConfig

export function IntakeOutput() {
  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-sky-200" firstLetter="I" secondLetter="ntake/Output" />
      <CardContent className="grid gap-2 px-4">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis 
              axisLine={false}
              tickLine={false} 
              unit="mL"
              className=""/>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0,4)}
              className="text-wrap"
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend className="text-xs  pt-1 text-neutral-700" content={<ChartLegendContent />} />
             <Bar
              dataKey="output"
              stackId="a"
              fill="#fef08a"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="intake"
              stackId="a"
              fill="#bae6fd"
              radius={[4, 4, 0, 0]}
            />
           
          </BarChart>
        </ChartContainer>
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}
