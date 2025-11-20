
'use client'

import { Tooltip } from "@radix-ui/react-tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import StyledTitle from "./styledTitle"
import { useGetOrdersQuery } from "@/app/store/apiSlice"
import CardSkeleton from "./cardSkeleton"

const RecurringOrders = () => {
  const { data, isLoading, isError, isFetching, error } = useGetOrdersQuery();

  if (isLoading || (isFetching && !data)) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-sky-200" firstLetter="R" secondLetter="ecurring Orders" />
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
        <p>Failed to load data</p>
      </Card>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
        <p>No data exists</p>
      </Card>
    )
  }

  const { nursingOrders, labOrders: labratoryOrders } = data;



  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-sky-200" firstLetter="R" secondLetter="ecurring Orders" />
      <CardContent className="grid gap-4 px-8">
        <div className="flex flex-col w-full items-start gap-1">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">Nursing</p>
            {/* Mark nursing orders as routine to display here */}
            {nursingOrders.map(order => {
              const isRecurring = order?.recurring
              if (isRecurring && isRecurring === true) {
                return (
                  <div key={order.displayName} className="flex pl-2 gap-3 items-center">
                    <p className="text-xs text-neutral-500 tracking-tight">{order.displayName}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={14} color="#d1d5db" />
                        </TooltipTrigger>
                        <TooltipContent className="w-fit">
                          <p className="max-w-120  text-wrap">{order.details}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )
              }
            })}

            <p className="text-sm font-medium leading-none">Labs</p>
            {/* Mark nursing orders as routine to display here */}
            {labratoryOrders.map(order => {
              const isRecurring = order?.recurring
              if (isRecurring && isRecurring === true) {
                return (
                  <div key={order.displayName} className="flex pl-2 gap-3 items-center">
                    <p className="text-xs text-neutral-500 tracking-tight">{order.displayName}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={14} color="#d1d5db" />
                        </TooltipTrigger>
                        <TooltipContent className="w-fit">
                          <p className="max-w-120  text-wrap">{order.details}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}

export default RecurringOrders