"use client"

import { Phone } from "lucide-react"
import { Card, CardContent  } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const CareTeam = () => {
  const { caseRow } = useSimulationTime()
  const attending = caseRow?.attending_provider?.trim() ?? ""
  return(
    <Card className="relative pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-lime-200" firstLetter="C" secondLetter="are Team" />
      <CardContent className="grid gap-4 px-8">
        {!attending ? (
          <p className="text-sm text-slate-600">No care team documented.</p>
        ) : (
          <div className="flex flex-col w-full items-start gap-1">
            <p className="text-md font-medium leading-none">{attending}</p>
            <div className="flex items-center pl-2 gap-2">
              <Phone size={14} color="#737373" />
              <p className="text-sm text-neutral-500 tracking-tight">Not provided</p>
            </div>
          </div>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>

    </Card>
  )
}

export default CareTeam
