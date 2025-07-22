export type ChartData = {
  indentifiers: {
    name: { label: string; value: string };
    dob: { label: string; value: string };
    mrn: { label: string, value: string }
  };
  demographics: {
    pronouns: { label: string; value: string };
    sexAtBirth: { label: string; value: string };
    gender: { label: string; value: string };
    ethnicity: { label: string; value: string };
  };
  clinicalInfo: {
    allergies: { label: string; value: string[] };
    immunizations: { label: string; value: string[] };
    attending: { label: string; value: string };
    pmh: { label: string; value: string[] };
  };
  socialFactors: {
    maritalStatus: { label: string; value: string };
    employmentStatus: { label: string; value: string };
    insurance: { label: string; value: string };
    language: { label: string; value: string };
    religion: { label: string; value: string };
    supportPerson: { label: string; value: string };
    VeteranStatus: { label: string; value: string };
  };
};


export const jamesAllen: ChartData = {
  indentifiers: {
    name: { label: "Name", value: "James Allen" },
    dob: { label: "DOB", value: "06/24/1964" },
    mrn: {label: "MRN", value: "56743"}
  },
  demographics: {
    pronouns: { label: "Pronouns", value: "He/Him" },
    sexAtBirth: { label: "Sex Assigned at Birth", value: "Male" },
    gender: { label: "Gender Identity", value: "Male" },
    ethnicity: { label: "Ethnicity", value: "African American"}
  },
  clinicalInfo: {
    allergies: { label: "Allergies", value: ["None known"] },
    immunizations: { label: "Immunizations", value: ["Influenza", "Pneumococcal"] },
    attending: { label: "Attending Provider", value: "Dr. Sheila Monroe, PCP" },
    pmh: { label: "Past Medical History", value: [
      "Type 2 Diabetes Mellitus (diagnosed 12 years ago)",
      "Hypertension",
      "Peripheral neuropathy"
    ]}
  },
  socialFactors: {
    maritalStatus: { label: "Marital Status", value: "Widowed" },
    employmentStatus: { label: "Employment", value: "Retired factory worker" },
    insurance: { label: "Insurance", value: "Medicare" },
    language: { label: "Language", value: "English" },
    religion: { label: "Religion", value: "Baptist" },
    supportPerson: { label: "Support Person", value: "Daughter (Angela Allen, 33)" },
    VeteranStatus: { label: "Veteran Status", value: "No" }
  }
}