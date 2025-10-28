'use client'

import { Phone } from "lucide-react"
import { Card, CardContent  } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useGetChartQuery } from "@/app/store/apiSlice"
import CardSkeleton from "./cardSkeleton"
import type { ChartData } from "@/app/simulation/[sessionId]/chart/components/chartData"

const Visitors = () => {
  const { data, isLoading, isError, isFetching, error } = useGetChartQuery();

  if (isLoading || isFetching) {
    return (
      <Card className="relative pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-lime-200" firstLetter="C" secondLetter="ontacts" />
        <CardSkeleton />
      </Card>
    )
  }

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
        <p>Error: {errorMessage}</p>
      </Card>
    )
  }

  const chartData: ChartData | undefined  = data?.chartData

  if (!chartData || Object.keys(chartData).length === 0 ) {
    return(
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="C" secondLetter="ontacts" />
        <p>No contact info</p>
      </Card>
    )
  }

  const contactItems = chartData.supportPersons.value

  return (
    <Card className="relative pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-lime-200" firstLetter="C" secondLetter="ontacts" />
        <CardContent className="grid gap-4 px-8">
          {contactItems.map((person, index) => {
            return (
              <div key={`${person.name}-${index}`} className="flex flex-col w-full items-start gap-1">
                <p className="text-md font-medium leading-none">{person.name}</p>
                <div className="flex pl-2 gap-3">
                  <p className="text-sm text-neutral-500 tracking-tight">Relationship:</p>
                  <p className="text-neutral-500 text-sm">{person.relationship}</p>
                </div>
                <div className="flex items-center pl-2 gap-2">
                  <Phone size={14} color="#737373" />
                  <p className="text-sm text-neutral-500 tracking-tight">{person.phone}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>

    </Card>
  )
}

export default Visitors
