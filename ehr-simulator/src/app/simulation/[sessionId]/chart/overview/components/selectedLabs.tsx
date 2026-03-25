'use client'

import { Card, CardContent } from "@/components/ui/card"
import StyledTitle from "./styledTitle"
import { formatTimeFromOffset } from "@/app/simulation/[sessionId]/chart/charting/page"
import { getResultStatus } from "@/app/simulation/[sessionId]/chart/labs/page"
import { AlertTriangle } from "lucide-react"
import { useMemo, useState } from "react"
import { labTemplate } from "../../labs/components/labsData"
import { useSimulationTime } from "../../context/SimulationTimeContext"
import type { LabResultRow } from "../../context/SimulationTimeContext"

const selectedLabs = [
  "Sodium",
  "Potassium",
  "Creatinine",
  "Glucose",
  "RBC",
  "WBC",
  "Platelets"
];

const fieldToColumn = {
  Sodium: "sodium",
  Potassium: "potassium",
  Creatinine: "creatinine",
  Glucose: "glucose",
  RBC: "rbc",
  WBC: "wbc",
  Platelets: "platelets",
} as const satisfies Record<string, keyof LabResultRow>

export function SelectedLabs() {
  const [startTime] = useState(new Date().getTime())
  const {
    isLoading,
    labResults,
    availableTimeOffsets,
    selectedTimeOffset,
  } = useSimulationTime()

  const selectedTemplateRows = useMemo(() => {
    return selectedLabs
      .map((field) => {
        const row = labTemplate.find((r) => r.field === field && r.rowType === "results")
        if (!row) return null
        return {
          field: row.field,
          normalRange: row.normalRange,
          criticalRange: row.criticalRange,
        }
      })
      .filter(Boolean) as Array<{
        field: string
        normalRange?: { low: number; high: number }
        criticalRange?: { low: number; high: number }
      }>
  }, [])

  const { labValuesByField, effectiveOffset } = useMemo(() => {
    if (availableTimeOffsets.length === 0) {
      return { labValuesByField: {} as Record<string, number | null>, effectiveOffset: null as number | null }
    }

    const candidates = labResults.filter((r) => r.time_offset === selectedTimeOffset)

    const scoreRow = (r: LabResultRow) =>
      selectedLabs.reduce((acc, field) => {
        const col = fieldToColumn[field as keyof typeof fieldToColumn]
        return acc + (r[col] != null ? 1 : 0)
      }, 0)

    const bestRow =
      candidates.length > 0
        ? [...candidates].sort((a, b) => scoreRow(b) - scoreRow(a))[0]
        : undefined

    const values: Record<string, number | null> = {}
    for (const field of selectedLabs) {
      const col = fieldToColumn[field as keyof typeof fieldToColumn]
      values[field] = (bestRow?.[col] as number | null) ?? null
    }

    return {
      labValuesByField: values,
      effectiveOffset: selectedTimeOffset,
    }
  }, [labResults, selectedTimeOffset, availableTimeOffsets.length])

  const hasAnyLabValue = useMemo(() => {
    return selectedLabs.some((field) => labValuesByField[field] != null)
  }, [labValuesByField])

  const selectedLabData = useMemo(() => {
    if (effectiveOffset === null) return []
    const { date: displayDate, time: displayTime } = formatTimeFromOffset(
      effectiveOffset,
      startTime
    )

    return selectedTemplateRows.map((t) => {
      const value = labValuesByField[t.field] ?? null
      const valueStr = value == null ? "N/A" : String(value)

      const resultStatus = getResultStatus(valueStr, t.normalRange, t.criticalRange)
      const isCritical = resultStatus === "critical"
      const isAbnormal = resultStatus === "abnormal"

      return {
        field: t.field,
        displayDate,
        displayTime,
        value: valueStr,
        isCritical,
        isAbnormal,
      }
    })
  }, [effectiveOffset, labValuesByField, selectedTemplateRows, startTime])

  return (
    <Card className="relative col-span-1 p-0 gap-3 pt-2 h-fit overflow-hidden">
      <StyledTitle color="bg-sky-200" firstLetter="S" secondLetter="elected Labs" />
      <CardContent className="grid grid-cols-2 gap-2 px-6 pb-6">
        {isLoading ? (
          <p className="col-span-2 text-sm text-slate-600">Loading selected labs...</p>
        ) : !hasAnyLabValue ? (
          <p className="col-span-2 text-sm text-slate-600">No lab data available</p>
        ) : (
          selectedLabData.map((labData) => (
            <div key={labData.field} className="grid grid-cols-2 rounded-md">
              <div className="p-1 rounded-t-lg col-span-2 border bg-sky-200 border-sky-200 flex justify-center items-center gap-4">
                <h2 className="text-xs text-neutral-800 overflow-hidden">{labData.displayDate}</h2>
                <h1 className="text-xs text-neutral-800 font-medium overflow-hidden">{labData.displayTime}</h1>
              </div>
              <p className="p-1 text-xs rounded-bl-lg border-l border-r border-b border-sky-200 overflow-hidden">{labData.field}</p>
              <div className="flex justify-center p-1 text-center text-xs rounded-br-lg border-r border-b border-sky-200">
                {labData.isCritical && <AlertTriangle color="#e7000b" size={18} />}
                <p className={`w-full ${(labData.isAbnormal || labData.isCritical) && "text-red-600 font-medium"}`}>{labData.value}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <div className="absolute bottom-0 bg-sky-200 w-full h-3"></div>
    </Card>
  )
}
