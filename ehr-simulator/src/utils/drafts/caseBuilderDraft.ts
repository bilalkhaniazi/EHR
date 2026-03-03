'use client';

import { DemographicFormData, HistoryFormData, IntakeOutputFormData, MedOrderFormData, TableFormData } from "@/utils/form";
import { ClinicalNote } from "@/app/simulation/[sessionId]/chart/notes/components/notesData";
import { OrderType } from "@/app/simulation/[sessionId]/chart/orders/components/orderData";
import { LabTableData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { FlexSheetData } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetData";
import { MedAdministrationInstance } from "@/app/simulation/[sessionId]/chart/mar/components/marData";

const DRAFT_VERSION = 1 as const;
const STORAGE_PREFIX = "ehr:caseBuilderDraft:v1:";

type SerializableTableFormData<T> = Omit<TableFormData<T>, "timePointsInPreSim" | "visibleItems"> & {
  timePointsInPreSim: number[];
  visibleItems?: string[];
};

export interface CaseBuilderDraftData {
  demographicData: DemographicFormData;
  historyData: HistoryFormData;
  noteData: ClinicalNote[];
  orderData: OrderType[];
  labData: SerializableTableFormData<LabTableData>;
  chartingData: SerializableTableFormData<FlexSheetData>;
  ioData: IntakeOutputFormData[];
  medOrderData: MedOrderFormData;
  medAdministrationData: MedAdministrationInstance[];
}

export interface CaseBuilderDraftPayload {
  version: number;
  updatedAt: string;
  lastVisitedPath?: string;
  data: CaseBuilderDraftData;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function getDraft(userId: string | undefined | null): CaseBuilderDraftPayload | null {
  if (!isBrowser() || !userId) return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CaseBuilderDraftPayload;

    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== DRAFT_VERSION) {
      // Clear incompatible versions so they don't linger forever
      window.localStorage.removeItem(getStorageKey(userId));
      return null;
    }

    console.log("RESTORE draft (getDraft)", {
      updatedAt: parsed.updatedAt,
      lastVisitedPath: parsed.lastVisitedPath,
    });
    return parsed;
  } catch {
    // Corrupted JSON or storage error – clear and start fresh
    try {
      window.localStorage.removeItem(getStorageKey(userId!));
      console.log("CLEAR draft (corrupted)", { userId });
    } catch {
      // ignore secondary errors
    }
    return null;
  }
}

export function setDraft(
  userId: string | undefined | null,
  data: CaseBuilderDraftData,
  meta?: { lastVisitedPath?: string; updatedAt?: string }
): CaseBuilderDraftPayload | null {
  if (!isBrowser() || !userId) return null;

  const updatedAt = meta?.updatedAt ?? new Date().toISOString();

  const payload: CaseBuilderDraftPayload = {
    version: DRAFT_VERSION,
    updatedAt,
    lastVisitedPath: meta?.lastVisitedPath,
    data,
  };

  try {
    window.localStorage.setItem(getStorageKey(userId), JSON.stringify(payload));
    console.log("AUTOSAVE draft", {
      updatedAt: payload.updatedAt,
      lastVisitedPath: payload.lastVisitedPath,
    });
  } catch {
    // Ignore quota / storage errors – drafts are best-effort only
  }

  return payload;
}

export function clearDraft(userId: string | undefined | null) {
  if (!isBrowser() || !userId) return;

  try {
    window.localStorage.removeItem(getStorageKey(userId));
    console.log("CLEAR draft", { userId });
  } catch {
    // Non-fatal, ignore
  }
}

