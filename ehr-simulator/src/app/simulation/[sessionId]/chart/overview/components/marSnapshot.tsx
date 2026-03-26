"use client"

import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const MarSnapshot = () => {
  const { medicationAdministrations } = useSimulationTime()
  const latest = medicationAdministrations
    .slice()
    .sort((a, b) => b.time_offset - a.time_offset)[0]

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-red-200" firstLetter="M" secondLetter="AR Snapshot" />
      <CardContent className="px-4 space-y-1">
        {latest ? (
          <div className="space-y-1 text-sm text-neutral-700">
            <p>
              <span className="font-medium">Status:</span> {latest.status ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Time Offset:</span> {latest.time_offset}
            </p>
            <p>
              <span className="font-medium">Administrator:</span> {latest.administrator ?? "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">No MAR administrations documented.</p>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-red-200 w-full h-3"></div>
    </Card>
  )
}

export default MarSnapshot