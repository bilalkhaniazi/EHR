'use client'

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

const Microbiology = () => {
  const { isLoading, microbiologyReports, labIdsAtSelectedTime } = useSimulationTime()

  const filteredReports = useMemo(() => {
    return microbiologyReports.filter((r) => labIdsAtSelectedTime.has(r.lab_id))
  }, [microbiologyReports, labIdsAtSelectedTime])

  const renderedReports = useMemo(() => {
    return filteredReports.map((r) => ({
      id: r.id,
      organismName: r.name,
      specimen: r.sample_type,
      sensitivities: r.sensitivity,
      results: r.culture_results,
    }))
  }, [filteredReports])

  const hasAny = renderedReports.length > 0

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-indigo-200" firstLetter="M" secondLetter="icrobiology" />
      <CardContent className="px-4 space-y-2">
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading microbiology...</p>
        ) : !hasAny ? (
          <p className="text-sm text-slate-600">No microbiology data available</p>
        ) : (
          <div className="space-y-3">
            {renderedReports.map((r) => (
              <div key={r.id} className="space-y-1">
                <p className="text-sm font-medium text-slate-900">{r.organismName || "Unnamed organism"}</p>
                <Separator className="bg-indigo-200" />

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700">Specimen</p>
                  <p className="text-sm text-slate-800">{r.specimen || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700">Sensitivities</p>
                  <p className="text-sm text-slate-800">{r.sensitivities || "N/A"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700">Results</p>
                  <p className="text-sm text-slate-800">{r.results || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-indigo-200 w-full h-3"></div>
    </Card>
  )
}

export default Microbiology
