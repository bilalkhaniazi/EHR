import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { MedAdministrationInstance } from "./marData";


export interface NewAdministrationData {
  [medOrderId: string]: Partial<MedAdministrationInstance>;
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
      if (checked) {
        state.selectedMeds.push(id);
      } else {
        state.selectedMeds = state.selectedMeds.filter(medId => medId !== id);
      }
    },
    updateNewAdministration: (state, action: PayloadAction<{
      medicationOrderId: string;
      field: keyof MedAdministrationInstance;
      value: any;
    }>) => {
      const { medicationOrderId, field, value } = action.payload;
      if (!state.newAdministrations[medicationOrderId]) {
        state.newAdministrations[medicationOrderId] = {}
      }
      (state.newAdministrations[medicationOrderId])[field] = value
    },
    clearNewAdminstrations: (state) => {
      state.newAdministrations = {}
    }
  },
 
});

export const { handleMedicationSelectionChange, updateNewAdministration, clearNewAdminstrations } = marSlice.actions
export default marSlice.reducer;