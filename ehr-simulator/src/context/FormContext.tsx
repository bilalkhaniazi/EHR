'use client';

import { createContext, useContext, useState } from 'react';
import { CompleteFormType, FormBlob } from '@/utils/form';

interface FormContextType {
  data: FormBlob;
  onDataChange: (key: keyof FormBlob, data: CompleteFormType) => void;
}
const defaultFormData = {
  demographics: {
    DOBDay: '',
    DOBMonth: '',
    admissionDateOffest: '',
    admissionTime: '',
    admittingDiagnosis: '',
    age: '',
    attendingProviderName: '',
    attendingProviderTitle: '',
    codeStatus: '',
    dosingWeight: '',
    employment: '',
    firstName: '',
    heightFeet: '',
    heightInches: '',
    insurance: '',
    language: '',
    needsInterpreter: false,
    lastName: '',
    precautions: '',
    relationshipStatus: '',
    religion: '',
    summary: '',
  },
  history: {
    medicalHistory: [],
    surgicalHistory: [],
    allergies: [],
    socialHistory: [],
    livingSituation: [],
    alerts: [],
    familyHistory: []
  },
  notes: [],
  orders: [],
  labs: [],
  charting: [],
  intakeOutput: [],
  medOrders: [],
  medAdministrationInstances: []
}
const MyContext = createContext<FormContextType>({
  data: defaultFormData,
  onDataChange: () => { }
});

export function FormContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FormBlob>(defaultFormData);
  const onDataChange = (key: keyof FormBlob, data: CompleteFormType) => (
    setData(prev => (
      {
        ...prev,
        [key]: data
      }
    ))
  )

  return (
    <MyContext.Provider value={{ data, onDataChange }}>
      {children}
    </MyContext.Provider>
  );
}

export function useFormContext() {
  return useContext(MyContext);
}