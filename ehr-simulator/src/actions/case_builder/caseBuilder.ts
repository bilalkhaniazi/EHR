"use server"

import { createClient } from "@supabase/supabase-js"
import { CaseSection } from "@/lib/saveCase"
import { upsertCaseDemographics } from "@/actions/case_builder/upsertCaseDemographics";
import { updatePatientHistory } from "@/actions/case_builder/updatePatientHistory";
import { updateClinicalDocuments, type ClinicalNoteInput } from "@/actions/case_builder/updateClinicalDocuments";
import { updateOrders } from "@/actions/case_builder/updateOrders";
import { updateLabs } from "@/actions/case_builder/updateLabs";
import { updateDocumentationResults } from "@/actions/case_builder/updateDocumentationResults";
import { updateMedications } from "@/actions/case_builder/updateMedications";

import { MedAdministrationInstance } from "@/app/simulation/[sessionId]/chart/mar/components/marData";

// TODO: Narrow type definitions for each section & enforce at runtime.
type SaveCaseArgs =
  | { section: typeof CaseSection.DEMOGRAPHICS; payload: unknown; caseId?: string | null }
  | { section: typeof CaseSection.HISTORY; payload: unknown; caseId?: string | null }
  | { section: typeof CaseSection.CLINICAL_DOCUMENTS; payload: unknown; caseId?: string | null }
  | { section: typeof CaseSection.ORDERS; payload: unknown; caseId?: string | null }
  | { section: typeof CaseSection.LABS; payload: unknown; caseId?: string | null }
  | { section: typeof CaseSection.DOCUMENTATION; payload: unknown; caseId?: string | null }
  | { section: typeof CaseSection.MEDICATION_ORDERS; payload: MedAdministrationInstance[]; caseId?: string | null }

export async function saveCaseData({ payload, section, caseId }: SaveCaseArgs) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  if (!caseId && section !== CaseSection.DEMOGRAPHICS) throw new Error("Case ID is required");
  const requiredCaseId = caseId ?? "";

  switch (section) {
    case CaseSection.DEMOGRAPHICS:
      return await upsertCaseDemographics(supabase, payload, requiredCaseId);
    case CaseSection.HISTORY:
      return await updatePatientHistory(supabase, payload, requiredCaseId);
    case CaseSection.CLINICAL_DOCUMENTS:
      return await updateClinicalDocuments(supabase, payload as ClinicalNoteInput[], requiredCaseId);
    case CaseSection.ORDERS:
      return await updateOrders(supabase, Array.isArray(payload) ? payload : [], requiredCaseId);
    case CaseSection.LABS:
      return await updateLabs(supabase, payload, requiredCaseId);
    case CaseSection.DOCUMENTATION:
      return await updateDocumentationResults(supabase, payload, requiredCaseId);
    case CaseSection.MEDICATION_ORDERS:
      return await updateMedications(supabase, payload, requiredCaseId);
  }
}



