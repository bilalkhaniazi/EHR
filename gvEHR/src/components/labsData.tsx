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
    
    const dateKey = `${(tempDate.getMonth() +1).toString().padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')} ${(tempDate.getHours()).toString().padStart(2, '0')}:${(tempDate.getMinutes()).toString().padStart(2, '0')}`;
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


export const predefinedLabData: PredefinedLabEntry[] = [
  // --- Day 0 (Today) - Recent BMP and a few others ---
  {
    daysOffset: 0, // Today
    hoursOffset: 1, // 1 hour ago
    labResults: [
      { labName: "Sodium", value: "138" },
      { labName: "Potassium", value: "4.0" },
      { labName: "Chlorine", value: "102" },
      { labName: "BUN", value: "18" },
      { labName: "Creatinine", value: "1.0" },
      { labName: "Glucose", value: "95" },
      { labName: "CO2", value: "26" },
      { labName: "Calcium", value: "9.2" },
      { labName: "Troponin", value: "0.03" }, // Slightly elevated for observation
    ]
  },
  {
    daysOffset: 0, // Today
    hoursOffset: 6, // 6 hours ago (e.g., morning labs)
    labResults: [
      { labName: "Hemoglobin", value: "14.5" },
      { labName: "WBC", value: "8.2" },
      { labName: "Platelets", value: "250" },
    ]
  },

  // --- Day 1 (Yesterday) - Comprehensive Panel (BMP, CBC, VBG) ---
  {
    daysOffset: 1, // Yesterday
    hoursOffset: 2, // 2 hours ago from yesterday's current time (e.g., late night)
    labResults: [
      { labName: "Sodium", value: "135" },
      { labName: "Potassium", value: "3.2" }, // Low
      { labName: "Chlorine", value: "98" },
      { labName: "BUN", value: "22" }, // Slightly high
      { labName: "Creatinine", value: "1.1" },
      { labName: "Glucose", value: "110" }, // Slightly high
      { labName: "CO2", value: "28" },
      { labName: "Calcium", value: "8.8" },
      { labName: "pH", value: "7.32" }, // Acidotic
      { labName: "pCO2", value: "52" }, // High
      { labName: "pO2", value: "35" },
      { labName: "HCO3", value: "25" },
    ]
  },
  {
    daysOffset: 1, // Yesterday
    hoursOffset: 14, // 14 hours ago from yesterday's current time (e.g., morning)
    labResults: [
      { labName: "RBC", value: "4.8" },
      { labName: "WBC", value: "12.5" }, // Elevated
      { labName: "Platelets", value: "180" },
      { labName: "Hemoglobin", value: "13.8" },
      { labName: "Hematocrit", value: "41" },
      { labName: "MCV", value: "90" },
      { labName: "MCH", value: "30" },
      { labName: "MCHC", value: "34" },
      
    ]
  },

  // --- Day 2 (Two Days Ago) - Follow-up and Cardiac/Hepatology ---
  {
    daysOffset: 2, // Two days ago
    hoursOffset: 8, // 8 hours ago
    labResults: [
      { labName: "Troponin", value: "0.06" }, // Higher
      { labName: "CKMB", value: "5" }, // Elevated
      { labName: "Myoglobin", value: "100" }, // Elevated
      { labName: "Total Bilirubin", value: "1.5" }, // Slightly high
      { labName: "Albumin", value: "3.2" }, // Low
      { labName: "AST", value: "55" }, // Elevated
      { labName: "ALT", value: "60" }, // Elevated
    ]
  },

  // --- Day 3 (Three Days Ago) - Initial Labs ---
  {
    daysOffset: 3, // Three days ago
    hoursOffset: 10, // 10 hours ago
    labResults: [
      { labName: "Sodium", value: "142" },
      { labName: "Potassium", value: "4.5" },
      { labName: "BUN", value: "15" },
      { labName: "Chlorine", value: "100" },
      { labName: "Creatinine", value: "0.9" },
      { labName: "Glucose", value: "85" },
      { labName: "Hemoglobin A1c", value: "6.0" }, // Elevated
      { labName: "Calcium", value: "8.8" },

    ]
  },

  // --- Day 4 (Four Days Ago) - Baseline Labs ---
  {
    daysOffset: 4, // Four days ago
    hoursOffset: 18, // 18 hours ago
    labResults: [
      { labName: "Sodium", value: "139" },
      { labName: "Potassium", value: "4.2" },
      { labName: "Chlorine", value: "100" },
      { labName: "BUN", value: "12" },
      { labName: "Creatinine", value: "0.8" },
      { labName: "Glucose", value: "92" },
      { labName: "Calcium", value: "8.8" },
      { labName: "Ammonia", value: "50" }, // Slightly high
      { labName: "pH", value: "7.40" },
      { labName: "pCO2", value: "45" },
      { labName: "pO2", value: "38" },
      { labName: "HCO3", value: "24" },
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
];
