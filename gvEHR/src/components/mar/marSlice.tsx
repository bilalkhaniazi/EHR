import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface MarState {
  selectedMeds: string[];
  isSelected: boolean
}

const initialState: MarState = {
  selectedMeds: [],
  isSelected: false
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
    }
  }
});

export const { handleMedicationSelectionChange } = marSlice.actions
export default marSlice.reducer;