'use client'

import { Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
    const err = error as unknown;

    function isStatusError(e: unknown): e is { status: number | string; data?: unknown } {
      return typeof e === "object" && e !== null && "status" in e;
    }

    function hasMessageData(e: { data?: unknown }): e is { data: { message?: string } } {
      return typeof e.data === "object" && e.data !== null && "message" in e.data;
    }

    if (isStatusError(err)) {
      errorMessage = `Error ${err.status}`;
      if (hasMessageData(err)) {
        errorMessage += `: ${err.data.message ?? JSON.stringify(err.data)}`;
      } else if ("data" in err) {
        errorMessage += `: ${JSON.stringify(err.data)}`;
      }
    } else if (typeof err === "object" && err !== null && "message" in err) {
      errorMessage = `Error: ${(err as { message: string }).message}`;
    } else {
      errorMessage = `Error: ${JSON.stringify(err)}`;
    }

    console.log(errorMessage);
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
        <p>Error: {errorMessage}</p>
      </Card>
    )
  }

  const chartData: ChartData | undefined = data?.chartData

  if (!chartData || Object.keys(chartData).length === 0) {
    return (
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
