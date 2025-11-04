'use client'
import { useGetChartQuery } from "@/app/store/apiSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StyledTitle from "./styledTitle"
import CardSkeleton from "./cardSkeleton"
import type { ChartData } from "@/app/simulation/[sessionId]/chart/components/chartData"

const Demographics = () => {
  const {data, isLoading, isError, isFetching, error} = useGetChartQuery()

  if (isLoading || isFetching ) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-lime-200" firstLetter="D" secondLetter="emograhics" />
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
        <StyledTitle color="bg-lime-200" firstLetter="D" secondLetter="emograhics" />
        <p>Failed to load data</p>
      </Card>

    )
  }

  const chartData: ChartData | undefined = data?.chartData

  if (!chartData || Object.keys(chartData).length === 0) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-lime-200" firstLetter="D" secondLetter="emograhics" />
        <p>No data exists</p>
      </Card>
    )
  }

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-lime-200" firstLetter="D" secondLetter="emograhics" />
      <CardContent className="px-4 space-y-1">
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.gender.label}: </p>
              <p className="text-sm">{chartData.gender.value}</p>
            </div>
            <Separator className="bg-lime-200" />
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.genderIdentity.label}: </p>
              <p className="text-sm">{chartData.genderIdentity.value}</p>
            </div>
            <Separator className="bg-lime-200" />
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.pronouns.label}: </p>
              <p className="text-sm">{chartData.pronouns.value}</p>
            </div>
            <Separator className="bg-lime-200" />
                 <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.relationshipStatus.label}: </p>
              <p className="text-sm">{chartData.relationshipStatus.value}</p>
            </div>
            <Separator className="bg-lime-200" />
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.employmentStatus.label}: </p>
              <p className="text-sm">{chartData.employmentStatus.value}</p>
            </div>
            <Separator className="bg-lime-200" />
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.insurance.label}: </p>
              <p className="text-sm">{chartData.insurance.value}</p>
            </div>
            <Separator className="bg-lime-200" />
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.religion.label}: </p>
              <p className="text-sm">{chartData.religion.value}</p>
            </div>
            <Separator className="bg-lime-200" />
            <div className="flex">
              <p className="text-sm pr-2 font-light">{chartData.language.label}: </p>
              <p className="text-sm">{chartData.language.value}</p>
            </div>
            <Separator className="bg-lime-200" />
      </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>
    </Card>
  )
}

export default Demographics