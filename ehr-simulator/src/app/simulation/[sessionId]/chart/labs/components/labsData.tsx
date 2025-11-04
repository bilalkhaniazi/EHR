import { sub } from "date-fns";

export interface ImagingData {
  displayName: string;
  technique: string;
  findings: {
    [area: string]: string
  };
  impression: string[];
}

export interface PathologyReportData {
  sampleType: string;
  appearance: string;
  microscopy: string;
  culture: string;
  sensitivity: string;
  comments: string;
  reporter: string;
  critical: true;
}

export interface Lab {
    labName: string; 
    value: string | ImagingData | PathologyReportData;
}

export interface PredefinedLabEntry {
  daysOffset: number,
  hoursOffset: number,
  labs: Lab[]
}

// predefined lab data with an offset time stamp
export interface LabTimePoint {
  dateKey: number; 
  labs: Lab[] 
}

// info for table row 
export interface LabDataTemplate {
  field: string,
  unit?: string,
  rowType: "divider" | "results" | "imaging" | "pathology",
  normalRange?: { low: number, high: number }
  criticalRange?: { low: number, high: number }
  hideable?: boolean
}


// dataset to be used by tanstack table
export interface LabTableData {
    field: string;
    rowType: "divider" | "results" | "imaging"  | "pathology";
    unit?: string;
    normalRange?: { low: number, high: number };
    criticalRange?: { low: number, high: number };
    hideable?: boolean
    [dateKey: string]: string | { labName: string, value: string } | ImagingData | PathologyReportData | any;   // need ability to add any timekey with any type of lab data
}


export const generateAllInitialLabTimes = (referenceDate: number) => {
  const timePoints = new Map<number, LabTimePoint>()

  predefinedLabData.forEach(entry => {
    const timeOffset = (entry.daysOffset * 60 * 24) + (entry.hoursOffset * 60)
    const displayTimeStamp = sub(referenceDate, {days: entry.daysOffset, hours: entry.hoursOffset}).getTime();
    
    if(!timePoints.has(displayTimeStamp)) {
      timePoints.set(displayTimeStamp, {dateKey: timeOffset, labs: entry.labs })
    }
  })
  const sortedTimePoints = Array.from(timePoints.values()).sort((a, b) => b.dateKey - a.dateKey);
  return sortedTimePoints;
}

export const generateInitialLabData = (
  allTimesColumns: LabTimePoint[],
  labTemplate: LabDataTemplate[]
) => {
  const generatedData: LabTableData[] = [];

  const labResultsLookup = new Map<number, Map<string, Lab>>();

  allTimesColumns.forEach(timePoint => {
    const labsForThisTime = new Map<string, Lab>();
    timePoint.labs.forEach(lab => {
      labsForThisTime.set(lab.labName, lab);
    })
    labResultsLookup.set(timePoint.dateKey, labsForThisTime);
  });

  labTemplate.forEach(templateRow => {
    const newRow: LabTableData = {
      field: templateRow.field,
      rowType: templateRow.rowType,
      ...(templateRow.normalRange && { normalRange: templateRow.normalRange }),
      ...(templateRow.criticalRange && {criticalRange: templateRow.criticalRange}),
      ...(templateRow.hideable && { hideable: templateRow.hideable}), 
      unit: templateRow.unit 
    };
    if (templateRow.rowType === "results") {
      allTimesColumns.forEach(timePoint => {
        const labValue = labResultsLookup.get(timePoint.dateKey)?.get(templateRow.field);
        newRow[timePoint.dateKey] = labValue ? labValue.value : '';
      });
    }
    if (templateRow.rowType === "imaging") {
      allTimesColumns.forEach(timePoint => {
        const labValue = labResultsLookup.get(timePoint.dateKey)?.get(templateRow.field);
        newRow[timePoint.dateKey] = labValue ? labValue.value : {};
      });
    }
     if (templateRow.rowType === "pathology") {
      allTimesColumns.forEach(timePoint => {
        const labValue = labResultsLookup.get(timePoint.dateKey)?.get(templateRow.field);
        newRow[timePoint.dateKey] = labValue ? labValue.value : {};
      });
    }
    generatedData.push(newRow)
  })

  return generatedData
}



export const predefinedLabData: PredefinedLabEntry[] = [
  {
    daysOffset: 2, // Today
    hoursOffset: 1, 
    labs: [
      { labName: "Sodium", value: "134" }, 
      { labName: "Potassium", value: "3.7" },
      { labName: "Chlorine", value: "99" },
      { labName: "BUN", value: "25" }, 
      { labName: "Creatinine", value: "1.3" },
      { labName: "Glucose", value: "275" }, 
      { labName: "CO2", value: "24" },
      { labName: "Calcium", value: "8.9" },

      { labName: "RBC", value: "4.5" },
      { labName: "WBC", value: "11.8" }, 
      { labName: "Platelets", value: "280" },
      { labName: "Hemoglobin", value: "14.2" },
      { labName: "Hematocrit", value: "42" },
      { labName: "MCV", value: "92" },
      { labName: "MCH", value: "31" },
      { labName: "MCHC", value: "33" },

      { labName: "pH", value: "7.35" }, 
      { labName: "pCO2", value: "48" }, 
      { labName: "pO2", value: "38" },
      { labName: "HCO3", value: "25" },

      { labName: "Hemoglobin A1c", value: "9.5" }, 
      { labName: "AST", value: "35" },
      { labName: "ALT", value: "40" },
      { labName: "Troponin", value: "0.01" }, 
    ]
  },
  {
    daysOffset: 0, // Today
    hoursOffset: 1, 
    labs: [
      { labName: "Glucose", value: "210" }, 
    ]
  },
  {
    daysOffset: 1, // Today
    hoursOffset: 4, 
    labs: [
      { labName: "Glucose", value: "204" }, 
    ]
  },

  {
    daysOffset: 0, 
    hoursOffset: 4, 
    labs: [
      { labName: "Sodium", value: "136" }, 
      { labName: "Potassium", value: "6.1" },
      { labName: "Chlorine", value: "100" },
      { labName: "BUN", value: "20" }, 
      { labName: "Creatinine", value: "1.2" }, 
      { labName: "Glucose", value: "185" }, 
      { labName: "CO2", value: "25" },
      { labName: "Calcium", value: "9.0" },
    ]
  },
  {
    daysOffset: 1, 
    hoursOffset: 1, 
    labs: [
      { labName: "Glucose", value: "160" },
      { labName: "CT R. Foot", 
        value: {
          displayName: "CT OF THE RIGHT FOOT",
          technique: "Non-contrast axial and sagittal CT images of the right foot were obtained. Multiplanar reconstructions performed.",
          findings: {
            "Soft Tissue": "There is a focal soft tissue defect overlying the plantar aspect of the right forefoot, measuring approximately 2.8 cm in diameter, with surrounding subcutaneous fat stranding and mild edema.",
            "Bone Structures": "Cortical irregularity and erosion noted involving the underlying second and third metatarsal heads. Trabecular sclerosis and decreased attenuation suggest early osteomyelitic changes. No definitive intraosseous gas observed.",
            "Joints": "Mild degenerative changes at the tarsometatarsal joints. No joint effusion",
            "Vascularity": "Posterior tibial artery calcifications consistent with peripheral vascular disease."
          },
          impression: [
            "Soft tissue ulceration of the right plantar forefoot with adjacent inflammatory changes.",
            "Findings suggestive of early osteomyelitis involving the second and third metatarsal heads.",
            "Peripheral vascular calcifications likely related to underlying diabetes."
          ]
        }
      },
      {
        labName: "Wound Culture",
        value: {
          sampleType: "Wound Culture – Right Great Toe",
          appearance: "Purulent drainage noted, surrounding erythema",
          microscopy: "Gram stain: Moderate gram-positive cocci in clusters, few PMNs",
          culture: "Staphylococcus aureus (moderate growth)",
          sensitivity: "Methicillin (R), Clindamycin (S), Vancomycin (S)",
          comments: "Likely MRSA involvement. Consider empiric coverage with vancomycin. Poor healing noted in context of suboptimal glycemic control.",
          reporter: "AC, Microbiology Lab – St. Jude Medical Center",
          critical: true
        }
      } 
    ]
  },
  {
    daysOffset: 1, 
    hoursOffset: 14, 
    labs: [
      { labName: "Glucose", value: "195" },
    ]
  },
];

export const labTemplate: LabDataTemplate[] = [
  {
    field: "Metabolic",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Sodium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 135, high: 145 }
  },
  {
    field: "Potassium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 3.5, high: 5.0 },
    criticalRange: {low: 3.0, high: 6.0 }
  },
  {
    field: "Chlorine",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 95, high: 105 }
  },
  {
    field: "BUN",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 7, high: 20 }
  },
  {
    field: "Creatinine",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0.6, high: 1.2 }
  },
  {
    field: "Glucose",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 70, high: 100 } 
  },
  {
    field: "CO2",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 23, high: 30 }
  },
  {
    field: "Calcium",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 8.5, high: 10.5 }
  },
  {
    field: "Lactate",
    unit: "(mmol/L)",
    rowType: "results",
    normalRange: { low: 0.5, high: 1.0 } 
  },
  {
    field: "Hematology",
    unit: "",
    rowType: "divider",
  },
  {
    field: "RBC",
    unit: "(10⁶/µL)",
    rowType: "results",
    normalRange: { low: 4.0, high: 6.0 } 
  },
  {
    field: "WBC",
    unit: "(10³/µL)",
    rowType: "results",
    normalRange: { low: 4.5, high: 11.0 }
  },
  {
    field: "Platelets",
    unit: "(10³/µL)",
    rowType: "results",
    normalRange: { low: 150, high: 450 }
  },
  {
    field: "Hemoglobin",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: 12.0, high: 17.5 }
  },
  {
    field: "Hematocrit",
    unit: "(%)",
    rowType: "results",
    normalRange: { low: 36, high: 54 } 
  },
  {
    field: "MCV",
    unit: "(fL)",
    rowType: "results",
    normalRange: { low: 80, high: 100 }
  },
  {
    field: "MCH",
    unit: "(pg)", // Picograms
    rowType: "results",
    normalRange: { low: 27, high: 33 }
  },
  {
    field: "MCHC",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: 32, high: 36 }
  },
  {
    field: "Cardiac",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Troponin",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: 0, high: 0.04 } 
  },
  {
    field: "CKMB",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: 0, high: 3 }
  },
  {
    field: "Myoglobin",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: 0, high: 85 }
  },
  {
    field: "Hepatology",
    unit: "",
    rowType: "divider",
  },
  {
    field: "AST",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: 10, high: 40 }
  },
  {
    field: "ALT",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: 7, high: 56 }
  },
  {
    field: "ALP",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: 40, high: 120 }
  },
  {
    field: "Total Bilirubin",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0.1, high: 1.2 }
  },
  {
    field: "Albumin",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: 3.5, high: 5.0 }
  },
  {
    field: "Ammonia",
    unit: "(mcg/dL)", // Common unit for Ammonia
    rowType: "results",
    normalRange: { low: 15, high: 45 }
  },
  {
    field: "Venous Blood Gas",
    unit: "",
    rowType: "divider",
  },
  {
    field: "pH",
    unit: "", // pH is unitless
    rowType: "results",
    normalRange: { low: 7.35, high: 7.45 }
  },
  {
    field: "pCO2",
    unit: "(mmHg)",
    rowType: "results",
    normalRange: { low: 40, high: 50 } 
  },
  {
    field: "pO2",
    unit: "(mmHg)",
    rowType: "results",
    normalRange: { low: 30, high: 40 }
  },
  {
    field: "HCO3",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 22, high: 29 }
  },
  {
    field: "Urinalysis",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Specific Gravity",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: 1.005, high: 1.030 }
  },
  {
    field: "Urine pH",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: 4.5, high: 8.0 }
  },
  {
    field: "Protein",
    unit: "", 
    rowType: "results",
  },
  {
    field: "Urine Glucose",
    unit: "", // Often reported as negative/positive
    rowType: "results",
  },
  {
    field: "Ketones",
    unit: "", // Often reported as negative/positive
    rowType: "results",
  },
  {
    field: "Leukocyte Esterase",
    unit: "", // Often reported as negative/positive
    rowType: "results",
  },
  {
    field: "Nitrites",
    unit: "", // Often reported as negative/positive
    rowType: "results",
  },
  {
    field: "Blood",
    unit: "", // Often reported as negative/positive
    rowType: "results",
  },
  {
    field: "Coagulation",
    unit: "",
    rowType: "divider",
  },
  {
    field: "PT",
    unit: "(sec)",
    rowType: "results",
    normalRange: { low: 11.0, high: 13.5 }
  },
  {
    field: "PTT",
    unit: "(sec)",
    rowType: "results",
    normalRange: { low: 25, high: 35 }
  },
  {
    field: "INR",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: 0.8, high: 1.1 },
    hideable: true
  },
  {
    field: "Inflammatory Markers",
    unit: "",
    rowType: "divider",
    hideable: true

  },
  {
    field: "CRP",
    unit: "(mg/L)",
    rowType: "results",
    normalRange: { low: 0, high: 10 },
    hideable: true
  },
  {
    field: "ESR",
    unit: "(mm/hr)",
    rowType: "results",
    normalRange: { low: 0, high: 20 },
    hideable: true
  },
  {
    field: "Thyroid Function",
    unit: "",
    rowType: "divider",
    hideable: true

  },
  {
    field: "TSH", 
    unit: "(mIU/L)",
    rowType: "results",
    normalRange: { low: 0.4, high: 4.0 },
    hideable: true
  },
  {
    field: "Free T3",
    unit: "(pg/mL)",
    rowType: "results",
    normalRange: { low: 2.3, high: 4.2 },
    hideable: true
  },
  {
    field: "Free T4",
    unit: "(ng/dL)",
    rowType: "results",
    normalRange: { low: 0.8, high: 1.8 },
    hideable: true
  },
  {
    field: "Lipid Panel",
    unit: "",
    rowType: "divider",
    hideable: true
  },
  {
    field: "Total Cholesterol",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 125, high: 200 },
    hideable: true

  },
  {
    field: "HDL Cholesterol", 
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 40, high: 60 },
    hideable: true
  },
  {
    field: "LDL Cholesterol", 
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0, high: 100 },
    hideable: true

  },
  {
    field: "Triglycerides",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 0, high: 150 },
    hideable: true
  },
  {
    field: "Additional Electrolytes",
    unit: "",
    rowType: "divider",
    hideable: true

  },
  {
    field: "Magnesium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: 1.5, high: 2.5 },
    hideable: true

  },
  {
    field: "Phosphate",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: 2.5, high: 4.5 },
    hideable: true
  },
  {
    field: "Pancreatic Enzymes",
    unit: "",
    rowType: "divider",
    hideable: true

  },
  {
    field: "Amylase",
    unit: "(U/L)",
    rowType: "results",
    normalRange: { low: 25, high: 125 },
    hideable: true
  },
  {
    field: "Lipase",
    unit: "(U/L)",
    rowType: "results",
    normalRange: { low: 0, high: 160 },
    hideable: true
  },
  {
    field: "Imaging",
    unit: "",
    rowType: "divider",
  },
  {
    field: "CT R. Foot",
    unit: "",
    rowType: "imaging",
    hideable: true

  },
  {
    field: "Pathology",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Wound Culture",
    unit: "",
    rowType: "pathology"
  }
];
