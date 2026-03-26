"use client"
import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

export function IntakeOutput() {
  const { documentationResults } = useSimulationTime()
  const latest = documentationResults
    .slice()
    .sort((a, b) => b.time_offset - a.time_offset)[0]
  const intake = latest?.enteral_nutrition ?? latest?.parenteral_nutrition ?? "N/A"
  const output = latest?.enteral_output ?? latest?.voiding ?? "N/A"

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-sky-200" firstLetter="I" secondLetter="ntake/Output" />
      <CardContent className="grid gap-2 px-4">
        {latest ? (
          <div className="space-y-2">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">Intake:</span> {intake}
            </p>
            <p className="text-sm text-neutral-700">
              <span className="font-medium">Output:</span> {output}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">No intake/output documented.</p>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}
