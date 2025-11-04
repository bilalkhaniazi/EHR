'use client'

import { useGetChartQuery } from "@/app/store/apiSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StyledTitle from "./styledTitle"
import CardSkeleton from "./cardSkeleton"
import type { ChartData } from "@/app/simulation/[sessionId]/chart/components/chartData";

const ActiveProblems = () => {
  const {data, isLoading, isError, isFetching, error} = useGetChartQuery()

  if (isLoading || isFetching ) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
        <CardSkeleton />
      </Card>
    )
  }

  // from RTK query docs
  if (isError) {
    let errorMessage = "An unknown error occurred.";
    if (error) {
      if ('status' in error && error.status) {
        errorMessage = `Error ${error.status}`;
        if ('data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data) {
          errorMessage += `: ${(error.data as any).message}`;
        }
      } else if ('message' in error) {
        errorMessage = `Error: ${error.message}`;
      } else {
        errorMessage = `Error: ${JSON.stringify(error)}`;
      }
    }
    console.log(errorMessage)
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
        <p>Failed to load data</p>
      </Card>

    )
  }

  const chartData: ChartData | undefined = data?.chartData

  if (!chartData || Object.keys(chartData).length === 0) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
        <p>No data exists</p>
      </Card>
    )
  }

  const pmh = chartData.pmh.value;

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
      <CardContent className="px-4 space-y-1">
        {pmh.map(problem => {
          return(
            <div key={problem} className="">
              <p className="text-sm">{problem}</p>
              <Separator className="bg-red-200" />
            </div>
          )
        })}
      </CardContent>
      <div className="absolute bottom-0 bg-red-200 w-full h-3"></div>
    </Card>
  )
}

export default ActiveProblems