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
        relationship_status:relationship_status_id ( id, name )
      `
      )
      .eq("id", caseId)
      .single(),

    supabase
      .from("case_safety_alerts")
      .select(
        `
        safety_alert:safety_alert_id ( id, name )
      `
      )
      .eq("case_id", caseId),

    supabase
      .from("case_family_history")
      .select(
        `
        *,
        relationship:relationship_id ( id, name )
      `
      )
      .eq("case_id", caseId)
      .order("created_at", { ascending: true }),

    supabase
      .from("clinical_documents")
      .select("*")
      .eq("case_id", caseId)
      .order("time_offset", { ascending: true })
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
      .order("time_offset", { ascending: true }),

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
      .order("time_offset", { ascending: true })
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
    labResults: labResultsRes.data ?? [],
    imagingReports: imagingReportsRes.data ?? [],
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

  const bundle = await fetchCaseBundleWithServiceRole(admin, resolved.caseId)
  return { ...bundle, caseId: resolved.caseId }
}
