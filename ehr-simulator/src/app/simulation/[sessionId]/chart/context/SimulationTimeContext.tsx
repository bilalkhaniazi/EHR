"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useParams } from "next/navigation"
import { getSimulationCaseBundle } from "@/actions/case_builder/getCase"
import type { Database } from "@/../database.types"

export type LabResultRow = Database["public"]["Tables"]["lab_results"]["Row"]
export type ImagingReportRow = Database["public"]["Tables"]["imaging_reports"]["Row"]
export type MicrobiologyReportRow =
  Database["public"]["Tables"]["microbiology_reports"]["Row"]
export type CaseRow = Database["public"]["Tables"]["cases"]["Row"]

export type SimulationTimeContextValue = {
  isLoading: boolean
  caseId: string | null
  caseRow: CaseRow | null
  /** Distinct `lab_results.time_offset` values, ascending (smallest = most recent in this UI). */
  availableTimeOffsets: number[]
  selectedTimeOffset: number
  setSelectedTimeOffset: (offset: number) => void
  labResults: LabResultRow[]
  imagingReports: ImagingReportRow[]
  microbiologyReports: MicrobiologyReportRow[]
  /** `lab_results.id` for rows at `selectedTimeOffset`. */
  labIdsAtSelectedTime: Set<string>
}

const SimulationTimeContext = createContext<SimulationTimeContextValue | null>(
  null
)

export function SimulationTimeProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const sessionId = params?.sessionId as string | undefined

  const [isLoading, setIsLoading] = useState(true)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [caseRow, setCaseRow] = useState<CaseRow | null>(null)
  const [labResults, setLabResults] = useState<LabResultRow[]>([])
  const [imagingReports, setImagingReports] = useState<ImagingReportRow[]>([])
  const [microbiologyReports, setMicrobiologyReports] = useState<
    MicrobiologyReportRow[]
  >([])
  const [availableTimeOffsets, setAvailableTimeOffsets] = useState<number[]>([])
  const [selectedTimeOffset, setSelectedTimeOffsetState] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false)
      setCaseId(null)
      setCaseRow(null)
      setLabResults([])
      setImagingReports([])
      setMicrobiologyReports([])
      setAvailableTimeOffsets([])
      setSelectedTimeOffsetState(0)
      return
    }

    let cancelled = false

    const run = async () => {
      setIsLoading(true)
      try {
        const bundle = await getSimulationCaseBundle(sessionId)
        if (cancelled) return

        if (!bundle) {
          setCaseId(null)
          setCaseRow(null)
          setLabResults([])
          setImagingReports([])
          setMicrobiologyReports([])
          setAvailableTimeOffsets([])
          setSelectedTimeOffsetState(0)
          return
        }

        const labs = (bundle.labResults ?? []) as LabResultRow[]
        const imaging = (bundle.imagingReports ?? []) as ImagingReportRow[]
        const micro = (bundle.microbiologyReports ?? []) as MicrobiologyReportRow[]

        const offsets = [...new Set(labs.map((r) => r.time_offset))].sort(
          (a, b) => a - b
        )

        setCaseId(bundle.caseId)
        setCaseRow((bundle.caseRow ?? null) as CaseRow | null)
        setLabResults(labs)
        setImagingReports(imaging)
        setMicrobiologyReports(micro)
        setAvailableTimeOffsets(offsets)

        setSelectedTimeOffsetState((prev) => {
          if (offsets.length === 0) return 0
          if (offsets.includes(prev)) return prev
          return offsets[0]!
        })
      } catch {
        if (!cancelled) {
          setCaseId(null)
          setCaseRow(null)
          setLabResults([])
          setImagingReports([])
          setMicrobiologyReports([])
          setAvailableTimeOffsets([])
          setSelectedTimeOffsetState(0)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const setSelectedTimeOffset = useCallback((offset: number) => {
    setSelectedTimeOffsetState(offset)
  }, [])

  const labIdsAtSelectedTime = useMemo(() => {
    const ids = labResults
      .filter((r) => r.time_offset === selectedTimeOffset)
      .map((r) => r.id)
    return new Set(ids)
  }, [labResults, selectedTimeOffset])

  const value = useMemo<SimulationTimeContextValue>(
    () => ({
      isLoading,
      caseId,
      caseRow,
      availableTimeOffsets,
      selectedTimeOffset,
      setSelectedTimeOffset,
      labResults,
      imagingReports,
      microbiologyReports,
      labIdsAtSelectedTime,
    }),
    [
      isLoading,
      caseId,
      caseRow,
      availableTimeOffsets,
      selectedTimeOffset,
      setSelectedTimeOffset,
      labResults,
      imagingReports,
      microbiologyReports,
      labIdsAtSelectedTime,
    ]
  )

  return (
    <SimulationTimeContext.Provider value={value}>
      {children}
    </SimulationTimeContext.Provider>
  )
}

export function useSimulationTime(): SimulationTimeContextValue {
  const ctx = useContext(SimulationTimeContext)
  if (!ctx) {
    throw new Error(
      "useSimulationTime must be used within SimulationTimeProvider (chart layout)"
    )
  }
  return ctx
}
