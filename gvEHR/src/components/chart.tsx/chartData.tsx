// export type ChartData = {
//   indentifiers: {
//     name: { label: string; value: string };
//     dob: { label: string; value: string };
//     mrn: { label: string, value: string }
//   };
//   demographics: {
//     pronouns: { label: string; value: string };
//     sexAtBirth: { label: string; value: string };
//     gender: { label: string; value: string };
//     ethnicity: { label: string; value: string };
//   };
//   clinicalInfo: {
//     isolation: { label: string, value: string, tooltip: string};
//     allergies: { label: string; value: string[] };
//     immunizations: { label: string; value: string[] };
//     attending: { label: string; value: string };
//     pmh: { label: string; value: string[] };
//   };
//   socialFactors: {
//     maritalStatus: { label: string; value: string };
//     employmentStatus: { label: string; value: string };
//     insurance: { label: string; value: string };
//     language: { label: string; value: string };
//     religion: { label: string; value: string };
//     supportPerson: { label: string; value: Contact[] };
//     VeteranStatus: { label: string; value: string };
//   };
// };



export interface StringValueItem {
  label: string;
  id: string; 
  value: string;
}

export interface StringArrayValueItem {
  label: string;
  id: 'allergies' | 'immunizations' | 'pmh'; // only fields that have arrays as values
  value: string[];
}

interface IsolationItem extends StringValueItem {
  id: 'isolation'; 
  tooltip: string; 
}

export interface ContactItem {
  id: 'supportPersons';
  label: 'Support Persons';
  value: Contact[]
}

export interface Contact {
  name: string;
  relationship: string;
  phone: string;
}

type ChartSidebarItem = StringValueItem | StringArrayValueItem | IsolationItem | ContactItem

export interface ChartSidebarData {
  identifiers: StringValueItem[],
  demographics: StringValueItem[],
  clinicalInfo: ChartSidebarItem[],
  socialFactors: (StringValueItem | ContactItem)[]
}


export const jamesAllen: ChartSidebarData = {
  identifiers: [
    { id: 'name', label: "Name", value: "James Allen" },
    { id: "dob", label: "DOB", value: "06/24/1964" },
    { id: "mrn", label: "MRN", value: "56743" }
  ],
  demographics: [
    { id: "pronouns", label: "Pronouns", value: "He/Him" },
    { id: 'sexAtBirth', label: "Sex Assigned at Birth", value: "Male" },
    { id: 'gender', label: "Gender Identity", value: "Male" },
    { id: "ethnicity", label: "Ethnicity", value: "African American" }
  ],
  clinicalInfo: [
    { id: 'isolation', label: "Isolation", value: "MRSA", tooltip: 'Contact Precautions: Use gloves and gown when entering the patient’s room'},
    { id: 'allergies', label: "Allergies", value: ["None known"] },
    { id: 'immunizations', label: "Immunizations", value: ["Influenza", "Pneumococcal"] },
    { id: 'attending', label: "Attending Provider", value: "Dr. Sheila Monroe, PCP" },
    { 
      id: 'pmh', label: "Past Medical History", value: [
      "Type 2 Diabetes Mellitus",
      "Hypertension",
      "Peripheral neuropathy"
    ]}
  ],
  socialFactors: [
    { id: 'maritalStatus', label: "Marital Status", value: "Widowed" },
    { id: 'employmentStatus', label: "Employment", value: "Retired factory worker" },
    { id: 'insurance', label: "Insurance", value: "Medicare" },
    { id: 'language', label: "Language", value: "English" },
    { id: 'religion', label: "Religion", value: "Baptist" },
    { 
      id: 'supportPersons',  
      label: "Support Persons", 
      value: [
        { name: "Sofia Allen", relationship: "Spouse", phone: "(616) 555-1234" },
        { name: "Samuel Allen", relationship: "Son", phone: "(616) 555-1234" }
      ]
    },
    { id: 'veteranStatus', label: "Veteran Status", value: "No" }
  ]
}