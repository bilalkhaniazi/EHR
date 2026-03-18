"use server"

import type { SupabaseClient } from "@supabase/supabase-js";

export async function updatePatientHistory(
  supabase: SupabaseClient,
  payload: unknown,
  caseId: string,
) {
  await updateMedicalHistory(supabase, payload, caseId);
  await updateSafetyAlerts(supabase, payload, caseId);
  await updateFamilyHistory(supabase, payload, caseId);
}

async function updateMedicalHistory(supabase: SupabaseClient, h: unknown, caseId: string) {
  const hh = (h ?? {}) as Record<string, unknown>
  const patch = {
    medical_history: hh.medicalHistory as string[] | null,
    surgical_history: hh.surgicalHistory as string[] | null,
    allergies: hh.allergies as string[] | null,
    social_habits: hh.socialHabits as string[] | null,
    living_situation: hh.livingSituation as string[] | null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("cases")
    .update(patch)
    .eq("id", caseId)
    .select("*")
    .single();

  if (error) throw new Error(`Failed to update cases medical history: ${error.message}`);
  if (!data) throw new Error(`Case not found (id=${caseId}). No update performed.`);
}


async function updateSafetyAlerts(
  supabase: SupabaseClient,
  h: unknown,
  caseId: string) {
  const hh = (h ?? {}) as Record<string, unknown>

  const { error: delErr } = await supabase
    .from("case_safety_alerts")
    .delete()
    .eq("case_id", caseId);

  if (delErr) {
    throw new Error(`Failed to clear case_safety_alerts for case_id=${caseId}: ${delErr.message}`);
  }
  const alertsRaw = hh.alerts
  const names = Array.isArray(alertsRaw) ? (alertsRaw as string[]) : []
  if (names.length === 0) return;

  const { error: seedErr } = await supabase
    .from("safety_alerts")
    .upsert(
      names.map((name) => ({ name })),
      { onConflict: "name", ignoreDuplicates: true }
    );

  if (seedErr) {
    throw new Error(`Failed to upsert safety_alerts: ${seedErr.message}`);
  }

  const { data: alerts, error: fetchErr } = await supabase
    .from("safety_alerts")
    .select("id,name")
    .in("name", names);

  if (fetchErr) {
    throw new Error(`Failed to fetch safety_alerts ids: ${fetchErr.message}`);
  }

  const idByName = new Map<string, string>((alerts ?? []).map((a) => [a.name, a.id]));

  const missing = names.filter((n) => !idByName.has(n));
  if (missing.length) {
    throw new Error(
      `Some safety alerts could not be resolved to ids: ${missing.join(
        ", "
      )}. Check permissions/RLS on safety_alerts.`
    );
  }

  const joinRows = names.map((name) => ({
    case_id: caseId,
    safety_alert_id: idByName.get(name)!,
  }));

  const { error: joinErr } = await supabase
    .from("case_safety_alerts")
    .upsert(joinRows, { onConflict: "case_id,safety_alert_id" });

  if (joinErr) {
    throw new Error(
      `Failed to upsert case_safety_alerts for case_id=${caseId}: ${joinErr.message}`
    );
  }
}

async function updateFamilyHistory(
  supabase: SupabaseClient,
  h: unknown,
  caseId: string) {

  const hh = (h ?? {}) as Record<string, unknown>
  const raw = Array.isArray(hh?.familyHistory) ? (hh.familyHistory as unknown[]) : [];
  const cleaned = raw
    .map((x) => ({
      relation: typeof (x as { relation?: unknown })?.relation === "string" ? (x as { relation: string }).relation.trim() : "",
      condition: typeof (x as { condition?: unknown })?.condition === "string" ? (x as { condition: string }).condition.trim() : "",
    }))
    .filter((x) => x.relation && x.condition);
  const deduped = Array.from(
    new Map(cleaned.map((x) => [`${x.relation}|||${x.condition}`, x])).values()
  );

  const { error: delErr } = await supabase
    .from("case_family_history")
    .delete()
    .eq("case_id", caseId);

  if (delErr) {
    throw new Error(
      `Failed to clear case_family_history for case_id=${caseId}: ${delErr.message}`
    );
  }

  if (deduped.length === 0) return;

  const relationNames = Array.from(new Set(deduped.map((x) => x.relation)));
  const { error: seedErr } = await supabase
    .from("relationship_types")
    .upsert(
      relationNames.map((name) => ({ name })),
      { onConflict: "name", ignoreDuplicates: true }
    );

  if (seedErr) {
    throw new Error(`Failed to upsert relationship_types: ${seedErr.message}`);
  }

  const { data: rels, error: relFetchErr } = await supabase
    .from("relationship_types")
    .select("id,name")
    .in("name", relationNames);

  if (relFetchErr) {
    throw new Error(
      `Failed to fetch relationship_types ids: ${relFetchErr.message}`
    );
  }

  const relIdByName = new Map<string, string>((rels ?? []).map((r) => [r.name, r.id]));

  const missing = relationNames.filter((n) => !relIdByName.has(n));
  if (missing.length) {
    throw new Error(
      `Some relationship types could not be resolved to ids: ${missing.join(
        ", "
      )}. Check permissions/RLS on relationship_types.`
    );
  }

  const rows = deduped.map((x) => ({
    case_id: caseId,
    relationship_id: relIdByName.get(x.relation)!,
    condition: x.condition,
  }));

  const { error: insErr } = await supabase
    .from("case_family_history")
    .insert(rows);

  if (insErr) {
    throw new Error(
      `Failed to insert case_family_history for case_id=${caseId}: ${insErr.message}`
    );
  }
}
