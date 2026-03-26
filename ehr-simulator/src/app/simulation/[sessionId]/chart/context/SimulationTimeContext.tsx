"use client"

import {
  createContext,
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
export type OrdersRow = Database["public"]["Tables"]["orders"]["Row"]
export type ClinicalDocumentRow =
  Database["public"]["Tables"]["clinical_documents"]["Row"]
export type DocumentationResultRow =
  Database["public"]["Tables"]["documentation_results"]["Row"]
export type MedicationAdministrationRow =
  Database["public"]["Tables"]["medication_administrations"]["Row"]
export type SafetyAlertRow = {
  safety_alerts: { id: string; name: string } | null
}
export type FamilyHistoryRow = {
  id: string
  condition: string
  relationship_types: { id: string; name: string } | null
}

export type SimulationTimeContextValue = {
  isLoading: boolean
  caseId: string | null
  caseRow: CaseRow | null
  labResults: LabResultRow[]
  imagingReports: ImagingReportRow[]
  microbiologyReports: MicrobiologyReportRow[]
  orders: OrdersRow[]
  clinicalDocuments: ClinicalDocumentRow[]
  documentationResults: DocumentationResultRow[]
  medicationAdministrations: MedicationAdministrationRow[]
  safetyAlerts: SafetyAlertRow[]
  familyHistory: FamilyHistoryRow[]
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
  const [orders, setOrders] = useState<OrdersRow[]>([])
  const [clinicalDocuments, setClinicalDocuments] = useState<
    ClinicalDocumentRow[]
  >([])
  const [documentationResults, setDocumentationResults] = useState<
    DocumentationResultRow[]
  >([])
  const [medicationAdministrations, setMedicationAdministrations] = useState<
    MedicationAdministrationRow[]
  >([])
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlertRow[]>([])
  const [familyHistory, setFamilyHistory] = useState<FamilyHistoryRow[]>([])

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false)
      setCaseId(null)
      setCaseRow(null)
      setLabResults([])
      setImagingReports([])
      setMicrobiologyReports([])
      setOrders([])
      setClinicalDocuments([])
      setDocumentationResults([])
      setMedicationAdministrations([])
      setSafetyAlerts([])
      setFamilyHistory([])
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
          setOrders([])
          setClinicalDocuments([])
          setDocumentationResults([])
          setMedicationAdministrations([])
          setSafetyAlerts([])
          setFamilyHistory([])
          return
        }

        const labs = (bundle.labResults ?? []) as LabResultRow[]
        const imaging = (bundle.imagingReports ?? []) as ImagingReportRow[]
        const micro = (bundle.microbiologyReports ?? []) as MicrobiologyReportRow[]
        const bundleOrders = (bundle.orders ?? []) as OrdersRow[]
        const bundleClinicalDocuments = (bundle.clinicalDocuments ??
          []) as ClinicalDocumentRow[]
        const bundleDocumentationResults = (bundle.documentationResults ??
          []) as DocumentationResultRow[]
        const bundleMedicationAdministrations = (bundle.medicationAdministrations ??
          []) as MedicationAdministrationRow[]
        const bundleSafetyAlerts = (bundle.safetyAlerts ?? []) as SafetyAlertRow[]
        const bundleFamilyHistory = (bundle.familyHistory ?? []) as FamilyHistoryRow[]

        setCaseId(bundle.caseId)
        setCaseRow((bundle.caseRow ?? null) as CaseRow | null)
        setLabResults(labs)
        setImagingReports(imaging)
        setMicrobiologyReports(micro)
        setOrders(bundleOrders)
        setClinicalDocuments(bundleClinicalDocuments)
        setDocumentationResults(bundleDocumentationResults)
        setMedicationAdministrations(bundleMedicationAdministrations)
        setSafetyAlerts(bundleSafetyAlerts)
        setFamilyHistory(bundleFamilyHistory)
      } catch {
        if (!cancelled) {
          setCaseId(null)
          setCaseRow(null)
          setLabResults([])
          setImagingReports([])
          setMicrobiologyReports([])
          setOrders([])
          setClinicalDocuments([])
          setDocumentationResults([])
          setMedicationAdministrations([])
          setSafetyAlerts([])
          setFamilyHistory([])
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

  const value = useMemo<SimulationTimeContextValue>(
    () => ({
      isLoading,
      caseId,
      caseRow,
      labResults,
      imagingReports,
      microbiologyReports,
      orders,
      clinicalDocuments,
      documentationResults,
      medicationAdministrations,
      safetyAlerts,
      familyHistory,
    }),
    [
      isLoading,
      caseId,
      caseRow,
      labResults,
      imagingReports,
      microbiologyReports,
      orders,
      clinicalDocuments,
      documentationResults,
      medicationAdministrations,
      safetyAlerts,
      familyHistory,
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
