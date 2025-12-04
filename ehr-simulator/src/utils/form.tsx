import { NewOrderData } from "@/app/admin/case-builder/form/medications/page";
import { FlexSheetData } from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetData";
import { LabTableData } from "@/app/simulation/[sessionId]/chart/labs/components/labsData";
import { MedAdministrationInstance } from "@/app/simulation/[sessionId]/chart/mar/components/marData";
import { NoteData } from "@/app/simulation/[sessionId]/chart/notes/components/notesData";
import { OrderType } from "@/app/simulation/[sessionId]/chart/orders/components/orderData";

interface DemographicFormData {
  DOBDay: string;
  DOBMonth: string;
  admissionDateOffest: string;
  admissionTime: string;
  admittingDiagnosis: string;
  age: string;
  attendingProviderName: string;
  attendingProviderTitle: string;
  codeStatus: string;
  dosingWeight: string;
  employment: string;
  firstName: string;
  heightFeet: string;
  heightInches: string;
  insurance: string;
  language: string;
  lastName: string;
  precautions: string;
  relationshipStatus: string;
  religion: string;
  summary: string;
}
interface FormHistoryData {
  medicalHistory: string[]
  surgicalHistory: string[]
  allergies: string[]
  socialHistory: string[]
  livingSituation: string[]
  alerts: string[]
  familyHistory: { relation: string, condition: string }[]
}

export interface FormBlob {
  demographics: DemographicFormData;
  history: FormHistoryData;
  notes: NoteData[];
  orders: OrderType[];
  labs: LabTableData[];
  charting: FlexSheetData[];
  intakeOutput: { blockId: number, intake: number, output: number }[];
  medOrders: NewOrderData[];
  medAdministrationInstances: MedAdministrationInstance[]
}

export type CompleteFormType = DemographicFormData | FormHistoryData | NoteData[] | OrderType[] | LabTableData[] | FlexSheetData[] | MedAdministrationInstance[] | NewOrderData[]

export const nursingAlerts = [
  "Seizure Risk",
  "Aspiration Risk",
  "Bleeding Precautions",
  "NPO Status",
  "Suicide / Self-Harm Risk",
  "Violence / Aggression Risk",
  "Elopement Risk",
  "Restraint Order Active",
  "Continuous Observation",
  "Hearing Impaired",
  "Vision Impaired",
  "High Risk for Falls",
  "Orthostatic Hypotension Risk",
  "Confused / Impulsive Behavior",
  "Delirium / Cognitive Impairment Risk",
  "Head Injury Precautions",
  "Increased Intracranial Pressure (ICP) Precautions",
  "IV Line / Central Line / PICC in Place",
  "Tracheostomy / Airway Precautions",
  "Chest Tube Precautions",
  "Pacemaker / ICD Precautions",
  "Anticoagulant Therapy - Bleeding Precautions",
  "Pressure Injury Risk (Braden <18)",
  "Immunocompromised Precautions",
  "Chemotherapy Precautions / Cytotoxic Drugs",
  "Advanced Directive on File",
  "Court-Ordered Observation / Police Hold",
];

export const categories = [
  "Admission",
  "Consent",
  "Consult",
  "Discharge",
  "History & Physical",
  "Nursing",
  "Post-op",
  "Pre-op",
  "Progress",
  "Rapid Response",
  "Telehealth"
];

export const specialties = [
  "Cardiology",
  "Care Management",
  "Critical Care",
  "Dermatology",
  "ENT",
  "Emergency Medicine",
  "Family Medicine",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Neurology",
  "Nursing",
  "Obstetrics",
  "Occupational Therapy",
  "Oncology",
  "Orthopedics",
  "Pathology",
  "Pediatrics",
  "Physical Therapy",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Respiratory Therapy",
  "SLP",
  "Social Work",
  "Spiritual Care",
  "Urology"
];

export const relationshipStatuses = [
  "Married",
  "Single",
  "Divorced",
  "Engaged",
  "Widowed",
  "Separated",
  "Domestic Partner",
  "Unknown / Undetermined"
]

export const precautions = [
  "Contact",
  "Contact-Enteric",
  "Airbourne",
  "Droplet",
  "Neutropenic",
  "None"
]

export const codeStatuses = [
  "Full",
  "DNR",
  "Partial"
]

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export const days = Array.from({ length: 31 }, (_, i) => i + 1);

export const insuranceOptions = [
  "Medicare",
  "Medicaid",
  "Private"
]