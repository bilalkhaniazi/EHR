'use client'

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import StyledTitle from "./styledTitle"
import { useSimulationTime } from "../../context/SimulationTimeContext"

type Finding = { region: string; description: string }

function normalizeFindings(findings: unknown): Finding[] {
  if (!findings) return []
  if (!Array.isArray(findings)) return []

  return findings
    .map((item: unknown) => {
      const maybe = item as { region?: unknown; description?: unknown } | null | undefined
      const region = maybe && typeof maybe.region === "string" ? maybe.region : ""
      const description =
        maybe && typeof maybe.description === "string" ? maybe.description : ""
      return { region, description }
    })
    .filter((x) => x.region || x.description)
}

const Imaging = () => {
  const { isLoading, imagingReports } = useSimulationTime()

  const hasAnyImaging = imagingReports.length > 0

  const renderedReports = useMemo(() => {
    return imagingReports.map((r) => {
      const findings = normalizeFindings(r.findings)
      const impressions = Array.isArray(r.impressions) ? r.impressions : []

      return {
        id: r.id,
        name: r.name,
        findings,
        impressions,
      }
    })
  }, [imagingReports])

  return (
    <Card className="relative col-span-1 pt-2 overflow-hidden h-fit gap-3">
      <StyledTitle color="bg-sky-200" firstLetter="I" secondLetter="maging" />
      <CardContent className="px-4 space-y-2">
        {isLoading ? (
          <p className="text-sm text-slate-600">Loading imaging...</p>
        ) : !hasAnyImaging ? (
          <p className="text-sm text-slate-600">No imaging available</p>
        ) : (
          <div className="space-y-3">
            {renderedReports.map((r) => (
              <div key={r.id} className="space-y-1">
                <div className="flex items-start gap-2">
                  <p className="text-sm font-medium text-slate-900">{r.name || "Unnamed imaging report"}</p>
                </div>

                <Separator className="bg-sky-200" />

                <p className="text-xs font-semibold text-slate-700">Findings</p>
                {r.findings.length === 0 ? (
                  <p className="text-sm text-slate-600">N/A</p>
                ) : (
                  <ul className="space-y-1 pl-4 list-disc">
                    {r.findings.map((f, idx) => (
                      <li key={`${r.id}-f-${idx}`} className="text-sm text-slate-700">
                        {f.region ? <span className="font-medium">{f.region}: </span> : null}
                        {f.description}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="text-xs font-semibold text-slate-700 mt-2">Impression</p>
                {r.impressions.length === 0 ? (
                  <p className="text-sm text-slate-600">N/A</p>
                ) : (
                  <ul className="space-y-1 pl-4 list-disc">
                    {r.impressions.map((imp, idx) => (
                      <li key={`${r.id}-i-${idx}`} className="text-sm text-slate-700">
                        {imp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}

export default Imaging
