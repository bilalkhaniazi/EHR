interface BaseMedication {
  id: string;
  genericName: string;
  brandName?: string;
  // Route will be a literal type for discrimination
  route: "PO" | "IV" | "SC" | "Topical" | "Inhalation" | "IM" | "PR" | "SL" | "TD" | "otic" | "ophthalmic";
  strength: number; // e.g., 25, 100
  strengthUnit: string; // e.g., "mg", "units/mL"
  orderableUnit: string; // e.g., "Tablet", "Solution", "Cream", "Vial", "Syringe"
  availableDosages: number[]; // e.g., [25, 50, 100] if strengthUnit is mg, or [5, 10] if dosageForm is mL.
  administrationFrequencies: string[]; // e.g., ["QD", "BID", "TID", "Q4H", "PRN"] - use specific codes
}


interface OralMedication extends BaseMedication {
  route: "PO";
  form: "tablet" | "capsule" | "liquid" | "chewable" | "dissolving_strip";
  canBeCrushedOrSplit: boolean;
  takeWithFood?: boolean;
}

interface IvMedication extends BaseMedication {
  route: "IV"; // Discriminator
  infusionRate?: number;
  infusionRateUnit?: "mL/hr" | "mg/hr" | "units/hr";
  diluent?: string; 
  totalVolume?: number; 
  infusionDurationHours?: number;
  requiresPump: boolean;
}

interface InjectableMedication extends BaseMedication {
  route: "SC" | "IM"; // Discriminator
  recommendedInjectionSites?: string[];
  needleGauge?: string;
  needleLength?: string;
  reconstitutionRequired: boolean; // For powdered medications
  reconstitutionInstructions?: string; // If reconstitutionRequired is true
}

interface TopicalMedication extends BaseMedication {
  route: "Topical" | "TD"; // Discriminator
  applicationArea: string; 
  form: "cream" | "ointment" | "gel" | "patch" | "lotion";
  applyThinLayer?: boolean;
  requiresOcclusiveDressing?: boolean;
  // For patches
  patchApplicationFrequency?: string; // e.g., "daily", "every 7 days"
  patchChangeInstructions?: string;
}

interface InhalerMedication extends BaseMedication {
  route: "Inhalation"; // Discriminator
  deviceType: "MDI" | "DPI" | "nebulizer";
  requiresSpacer?: boolean;
  inhalationsPerDose: number;
  // For nebulizers
  nebulizerDurationMinutes?: number;
}

export type AllMedicationTypes =     // route property acts as discriminator
  OralMedication |
  IvMedication |
  InjectableMedication | 
  TopicalMedication | 
  InhalerMedication;

export interface MedicationOrder {
  id: string;
  medicationId: string;
  doseValue: number;
  doseUnit: string;
  frequency: string; 
  priority: "STAT" | "NOW" |"ROUTINE";
  instructions?: string;
  // orderDate: Date;
  indication: string;
  status: "active" | "completed" | "held" | "cancelled"
}

export interface MedAdministrationInstance {
  medicationOrderId: string;    // link to specific med order
  administratorId: string;      // who gave the med
  adminTimeMinuteOffset: number;
  status: 'given' | 'held' | 'missed' | 'refused';
  notes?: string; 
}


export const allMedications: AllMedicationTypes[] = [
  { 
    id: "medMetoprololOral25",
    genericName: "metoprolol succinate",
    brandName: "Toprol XL",
    route: "PO", // This matches the discriminator for OralMedication
    strength: 25,
    strengthUnit: "mg",
    orderableUnit: "Tablet", 
    availableDosages: [1, 2],
    administrationFrequencies: ["QD", "BID"],
    // Properties specific to OralMedication:
    form: "tablet", 
    canBeCrushedOrSplit: false, 
    takeWithFood: true, 
  },
  {
    id: "medAmoxIv",
    genericName: "amoxicillin",
    brandName: "Amoxil IV", 
    route: "IV", 
    strength: 500,
    strengthUnit: "mg",
    orderableUnit: "Vial",                          // should match (replace) doseUnit in MedicationOrder 
    availableDosages: [500, 1000], 
    administrationFrequencies: ["Q6H", "Q8H"], 
    // --- IVMedication specific properties ---
    infusionRate: undefined, 
    infusionRateUnit: undefined, 
    diluent: "Normal Saline 0.9%", 
    totalVolume: 50, 
    infusionDurationHours: 0.5, 
    requiresPump: true, 
  }
];

export const medicationOrders: MedicationOrder[] = [
  {
    id: "orderAmoxIv",
    medicationId: "medAmoxIv", 
    doseValue: 2, 
    doseUnit: "Vial", 
    frequency: "Q8H",
    priority: "ROUTINE",
    instructions: "Administer over 30 minutes via infusion pump.",
    indication: "Infection",
    status: "active",
  },
  {
    id: "orderMetoprololOral25",
    medicationId: "medMetoprololOral25",
    doseValue: 2,
    doseUnit: "Tablet",
    frequency: "Twice Daily",
    priority: "ROUTINE",
    status: "active",
    indication: "Blood Pressure",
    instructions: "Check HR and BP within 30 minutes of administration.",
  }
]

export const medAdministrations: MedAdministrationInstance[] = [
  {
    medicationOrderId: "orderMetoprololOral25", // Metoprolol
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -120, 
    status: 'given',
    notes: "Routine AM dose."
  },
  {
    medicationOrderId: "orderAmoxIv", // Amoxicillin
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -15, 
    status: 'given',
    notes: "Just given before handover."
  },
  {
    medicationOrderId: "orderMetoprololOral25", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: -750, 
    status: 'given',
    notes: "Previous evening dose."
  },
]