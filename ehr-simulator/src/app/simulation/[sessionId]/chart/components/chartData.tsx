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

export interface NumericValueItem {
  label: string;
  id: string
  value: number;
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

// all general info that a patient will have, only some of it is useful, the rest
// just provides a sense of completeness/fidelity
export interface ChartData {
  // Identifiers
  name: StringValueItem;
  gender: StringValueItem;
  age: NumericValueItem
  mrn: StringValueItem;
  code: StringValueItem;
  admissionDate: NumericValueItem;
  location: StringValueItem;
  

  // Clinical Info
  isolation: IsolationItem;
  allergies: StringArrayValueItem;
  immunizations: StringArrayValueItem;
  attending: StringValueItem;
  pmh: StringArrayValueItem;
  height: StringValueItem;
  weight: StringValueItem;


  // Social and demographic data
  relationshipStatus: StringValueItem;
  employmentStatus: StringValueItem;
  insurance: StringValueItem;
  language: StringValueItem;
  religion: StringValueItem;
  supportPersons: ContactItem;
  veteranStatus: StringValueItem;
  pronouns: StringValueItem;
  sexAtBirth: StringValueItem;
  genderIdentity: StringValueItem;
  ethnicity: StringValueItem;

}


export const jamesAllen: ChartData = {
  name: { id: 'name', label: "Name", value: "James Allen" },
  gender: { id: 'gender', label: "Gender", value: "Male" },
  age: { id: "dob", label: "DOB", value: 56 },
  mrn: { id: "mrn", label: "MRN", value: "56743" },
  code: { id: "code", label: "Code", value: "Full"},
  admissionDate: { id: "admission", label: "Admission Date", value: 4 },
  pronouns: { id: "pronouns", label: "Pronouns", value: "He/Him" },
  sexAtBirth: { id: 'sexAtBirth', label: "Sex Assigned at Birth", value: "Male" },
  genderIdentity: { id: 'genderIdentity', label: "Gender Identity", value: "Male" },
  ethnicity: { id: "ethnicity", label: "Ethnicity", value: "African American" },
  location: { id: "location", label: "Location", value: "CHS-350-G"},
  
  isolation: { id: 'isolation', label: "Isolation", value: "MRSA", tooltip: 'Contact Precautions: Use gloves and gown when entering the patient’s room'},
  allergies: { id: 'allergies', label: "Allergies", value: ["None known"] },
  immunizations: { id: 'immunizations', label: "Immunizations", value: ["Influenza", "Pneumococcal"] },
  attending: { id: 'attending', label: "Attending Provider", value: "Dr. Sheila Monroe, PCP" },
  pmh: { 
    id: 'pmh', label: "Past Medical History", value: [
      "T2DM",
      "HTN",
      "Peripheral neuropathy"
    ]
  },
  height: { id: "height", label: "Height", value: '6\'4\"'},
  weight: { id: "weight", label: "Weight", value:"94kg" },
  
  relationshipStatus: { id: 'maritalStatus', label: "Relationship Status", value: "Widowed" },
  employmentStatus: { id: 'employmentStatus', label: "Employment", value: "Retired factory worker" },
  insurance: { id: 'insurance', label: "Insurance", value: "Medicare" },
  language: { id: 'language', label: "Language", value: "English" },
  religion: { id: "religion", label: "Religion", value: "Baptist" },
  supportPersons: { 
    id: 'supportPersons', 
    label: "Support Persons", 
    value: [
      { name: "Sofia Allen", relationship: "Spouse", phone: "(616) 555-1234" },
      { name: "Samuel Allen", relationship: "Son", phone: "(616) 555-1234" }
    ]
  },
  veteranStatus: { id: 'veteranStatus', label: "Veteran Status", value: "No" }
};