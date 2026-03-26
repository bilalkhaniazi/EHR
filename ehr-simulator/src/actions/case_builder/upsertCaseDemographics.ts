import { SupabaseClient } from "@supabase/supabase-js"

export async function upsertCaseDemographics(
  supabase: SupabaseClient,
  payload: unknown,
  caseId?: string | null
) {
  const d = (payload ?? {}) as Record<string, unknown>
  const heightFt = toNumeric(d.heightFeet);
  const heightIn = toNumeric(d.heightInches);
  const precautionName = normalizePrecautionName(d.precautions);
  const relationshipName = toTrimmedString(d.relationshipStatus);
  const isolationPrecautionId = await resolveLookupId(
    supabase,
    "isolation_precautions",
    precautionName || "None"
  );
  const relationshipStatusId = await resolveLookupId(
    supabase,
    "relationship_statuses",
    relationshipName || "Unknown / Undetermined"
  );

  const row = {
    ...(caseId ? { id: caseId } : {}),
    name: "Case " + String(d.firstName ?? "") + " " + String(d.lastName ?? ""),
    description: (d.summary as string | undefined) ?? null,
    first_name: String(d.firstName ?? ""),
    last_name: String(d.lastName ?? ""),
    date_of_birth: computeDob(d),
    // `cases.code_status` is a Postgres enum (NOT NULL). UI sometimes sends "".
    code_status: normalizeCodeStatus(d.codeStatus),
    height_ft: heightFt,
    height_in: heightIn,
    // Local schema enforces height_cm NOT NULL.
    height_cm: toHeightCm(heightFt, heightIn),
    weight_kg: toNumeric(d.dosingWeight),
    isolation_precautions_id: isolationPrecautionId,
    language: (d.language as string | undefined) ?? null,
    insurance: normalizeInsurance(d.insurance),
    employment: (d.employment as string | undefined) ?? null,
    relationship_status_id: relationshipStatusId,
    religion: (d.religion as string | undefined) ?? null,
    requires_interpreter: Boolean(d.needsInterpreter),
    admitting_diagnosis: (d.admittingDiagnosis as string | undefined) ?? null,
    attending_provider: [d.attendingProviderName, d.attendingProviderTitle].filter(Boolean).join(" ") || null,
    inpatient_duration_days: toNumeric(d.admissionDateOffest),
    time_of_admission: normalizeTime(d.admissionTime),
    emergency_contact_name: (d.contact as string | undefined) ?? null,
    emergency_contact_relationship: (d.contactRelationship as string | undefined) ?? null,
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
  const rawDay = Number(d?.DOBDay);
  const day = Number.isFinite(rawDay) && rawDay > 0 && rawDay <= 31 ? rawDay : 1;

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

function toTrimmedString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function normalizePrecautionName(v: unknown): string {
  const s = toTrimmedString(v);
  if (!s) return "";
  // UI option has a misspelling; DB lookup uses "Airborne".
  if (s.toLowerCase() === "airbourne") return "Airborne";
  return s;
}

function normalizeInsurance(v: unknown): string {
  const s = toTrimmedString(v);
  if (s === "Medicare" || s === "Medicaid" || s === "Private") return s;
  return "Private";
}

async function resolveLookupId(
  supabase: SupabaseClient,
  table: "isolation_precautions" | "relationship_statuses",
  name: string
) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("name", name)
    .maybeSingle();
  if (error || !data?.id) {
    throw new Error(`Could not resolve ${table} id for "${name}"`);
  }
  return data.id as string;
}

function toHeightCm(feet: number | null, inches: number | null): number {
  const totalInches = (feet ?? 0) * 12 + (inches ?? 0);
  const cm = totalInches * 2.54;
  // Keep it as a number and guarantee NOT NULL.
  return Number.isFinite(cm) ? Number(cm.toFixed(2)) : 0;
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
