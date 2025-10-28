interface BaseMedication {
  id: string;
  genericName: string;
  brandName?: string;
  route: "PO" | "IV" | "SC" | "Topical" | "Inhalation" | "IM" | "SL" | "Otic" | "Ophthalmic";     // Route will be a literal type for discrimination
  strength: number; // e.g., 25, 100
  strengthUnit: string; // e.g., "mg", "units/mL"
  orderableUnit: string; // e.g., "Tablet", "Solution", "Cream", "Vial", "Syringe"
  administrationFrequencies: string[]; 
}


interface OralMedication extends BaseMedication {
  route: "PO";
  form: "tablet" | "capsule" | "dissolvable tab" | "chewable" ;
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
  isContinuous: boolean;
}

interface InjectableMedication extends BaseMedication {
  route: "SC" | "IM"; 
  recommendedInjectionSites?: string[];
  needleGauge?: string;
  needleLength?: string;
  reconstitutionRequired?: boolean; 
  reconstitutionInstructions?: string;
}

interface TopicalMedication extends BaseMedication {
  route: "Topical"; 
  applicationArea: string; 
  form: "cream" | "ointment" | "gel" | "patch" | "lotion";
  patchApplicationFrequency?: string;
  patchChangeInstructions?: string;
}

interface InhalerMedication extends BaseMedication {
  route: "Inhalation"; 
  deviceType: "MDI" | "DPI" | "nebulizer";
  requiresSpacer?: boolean;
  inhalationsPerDose: number;
}

export interface InsulinMedication extends InjectableMedication {
  bgDosing: { bgRange: string, units: string }[],
}

export type AllMedicationTypes =     // route property acts as discriminator
  OralMedication |
  IvMedication |
  InjectableMedication | 
  TopicalMedication | 
  InhalerMedication | 
  InsulinMedication 


// Each order is associated with one medication and details how, when, why it should be given  
export interface MedicationOrder {
  id: string;
  medicationId: string;
  unitsOrdered: number;
  frequency: string; 
  priority: "STAT" | "NOW" |"Routine";
  instructions?: string;
  indication: string;
  status: "active" | "completed" | "Held" | "cancelled";
  orderingProvider: String;
  infusionRate?: number
}

// an instance where a patient is given a medication (or refuses it)
// is associated with a specific med order
export interface MedAdministrationInstance {
  medicationOrderId: string;    // link to specific med order
  administratorId: string;      
  adminTimeMinuteOffset: number;
  status: 'Given' | 'Held' | 'Missed' | 'Refused' | "Due" ;
  notes?: string; 
  administeredDose: number
}

// List of all medications that could be used in a medicationOrder. 
export const allMedications: AllMedicationTypes[] = [
  { 
    id: "medMetoprololOral25",
    genericName: "metoprolol succinate",
    brandName: "Toprol XL",
    route: "PO", // This matches the discriminator for OralMedication
    strength: 25,
    strengthUnit: "mg",
    orderableUnit: "Tablet", 
    administrationFrequencies: ["QD", "BID"],
    // Properties specific to OralMedication:
    form: "tablet",         // dup of orderableUnit
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
    orderableUnit: "Vial",           
    administrationFrequencies: ["Q6H", "Q8H"], 
    // --- IVMedication specific properties ---
    infusionRate: 100, 
    infusionRateUnit: 'mL/hr', 
    diluent: "normal saline 0.9%", 
    totalVolume: 50, 
    infusionDurationHours: 0.5, 
    isContinuous: false, 
  },
  {
    id: "medNormalSaline09Iv",              
    genericName: "normal saline 0.9%",
    route: "IV", 
    strength: 1000,
    strengthUnit: "mL",
    orderableUnit: "Bag",           
    administrationFrequencies: ["Q6H", "Q8H"], 
    infusionRate: 100, 
    infusionRateUnit: 'mL/hr', 
    totalVolume: 1000, 
    infusionDurationHours: 10, 
    isContinuous: true, 
  },
    {
    id: "medLactatedRingersIV",              
    genericName: "Lactated Ringer's Injection ",
    route: "IV", 
    strength: 1000,
    strengthUnit: "mL",
    orderableUnit: "Bag",           
    administrationFrequencies: ["Q6H", "Q8H"], 
    infusionRate: 100, 
    infusionRateUnit: 'mL/hr', 
    totalVolume: 1000, 
    infusionDurationHours: 10, 
    isContinuous: true, 
  },
  {
    id: "medPiperacillinTazobactamIV",
    genericName: "piperacillin tazobactam",
    route: "IV", 
    strength: 3.375,
    strengthUnit: "g",
    orderableUnit: "vial",           
    administrationFrequencies: ["Q6H", "Q8H"], 
    infusionRate: 100, 
    infusionRateUnit: 'mL/hr',
    diluent: 'normal saline 0.9%', 
    totalVolume: 100, 
    infusionDurationHours: 10, 
    isContinuous: false, 
  },
  {
    id: "medLisinoprilOral10",
    genericName: "lisinopril",
    brandName: "Zestril",
    route: "PO",
    strength: 10,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
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
    administrationFrequencies: ["Q12H", "Q24H"], 
    infusionRate: 250, 
    infusionRateUnit: 'mL/hr',
    diluent: "dextrose 5% in water", 
    totalVolume: 250, 
    infusionDurationHours: 2, 
    isContinuous: false,
  },
  {
    id: "medAtorvastatinOral40",
    genericName: "atorvastatin",
    brandName: "Lipitor",
    route: "PO",
    strength: 40,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
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
    strength: 1,
    strengthUnit: "units",
    orderableUnit: "Unit",
    administrationFrequencies: ["QD"],
  },
  {
    id: "medInsulinAspartHum",
    genericName: "insulin aspart",
    brandName: "Humalog",
    route: "SC",
    strength: 1,
    strengthUnit: "units",
    orderableUnit: "Unit",
    administrationFrequencies: ["QD"],
    bgDosing: [
      { bgRange: "<70", units: "0" },
      { bgRange: "70-150", units: "6" },
      { bgRange: "151-200", units: "8" },
      { bgRange: "201-250", units: "10" },
      { bgRange: "251-300", units: "12" },
      { bgRange: "301-350", units: "14" },
      { bgRange: "351-400", units: "16" },
      { bgRange: ">400", units: "18" },
    ],
  },
  {
    id: "medHydrocortisoneCream",
    genericName: "hydrocortisone",
    brandName: "Cortaid",
    route: "Topical",
    strength: 1,
    strengthUnit: "%",
    orderableUnit: "Gram",
    administrationFrequencies: ["PRN"],
    applicationArea: "Affected skin area",
    form: "cream",
  },
  {
    id: "medFurosemideOral20",
    genericName: "furosemide",
    brandName: "Lasix",
    route: "PO",
    strength: 20,
    strengthUnit: "mg",
    orderableUnit: "Tablet",
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
    administrationFrequencies: ["QD"],
    infusionRate: 50,
    infusionRateUnit: "mL/hr",
    diluent: "D5W",
    totalVolume: 50,
    infusionDurationHours: 0.5,
    isContinuous: false,
  },
  {
    id: "medEnoxaparinSc40",
    genericName: "enoxaparin",
    brandName: "Lovenox",
    route: "SC",
    strength: 40,
    strengthUnit: "mg",
    orderableUnit: "Pre-filled Syringe",
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
    administrationFrequencies: ["PRN", "Q4H"],
    infusionRate: 50,
    infusionRateUnit: "mL/hr",
    diluent: "NS 0.9%",
    totalVolume: 50,
    infusionDurationHours: 1,
    isContinuous: false,
  },
  {
    id: "medAlbuterolInhalation",
    genericName: "albuterol sulfate",
    brandName: "ProAir HFA",
    route: "Inhalation",
    strength: 30,
    strengthUnit: "mcg",
    orderableUnit: "puff",
    administrationFrequencies: ["Q4H", "PRN"],
    deviceType: "MDI",
    requiresSpacer: false,
    inhalationsPerDose: 2,
  },
  {
    id: "medNitroPatchTd",
    genericName: "nitroglycerin",
    brandName: "Minitran",
    route: "Topical",
    strength: 0.4,
    strengthUnit: "mg/hr",
    orderableUnit: "Patch",
    administrationFrequencies: ["Daily"],
    applicationArea: "Chest wall or upper arm",
    form: "patch",
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
    administrationFrequencies: ["Q8H", "PRN"],
    infusionRate: 2,
    infusionRateUnit: "mg/hr",
    diluent: "NS 0.9%",
    totalVolume: 50,
    infusionDurationHours: 0.5,
    isContinuous: false,
  },
  {
    id: "medCeftriaxoneIm250",
    genericName: "ceftriaxone",
    brandName: "Rocephin IM",
    route: "IM",
    strength: 250,
    strengthUnit: "mg",
    orderableUnit: "Vial",
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
    administrationFrequencies: ["Once", "Q6H"],
    infusionRate: 100,
    infusionRateUnit: "mL/hr",
    diluent: "NS 0.9%",
    totalVolume: 100,
    infusionDurationHours: 1,
    isContinuous: false,
  },
  {
    id: "medMetoprololIvPush",
    genericName: "metoprolol tartate",
    brandName: "Lopressor",
    route: "IV",
    strength: 10,
    strengthUnit: "mg",
    orderableUnit: "Vial",
    administrationFrequencies: ["Once", "Q6H"],
    isContinuous: false,
  },
];

// interface IvMedication extends BaseMedication {
//   route: "IV"; 
//   infusionRate?: number;
//   infusionRateUnit?: "mL/hr" | "mg/hr" | "units/hr";
//   diluent?: string; 
//   totalVolume?: number; 
//   infusionDurationHours?: number;
//   isContinuous: boolean;
// }

export const medicationOrders: MedicationOrder[] = [
  {
    id: "orderMetoprololIvPush",
    medicationId: "medMetoprololIvPush", 
    unitsOrdered: 0.8,               // amount of orderableUnits to be administered to pt   
    frequency: "Q8H",
    priority: "STAT",
    indication: "Tachycardia",
    status: "active",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderAlbuterolInh",
    medicationId: "medAlbuterolInhalation", 
    unitsOrdered: 1,               // amount of orderableUnits to be administered to pt   
    frequency: "Q8H",
    priority: "STAT",
    indication: "Tachycardia",
    status: "active",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderAmoxIv",
    medicationId: "medAmoxIv", 
    unitsOrdered: 1,               // amount of orderableUnits to be administered to pt   
    frequency: "Q8H",
    priority: "Routine",
    indication: "Infection",
    status: "active",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderPiperacillinTazobactamIV",
    medicationId: "medPiperacillinTazobactamIV", 
    unitsOrdered: 1,               // amount of orderableUnits to be administered to pt   
    frequency: "Q8H",
    priority: "Routine",
    indication: "Infection",
    status: "active",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderNormalSaline09",
    medicationId: "medNormalSaline09Iv", 
    unitsOrdered: 1,
    frequency: "Continuous",
    priority: "Routine",
    indication: "IV Fluids",
    status: "active",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderMetoprololOral25",
    medicationId: "medMetoprololOral25",
    unitsOrdered: 2,
    frequency: "Twice Daily",
    priority: "Routine",
    status: "active",
    indication: "Blood Pressure",
    instructions: "Check HR and BP within 30 minutes of administration.",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderLisinoprilOral10",
    medicationId: "medLisinoprilOral10",
    unitsOrdered: 1, // Ordering 1 Tablet (10mg)
    frequency: "QD",
    priority: "Routine",
    status: "active",
    indication: "Hypertension",
    instructions: "Monitor blood pressure daily.",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderVancomycinIv",
    medicationId: "medVancomycinIv1000",
    unitsOrdered: 1, // Ordering 1 Bag (1000mg)
    frequency: "Q12H",
    priority: "Routine",
    status: "active",
    indication: "Severe Bacterial Infection",
    instructions: "Infuse over 2 hours. Monitor for Red Man Syndrome. Obtain trough level before 4th dose.",
    orderingProvider: "Dr. Rahul Gupta"
    },
  {
    id: "orderAtorvastatinOral40",
    medicationId: "medAtorvastatinOral40",
    unitsOrdered: 1,
    frequency: "QD",
    priority: "Routine",
    status: "active",
    indication: "Hyperlipidemia",
    instructions: "Administer in the evening.",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderAcetaminophenOral650",
    medicationId: "medAcetaminophenOral650",
    unitsOrdered: 1,
    frequency: "PRN",
    priority: "Routine",
    status: "active",
    indication: "Pain",
    instructions: "For pain of 4/10 or greater. Max dose of 4 tablets per 24 hours.",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderInsulinGlargineSc",
    medicationId: "medInsulinGlargineSc",
    unitsOrdered: 15,
    frequency: "QD",
    priority: "Routine",
    status: "active",
    indication: "Type 2 Diabetes",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderInsulinAspartHum",
    medicationId: "medInsulinAspartHum",
    unitsOrdered: 15,
    frequency: "QD",
    priority: "Routine",
    status: "active",
    indication: "Type 2 Diabetes",
    orderingProvider: "Dr. Rahul Gupta"
  },
  {
    id: "orderLactatedRingers",
    medicationId: "medLactatedRingersIV",
    unitsOrdered: 1,
    frequency: "Continuous",
    priority: "Routine",
    status: "active",
    indication: "Maintainence Fluids",
    orderingProvider: "Dr. Rahul Gupta"
  },
]

export const medAdministrations: MedAdministrationInstance[] = [
  {
    medicationOrderId: "orderMetoprololOral25", // Metoprolol
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -200, 
    status: 'Given',
    notes: " metoprolol", 
    administeredDose: 25
  },
  {
    medicationOrderId: "orderAmoxIv", 
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -31, 
    status: 'Given',
    notes: "-61 amox.",
    administeredDose: 200
  },
    {
    medicationOrderId: "orderAmoxIv", 
    administratorId: "RN Smith",
    adminTimeMinuteOffset: -180, 
    status: 'Held',
    notes: "-61 amox.", 
    administeredDose: 100
  },
  {
    medicationOrderId: "orderMetoprololOral25", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: 0, 
    status: 'Due',
    notes: "-121 metoprolol dose.", 
    administeredDose: 100
  },
  {
    medicationOrderId: "orderLisinoprilOral10", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: -121, 
    status: 'Missed',
    notes: "-121 metoprolol dose.", 
    administeredDose: 100
  },
  {
    medicationOrderId: "orderLisinoprilOral10", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: 60, 
    status: 'Due',
    notes: "-121 metoprolol dose.",
    administeredDose: 100
  },
  {
    medicationOrderId: "orderVancomycinIv", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: 60, 
    status: 'Due',
    notes: "-121 metoprolol dose.",
    administeredDose: 100
  },
  {
    medicationOrderId: "orderVancomycinIv", 
    administratorId: "RN Jones",
    adminTimeMinuteOffset: -140, 
    status: 'Refused',
    notes: "-121 metoprolol dose.",
    administeredDose: 100
  },
]


export const medRouteSelections: string[] = ["PO", "IV", "SC", "Topical", "Inhalation", "IM", "SL", "Otic", "Ophthalmic"]
export const medActionSelections: string[] = ["Given", "Held", "Refused", "Patient Administered", "Override"]

