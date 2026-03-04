
export async function updatePatientHistory(
  supabase: SupabaseClient,
  payload: any,
  caseId: string,
) {
  const h = payload.historyData ?? {};

  await updateMedicalHistory(supabase, h, caseId);
  await updateSafetyAlerts(supabase, h, caseId);
  await updateFamilyHistory(supabase, h, caseId);
}

async function updateMedicalHistory(supabase, h, caseId) {
  const patch = {
    medical_history: h.medicalHistory,
    surgical_history: h.surgicalHistory,
    allergies: h.allergies,
    social_habits: h.socialHabits,
    living_situation: h.livingSituation,
    updated_at: new Date().toISOString(),
  };
}

async function updateSafetyAlerts(supabase, h, caseId) { }

async function updateFamilyHistory(supabase, h, caseId) { }
