import { useGetMarQuery } from "@/app/apiSlice";
import { format } from 'date-fns'
import MedCard from "./medCard";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import type { AllMedicationTypes, MedAdministrationInstance } from "./marData";

export interface MedCardColumns { 
  startTime: Date;
  endTime: Date; 
  colHeader: string;
}


export default function Mar() {

  const { data, isLoading, isFetching, isError, error } = useGetMarQuery()
  const [realWorldNow, setRealWorldNow] = useState(new Date());

  const medicationOrders = data?.medicationOrders || []; 
  const allMedications = data?.allMedications || []; 
  const medAdministrations = data?.medAdministrations || [];

  // lookup map grouping all administrations by order id
  const groupedAdministrationsMap = useMemo(() => {
    return medAdministrations.reduce((acc, admin) => {
      if (!acc[admin.medicationOrderId]) {
        acc[admin.medicationOrderId] = [];
      }
      acc[admin.medicationOrderId].push(admin)
      return acc
    }, {} as { [orderId: string]: MedAdministrationInstance[] })
  }, [medAdministrations])

  // map only needs to be created if a new med and order are added to the sim by a prof
  const medLookupMap = useMemo(() => {
    return allMedications.reduce((acc, med) => {
      acc[med.id] = med;
      return acc;
    }, {} as { [id: string]: AllMedicationTypes });
  }, [allMedications]);
  console.log(medLookupMap)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRealWorldNow(new Date());
    }, 60 * 1000)
    return () => clearInterval(intervalId);
  }, []);





  if (isLoading || isFetching) {
    return (
      <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] grid gap-4 p-4 bg-gray-100 overflow-y-auto">
        <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
          <Skeleton className="w-full h-30 px-4 bg-gray-200" />
          <Skeleton className="w-full h-30 px-4 bg-gray-200" />      
          <Skeleton className="w-full h-30 px-4 bg-gray-200" />      
          <Skeleton className="w-full h-30 px-4 bg-gray-200" />      
        </div>
      </div> 
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
       <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] grid gap-4 p-4 bg-gray-100 overflow-y-auto">
        <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
          <p>Error loading med data </p>
        </div>
      </div> 
    )
  }

    if (!data || Object.keys(data).length === 0) {
      return(
       <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] grid gap-4 p-4 bg-gray-100 overflow-y-auto">
        <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
          <p>No med data exists</p>
        </div>
      </div> 
      )
    }

  // const sessionStartDate = new Date(sessionStartDateString)

  const columnAnchorTime = new Date(
    realWorldNow.getFullYear(),
    realWorldNow.getMonth(),
    realWorldNow.getDate(),
    realWorldNow.getHours(),
    0, 0, 0
  )

  const columnCount = 6
  const displayColumns = [] as MedCardColumns[]

  for (let i = 0; i < columnCount; i++ ) {
    const colStartTime = new Date(columnAnchorTime.getTime() - ((i - 2) * 60 * 60 * 1000));
    const colEndTime = new Date(columnAnchorTime.getTime() - ((i - 3) * 60 * 60 * 1000) - 1);
    const colHeader = format(colStartTime, 'HH00');

    displayColumns.push({ startTime: colStartTime, endTime: colEndTime, colHeader: colHeader })

  }

  return (
    <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] grid gap-4 p-4 bg-gray-100 overflow-y-auto">
      <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        {medicationOrders.map((order) => {
          const associatedMedication = medLookupMap[order.medicationId]
          const orderSpecifcAdministrations = groupedAdministrationsMap[order.id]
          if (!associatedMedication) {
            console.log(order.id, '!!!')

            console.warn(`Med ${order.medicationId} not found for order ${order.id}`)
            return null
          }

          return(
            <MedCard
              key={order.id}
              medication={associatedMedication}
              administrations={orderSpecifcAdministrations}
              order={order}
              columns={displayColumns}

               />      
          )
        })}
      </div>
    </div> 
  )
}
