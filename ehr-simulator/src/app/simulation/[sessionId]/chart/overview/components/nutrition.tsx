"use client"

import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const Nutrition = () => {
  const { orders } = useSimulationTime()
  const dietOrders = orders.filter((order) => order.category === "Diet")
  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-sky-200" firstLetter="N" secondLetter="utrition" />
      <CardContent className="grid gap-2 px-4">
        {dietOrders.length === 0 ? (
          <p className="text-sm text-slate-600">No nutrition orders documented.</p>
        ) : (
          dietOrders.map((order) => (
            <div key={order.id} className="flex pl-2 gap-3">
              <p className="text-md  font-light tracking-tight">Diet:</p>
              <p className=" text-md tracking-tight">{order.title}</p>
            </div>
          ))
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}

export default Nutrition