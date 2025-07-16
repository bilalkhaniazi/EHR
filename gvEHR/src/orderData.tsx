export interface NursingOrderData {
    displayName: string,
    orderType: string,
    status: string,
    [key: string]: string
}

export const nursingOrders: NursingOrderData[] = [
    
    {
        displayName: "Vital Signs Monitoring",
        orderType: "nursing",
        details: "Monitor temperature, pulse, respiration, and blood pressure per protocol.",
        status: "Active",
        duration: "Until cancelled",
        orderingProvider: "Dr. Azzedine Habz"
    },
    {
        displayName: "Intake and Output",
        orderType: "nursing",
        details: "Measure and document all oral intake and urinary output every shift. Maintain strict I&O record.",
        status: "Active",
        duration: "Until cancelled",
        orderingProvider: "Dr. Azzedine Habz"
    },
    {
        displayName: "Wound Care",
        orderType: "nursing",
        details: "Cleanse wound with normal saline, apply hydrocolloid dressing daily, and assess for signs of infection.",
        status: "Active",
        duration: "Until cancelled",
        orderingProvider: "Dr. Azzedine Habz"
    },
        {
        displayName: "Specimen Collection",
        orderType: "nursing",
        details: "Collect R. hip wound culture for sensitivity. Label and send to lab within 30 minutes.",
        status: "Active",
        duration: "NOW",
        orderingProvider: "Dr. Azzedine Habz"
    },
    {
        displayName: "Maintain IV Access",
        orderType: "nursing",
        details: "Insert and maintain intravenous access. Change dressing per facility protocol.",
        status: "Active",
        duration: "Until cancelled",
        orderingProvider: "Dr. Azzedine Habz"
    },
    {
        displayName: "Discharge Readiness Evaluation",
        orderType: "nursing",
        details: "Assess patient understanding of discharge instructions, medication regimen, and follow-up appointments.",
        status: "Active",
        duration: "Until cancelled",
        orderingProvider: "Dr. Azzedine Habz"
    },
    {
        displayName: "Pain Assessment",
        orderType: "nursing",
        details: "Assess pain level every 4 hours and as needed. Administer PRN analgesics per MAR and evaluate effectiveness within 1 hour.",
        status: "Active",
        duration: "Until cancelled",
        orderingProvider: "Dr. Azzedine Habz"
    },
]

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
  {
    displayName: "Continuous Oximetry Monitoring",
    orderType: "respiratory",
    details: "Monitor SpO₂ continuously. Document readings every shift and PRN for respiratory changes.",
    status: "Active",
    duration: "Until cancelled",
    orderingProvider: "Dr. Azzedine Habz"
  },
  {
    displayName: "Nebulizer Treatment",
    orderType: "respiratory",
    details: "Administer albuterol 2.5 mg via nebulizer every 4 hours PRN for wheezing or shortness of breath.",
    status: "Active",
    duration: "Until cancelled",
    orderingProvider: "Dr. Azzedine Habz"
  }
];

export const respHeaderNames: RespiratoryOrderData = {
        displayName: "Respiratory",
        orderType: "nursing",
        details: "Details",
        status: "Status",
        duration: "Duration",
        orderingProvider: "Ordering Provider"
    }