'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const ActiveProblems = () => {
  const { caseRow } = useSimulationTime()
  const pmh = caseRow?.medical_history ?? []
  if (!pmh.length) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
        <CardContent className="px-4 py-2">
          <p className="text-sm text-slate-600">No active problems documented.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-red-200" firstLetter="A" secondLetter="ctive Problems" />
      <CardContent className="px-4 space-y-1">
        {pmh.map((problem) => {
          return (
            <div key={problem} className="group">
              <p className="text-sm">{problem}</p>
              <Separator className="bg-red-200" />
            </div>
          )
        })}
      </CardContent>
      <div className="absolute bottom-0 bg-red-200 w-full h-3"></div>
    </Card>
  )
}

export default ActiveProblems