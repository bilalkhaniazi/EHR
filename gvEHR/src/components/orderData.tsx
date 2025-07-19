export interface NursingOrderData {
    displayName: string,
    orderType: string,
    status: string,
    [key: string]: string
}

export const nursingOrders: NursingOrderData[] = [
    {
        displayName: "Vital Signs Monitoring (q4h)",
        orderType: "nursing",
        status: "Active",
        details: "Monitor BP, HR, RR, Temp, SpO₂ every 4 hours. Notify provider for Temp > 38.0°C (100.4°F), Systolic BP > 160 mmHg or < 100 mmHg, HR > 110 bpm or < 50 bpm.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Blood Glucose Monitoring (ACHS)",
        orderType: "nursing",
        status: "Active",
        details: "Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose < 70 mg/dL or > 300 mg/dL.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Activity: As Tolerated",
        orderType: "nursing",
        status: "Active",
        details: "Encourage patient activity as tolerated. Assist with ambulation as needed.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Fall Risk Precautions",
        orderType: "nursing",
        status: "Active",
        details: "Implement standard fall risk protocol. Ensure bed in low position and call light within reach.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Contact Precautions for MRSA",
        orderType: "nursing",
        status: "Active",
        details: "Gown and gloves with all room entry. Use dedicated patient equipment. Strict hand hygiene.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Right Great Toe Wound Care",
        orderType: "nursing",
        status: "Active",
        details: "Daily dressing change with normal saline (NS) wound cleansing and application of sterile dry dressing. Apply topical antimicrobial per wound care protocol. Monitor for signs of infection (increased redness, drainage, odor).",
        duration: "Daily",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Diabetic Diet",
        orderType: "nursing",
        status: "Active",
        details: "Provide consistent carbohydrate diabetic diet. Encourage fluid intake unless contraindicated.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Patient Education",
        orderType: "nursing",
        status: "Active",
        details: "Educate patient on diabetes management, wound care, and MRSA precautions.",
        duration: "Once during admission",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Case Management Consult",
        orderType: "nursing",
        status: "Active",
        details: "Consult Case Management for discharge planning and home wound care follow-up.",
        duration: "Once",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Pharmacy Consult",
        orderType: "nursing",
        status: "Active",
        details: "Consult Pharmacy for medication review.",
        duration: "Once",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Basic Metabolic Panel (BMP)",
        orderType: "nursing", // Categorized as nursing as nurses will collect the sample
        status: "Active",
        details: "Collect Basic Metabolic Panel (BMP).",
        duration: "Daily x3 days",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "HbA1c",
        orderType: "nursing", // Categorized as nursing as nurses will collect the sample
        status: "Active",
        details: "Collect HbA1c if not done within last 3 months.",
        duration: "Once during admission",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Wound Culture",
        orderType: "nursing", // Categorized as nursing as nurses will collect the sample
        status: "Active",
        details: "Collect wound culture if signs of worsening infection.",
        duration: "PRN",
        orderingProvider: "Dr. John Smith, MD"
    }
];

export const nursingHeaderNames: NursingOrderData = {
        displayName: "Nursing",
        orderType: "nursing",
        details: "Details",
        status: "Status",
        duration: "Duration",
        orderingProvider: "Ordering Provider"
    }


export interface MedOrderData {
  displayName: string;
  orderType: string;
  dose: string;
  route: string;
  frequency: string;
  priority: string;
  administrationInstructions: string;
  orderingProvider: string;
  [key: string]: string;
}

export const medOrders: MedOrderData[] = [
  {
    displayName: "metoprolol tartrate 5mg/1mg",
    orderType: "medical",
    dose: "5mg",
    route: "IV push",
    frequency: "PRN q. 4hr",
    priority: "NOW",
    administrationInstructions: "PRN q. 4hr for HR > 120 bpm. Please page if unresolved after 2 doses.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "ceftriaxone (Rocephin) infusion 1g",
    orderType: "medical", 
    dose: "1g",
    route: "IV",
    frequency: "Daily",
    priority: "Routine",
    administrationInstructions: "Reconstitute in 50 mL 0.9% NS. Infuse over 30 minutes. Do NOT administer with calcium containing IV solutions.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "methylprednisolone (SOLU-MEDROL)",
    orderType: "medical",
    dose: "125mg", 
    route: "IV",
    frequency: "q. 6hr",
    priority: "Routine",
    administrationInstructions: "",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "albuterol sulfate",
    orderType: "medical",
    dose: "2.5mg",
    route: "MDI",
    frequency: "q. 4hr", 
    priority: "Routine",
    administrationInstructions: "Administer over 5-15 minutes using jet nebulizer with mouthpiece or mask",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "tiotropium bromide (Spiriva)",
    orderType: "medical",
    dose: "5mcg",
    route: "MDI",
    frequency: "Daily",
    priority: "Routine",
    administrationInstructions: "Inhale 2 puffs once daily at the same time each day using the Respimat inhaler.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "acetaminophen (Tylenol)",
    orderType: "medical",
    dose: "500mg",
    route: "PO",
    frequency: "PRN q. 6hr",
    priority: "Routine",
    administrationInstructions: "Administer 1 to 2 tablets by mouth every 6 hours as needed. Do not exceed 4,000 mg (8 tablets) in 24 hours.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "carvedilol (Coreg)",
    orderType: "medical",
    dose: "12.5mg",
    route: "PO", 
    frequency: "BID",
    priority: "Routine",
    administrationInstructions: "Check heart rate and blood pressure 30 minutes prior to administration.",
    orderingProvider: "Dr. Azzedine Habz"
  }
];

export const medHeaderNames: MedOrderData = {
        displayName: "Medication",
        orderType: "medical",
        dose: "Dose",
        route: "Route",
        frequency: "Frequency",
        priority: "Priority",
        administrationInstructions: "Administration Instructions",
        orderingProvider: "Ordering Provider"
    }

export interface RespiratoryOrderData {
  displayName: string;
  orderType: string;
  details: string;
  status: string;
  orderingProvider: string;
  [key: string]: string;
}

export const respiratoryOrders: RespiratoryOrderData[] = [
  {
    displayName: "Oxygen Therapy",
    orderType: "respiratory",
    details: "Administer oxygen via nasal cannula at 2 L/min. Titrate to maintain SpO₂ ≥ 92%.",
    status: "Active",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "Incentive Spirometry",
    orderType: "respiratory",
    details: "Instruct patient to use incentive spirometer 10 times per hour while awake. Document effort and results",
    status: "Active",
    duration: "Until cancelled",
    orderingProvider: "Dr. Azzedine Habz"
  },
];

export const respHeaderNames: RespiratoryOrderData = {
        displayName: "Respiratory",
        orderType: "nursing",
        details: "Details",
        status: "Status",
        duration: "Duration",
        orderingProvider: "Ordering Provider"
    }



export interface LabratoryOrderData {
  displayName: string;
  orderType: string;
  details: string;
  status: string;
  orderingProvider: string;
  [key: string]: string;
}

export const labratoryOrders: LabratoryOrderData[] = [
  {
        displayName: "Basic Metabolic Panel (BMP)",
        orderType: "lab", // Categorized as lab as nurses will collect the sample
        status: "Active",
        details: "Collect Basic Metabolic Panel (BMP).",
        duration: "Daily x3 days",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Complete Blood Count (CBC)",
        orderType: "lab", // Categorized as lab as nurses will collect the sample
        status: "Active",
        details: "Collect Complete Blood Count (CBC).",
        duration: "Daily x1 days",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "HbA1c",
        orderType: "lab", // Categorized as lab as nurses will collect the sample
        status: "Active",
        details: "Collect HbA1c if not done within last 3 months.",
        duration: "Once during admission",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Wound Culture",
        orderType: "lab", // Categorized as lab as nurses will collect the sample
        status: "Active",
        details: "Collect wound culture if signs of worsening infection.",
        duration: "PRN",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Blood Glucose Monitoring (ACHS)",
        orderType: "lab",
        status: "Active",
        details: "Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose < 70 mg/dL or > 300 mg/dL.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD"
    },
]

export const labratoryHeaderNames: RespiratoryOrderData = {
        displayName: "Labratory",
        orderType: "lab",
        details: "Details",
        status: "Status",
        duration: "Duration",
        orderingProvider: "Ordering Provider"
    }

