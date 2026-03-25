import { Database } from "@/../database.types"

// --- Enum types derived from DB ---
export type CodeStatusType = Database["public"]["Enums"]["code_status_type"]   // "Full" | "DNR" | "Partial"
export type InsuranceType = Database["public"]["Enums"]["insurance_type"]     // "Medicare" | "Medicaid" | "Private"

// --- Table row types ---
export type CasesRow = Database["public"]["Tables"]["cases"]["Row"]
export type CaseFamilyHistoryRow = Database["public"]["Tables"]["case_family_history"]["Row"]
export type CaseSafetyAlertRow = Database["public"]["Tables"]["case_safety_alerts"]["Row"]

// --- Composite type used throughout the edit page ---
export type CaseDataRow = CasesRow & {
  case_family_history: CaseFamilyHistoryRow[]
  case_safety_alerts: CaseSafetyAlertRow[]
}

// --- Update payload types ---
export type CaseDataScalarUpdate = Database["public"]["Tables"]["cases"]["Update"]