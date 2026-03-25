import { ImagingData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { LabTableData } from '@/app/simulation/[sessionId]/chart/labs/components/labsData';
import { MicrobiologyReportData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { labTemplate } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import type { Database } from "../../database.types";

export type LabResultInsert = {
  case_id: string
  time_offset: number
  is_in_presim: boolean

  sodium?: number | null
  potassium?: number | null
  chloride?: number | null
  bun?: number | null
  creatinine?: number | null
  glucose?: number | null
  co2?: number | null
  calcium?: number | null
  lactate?: number | null

  rbc?: number | null
  wbc?: number | null
  platelets?: number | null
  hemoglobin?: number | null
  hematocrit?: number | null
  mcv?: number | null
  mch?: number | null
  mchc?: number | null

  troponin?: number | null
  ckmb?: number | null
  myoglobin?: number | null

  ast?: number | null
  alt?: number | null
  alp?: number | null
  total_bilirubin?: number | null
  albumin?: number | null
  ammonia?: number | null

  pco2?: number | null
  po2?: number | null
  hco3?: number | null

  specific_gravity?: number | null
  urine_ph?: number | null
  protein?: string | null
  urine_glucose?: string | null
  ketones?: string | null
  leukocyte_esterase?: string | null
  nitrites?: string | null
  blood?: string | null

  pt?: number | null
  ptt?: number | null

  crp?: number | null
  esr?: number | null
  tsh?: number | null
  free_t3?: number | null
  free_t4?: number | null

  total_cholesterol?: number | null
  hdl_cholesterol?: number | null
  ldl_cholesterol?: number | null
  triglycerides?: number | null

  magnesium?: number | null
  phosphate?: number | null
  amylase?: number | null
  lipase?: number | null

  data?: Record<string, unknown>
}

export type ImagingReportDraft = {
  case_id: string
  time_offset: number
  name: string
  raw: ImagingData
}

export type MicrobiologyReportDraft = {
  case_id: string
  time_offset: number
  name: string
  raw: MicrobiologyReportData
}

export const LAB_FIELD_TO_COLUMN: Record<string, keyof LabResultInsert> = {
  "Sodium": "sodium",
  "Potassium": "potassium",
  "Chlorine": "chloride",
  "BUN": "bun",
  "Creatinine": "creatinine",
  "Glucose": "glucose",
  "CO2": "co2",
  "Calcium": "calcium",
  "Lactate": "lactate",
  "RBC": "rbc",
  "WBC": "wbc",
  "Platelets": "platelets",
  "Hemoglobin": "hemoglobin",
  "Hematocrit": "hematocrit",
  "MCV": "mcv",
  "MCH": "mch",
  "MCHC": "mchc",
  "Troponin": "troponin",
  "CKMB": "ckmb",
  "Myoglobin": "myoglobin",
  "AST": "ast",
  "ALT": "alt",
  "ALP": "alp",
  "Total Bilirubin": "total_bilirubin",
  "Albumin": "albumin",
  "Ammonia": "ammonia",
  "pCO2": "pco2",
  "pO2": "po2",
  "HCO3": "hco3",
  "Specific Gravity": "specific_gravity",
  "Urine pH": "urine_ph",
  "Protein": "protein",
  "Urine Glucose": "urine_glucose",
  "Ketones": "ketones",
  "Leukocyte Esterase": "leukocyte_esterase",
  "Nitrites": "nitrites",
  "Blood": "blood",
  "PT": "pt",
  "PTT": "ptt",
  "CRP": "crp",
  "ESR": "esr",
  "TSH": "tsh",
  "Free T3": "free_t3",
  "Free T4": "free_t4",
  "Total Cholesterol": "total_cholesterol",
  "HDL Cholesterol": "hdl_cholesterol",
  "LDL Cholesterol": "ldl_cholesterol",
  "Triglycerides": "triglycerides",
  "Magnesium": "magnesium",
  "Phosphate": "phosphate",
  "Amylase": "amylase",
  "Lipase": "lipase",
}

type LabFormPayload = {
  data: LabTableData[]
  timePoints: number[]
  timePointsInPreSim: Set<number>
  visibleItems?: Set<string>
}

type TransformedLabsPayload = {
  labResults: LabResultInsert[]
  imagingReports: ImagingReportDraft[]
  microbiologyReports: MicrobiologyReportDraft[]
}

function parseNumeric(value: unknown): number | null {
  if (value === "" || value == null) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function transformLabTableToSchema(
  caseId: string,
  payload: LabFormPayload
): TransformedLabsPayload {
  const { data, timePoints, timePointsInPreSim } = payload

  const imagingReports: ImagingReportDraft[] = []
  const microbiologyReports: MicrobiologyReportDraft[] = []

  // 
  const labResults: LabResultInsert[] = timePoints.map((timePoint) => {
    const baseRow: LabResultInsert = {
      case_id: caseId,
      time_offset: timePoint,
      is_in_presim: timePointsInPreSim.has(timePoint),
      data: {},
    }

    for (const row of data) {
      if (row.rowType === "divider") continue

      const cellValue = row[timePoint]

      if (row.rowType === "results") {
        const columnName = LAB_FIELD_TO_COLUMN[row.field]

        if (columnName) {
          /// TODO: This is workaround, update mappings above to satisfy type checking
          ; (baseRow[columnName] as number | null | undefined) = parseNumeric(cellValue)
        } else {
          baseRow.data = {
            ...(baseRow.data ?? {}),
            unstructured: {
              ...(((baseRow.data ?? {}) as { unstructured?: Record<string, unknown> }).unstructured ?? {}),
              [row.field]: cellValue ?? null,
            },
          }
        }
      }
      else if (row.rowType === "imaging" && cellValue) {
        imagingReports.push({
          case_id: caseId,
          time_offset: timePoint,
          name: row.field,
          raw: cellValue as ImagingData,
        })
      }
      else if (row.rowType === "microbiology" && cellValue) {
        microbiologyReports.push({
          case_id: caseId,
          time_offset: timePoint,
          name: row.field,
          raw: cellValue as MicrobiologyReportData,
        })
      }

    }
    return baseRow
  })

  return {
    labResults,
    imagingReports,
    microbiologyReports,
  }
}

type LabResultRow = Database["public"]["Tables"]["lab_results"]["Row"];
type ImagingReportRow = Database["public"]["Tables"]["imaging_reports"]["Row"];
type MicrobiologyReportRow = Database["public"]["Tables"]["microbiology_reports"]["Row"];

export type LabFrontendBundle = {
  timePoints: number[];
  labTableData: LabTableData[];
};

function toCellString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value === "") return "";
  // Preserve "0" rather than turning it into "".
  if (typeof value === "number" && !Number.isFinite(value)) return "";
  if (typeof value === "string") return value;
  return String(value);
}

function getUnstructuredLabValue(lab: LabResultRow, field: string): unknown {
  const data = lab.data as unknown;
  if (!data || typeof data !== "object") return undefined;

  const maybe = data as {
    unstructured?: Record<string, unknown>;
    [key: string]: unknown;
  };

  // Current save path stores extra/missing fields under `data.unstructured[field]`.
  if (maybe.unstructured && field in maybe.unstructured) {
    return maybe.unstructured[field];
  }

  // Defensive fallback: sometimes JSON blobs are stored at the top-level.
  if (field in maybe) {
    return maybe[field];
  }

  return undefined;
}

function normalizeFindings(findings: unknown): ImagingData["findings"] {
  if (!findings) return [];
  if (Array.isArray(findings)) {
    return findings
      .map((item: unknown) => {
        const maybe = item as { region?: unknown; description?: unknown } | null | undefined;
        const region =
          maybe && typeof maybe.region === "string" ? maybe.region : "";
        const description =
          maybe && typeof maybe.description === "string" ? maybe.description : "";
        return { region, description };
      })
      .filter((x) => x.region || x.description);
  }
  return [];
}

function parseMicroCritical(value: unknown): boolean | "indeterminate" {
  if (value === true) return true;
  if (value === "true") return true;
  if (value === false) return false;
  if (value === "false") return false;

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v.includes("indeterminate")) return "indeterminate";
    if (v.includes("critical")) return true;
    if (v === "true") return true;
    if (v === "false") return false;
  }

  return false;
}

/**
 * Build the exact `LabTableData` shape expected by `labs/page.tsx`:
 * - `timePoints` are numeric "minute offsets"
 * - cell keys are `timePoints` values (e.g. `row[120]`)
 *
 * Assumption for this first labs slice:
 * - DB `lab_results.time_offset` is stored as minutes and can be used directly
 *   as the column key in the UI (which also treats offsets as minutes).
 */
export function buildLabFrontendBundle(args: {
  labResults: LabResultRow[];
  imagingReports: ImagingReportRow[];
  microbiologyReports: MicrobiologyReportRow[];
}): LabFrontendBundle {
  const { labResults, imagingReports, microbiologyReports } = args;

  const timePoints = Array.from(new Set(labResults.map((lr) => lr.time_offset))).sort((a, b) => b - a);

  const labByTimeOffset = new Map<number, LabResultRow>();
  const timeOffsetByLabId = new Map<string, number>();
  for (const lab of labResults) {
    labByTimeOffset.set(lab.time_offset, lab);
    timeOffsetByLabId.set(lab.id, lab.time_offset);
  }

  const imagingByTimeAndName = new Map<number, Map<string, ImagingData>>();
  for (const report of imagingReports) {
    const t = timeOffsetByLabId.get(report.lab_id);
    if (t === undefined) continue;

    const byName = imagingByTimeAndName.get(t) ?? new Map<string, ImagingData>();
    byName.set(report.name, {
      displayName: report.name,
      technique: report.technique,
      findings: normalizeFindings(report.findings),
      impressions: Array.isArray(report.impressions) ? report.impressions : [],
      isCritical: report.is_critical,
    });
    imagingByTimeAndName.set(t, byName);
  }

  const microByTimeAndName = new Map<number, Map<string, MicrobiologyReportData>>();
  for (const report of microbiologyReports) {
    const t = timeOffsetByLabId.get(report.lab_id);
    if (t === undefined) continue;

    const byName =
      microByTimeAndName.get(t) ?? new Map<string, MicrobiologyReportData>();
    byName.set(report.name, {
      sampleType: report.sample_type,
      appearance: report.appearance,
      microscopy: report.microscopy,
      location: report.location ?? undefined,
      cultureResults: report.culture_results,
      sensitivity: report.sensitivity,
      comments: report.comments,
      reporter: report.reporter,
      isCritical: parseMicroCritical(report.is_critical),
    });
    microByTimeAndName.set(t, byName);
  }

  const labTableData: LabTableData[] = labTemplate.map((templateRow) => {
    const row: LabTableData = {
      field: templateRow.field,
      rowType: templateRow.rowType,
      unit: templateRow.unit,
      normalRange: templateRow.normalRange,
      criticalRange: templateRow.criticalRange,
      hideable: templateRow.hideable,
      visibleInPresim: templateRow.visibleInPresim,
    };

    if (templateRow.rowType === "results") {
      for (const timePoint of timePoints) {
        const lab = labByTimeOffset.get(timePoint);
        if (!lab) {
          row[timePoint] = "";
          continue;
        }

        const columnName = LAB_FIELD_TO_COLUMN[templateRow.field];
        if (columnName) {
          const columnKey = columnName as keyof LabResultRow;
          row[timePoint] = toCellString(lab[columnKey]);
        } else {
          const rawValue = getUnstructuredLabValue(lab, templateRow.field);
          row[timePoint] = toCellString(rawValue);
        }
      }
    } else if (templateRow.rowType === "imaging") {
      for (const timePoint of timePoints) {
        const byName = imagingByTimeAndName.get(timePoint);
        row[timePoint] = byName?.get(templateRow.field) ?? {};
      }
    } else if (templateRow.rowType === "microbiology") {
      for (const timePoint of timePoints) {
        const byName = microByTimeAndName.get(timePoint);
        row[timePoint] = byName?.get(templateRow.field) ?? {};
      }
    }

    return row;
  });

  return { timePoints, labTableData };
}

