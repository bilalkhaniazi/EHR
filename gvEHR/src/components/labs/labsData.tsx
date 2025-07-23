// initial data to be created by nursing faculty
export interface PredefinedLabEntry {
  daysOffset: number,
  hoursOffset: number,
  labResults: { labName: string, value: string}[] 
}

// predefined lab data with an offset time stamp
export interface LabTimePoint {
  dateKey: string; // e.g., "2025-07-14 01:00"
  daysOffset: number;
  hours: number;
  labs: { labName: string, value: string}[] 
}

// info for table row 
export interface LabDataTemplate {
  field: string,
  unit?: string,
  rowType: "divider" | "results",
  normalRange?: { low: string, high: string }
}

// dataset to be used by tanstack table
export interface LabTableData {
    field: string;
    rowType: "divider" | "results";
    unit?: string;
    normalRange?: { low: string, high: string };
    [dateKey: string]: string | { labName: string, value: string } | any; 
}

// export const getInitialDynamicHours = (currHour: number) => {
//   return Array.from({length: 2}, (_, index) => {
//       const adjustedHour = (currHour + index) % 24
//       return `${adjustedHour.toString().padStart(2, "0")}00`
//   }); 
// };

export const generateAllInitialLabTimes = (referenceDate: Date = new Date()) => {
  const timePoints = new Map<string, LabTimePoint>()

  predefinedLabData.forEach(entry => {
    const tempDate = new Date(referenceDate);
    tempDate.setDate(tempDate.getDate() - entry.daysOffset);
    tempDate.setHours(tempDate.getHours() - entry.hoursOffset);
    
    const dateKey = `${(tempDate.getMonth() +1).toString().padStart(2, '0')}/${tempDate.getDate().toString().padStart(2, '0')} ${(tempDate.getHours()).toString().padStart(2, '0')}:${(tempDate.getMinutes()).toString().padStart(2, '0')}`;
    if(!timePoints.has(dateKey)) {
      timePoints.set(dateKey, {dateKey, daysOffset: entry.daysOffset, hours: entry.hoursOffset, labs: entry.labResults })
    }
  })
  const sortedTimePoints = Array.from(timePoints.values()).sort((a, b) => {
        const dateA = new Date(a.dateKey);
        const dateB = new Date(b.dateKey);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedTimePoints;
}

export const generateInitialLabData = (
  allTimesColumns: LabTimePoint[],
  labTemplate: LabDataTemplate[]
) => {
  const generatedData: LabTableData[] = [];

  const labResultsLookup = new Map<string, Map<String, {labName: string, value: string }>>();

  allTimesColumns.forEach(timePoint => {
    const labsForThisTime = new Map<string, {labName: string, value: string }>();
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
      unit: templateRow.unit 
    };
    if (templateRow.rowType === "results") {
      allTimesColumns.forEach(timePoint => {
        const labValue = labResultsLookup.get(timePoint.dateKey)?.get(templateRow.field);
        newRow[timePoint.dateKey] = labValue ? labValue.value : '';
      });
    }
    generatedData.push(newRow)
  })

  return generatedData
}


export interface PredefinedLabEntry {
  daysOffset: number,
  hoursOffset: number,
  labResults: { labName: string, value: string}[]
}

export const predefinedLabData: PredefinedLabEntry[] = [
  // --- Day 1: Hospital Day (Today - daysOffset: 0) ---
  // Admission Labs (BMP, CBC, VBG, some Cardiac/Hepatology) - Drawn ~4 hours ago
  {
    daysOffset: 2, // Today
    hoursOffset: 1, // Approximately 4 hours ago (e.g., around 2:55 PM if current time is 6:55 PM)
    labResults: [
      // Basic Metabolic Panel (BMP)
      { labName: "Sodium", value: "134" }, // Slightly low, common with hyperglycemia
      { labName: "Potassium", value: "4.8" },
      { labName: "Chlorine", value: "99" },
      { labName: "BUN", value: "25" }, // Elevated, mild kidney strain/dehydration
      { labName: "Creatinine", value: "1.3" }, // Slightly elevated
      { labName: "Glucose", value: "275" }, // As per HPI
      { labName: "CO2", value: "24" },
      { labName: "Calcium", value: "8.9" },

      // Complete Blood Count (CBC)
      { labName: "RBC", value: "4.5" },
      { labName: "WBC", value: "11.8" }, // Mildly elevated, consistent with inflammation/infection from ulcer
      { labName: "Platelets", value: "280" },
      { labName: "Hemoglobin", value: "14.2" },
      { labName: "Hematocrit", value: "42" },
      { labName: "MCV", value: "92" },
      { labName: "MCH", value: "31" },
      { labName: "MCHC", value: "33" },

      // Venous Blood Gas (VBG) - to check acid-base status given poorly controlled diabetes
      { labName: "pH", value: "7.35" }, // On the lower end of normal
      { labName: "pCO2", value: "48" }, // Slightly high, mild respiratory acidosis or compensation
      { labName: "pO2", value: "38" },
      { labName: "HCO3", value: "25" },

      // Other relevant labs (e.g., for general assessment)
      { labName: "Hemoglobin A1c", value: "9.5" }, // Reflects long-term poor control
      { labName: "AST", value: "35" },
      { labName: "ALT", value: "40" },
      { labName: "Troponin", value: "0.01" }, // Within normal limits
    ]
  },
  // Post-Insulin BG Check - Drawn ~1 hour ago
  {
    daysOffset: 0, // Today
    hoursOffset: 1, // Approximately 1 hour ago (e.g., around 5:55 PM)
    labResults: [
      { labName: "Glucose", value: "210" }, // Showing some decrease after initial insulin
    ]
  },
  {
    daysOffset: 1, // Today
    hoursOffset: 4, // Approximately 1 hour ago (e.g., around 5:55 PM)
    labResults: [
      { labName: "Glucose", value: "204" }, // Showing some decrease after initial insulin
    ]
  },

  // --- Day 2: Hospital Day 2 (Yesterday - daysOffset: 1) ---
  // Morning BMP and BG checks - Drawn ~22 hours ago (e.g., 8:55 PM yesterday)
  {
    daysOffset: 0, // Yesterday
    hoursOffset: 4, // Approximately 22 hours ago (e.g., 8:55 PM yesterday)
    labResults: [
      // Basic Metabolic Panel (BMP)
      { labName: "Sodium", value: "136" }, // Improving
      { labName: "Potassium", value: "4.5" },
      { labName: "Chlorine", value: "100" },
      { labName: "BUN", value: "20" }, // Improving
      { labName: "Creatinine", value: "1.2" }, // Stable
      { labName: "Glucose", value: "185" }, // Improving, but still elevated
      { labName: "CO2", value: "25" },
      { labName: "Calcium", value: "9.0" },
    ]
  },
  // Mid-day BG Check - Drawn ~18 hours ago (e.g., 12:55 PM yesterday)
  {
    daysOffset: 1, // Yesterday
    hoursOffset: 18, // Approximately 18 hours ago (e.g., 12:55 PM yesterday)
    labResults: [
      { labName: "Glucose", value: "160" }, // Further improvement
    ]
  },
  // Evening BG Check - Drawn ~14 hours ago (e.g., 4:55 PM yesterday)
  {
    daysOffset: 1, // Yesterday
    hoursOffset: 14, // Approximately 14 hours ago (e.g., 4:55 PM yesterday)
    labResults: [
      { labName: "Glucose", value: "195" }, // Slight rise, indicating continued need for management
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
    normalRange: { low: "135", high: "145" }
  },
  {
    field: "Potassium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: "3.5", high: "5.0" }
  },
  {
    field: "Chlorine",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: "95", high: "105" }
  },
  {
    field: "BUN",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "7", high: "20" }
  },
  {
    field: "Creatinine",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "0.6", high: "1.2" }
  },
  {
    field: "Glucose",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "70", high: "100" } // Fasting
  },
  {
    field: "CO2",
    unit: "(mEq/L)", // Often represents Bicarbonate
    rowType: "results",
    normalRange: { low: "23", high: "30" }
  },
  {
    field: "Calcium",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "8.5", high: "10.5" }
  },
  {
    field: "Lactate",
    unit: "(mmol/L)",
    rowType: "results",
    normalRange: { low: "0.5", high: "1.0" } // Resting, venous
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
    normalRange: { low: "4.0", high: "6.0" } // General range
  },
  {
    field: "WBC",
    unit: "(10³/µL)",
    rowType: "results",
    normalRange: { low: "4.5", high: "11.0" }
  },
  {
    field: "Platelets",
    unit: "(10³/µL)",
    rowType: "results",
    normalRange: { low: "150", high: "450" }
  },
  {
    field: "Hemoglobin",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: "12.0", high: "17.5" } // General range
  },
  {
    field: "Hematocrit",
    unit: "(%)",
    rowType: "results",
    normalRange: { low: "36", high: "54" } // General range
  },
  {
    field: "MCV",
    unit: "(fL)",
    rowType: "results",
    normalRange: { low: "80", high: "100" }
  },
  {
    field: "MCH",
    unit: "(pg)", // Picograms
    rowType: "results",
    normalRange: { low: "27", high: "33" }
  },
  {
    field: "MCHC",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: "32", high: "36" }
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
    normalRange: { low: "0", high: "0.04" } // Common cutoff for high-sensitivity Troponin I
  },
  {
    field: "CKMB",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: "0", high: "3" }
  },
  {
    field: "Myoglobin",
    unit: "(ng/mL)",
    rowType: "results",
    normalRange: { low: "0", high: "85" }
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
    normalRange: { low: "10", high: "40" }
  },
  {
    field: "ALT",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: "7", high: "56" }
  },
  {
    field: "ALP",
    unit: "(IU/L)",
    rowType: "results",
    normalRange: { low: "40", high: "120" }
  },
  {
    field: "Total Bilirubin",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "0.1", high: "1.2" }
  },
  {
    field: "Albumin",
    unit: "(g/dL)",
    rowType: "results",
    normalRange: { low: "3.5", high: "5.0" }
  },
  {
    field: "Ammonia",
    unit: "(mcg/dL)", // Common unit for Ammonia
    rowType: "results",
    normalRange: { low: "15", high: "45" }
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
    normalRange: { low: "7.35", high: "7.45" }
  },
  {
    field: "pCO2",
    unit: "(mmHg)",
    rowType: "results",
    normalRange: { low: "40", high: "50" } // Venous pCO2 is typically higher than arterial
  },
  {
    field: "pO2",
    unit: "(mmHg)",
    rowType: "results",
    normalRange: { low: "30", high: "40" } // Venous pO2 is typically lower than arterial
  },
  {
    field: "HCO3",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: "22", high: "29" }
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
    normalRange: { low: "1.005", high: "1.030" }
  },
  {
    field: "Urine pH",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: "4.5", high: "8.0" }
  },
  {
    field: "Protein",
    unit: "", // Often reported as negative/positive or trace
    rowType: "results",
    normalRange: { low: "Negative", high: "Negative" } // Or "0", "Trace" depending on reporting
  },
  {
    field: "Urine Glucose",
    unit: "", // Often reported as negative/positive
    rowType: "results",
    normalRange: { low: "Negative", high: "Negative" }
  },
  {
    field: "Ketones",
    unit: "", // Often reported as negative/positive
    rowType: "results",
    normalRange: { low: "Negative", high: "Negative" }
  },
  {
    field: "Leukocyte Esterase",
    unit: "", // Often reported as negative/positive
    rowType: "results",
    normalRange: { low: "Negative", high: "Negative" }
  },
  {
    field: "Nitrites",
    unit: "", // Often reported as negative/positive
    rowType: "results",
    normalRange: { low: "Negative", high: "Negative" }
  },
  {
    field: "Blood",
    unit: "", // Often reported as negative/positive
    rowType: "results",
    normalRange: { low: "Negative", high: "Negative" }
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
    normalRange: { low: "11.0", high: "13.5" }
  },
  {
    field: "PTT",
    unit: "(sec)",
    rowType: "results",
    normalRange: { low: "25", high: "35" }
  },
  {
    field: "INR",
    unit: "", // Unitless
    rowType: "results",
    normalRange: { low: "0.8", high: "1.1" } // For non-anticoagulated patients
  },
  {
    field: "Inflammatory Markers",
    unit: "",
    rowType: "divider",
  },
  {
    field: "CRP",
    unit: "(mg/L)",
    rowType: "results",
    normalRange: { low: "0", high: "10" } // Varies, but common clinical cutoff
  },
  {
    field: "ESR",
    unit: "(mm/hr)",
    rowType: "results",
    normalRange: { low: "0", high: "20" } // Varies by age/sex, general range
  },
  // --- NEW ADDITIONS ---
  {
    field: "Thyroid Function",
    unit: "",
    rowType: "divider",
  },
  {
    field: "TSH", // Thyroid Stimulating Hormone
    unit: "(mIU/L)",
    rowType: "results",
    normalRange: { low: "0.4", high: "4.0" }
  },
  {
    field: "Free T3",
    unit: "(pg/mL)",
    rowType: "results",
    normalRange: { low: "2.3", high: "4.2" }
  },
  {
    field: "Free T4",
    unit: "(ng/dL)",
    rowType: "results",
    normalRange: { low: "0.8", high: "1.8" }
  },
  {
    field: "Lipid Panel",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Total Cholesterol",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "125", high: "200" } // Desirable
  },
  {
    field: "HDL Cholesterol", // High-Density Lipoprotein
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "40", high: "60" } // Desirable, higher is better
  },
  {
    field: "LDL Cholesterol", // Low-Density Lipoprotein
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "0", high: "100" } // Optimal
  },
  {
    field: "Triglycerides",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "0", high: "150" } // Normal
  },
  {
    field: "Additional Electrolytes",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Magnesium",
    unit: "(mEq/L)",
    rowType: "results",
    normalRange: { low: "1.5", high: "2.5" }
  },
  {
    field: "Phosphate",
    unit: "(mg/dL)",
    rowType: "results",
    normalRange: { low: "2.5", high: "4.5" }
  },
  {
    field: "Pancreatic Enzymes",
    unit: "",
    rowType: "divider",
  },
  {
    field: "Amylase",
    unit: "(U/L)",
    rowType: "results",
    normalRange: { low: "25", high: "125" }
  },
  {
    field: "Lipase",
    unit: "(U/L)",
    rowType: "results",
    normalRange: { low: "0", high: "160" } // Varies by lab
  },
];
