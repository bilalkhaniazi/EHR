"use client"

import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { Separator } from "@/components/ui/separator"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const FamilyHistory = () => {
  const { familyHistory } = useSimulationTime()
  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-lime-200" firstLetter="F" secondLetter="amily History" />
      <CardContent className="px-4 space-y-1">
        {familyHistory.length === 0 ? (
          <p className="text-sm text-slate-600">No family history documented.</p>
        ) : (
          <div className="flex flex-col gap-1 w-full">
            {familyHistory.map((item) => (
              <div key={item.id} className="group">
                <div className="flex w-full pb-1">
                  <p className="text-sm flex-1 pr-2 font-light text-nowrap">
                    {(item.relationship_types?.name ?? "Unknown")}:
                  </p>
                  <p className="text-sm w-full">{item.condition}</p>
                </div>
                <Separator className="bg-lime-200 group-last:bg-transparent" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>
    </Card>
  )
}

export default FamilyHistory