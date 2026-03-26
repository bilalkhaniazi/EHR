"use server"

import type { SupabaseClient } from "@supabase/supabase-js"
import { createServerSupabase } from "@/utils/supabase/server"
import { createServiceSupabase } from "@/utils/supabase/service"
import { verifySimulationSessionAccess } from "@/actions/simulation/verifySimulationSessionAccess"

export interface CaseBundle {
  caseRow: unknown
  safetyAlerts: unknown[]
  familyHistory: unknown[]
  clinicalDocuments: unknown[]
  orders: unknown[]
  labResults: unknown[]
  imagingReports: unknown[]
  microbiologyReports: unknown[]
  documentationResults: unknown[]
  medicationAdministrations: unknown[]
}

export type SimulationCaseBundle = CaseBundle & { caseId: string }

/**
 * `20260223043507_case_data_tables` created `lab_results` with
 * `time_offset_days` / `time_offset_hours` / `time_offset_minutes`.
 * `20260302003314` uses a single `time_offset` but `CREATE IF NOT EXISTS` skips when the
 * table already exists — so local DBs often only have the older columns. The labs UI expects
 * `time_offset` (minutes from a common zero).
 */
function normalizeLabResultRows(
  rows: Record<string, unknown>[] | null | undefined
): Record<string, unknown>[] {
  if (!rows?.length) return []
  return rows.map((row) => {
    if (typeof row.time_offset === "number") return row
    const d = row.time_offset_days
    if (typeof d === "number") {
      const h =
        typeof row.time_offset_hours === "number" ? row.time_offset_hours : 0
      const m =
        typeof row.time_offset_minutes === "number"
          ? row.time_offset_minutes
          : 0
      return { ...row, time_offset: d * 24 * 60 + h * 60 + m }
    }
    return { ...row, time_offset: 0 }
  })
}

/** Older `imaging_reports` uses `is_critical_or_abnormal`; UI expects `is_critical`. */
function normalizeImagingRows(
  rows: Record<string, unknown>[] | null | undefined
): Record<string, unknown>[] {
  if (!rows?.length) return []
  return rows.map((row) => {
    if ("is_critical" in row && row.is_critical !== undefined) return row
    if (
      "is_critical_or_abnormal" in row &&
      row.is_critical_or_abnormal !== undefined
    ) {
      return { ...row, is_critical: row.is_critical_or_abnormal }
    }
    return row
  })
}

async function fetchCaseBundleWithServiceRole(
  supabase: SupabaseClient,
  caseId: string
): Promise<CaseBundle> {
  const [
    caseRes,
    safetyAlertsRes,
    familyHistoryRes,
    clinicalDocumentsRes,
    ordersRes,
    labResultsRes,
    imagingReportsRes,
    microbiologyReportsRes,
    documentationResultsRes,
    medicationAdministrationsRes,
  ] = await Promise.all([
    supabase
      .from("cases")
      .select(
        `
        *,
        isolation_precautions:isolation_precautions_id ( id, name ),
        relationship_statuses:relationship_status_id ( id, name )
      `
      )
      .eq("id", caseId)
      .single(),

    supabase
      .from("case_safety_alerts")
      .select(
        `
        safety_alerts:safety_alert_id ( id, name )
      `
      )
      .eq("case_id", caseId),

    supabase
      .from("case_family_history")
      .select(
        `
        *,
        relationship_types:relationship_id ( id, name )
      `
      )
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("clinical_documents")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("orders")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("lab_results")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("imaging_reports")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("microbiology_reports")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("documentation_results")
      .select("*")
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("medication_administrations")
      .select("*")
      .eq("case_id", caseId)
      .order("time_offset", { ascending: true })
      .order("created_at", { ascending: true }),
  ])

  if (caseRes.error) throw caseRes.error
  if (!caseRes.data) throw new Error(`Case not found for id ${caseId}`)

  const errors = [
    safetyAlertsRes.error,
    familyHistoryRes.error,
    clinicalDocumentsRes.error,
    ordersRes.error,
    labResultsRes.error,
    imagingReportsRes.error,
    microbiologyReportsRes.error,
    documentationResultsRes.error,
    medicationAdministrationsRes.error,
  ].filter(Boolean)

  if (errors.length > 0) {
    throw errors[0]
  }

  return {
    caseRow: caseRes.data,
    safetyAlerts: safetyAlertsRes.data ?? [],
    familyHistory: familyHistoryRes.data ?? [],
    clinicalDocuments: clinicalDocumentsRes.data ?? [],
    orders: ordersRes.data ?? [],
    labResults: normalizeLabResultRows(
      labResultsRes.data as Record<string, unknown>[] | null
    ),
    imagingReports: normalizeImagingRows(
      imagingReportsRes.data as Record<string, unknown>[] | null
    ),
    microbiologyReports: microbiologyReportsRes.data ?? [],
    documentationResults: documentationResultsRes.data ?? [],
    medicationAdministrations: medicationAdministrationsRes.data ?? [],
  }
}

/**
 * Loads simulation clinical data only after verifying the signed-in user may access
 * `case_sessions.id = sessionId` (group membership or faculty section assignment).
 */
export async function getSimulationCaseBundle(
  sessionId: string
): Promise<SimulationCaseBundle | null> {
  if (!sessionId) return null

  const userClient = await createServerSupabase()
  const {
    data: { user },
  } = await userClient.auth.getUser()
  if (!user?.id) return null

  const admin = createServiceSupabase()
  const resolved = await verifySimulationSessionAccess(
    admin,
    user.id,
    sessionId,
    user.email
  )
  if (!resolved) return null

  try {
    const bundle = await fetchCaseBundleWithServiceRole(admin, resolved.caseId)
    return { ...bundle, caseId: resolved.caseId }
  } catch (e) {
    console.error("getSimulationCaseBundle: failed to load case data", {
      sessionId,
      caseId: resolved.caseId,
      error: e,
    })
    return null
  }
}
