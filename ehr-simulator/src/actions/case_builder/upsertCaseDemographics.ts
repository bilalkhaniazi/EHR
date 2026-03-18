import { SupabaseClient } from "@supabase/supabase-js"

export async function upsertCaseDemographics(
  supabase: SupabaseClient,
  payload: unknown,
  caseId: string
) {
  const d = (payload ?? {}) as Record<string, unknown>

  const row = {
    ...(caseId ? { id: caseId } : {}),
    name: "Case " + String(d.firstName ?? "") + " " + String(d.lastName ?? ""),
    description: (d.summary as string | undefined) ?? null,
    first_name: String(d.firstName ?? ""),
    last_name: String(d.lastName ?? ""),
    date_of_birth: computeDob(d),
    // `cases.code_status` is a Postgres enum (NOT NULL). UI sometimes sends "".
    code_status: normalizeCodeStatus(d.codeStatus),
    height_ft: toNumeric(d.heightFeet),
    height_in: toNumeric(d.heightInches),
    weight_kg: toNumeric(d.dosingWeight),
    language: (d.language as string | undefined) ?? null,
    //insurance
    employment: (d.employment as string | undefined) ?? null,
    religion: (d.religion as string | undefined) ?? null,
    requires_interpreter: Boolean(d.needsInterpreter),
    admitting_diagnosis: (d.admittingDiagnosis as string | undefined) ?? null,
    attending_provider: [d.attendingProviderName, d.attendingProviderTitle].filter(Boolean).join(" ") || null,
    inpatient_duration_days: toNumeric(d.admissionDateOffest),
    time_of_admission: normalizeTime(d.admissionTime),
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(), // Fix: check if exists before setting created_at
  };

  const { data, error } = await supabase
    .from("cases")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

function normalizeCodeStatus(v: unknown) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "Full";
  // tolerate older enum variants
  if (s.toUpperCase() === "FULL") return "Full";
  if (s.toUpperCase() === "PARTIAL") return "Partial";
  return s;
}

function normalizeTime(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

function computeDob(d: Record<string, unknown>) {
  const day = Number(d?.DOBDay);
  if (!Number.isFinite(day) || day <= 0) return null;

  const month = monthToNumber(d?.DOBMonth as string | undefined);
  const age = Number(d?.age);
  const year = new Date().getFullYear() - (Number.isFinite(age) ? age : 0);

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function toNumeric(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function monthToNumber(monthName?: string) {
  const m = (monthName ?? "").trim().toLowerCase();
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  const idx = months.indexOf(m);
  return idx >= 0 ? idx + 1 : 1;
}
