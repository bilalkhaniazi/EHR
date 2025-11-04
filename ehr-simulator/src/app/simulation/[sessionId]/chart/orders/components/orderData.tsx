export interface OrderData {
  displayName: string;
  details: string;
  status: string;
  orderingProvider: string;
  recurring?: boolean
  [key: string]: string | boolean | undefined;
}

export const nursingOrders: OrderData[] = [
    {
        displayName: "Vital Signs Monitoring (q4h)",
        status: "Active",
        details: "Monitor BP, HR, RR, Temp, SpO₂ every 4 hours. Notify provider for Temp > 38.0°C (100.4°F), Systolic BP > 160 mmHg or < 100 mmHg, HR > 110 bpm or < 50 bpm.",
        orderingProvider: "Dr. John Smith, MD",
        recurring: true
    },
    {
        displayName: "Blood Glucose Monitoring (ACHS)",
        status: "Active",
        details: "Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose < 70 mg/dL or > 300 mg/dL.",
        orderingProvider: "Dr. John Smith, MD",
        recurring: true
    },
    {
        displayName: "Activity: As Tolerated",
        status: "Active",
        details: "Encourage patient activity as tolerated. Assist with ambulation as needed.",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Fall Risk Precautions",
        status: "Active",
        details: "Implement standard fall risk protocol. Ensure bed in low position and call light within reach.",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Contact Precautions for MRSA",
        status: "Active",
        details: "Gown and gloves with all room entry. Use dedicated patient equipment. Strict hand hygiene.",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Right Great Toe Wound Care",
        status: "Active",
        details: "Daily dressing change with normal saline (NS) wound cleansing and application of sterile dry dressing. Apply topical antimicrobial per wound care protocol. Monitor for signs of infection (increased redness, drainage, odor).",
        orderingProvider: "Dr. John Smith, MD",
        recurring: true
    },
    {
        displayName: "Diabetic Diet",
        status: "Active",
        details: "Provide consistent carbohydrate diabetic diet. Encourage fluid intake unless contraindicated.",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Patient Education",
        status: "Active",
        details: "Educate patient on diabetes management, wound care, and MRSA precautions.",
        orderingProvider: "Dr. John Smith, MD",
        recurring: true
    },
];

export const nursingHeaderNames: OrderData = {
    displayName: "Nursing",
    details: "Details",
    status: "Status",
    orderingProvider: "Ordering Provider",
}


export interface MedOrderData {
  displayName: string;
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
    dose: "5mg",
    route: "IV push",
    frequency: "PRN q. 4hr",
    priority: "NOW",
    administrationInstructions: "PRN q. 4hr for HR > 120 bpm. Please page if unresolved after 2 doses.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "ceftriaxone (Rocephin) infusion 1g",
    dose: "1g",
    route: "IV",
    frequency: "Daily",
    priority: "Routine",
    administrationInstructions: "Reconstitute in 50 mL 0.9% NS. Infuse over 30 minutes. Do NOT administer with calcium containing IV solutions.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "methylprednisolone (SOLU-MEDROL)",
    dose: "125mg", 
    route: "IV",
    frequency: "q. 6hr",
    priority: "Routine",
    administrationInstructions: "",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "albuterol sulfate",
    dose: "2.5mg",
    route: "MDI",
    frequency: "q. 4hr", 
    priority: "Routine",
    administrationInstructions: "Administer over 5-15 minutes using jet nebulizer with mouthpiece or mask",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "tiotropium bromide (Spiriva)",
    dose: "5mcg",
    route: "MDI",
    frequency: "Daily",
    priority: "Routine",
    administrationInstructions: "Inhale 2 puffs once daily at the same time each day using the Respimat inhaler.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "acetaminophen (Tylenol)",
    dose: "500mg",
    route: "PO",
    frequency: "PRN q. 6hr",
    priority: "Routine",
    administrationInstructions: "Administer 1 to 2 tablets by mouth every 6 hours as needed. Do not exceed 4,000 mg (8 tablets) in 24 hours.",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "carvedilol (Coreg)",
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
    dose: "Dose",
    route: "Route",
    frequency: "Frequency",
    priority: "Priority",
    administrationInstructions: "Administration Instructions",
    orderingProvider: "Ordering Provider"
}

export const respiratoryOrders: OrderData[] = [
  {
    displayName: "Oxygen Therapy",
    details: "Administer oxygen via nasal cannula at 2 L/min. Titrate to maintain SpO₂ ≥ 92%.",
    status: "Active",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "Incentive Spirometry",
    details: "Instruct patient to use incentive spirometer 10 times per hour while awake. Document effort and results",
    status: "Active",
    duration: "Until cancelled",
    orderingProvider: "Dr. Azzedine Habz"
  },
];

export const respHeaderNames: OrderData = {
    displayName: "Respiratory",
    details: "Details",
    status: "Status",
    duration: "Duration",
    orderingProvider: "Ordering Provider"
}



export const laboratoryOrders: OrderData[] = [
  {
        displayName: "Basic Metabolic Panel (BMP)",
        status: "Active",
        details: "Collect Basic Metabolic Panel (BMP).",
        duration: "Daily x3 days",
        orderingProvider: "Dr. John Smith, MD",
        recurring: true
    },
    {
        displayName: "Complete Blood Count (CBC)",
        status: "Active",
        details: "Collect Complete Blood Count (CBC).",
        duration: "Daily x1 days",
        orderingProvider: "Dr. John Smith, MD",
        recurring: true
    },
    {
        displayName: "HbA1c",
        status: "Active",
        details: "Collect HbA1c if not done within last 3 months.",
        duration: "Once during admission",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Wound Culture",
        status: "Active",
        details: "Collect wound culture if signs of worsening infection.",
        duration: "PRN",
        orderingProvider: "Dr. John Smith, MD"
    },
    {
        displayName: "Blood Glucose Monitoring (ACHS)",
        status: "Active",
        details: "Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose < 70 mg/dL or > 300 mg/dL.",
        duration: "Until cancelled",
        orderingProvider: "Dr. John Smith, MD", 
        recurring: true
    },
]

export const laboratoryHeaderNames: OrderData = {
    displayName: "Laboratory",
    details: "Details",
    status: "Status",
    duration: "Duration",
    orderingProvider: "Ordering Provider"
}

export const consultHeaderNames: OrderData = {
    displayName: "Consults",
    details: "Details",
    status: "Status",
    duration: "Duration",
    orderingProvider: "Ordering Provider"
}

export const consultOrders: OrderData[] = [
  {
    displayName: "Case Management Consult",
    status: "Active",
    details: "Consult Case Management for discharge planning and home wound care follow-up.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    displayName: "Pharmacy Consult",
    status: "Active",
    details: "Consult Pharmacy for medication review.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    displayName: "Wound Culture",
    status: "Active",
    details: "Collect wound culture if signs of worsening infection.",
    orderingProvider: "Dr. John Smith, MD"
  }
]


