"use client"

import OrdersTable from "./components/ordersTable"
import { 
  nursingHeaderNames, 
  respHeaderNames, 
  medHeaderNames,
  laboratoryHeaderNames,
  consultHeaderNames,
} from "./components/orderData"


import { useGetOrdersQuery } from "@/app/store/apiSlice"
import { Skeleton } from "@/components/ui/skeleton"

const OrdersPage = () => {
  const { data, isLoading, isFetching, isError, error } = useGetOrdersQuery();
  
  const nursingOrderData = data?.nursingOrders || []
  const labOrderData = data?.labOrders || []
  const medicationData = data?.medicationData || []
  const respiratoryOrderData = data?.respiratoryOrders || []
  const consultOrderData = data?.consultOrders || []




  // arrays for tanstack table to iterate over to build columns 
  const orderColumns = ["details", "status", "orderingProvider"]
  const medOrderColumns = ["dose",  "route", "frequency", "priority", "administrationInstructions", "orderingProvider"]
  
  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col h-full w-full pt-16 bg-gray-100 justify-start items-center gap-6">
        <Skeleton className="w-5/6 h-16 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
        <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full bg-gray-100 justify-center items-center px-4 py-2">
        <p className="text-red-600">Error: {error ? (error as any).message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] flex flex-col gap-4 justify-start items-center bg-gray-100 overflow-y-auto">
      <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        <OrdersTable color="bg-blue-300" columnNames={orderColumns} headerNames={nursingHeaderNames} data={nursingOrderData} />
        <OrdersTable color="bg-red-300" columnNames={medOrderColumns} headerNames={medHeaderNames} data={medicationData} />
        <OrdersTable color="bg-lime-200" columnNames={orderColumns} headerNames={respHeaderNames} data={respiratoryOrderData} />
        <OrdersTable color="bg-fuchsia-200" columnNames={orderColumns} headerNames={laboratoryHeaderNames} data={labOrderData} />
        <OrdersTable color="bg-yellow-200" columnNames={orderColumns} headerNames={consultHeaderNames} data={consultOrderData} />
      </div>
    </div>
  )
}

export default OrdersPage