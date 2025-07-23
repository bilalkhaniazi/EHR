import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { sampleNotes, type NoteData } from "./notesData"

export interface NotesState {
  notesData: NoteData[];
  filteredSpecialties: string[];
}

const initialState: NotesState = {
  notesData: sampleNotes,
  filteredSpecialties: [],
};

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<NoteData>) => {
      state.notesData.unshift(action.payload);
    },
    addSpecialtyFilter: (state, action: PayloadAction<string>) => {
      if(!state.filteredSpecialties.includes(action.payload)) {
      state.filteredSpecialties.push(action.payload)
      }
    },
    removeSpecialtyFilter: (state, action: PayloadAction<string>) => {
      state.filteredSpecialties = state.filteredSpecialties.filter((specialty) => {
        specialty !== action.payload
      })
    },
    clearSpecialtyFilters: (state) => {
      state.filteredSpecialties = [];
    }
  }
});

export const { addNote, addSpecialtyFilter, removeSpecialtyFilter, clearSpecialtyFilters } = noteSlice.actions
export default noteSlice.reducer;