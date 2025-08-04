import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface MarState {
  selectedMeds: Set<string>;
  isSelected: boolean
}

const initialState: MarState = {
  selectedMeds: new Set(),
  isSelected: false
};

export const marSlice = createSlice({
  name: 'mar',
  initialState,
  reducers: {
    handleMedicationSelectionChange: (state, action: PayloadAction<{id: string, checked: boolean}>) => {
      const {id, checked} = action.payload
      if (checked) {
        state.selectedMeds.add(id);
      } else {
        state.selectedMeds.delete(id);
      }
    }
  }
});

export const { handleMedicationSelectionChange } = marSlice.actions
export default marSlice.reducer;