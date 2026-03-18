import { Database } from "@/../database.types"

// ── Enum types derived from DB ──────────────────────────────────────────────
export type CodeStatusType = Database["public"]["Enums"]["code_status_type"]   // "Full" | "DNR" | "Partial"
export type InsuranceType = Database["public"]["Enums"]["insurance_type"]     // "Medicare" | "Medicaid" | "Private"

// ── Table row types ─────────────────────────────────────────────────────────
export type CasesRow = Database["public"]["Tables"]["cases"]["Row"]
export type CaseFamilyHistoryRow = Database["public"]["Tables"]["case_family_history"]["Row"]
export type CaseSafetyAlertRow = Database["public"]["Tables"]["case_safety_alerts"]["Row"]

// ── Composite type used throughout the edit page ────────────────────────────
export type CaseDataRow = CasesRow & {
  case_family_history: CaseFamilyHistoryRow[]
  case_safety_alerts: CaseSafetyAlertRow[]
}

// ── Update payload types ─────────────────────────────────────────────────────
export type CaseDataScalarUpdate = Database["public"]["Tables"]["cases"]["Update"]

// ── Temp data (remove once schema is fully wired) ───────────────────────────
export const TempFormData: CaseDataRow = {
  id: "d764f9b3-5877-41a1-8b7c-27629cfa9633",
  name: "Case Max Mulder",
  description: "Description",
  first_name: "Max",
  last_name: "Mulder",
  date_of_birth: "1997-01-16",
  code_status: "Full",
  height_ft: 6,
  height_in: 2,
  weight_kg: 200,
  isolation_precautions_id: null,
  language: "English",
  insurance: null,
  employment: "Software",
  relationship_status_id: null,
  religion: "Catholic",
  requires_interpreter: true,
  admitting_diagnosis: "Acute Something",
  attending_provider: "John Smith MD",
  inpatient_duration_days: 2,
  time_of_admission: "10:01:00",
  medical_history: ["HTN", "GERD"],
  surgical_history: ["TAVR (2010)"],
  allergies: ["Penicillin"],
  social_habits: [],
  living_situation: ["Lives alone"],
  case_creation_complete: false,
  updated_at: "2026-03-04T21:07:50.3+00:00",
  created_at: "2026-03-04T21:07:15.409+00:00",
  case_safety_alerts: [
    {
      case_id: "d764f9b3-5877-41a1-8b7c-27629cfa9633",
      created_at: "2026-03-04T21:07:50.382161+00:00",
      safety_alert_id: "3fe90d3c-cc3f-4ca4-991a-6241ee47eb27",
    },
  ],
  case_family_history: [
    {
      id: "c43f81f1-d723-43a2-89b0-52241e44332c",
      case_id: "d764f9b3-5877-41a1-8b7c-27629cfa9633",
      condition: "Type 2 Diabetes",
      created_at: "2026-03-04T21:07:50.418181+00:00",
      relationship_id: "87b4b1a9-af1d-4b60-b0fd-9784fdc88c09",
    },
  ],
}