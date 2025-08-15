interface BaseMedication {
  id: string;
  genericName: string;
  brandName?: string;
  route: "PO" | "IV" | "SC" | "Topical" | "TD" | "Inhalation" | "IM" | "PR" | "SL" | "otic" | "ophthalmic";     // Route will be a literal type for discrimination
  strength: number; // e.g., 25, 100
  strengthUnit: string; // e.g., "mg", "units/mL"
  orderableUnit: string; // e.g., "Tablet", "Solution", "Cream", "Vial", "Syringe"
  availableDosages: number[]; 
  administrationFrequencies: string[]; // probably won't end up needing 
}


interface OralMedication extends BaseMedication {
  route: "PO";
  form: "tablet" | "capsule" | "liquid" | "chewable" | "dissolving_strip";
  canBeCrushedOrSplit: boolean;
  takeWithFood?: boolean;
}

interface IvMedication extends BaseMedication {
  route: "IV"; 
  infusionRate?: number;
  infusionRateUnit?: "mL/hr" | "mg/hr" | "units/hr";
  diluent?: string; 
  totalVolume?: number; 
  infusionDurationHours?: number;
  requiresPump: boolean;
}

interface InjectableMedication extends BaseMedication {
  route: "SC" | "IM"; 
  recommendedInjectionSites?: string[];
  needleGauge?: string;
  needleLength?: string;
  reconstitutionRequired: boolean; // For powdered medications
  reconstitutionInstructions?: string; // If reconstitutionRequired is true
}

interface TopicalMedication extends BaseMedication {
  route: "Topical" | "TD"; 
  applicationArea: string; 
  form: "cream" | "ointment" | "gel" | "patch" | "lotion";
  applyThinLayer?: boolean;
  requiresOcclusiveDressing?: boolean;
  // For patches
  patchApplicationFrequency?: string;
  patchChangeInstructions?: string;
}

interface InhalerMedication extends BaseMedication {
  route: "Inhalation"; 
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
  unitsOrdered: number;
  frequency: string; 
  priority: "STAT" | "NOW" |"ROUTINE";
  instructions?: string;
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
    orderableUnit: "Vial",           
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
    canBeCrushedOrSplit: true, 
    takeWithFood: false, 
  },
  {
    id: "medVancomycinIv1000",
    genericName: "vancomycin",
    brandName: "Vancocin IV",
    route: "IV",
    strength: 1000, // 1000mg per dose/vial
    strengthUnit: "mg",
    orderableUnit: "Bag", 
    availableDosages: [1], 
    administrationFrequencies: ["Q12H", "Q24H"], 
    infusionRate: 250, 
    infusionRateUnit: 'mL/hr',
    diluent: "Dextrose 5% in Water", 
    totalVolume: 250, 
    infusionDurationHours: 2, 
    requiresPump: true,
  },
   {
    id: "medAtorvastatinOral40",
    genericName: "atorvastatin",
    brandName: "Lipitor",
    route: "PO",
    strength: 40,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
    availableDosages: [1], 
    administrationFrequencies: ["QD"],
    form: "tablet",
    canBeCrushedOrSplit: false,
    takeWithFood: false,
  },
  {
    id: "medAcetaminophenOral650",
    genericName: "acetaminophen",
    brandName: "Tylenol",
    route: "PO",
    strength: 650,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
    availableDosages: [1],
    administrationFrequencies: ["PRN"], // As needed
    form: "tablet",
    canBeCrushedOrSplit: true,
    takeWithFood: false,
  },
  {
    id: "medInsulinGlargineSc",
    genericName: "insulin glargine",
    brandName: "Lantus",
    route: "SC",
    strength: 100,
    strengthUnit: "units/mL",
    orderableUnit: "Unit",
    availableDosages: [5, 10, 15, 20, 25], 
    administrationFrequencies: ["QD"],
    reconstitutionRequired: false,
  },
  {
    id: "medHydrocortisoneCream",
    genericName: "hydrocortisone",
    brandName: "Cortaid",
    route: "Topical",
    strength: 1,
    strengthUnit: "%",
    orderableUnit: "Gram",
    availableDosages: [1, 2, 3], 
    administrationFrequencies: ["PRN"],
    applicationArea: "Affected skin area",
    form: "cream",
    applyThinLayer: true,
    requiresOcclusiveDressing: false,
  },
  {
    id: "medFurosemideOral20",
    genericName: "furosemide",
    brandName: "Lasix",
    route: "PO",
    strength: 20,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
    availableDosages: [1, 2, 4],
    administrationFrequencies: ["QD", "BID"],
    form: "tablet",
    canBeCrushedOrSplit: true,
    takeWithFood: false,
  },
  {
    id: "medPantoprazoleIv40",
    genericName: "pantoprazole",
    brandName: "Protonix IV",
    route: "IV",
    strength: 40,
    strengthUnit: "mg",
    orderableUnit: "Vial",
    availableDosages: [40],
    administrationFrequencies: ["QD"],
    infusionRate: 50,
    infusionRateUnit: "mL/hr",
    diluent: "D5W",
    totalVolume: 50,
    infusionDurationHours: 0.5,
    requiresPump: false,
  },
  {
    id: "medEnoxaparinSc40",
    genericName: "enoxaparin",
    brandName: "Lovenox",
    route: "SC",
    strength: 40,
    strengthUnit: "mg",
    orderableUnit: "Pre-filled Syringe",
    availableDosages: [40, 80, 100],
    administrationFrequencies: ["QD", "BID"],
    recommendedInjectionSites: ["Abdomen"],
    needleGauge: "30G",
    needleLength: "5/16 inch",
    reconstitutionRequired: false,
  },
  {
    id: "medMorphineIv10",
    genericName: "morphine sulfate",
    brandName: "Morphine IV",
    route: "IV",
    strength: 10,
    strengthUnit: "mg",
    orderableUnit: "Ampule",
    availableDosages: [2, 4, 10],
    administrationFrequencies: ["PRN", "Q4H"],
    infusionRate: 50,
    infusionRateUnit: "mL/hr",
    diluent: "NS 0.9%",
    totalVolume: 50,
    infusionDurationHours: 1,
    requiresPump: true,
  },
  {
    id: "medAlbuterolInhalation",
    genericName: "albuterol sulfate",
    brandName: "ProAir HFA",
    route: "Inhalation",
    strength: 90,
    strengthUnit: "mcg/actuation",
    orderableUnit: "Inhaler",
    availableDosages: [1],
    administrationFrequencies: ["Q4H", "PRN"],
    deviceType: "MDI",
    requiresSpacer: false,
    inhalationsPerDose: 2,
  },
  {
    id: "medNitroPatchTd",
    genericName: "nitroglycerin",
    brandName: "Minitran",
    route: "TD",
    strength: 0.4,
    strengthUnit: "mg/hr",
    orderableUnit: "Patch",
    availableDosages: [0.2, 0.4],
    administrationFrequencies: ["Daily"],
    applicationArea: "Chest wall or upper arm",
    form: "patch",
    applyThinLayer: false,
    requiresOcclusiveDressing: false,
    patchApplicationFrequency: "daily",
    patchChangeInstructions: "Replace every 24 hours; remove old patch before applying new one",
  },
  {
    id: "medOndansetronIv4",
    genericName: "ondansetron",
    brandName: "Zofran IV",
    route: "IV",
    strength: 4,
    strengthUnit: "mg",
    orderableUnit: "Vial",
    availableDosages: [4],
    administrationFrequencies: ["Q8H", "PRN"],
    infusionRate: 2,
    infusionRateUnit: "mg/hr",
    diluent: "NS 0.9%",
    totalVolume: 50,
    infusionDurationHours: 0.5,
    requiresPump: false,
  },
  {
    id: "medCeftriaxoneIm250",
    genericName: "ceftriaxone",
    brandName: "Rocephin IM",
    route: "IM",
    strength: 250,
    strengthUnit: "mg",
    orderableUnit: "Vial",
    availableDosages: [250, 500, 1000],
    administrationFrequencies: ["Once"],
    recommendedInjectionSites: ["Gluteal muscle", "Vastus lateralis"],
    needleGauge: "22G",
    needleLength: "1.5 inches",
    reconstitutionRequired: true,
    reconstitutionInstructions: "Reconstitute with 1.8 mL sterile water for injection",
  },
  {
    id: "medEpinephrineIm1mg",
    genericName: "epinephrine",
    brandName: "EpiPen",
    route: "IM",
    strength: 1,
    strengthUnit: "mg/0.3mL",
    orderableUnit: "Auto-Injector",
    availableDosages: [1],
    administrationFrequencies: ["PRN"],
    recommendedInjectionSites: ["Anterolateral thigh"],
    needleGauge: "23G",
    needleLength: "0.5 inches",
    reconstitutionRequired: false,
  },
  {
    id: "medMethylprednisoloneIv125",
    genericName: "methylprednisolone",
    brandName: "Solu-Medrol IV",
    route: "IV",
    strength: 125,
    strengthUnit: "mg",
    orderableUnit: "Vial",
    availableDosages: [40, 125],
    administrationFrequencies: ["Once", "Q6H"],
    infusionRate: 100,
    infusionRateUnit: "mL/hr",
    diluent: "NS 0.9%",
    totalVolume: 100,
    infusionDurationHours: 1,
    requiresPump: false,
  },
];

export const medicationOrders: MedicationOrder[] = [
  {
    id: "orderAmoxIv",
    medicationId: "medAmoxIv", 
    unitsOrdered: 1,               // amount of orderableUnits to be administered to pt
    frequency: "Q8H",
    priority: "ROUTINE",
    instructions: "Administer over 30 minutes via infusion pump.",
    indication: "Infection",
    status: "active",
  },
  {
    id: "orderMetoprololOral25",
    medicationId: "medMetoprololOral25",
    unitsOrdered: 2,
    frequency: "Twice Daily",
    priority: "ROUTINE",
    status: "active",
    indication: "Blood Pressure",
    instructions: "Check HR and BP within 30 minutes of administration.",
  },
  {
    id: "orderLisinoprilOral10",
    medicationId: "medLisinoprilOral10",
    unitsOrdered: 1, // Ordering 1 Tablet (10mg)
    frequency: "QD",
    priority: "ROUTINE",
    status: "active",
    indication: "Hypertension",
    instructions: "Monitor blood pressure daily.",
  },
  {
    id: "orderVancomycinIv",
    medicationId: "medVancomycinIv1000",
    unitsOrdered: 1, // Ordering 1 Bag (1000mg)
    frequency: "Q12H",
    priority: "ROUTINE",
    status: "active",
    indication: "Severe Bacterial Infection",
    instructions: "Infuse over 2 hours. Monitor for Red Man Syndrome. Obtain trough level before 4th dose.",
  },
  {
    id: "orderAtorvastatinOral40",
    medicationId: "medAtorvastatinOral40",
    unitsOrdered: 1,
    frequency: "QD",
    priority: "ROUTINE",
    status: "active",
    indication: "Hyperlipidemia",
    instructions: "Administer in the evening.",
  },
  {
    id: "orderAcetaminophenOral650",
    medicationId: "medAcetaminophenOral650",
    unitsOrdered: 1,
    frequency: "PRN",
    priority: "ROUTINE",
    status: "active",
    indication: "Pain",
    instructions: "For pain of 4/10 or greater. Max dose of 4 tablets per 24 hours.",
  },
  {
    id: "orderInsulinGlargineSc",
    medicationId: "medInsulinGlargineSc",
    unitsOrdered: 15,
    frequency: "QD",
    priority: "ROUTINE",
    status: "active",
    indication: "Type 2 Diabetes",
    instructions: "Administer at bedtime.",
  },
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

