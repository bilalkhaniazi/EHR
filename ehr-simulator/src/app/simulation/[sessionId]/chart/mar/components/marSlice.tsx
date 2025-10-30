import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { MedAdministrationInstance } from "./marData";


export interface NewAdministrationData {
  [medOrderId: string]: MedAdministrationInstance;     
}

export interface MarState {
  selectedMeds: string[];
  isSelected: boolean;
  newAdministrations: NewAdministrationData
}

const initialState: MarState = {
  selectedMeds: [],
  isSelected: false,
  newAdministrations: {}
};

export const marSlice = createSlice({
  name: 'mar',
  initialState,
  reducers: {
    handleMedicationSelectionChange: (state, action: PayloadAction<{id: string, checked: boolean}>) => {
      const {id, checked} = action.payload
      // add a medAdministationInstance to newAdministrations and its id to selectedMeds
      if (checked) {
        state.newAdministrations[id] = {
          medicationOrderId: id,
          status: "Given",
          administratorId: "currentUser",
          adminTimeMinuteOffset: 0,     // time will be updated when the RTK query mutation is called
          administeredDose: 0        // dose will be updated by user           
        }
        state.selectedMeds.push(id);
        
      } else {
        state.selectedMeds = state.selectedMeds.filter(medId => medId !== id);
        delete state.newAdministrations[id]
      }
    },
    clearSelectedMedications: (state) => {
      state.selectedMeds = []
    },
    updateNewAdministration: (state, action: PayloadAction<{
      medicationOrderId: string;
      field: keyof MedAdministrationInstance;
      value: any;
    }>) => {
      const { medicationOrderId, field, value } = action.payload;
      const adminInstance = state.newAdministrations[medicationOrderId];
      
      // likely the three properties that student will need to change when administering meds during sim
      if (adminInstance) {
        switch (field) {
          case 'status':
            adminInstance.status = value as typeof adminInstance.status;
            break;
          case 'notes':
            adminInstance.notes = value as typeof adminInstance.notes;
            break;
          case 'administeredDose':
            adminInstance.administeredDose = value as typeof adminInstance.administeredDose
        }
      }
    },
    clearNewAdminstrations: (state) => {
      state.newAdministrations = {}
    }
  },
 
});

export const { 
  handleMedicationSelectionChange,
  updateNewAdministration,
  clearNewAdminstrations,
  clearSelectedMedications 
} = marSlice.actions
export default marSlice.reducer;