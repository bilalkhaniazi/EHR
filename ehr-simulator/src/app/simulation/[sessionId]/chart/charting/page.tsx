"use client"

import { useMemo } from "react"
import { differenceInMilliseconds, format } from "date-fns"
import type { RowData } from "@tanstack/react-table"
import { useSimulationTime } from "../context/SimulationTimeContext"
import type { ImagingData, LabCellValue } from "../labs/components/labsData"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value:
        | string
        | string[]
        | ImagingData
        | LabCellValue
        | Partial<TData>
    ) => void
  }
}

export const formatTimeFromOffset = (
  offsetMinutes: number,
  nowTimestamp: number | null
) => {
  if (!nowTimestamp) {
    return { error: { status: "TIME_ERROR", data: "Time has not been initialized." } }
  }
  const targetTime = differenceInMilliseconds(nowTimestamp, offsetMinutes * 60 * 1000)
  const time = format(targetTime, "HHmm")
  const date = format(targetTime, "MM/dd")
  return { time, date }
}

const toText = (value: string | null, fallback = "N/A") => {
  if (!value || !value.trim()) return fallback
  return value
}

const toNumberText = (value: number | null, fallback = "—") => {
  if (value == null || !Number.isFinite(value)) return fallback
  return String(value)
}

const toOffsetDisplay = (offset: number | null) => {
  if (offset == null || !Number.isFinite(offset)) return "N/A"
  if (offset >= 0) return `+${offset} min`
  return `${offset} min`
}

export default function ChartingPage() {
  const { isLoading, documentationResults } = useSimulationTime()

  const rows = useMemo(() => {
    return [...documentationResults].sort((a, b) => {
      if (a.time_offset !== b.time_offset) return b.time_offset - a.time_offset
      return a.created_at < b.created_at ? 1 : -1
    })
  }, [documentationResults])

  if (isLoading) {
    return (
      <div className="flex flex-col p-2 pt-0 w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-y-auto justify-center items-center">
        <p className="text-sm text-gray-600">Loading charting...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-2 pt-0 w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-y-auto">
      <div className="flex w-full h-full flex-col flex-1 gap-3 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        {rows.length === 0 ? (
          <div className="h-52 border-2 mt-8 mx-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
            <p className="font-medium">No charting data available</p>
          </div>
        ) : (
          rows.map((row) => (
            <section
              key={row.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-800">
                Time Offset: {toOffsetDisplay(row.time_offset)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-sm">
                <p><span className="font-medium">HR:</span> {toText(row.hr)}</p>
                <p><span className="font-medium">BP:</span> {toText(row.bp)}</p>
                <p><span className="font-medium">RR:</span> {toText(row.rr)}</p>
                <p><span className="font-medium">Temp:</span> {toText(row.temp)}</p>
                <p><span className="font-medium">SpO2:</span> {toText(row.spo2)}</p>
                <p><span className="font-medium">Pain:</span> {toText(row.pain)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <p><span className="font-medium">Oral Intake:</span> {toText(row.oral)}</p>
                <p><span className="font-medium">Intravenous:</span> {toText(row.intravenous)}</p>
                <p><span className="font-medium">Urine:</span> {toText(row.urine)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Appearance:</span> {toText(row.appearance, "—")}</p>
                <p><span className="font-medium">Mood & Affect:</span> {toText(row.mood_and_affect, "—")}</p>
                <p><span className="font-medium">Orientation:</span> {toText(row.orientation, "—")}</p>
                <p><span className="font-medium">Speech:</span> {toText(row.speech, "—")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <p><span className="font-medium">Nausea/Vomiting Score:</span> {toNumberText(row.nausea_vomiting)}</p>
                <p><span className="font-medium">Anxiety Score:</span> {toNumberText(row.anxiety)}</p>
                <p><span className="font-medium">Agitation Score:</span> {toNumberText(row.agitation)}</p>
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
