import { CircleUserRound, Info } from "lucide-react";
import { type ChartSidebarData, type Contact, type StringValueItem } from "./chartData";
import { useGetChartQuery } from "@/app/apiSlice";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


function ChartSidebarSkeleton() {
  return (
    <div className="flex flex-col items-center justify-start h-full w-full py-8 gap-3">
      <Skeleton className="h-28 w-1/2 bg-gray-300 rounded-full mb-6" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300" />
      <Skeleton className="h-4 w-3/5 bg-gray-300" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300 mb-6" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300" /> 
      <Skeleton className="h-4 w-5/8 bg-gray-300 mb-6" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300" /> 
      <Skeleton className="h-4 w-3/4 bg-gray-300" /> 
    </div>
  );
} 

export default function ChartSidebar() {
  const { data, isLoading, isError, error, isFetching } = useGetChartQuery()

  if (isLoading || isFetching && !data) {
    return (
      <div className="w-72 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
        <ChartSidebarSkeleton  />
      </div>
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
      <div className="w-72 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
        <p>Failed to load data</p>
      </div>

    )
  }


  const sidebarData: ChartSidebarData | undefined = data?.chartData;

  if (!sidebarData || Object.keys(sidebarData).length === 0) {
    return (
      <div className="w-72 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
        <p>No patient data.</p>
      </div>
    )
  }

  const nameItem = sidebarData.identifiers.find(item => item.id === 'name') as StringValueItem | undefined;
  const dobItem = sidebarData.identifiers.find(item => item.id === 'dob') as StringValueItem | undefined;
  const mrnItem = sidebarData.identifiers.find(item => item.id === 'mrn') as StringValueItem | undefined;

  return (
    <div className="w-72 h-[calc(100vh-4rem)] flex flex-col justify-start items-center bg-gray-200 border-r border-gray-300 p-2 flex-shrink-0">
        <span className="rounded-full p-1 bg-gray-100 shadow-md">
          <CircleUserRound size={116} strokeWidth={0.8} color="oklch(38% 0.189 293.745)" className="rounded-full bg-white"/>
        </span>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-purple-900 text-lg font-medium tracking-tight">
            {nameItem?.value ?? "N/A"}
          </h1>
          <p className="text-purple-900 text-sm font-light tracking-tight">
            {dobItem?.label ?? "N/A"}
            <span className="pl-2 font-normal">{dobItem?.value ?? "N/A"}</span>
          </p>
          <p className="text-purple-900 text-sm font-light tracking-tight">
            {mrnItem?.label ?? 'N/A'}:
            <span className="pl-2 font-normal">{mrnItem?.value ?? "N/A"}</span>
          </p>
        </div>

        <div className="flex flex-col h-fit max-h-full py-4 px-2 rounded-lg shadow-md mt-4 border gap-6 bg-white overflow-y-auto">
          {/*Demographic Data */}
          <div className="relative flex flex-col border bg-white border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
            <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl  px-1">Demographics</p>
            {Object.values(sidebarData.demographics).map((row) => {
              return(
                <p key={row.label} className="text-purple-900 text-xs font-light tracking-tight">
                  <span className="underline">{row.label}:</span>
                  <span className="pl-2 font-normal">{row.value}</span>
                </p>
              );
            })}
          </div>

          {/*Clinical Data */}
          <div className="relative flex flex-col bg-white border border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
            <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl px-1">Clinical Info</p>
            {Object.values(sidebarData.clinicalInfo).map((row) => {
              const isIsolationRow = row.id === "isolation";

              return(
                <p key={row.label} className="text-purple-900 text-xs font-light tracking-tight  ">
                  <span className="underline pr-2 text-nowrap">{row.label}:</span>
                  <span className={`font-normal decoration-none no-underline ${isIsolationRow ? 'px-2 bg-yellow-200 rounded-md' : ''}`}>
                    {Array.isArray(row.value) ? row.value.join(", ") : row.value}
                  </span>
                  {isIsolationRow && 'tooltip' in row &&
                    <span className="pl-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={14} color="oklch(38.1% 0.176 304.987)" />
                          </TooltipTrigger>
                          <TooltipContent className="w-fit">
                            <p className="max-w-120 text-wrap">{row.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  }
                </p>
              );
            })}
          </div>

          {/*Social Data */}
          <div className="relative flex flex-col bg-white border border-purple-900 w-full h-fit px-2 py-3 gap-1 rounded-lg shadow-md">
            <p className="font-medium text-purple-900 tracking-tight -top-3 absolute left-2 bg-white rounded-2xl px-1">Social Info</p>
            
            {/* handle Contact type or string */}
            {Object.values(sidebarData.socialFactors).map((row) => {
              const isSupportPersonArray = Array.isArray(row.value);
              const displayValue = isSupportPersonArray
                ? (row.value as Contact[]).map(person => person.name).join(', ')
                : String(row.value); 
              return(
                <p key={row.label} className="text-purple-900 text-xs font-light tracking-tight">
                  <span className="underline">{row.label}:</span>
                  <span className="pl-2 font-normal">{displayValue}</span>
                </p>
              )
            })}
              
          </div>
        </div>

      </div>
  )
}