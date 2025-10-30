import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface NotesState {
  filteredSpecialties: string[];
}

const initialState: NotesState = {
  filteredSpecialties: [],
};

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addSpecialtyFilter: (state, action: PayloadAction<string>) => {
      if(!state.filteredSpecialties.includes(action.payload)) {
      state.filteredSpecialties.push(action.payload)
      }
    },
    removeSpecialtyFilter: (state, action: PayloadAction<string>) => {
      state.filteredSpecialties = state.filteredSpecialties.filter((specialty) => {
        return specialty !== action.payload
      })
    },
    clearSpecialtyFilters: (state) => {
      state.filteredSpecialties = [];
    }
  }
});

export const { addSpecialtyFilter, removeSpecialtyFilter, clearSpecialtyFilters } = noteSlice.actions
export default noteSlice.reducer;