"use client"

import { useMemo } from "react"
import { PillBottle } from "lucide-react"
import { useSimulationTime } from "../context/SimulationTimeContext"
import type { MedAdministrationInstance } from "./components/marData"

// Kept for compatibility with existing MAR subcomponents that import this type.
export interface NewAdministrationData {
  [medOrderId: string]: MedAdministrationInstance
}

const toDoseDisplay = (dose: number | null) => {
  if (dose == null) return "N/A"
  return String(dose)
}

const toText = (value: string | null, fallback: string) => {
  if (!value || !value.trim()) return fallback
  return value
}

const toOffsetDisplay = (offset: number | null) => {
  if (offset == null || !Number.isFinite(offset)) return "N/A"
  if (offset >= 0) return `+${offset} min`
  return `${offset} min`
}

export default function MarPage() {
  const { isLoading, medicationAdministrations } = useSimulationTime()

  const rows = useMemo(() => {
    return [...medicationAdministrations].sort((a, b) => {
      if (a.time_offset !== b.time_offset) return b.time_offset - a.time_offset
      return a.created_at < b.created_at ? 1 : -1
    })
  }, [medicationAdministrations])

  if (isLoading) {
    return (
      <div className="flex flex-col p-2 pt-0 w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-y-auto justify-center items-center">
        <p className="text-sm text-gray-600">Loading MAR...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-2 pt-0 w-full h-[calc(100vh-4rem)] bg-gray-100 overflow-y-auto">
      <div className="flex w-full h-full flex-col flex-1 gap-3 px-2 py-3 overflow-y-auto border border-gray-300 rounded-tl-lg inset-shadow-sm">
        {rows.length === 0 ? (
          <div className="h-52 border-2 mt-8 mx-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
            <PillBottle className="w-10 h-10 mb-3 opacity-20" />
            <p className="font-medium">No medication administration data available</p>
          </div>
        ) : (
          rows.map((row, index) => (
            <div
              key={`${row.created_at}-${row.medication_id ?? "unknown"}-${index}`}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="font-medium">Medication:</span>{" "}
                  {toText(row.medication_id, "Unknown medication")}
                </p>
                <p>
                  <span className="font-medium">Dose:</span>{" "}
                  {toDoseDisplay(row.administered_dose)}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {toText(row.status, "N/A")}
                </p>
                <p>
                  <span className="font-medium">Administrator:</span>{" "}
                  {toText(row.administrator, "N/A")}
                </p>
                <p>
                  <span className="font-medium">Time Offset:</span>{" "}
                  {toOffsetDisplay(row.time_offset)}
                </p>
                <p>
                  <span className="font-medium">Notes:</span>{" "}
                  {toText(row.notes, "—")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
