"use client"

import OrdersTable from "./components/ordersTable"
import {
  nursingHeaderNames,
  respHeaderNames,
  laboratoryHeaderNames,
  consultHeaderNames,
} from "./components/orderData"
import { useSimulationTime, type OrdersRow } from "../context/SimulationTimeContext"


// import { Skeleton } from "@/components/ui/skeleton"

const OrdersPage = () => {
  const { isLoading: ctxLoading, orders } = useSimulationTime()

  const toUIOrderRow = (o: OrdersRow) => {
    return {
      displayName: o.title,
      title: o.title,
      details: o.details,
      status: o.status,
      orderingProvider: o.provider,
      important: o.is_important,
      visibleInPresim: o.is_in_presim,
    }
  }

  const nursingUiOrders = ctxLoading
    ? []
    : orders.filter((o) => o.category === "Nursing").map(toUIOrderRow)
  const respiratoryUiOrders = ctxLoading
    ? []
    : orders
        .filter((o) => o.category === "Respiratory")
        .map(toUIOrderRow)
  const laboratoryUiOrders = ctxLoading
    ? []
    : orders
        .filter((o) => o.category === "Laboratory")
        .map(toUIOrderRow)
  const consultUiOrders = ctxLoading
    ? []
    : orders.filter((o) => o.category === "Consult").map(toUIOrderRow)


  // arrays for tanstack table to iterate over to build columns 
  const orderColumns = ["details", "status", "orderingProvider"]

  // if (isLoading || isFetching) {
  //   return (
  //     <div className="flex flex-col h-full w-full pt-16 bg-gray-100 justify-start items-center gap-6">
  //       <Skeleton className="w-5/6 h-16 rounded-xl bg-gray-200" />
  //       <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
  //       <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
  //       <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
  //       <Skeleton className="w-5/6 h-8 rounded-xl bg-gray-200" />
  //     </div>
  //   );
  // }


  return (
    <div className="px-2 pt-4 w-full h-[calc(100vh-4rem)] flex flex-col gap-4 justify-start items-center bg-gray-100 overflow-y-auto">
      <div className="flex w-full h-full flex-col gap-4 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        <OrdersTable color="bg-blue-300" columnNames={orderColumns} headerNames={nursingHeaderNames} data={nursingUiOrders} />
        <OrdersTable color="bg-lime-200" columnNames={orderColumns} headerNames={respHeaderNames} data={respiratoryUiOrders} />
        <OrdersTable color="bg-fuchsia-200" columnNames={orderColumns} headerNames={laboratoryHeaderNames} data={laboratoryUiOrders} />
        <OrdersTable color="bg-yellow-200" columnNames={orderColumns} headerNames={consultHeaderNames} data={consultUiOrders} />
      </div>
    </div>
  )
}

export default OrdersPage