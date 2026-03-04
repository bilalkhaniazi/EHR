"use server"

import { createClient } from "@supabase/supabase-js"
import { CaseSection } from "@/lib/saveCase"
import { upsertCaseDemographics } from "@/actions/case_builder/upsertCaseDemographics";

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
      const savedRow = await upsertCaseDemographics(supabase, payload, caseId);
      return savedRow;
  }
  return;
}



