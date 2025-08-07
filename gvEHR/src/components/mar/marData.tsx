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
  status: "active" | "completed" | "Held" | "cancelled"
}

export interface MedAdministrationInstance {
  medicationOrderId: string;    // link to specific med order
  administratorId: string;      // who gave the med
  adminTimeMinuteOffset: number;
  status: 'Given' | 'Held' | 'Missed' | 'Refused' | "Due" | "Patient Administered";
  notes?: string; 
}


// interface medAdminPanelSelections


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
    form: "tablet",         // dup of orderableUnit
    canBeCrushedOrSplit: false, 
    takeWithFood: true, 
  },
  {
    id: "medAmoxIv",              // links to order
    genericName: "amoxicillin",
    brandName: "Amoxil IV", 
    route: "IV", 
    strength: 500,
    strengthUnit: "mg",
    orderableUnit: "Vial",                          // should match (or be replaced by) doseUnit in MedicationOrder 
    availableDosages: [500, 1000], 
    administrationFrequencies: ["Q6H", "Q8H"], 
    // --- IVMedication specific properties ---
    infusionRate: 100, 
    infusionRateUnit: 'mL/hr', 
    diluent: "Normal Saline 0.9%", 
    totalVolume: 50, 
    infusionDurationHours: 0.5, 
    requiresPump: true, 
  },
  {
    id: "medLisinoprilOral10",
    genericName: "lisinopril",
    brandName: "Zestril",
    route: "PO",
    strength: 10,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
    availableDosages: [1, 2], // Order 1 or 2 tablets (10mg or 20mg)
    administrationFrequencies: ["QD"], // Once daily
    form: "tablet",
    canBeCrushedOrSplit: true, // Example: Lisinopril can often be crushed
    takeWithFood: false, // Can be taken without regard to food
  },
  // --- NEW IV MEDICATION ---
  {
    id: "medVancomycinIv",
    genericName: "vancomycin",
    brandName: "Vancocin IV",
    route: "IV",
    strength: 1000, // 1000mg per dose/vial
    strengthUnit: "mg",
    orderableUnit: "Bag", // Often pre-mixed in a bag
    availableDosages: [1], // Typically ordered as 1 bag of 1000mg
    administrationFrequencies: ["Q12H", "Q24H"], // Common frequencies
    infusionRate: 250, // Example: 1000mg in 250mL infused over 2 hours (125 mL/hr) or 4 hours (250 mL/hr)
    infusionRateUnit: 'mL/hr',
    diluent: "Dextrose 5% in Water", // Common diluent for Vancomycin
    totalVolume: 250, // Often comes in 250mL bags
    infusionDurationHours: 2, 
    requiresPump: true,
  }
];

export const medicationOrders: MedicationOrder[] = [
  {
    id: "orderAmoxIv",
    medicationId: "medAmoxIv", 
    doseValue: 1, 
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
  },
  {
    id: "orderLisinoprilOral10",
    medicationId: "medLisinoprilOral10",
    doseValue: 1, // Ordering 1 Tablet (10mg)
    doseUnit: "Tablet",
    frequency: "QD",
    priority: "ROUTINE",
    status: "active",
    indication: "Hypertension",
    instructions: "Monitor blood pressure daily.",
  },
  // --- NEW IV MEDICATION ORDER ---
  {
    id: "orderVancomycinIv",
    medicationId: "medVancomycinIv",
    doseValue: 1, // Ordering 1 Bag (1000mg)
    doseUnit: "Bag",
    frequency: "Q12H",
    priority: "ROUTINE",
    status: "active",
    indication: "Severe Bacterial Infection",
    instructions: "Infuse over 2 hours. Monitor for Red Man Syndrome. Obtain trough level before 4th dose.",
  }
]

export const medAdministrations: MedAdministrationInstance[] = [
  {
    medicationOrderId: "orderMetoprololOral25", // Metoprolol
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -200, 
    status: 'Given',
    notes: " metoprolol"
  },
  {
    medicationOrderId: "orderAmoxIv", 
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -31, 
    status: 'Given',
    notes: "-61 amox."
  },
    {
    medicationOrderId: "orderAmoxIv", 
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -180, 
    status: 'Held',
    notes: "-61 amox."
  },
  {
    medicationOrderId: "orderMetoprololOral25", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: 0, 
    status: 'Due',
    notes: "-121 metoprolol dose."
  },
  {
    medicationOrderId: "orderLisinoprilOral10", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: -121, 
    status: 'Missed',
    notes: "-121 metoprolol dose."
  },
  {
    medicationOrderId: "orderLisinoprilOral10", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: 60, 
    status: 'Due',
    notes: "-121 metoprolol dose."
  },
  {
    medicationOrderId: "orderVancomycinIv", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: 60, 
    status: 'Due',
    notes: "-121 metoprolol dose."
  },
  {
    medicationOrderId: "orderVancomycinIv", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: -140, 
    status: 'Refused',
    notes: "-121 metoprolol dose."
  },
]


export const medRouteSelections: string[] = ["PO", "IV", "SC", "Topical", "Inhalation", "IM", "SL", "Otic", "Ophthalmic"]
export const medActionSelections: string[] = ["Given", "Held", "Refused", "Patient Administered", "Override"]

