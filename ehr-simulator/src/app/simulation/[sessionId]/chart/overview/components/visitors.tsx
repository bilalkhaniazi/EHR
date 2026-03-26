'use client'

import { Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const Visitors = () => {
  const { caseRow } = useSimulationTime()
  const contactName = caseRow?.emergency_contact_name?.trim() ?? ""
  const contactRelationship = caseRow?.emergency_contact_relationship?.trim() ?? ""

  if (!contactName) {
    return (
      <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
        <StyledTitle color="bg-red-200" firstLetter="C" secondLetter="ontacts" />
        <CardContent className="px-4 py-2">
          <p className="text-sm text-slate-600">No contact info documented.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-lime-200" firstLetter="C" secondLetter="ontacts" />
      <CardContent className="grid gap-4 px-8">
        <div className="flex flex-col w-full items-start gap-1">
          <p className="text-md font-medium leading-none">{contactName}</p>
          <div className="flex pl-2 gap-3">
            <p className="text-sm text-neutral-500 tracking-tight">Relationship:</p>
            <p className="text-neutral-500 text-sm">{contactRelationship || "N/A"}</p>
          </div>
          <div className="flex items-center pl-2 gap-2">
            <Phone size={14} color="#737373" />
            <p className="text-sm text-neutral-500 tracking-tight">Not provided</p>
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 bg-lime-200 w-full h-3"></div>

    </Card>
  )
}

export default Visitors
