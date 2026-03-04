"use server"

import { createClient } from "@supabase/supabase-js"
import { CaseSection } from "@/lib/saveCase"
import { upsertCaseDemographics } from "@/actions/case_builder/upsertCaseDemographics";
import { updatePatientHistory } from "@/actions/case_builder/updatePatientHistory";
type SaveCaseArgs = {
  payload: any;
  section: keyof typeof CaseSection;
  caseId?: string | null;
};

export async function saveCaseData({ payload, section, caseId }: SaveCaseArgs) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  switch (section) {
    case CaseSection.DEMOGRAPHICS:
      return await upsertCaseDemographics(supabase, payload, caseId);
    case CaseSection.HISTORY:
      return await updatePatientHistory(supabase, payload, caseId);
  }
  return;
}



