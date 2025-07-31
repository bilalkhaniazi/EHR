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

type AllMedicationTypes = 
  OralMedication |
  IvMedication |
  InjectableMedication | 
  TopicalMedication | 
  InhalerMedication;

interface MedicationOrder {
  id: string;
  medication: AllMedicationTypes;
  doseValue: number;
  doseUnit: string;
  frequency: string; 
  priority: "STAT" | "NOW" |"ROUTINE";
  instructions?: string;
  orderDate: Date;
  status: "active" | "completed" | "held" | "cancelled"
}



const metoprolol25mgTablet: OralMedication = { 
  id: "med123",
  genericName: "Metoprolol Succinate",
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
};

const patientMetoprololOrder: MedicationOrder = {
  id: "order456",
  medication: metoprolol25mgTablet,
  doseValue: 2,
  doseUnit: "tablet",
  frequency: "QD",
  priority: "ROUTINE",
  orderDate: new Date(),
  status: "active",
  instructions: "Take with food",
};