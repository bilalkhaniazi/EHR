interface OrderType {
  category?: "Nursing" | "Respiratory" | "Laboratory" | "Consult"
  title: string
  details: string
  status: string;
  orderingProvider: string
  important?: boolean
}

export const nursingOrders: OrderType[] = [
  {
    category: 'Nursing',
    title: "Vital Signs Monitoring (q4h)",
    status: "Active",
    details: "Monitor BP, HR, RR, Temp, SpO₂ every 4 hours. Notify provider for Temp > 38.0°C (100.4°F), Systolic BP > 160 mmHg or < 100 mmHg, HR > 110 bpm or < 50 bpm.",
    orderingProvider: "Dr. John Smith, MD",
    important: true
  },
  {
    category: 'Nursing',
    title: "Blood Glucose Monitoring (ACHS)",
    status: "Active",
    details: "Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose < 70 mg/dL or > 300 mg/dL.",
    orderingProvider: "Dr. John Smith, MD",
    important: true
  },
  {
    category: 'Nursing',
    title: "Activity: As Tolerated",
    status: "Active",
    details: "Encourage patient activity as tolerated. Assist with ambulation as needed.",
    orderingProvider: "Dr. John Smith, MD",
    important: false

  },
  {
    important: false,

    category: 'Nursing',
    title: "Fall Risk Precautions",
    status: "Active",
    details: "Implement standard fall risk protocol. Ensure bed in low position and call light within reach.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    important: false,

    category: 'Nursing',
    title: "Contact Precautions for MRSA",
    status: "Active",
    details: "Gown and gloves with all room entry. Use dedicated patient equipment. Strict hand hygiene.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    important: true,

    category: 'Nursing',
    title: "Right Great Toe Wound Care",
    status: "Active",
    details: "Daily dressing change with normal saline (NS) wound cleansing and application of sterile dry dressing. Apply topical antimicrobial per wound care protocol. Monitor for signs of infection (increased redness, drainage, odor).",
    orderingProvider: "Dr. John Smith, MD",
  },
  {
    important: false,

    category: 'Nursing',
    title: "Diabetic Diet",
    status: "Active",
    details: "Provide consistent carbohydrate diabetic diet. Encourage fluid intake unless contraindicated.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    category: 'Nursing',
    title: "Patient Education",
    status: "Active",
    details: "Educate patient on diabetes management, wound care, and MRSA precautions.",
    orderingProvider: "Dr. John Smith, MD",
    important: true
  },
];

export const nursingHeaderNames: OrderType = {
  title: "Nursing",
  details: "Details",
  status: "Status",
  orderingProvider: "Ordering Provider",
}


export interface MedOrderData {
  title: string;
  dose: string;
  route: string;
  frequency: string;
  priority: string;
  administrationInstructions: string;
  orderingProvider: string;
  [key: string]: string;
}

// export const medOrders: MedOrderData[] = [
//   {
//     title: "metoprolol tartrate 5mg/1mg",
//     dose: "5mg",
//     route: "IV push",
//     frequency: "PRN q. 4hr",
//     priority: "NOW",
//     administrationInstructions: "PRN q. 4hr for HR > 120 bpm. Please page if unresolved after 2 doses.",
//     orderingProvider: "Dr. Azzedine Habz"
//   },
//   {
//     title: "ceftriaxone (Rocephin) infusion 1g",
//     dose: "1g",
//     route: "IV",
//     frequency: "Daily",
//     priority: "Routine",
//     administrationInstructions: "Reconstitute in 50 mL 0.9% NS. Infuse over 30 minutes. Do NOT administer with calcium containing IV solutions.",
//     orderingProvider: "Dr. Azzedine Habz"
//   },
//   {
//     title: "methylprednisolone (SOLU-MEDROL)",
//     dose: "125mg", 
//     route: "IV",
//     frequency: "q. 6hr",
//     priority: "Routine",
//     administrationInstructions: "",
//     orderingProvider: "Dr. Azzedine Habz"
//   },
//   {
//     title: "albuterol sulfate",
//     dose: "2.5mg",
//     route: "MDI",
//     frequency: "q. 4hr", 
//     priority: "Routine",
//     administrationInstructions: "Administer over 5-15 minutes using jet nebulizer with mouthpiece or mask",
//     orderingProvider: "Dr. Azzedine Habz"
//   },
//   {
//     title: "tiotropium bromide (Spiriva)",
//     dose: "5mcg",
//     route: "MDI",
//     frequency: "Daily",
//     priority: "Routine",
//     administrationInstructions: "Inhale 2 puffs once daily at the same time each day using the Respimat inhaler.",
//     orderingProvider: "Dr. Azzedine Habz"
//   },
//   {
//     title: "acetaminophen (Tylenol)",
//     dose: "500mg",
//     route: "PO",
//     frequency: "PRN q. 6hr",
//     priority: "Routine",
//     administrationInstructions: "Administer 1 to 2 tablets by mouth every 6 hours as needed. Do not exceed 4,000 mg (8 tablets) in 24 hours.",
//     orderingProvider: "Dr. Azzedine Habz"
//   },
//   {
//     title: "carvedilol (Coreg)",
//     dose: "12.5mg",
//     route: "PO", 
//     frequency: "BID",
//     priority: "Routine",
//     administrationInstructions: "Check heart rate and blood pressure 30 minutes prior to administration.",
//     orderingProvider: "Dr. Azzedine Habz"
//   }
// ];

export const medHeaderNames: MedOrderData = {
  title: "Medication",
  dose: "Dose",
  route: "Route",
  frequency: "Frequency",
  priority: "Priority",
  administrationInstructions: "Administration Instructions",
  orderingProvider: "Ordering Provider"
}

export const respiratoryOrders: OrderType[] = [
  {
    important: false,

    category: 'Respiratory',
    title: "Oxygen Therapy",
    details: "Administer oxygen via nasal cannula at 2 L/min. Titrate to maintain SpO₂ ≥ 92%.",
    status: "Active",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    important: false,

    category: 'Respiratory',
    title: "Incentive Spirometry",
    details: "Instruct patient to use incentive spirometer 10 times per hour while awake. Document effort and results",
    status: "Active",
    orderingProvider: "Dr. Azzedine Habz"
  },
];

export const respHeaderNames: OrderType = {
  title: "Respiratory",
  details: "Details",
  status: "Status",
  orderingProvider: "Ordering Provider"
}



export const laboratoryOrders: OrderType[] = [
  {
    category: 'Laboratory',
    title: "Basic Metabolic Panel (BMP)",
    status: "Active",
    details: "Collect Basic Metabolic Panel (BMP).",
    orderingProvider: "Dr. John Smith, MD",
    important: true
  },
  {
    category: 'Laboratory',
    title: "Complete Blood Count (CBC)",
    status: "Active",
    details: "Collect Complete Blood Count (CBC).",
    orderingProvider: "Dr. John Smith, MD",
    important: true
  },
  {

    category: 'Laboratory',
    title: "HbA1c",
    status: "Active",
    details: "Collect HbA1c if not done within last 3 months.",
    orderingProvider: "Dr. John Smith, MD",
    important: false,
  },
  {
    important: false,

    category: 'Laboratory',
    title: "Wound Culture",
    status: "Active",
    details: "Collect wound culture if signs of worsening infection.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    category: 'Laboratory',
    title: "Blood Glucose Monitoring (ACHS)",
    status: "Active",
    details: "Monitor blood glucose before meals and at bedtime (ACHS). Notify provider for blood glucose < 70 mg/dL or > 300 mg/dL.",
    orderingProvider: "Dr. John Smith, MD",
    important: true
  },
]

export const laboratoryHeaderNames: OrderType = {
  title: "Laboratory",
  details: "Details",
  status: "Status",
  orderingProvider: "Ordering Provider"
}

export const consultHeaderNames: OrderType = {
  title: "Consults",
  details: "Details",
  status: "Status",
  orderingProvider: "Ordering Provider"
}

export const consultOrders: OrderType[] = [
  {
    important: false,

    category: 'Consult',
    title: "Case Management Consult",
    status: "Active",
    details: "Consult Case Management for discharge planning and home wound care follow-up.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    important: false,

    category: 'Consult',
    title: "Pharmacy Consult",
    status: "Active",
    details: "Consult Pharmacy for medication review.",
    orderingProvider: "Dr. John Smith, MD"
  },
  {
    important: false,

    category: 'Consult',
    title: "Wound Culture",
    status: "Active",
    details: "Collect wound culture if signs of worsening infection.",
    orderingProvider: "Dr. John Smith, MD"
  }
]


