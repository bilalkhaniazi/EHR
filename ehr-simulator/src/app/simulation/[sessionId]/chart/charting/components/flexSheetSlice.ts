import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { tableData } from "./flexSheetData";

export interface FlexSheetState {
  fieldSelections: Record<string, string[]>;
  isSidebarOpen: boolean;
  editableData: tableData[];
}

const initialState: FlexSheetState = {
  fieldSelections: {},
  isSidebarOpen: false,
  editableData: [],
};

export const flexSheetSlice = createSlice({
  name: 'flexSheet',
  initialState,
  reducers: {
    setFieldSelection: (state, action: PayloadAction<{ key: string, selectedIds: string[]}>) => {
      state.fieldSelections[action.payload.key] = action.payload.selectedIds;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload
    },
    updateEditableData: (state, action: PayloadAction<{rowId: string, columnId: string, newValue: string | string[]}>) => {
      const { rowId, columnId, newValue } = action.payload
      const rowIndex = state.editableData.findIndex(row => row.id === rowId);
      if (rowIndex !== -1) {
        state.editableData[rowIndex] = {
          ...state.editableData[rowIndex],
          [columnId]: newValue,
        };
      }
    },
    initializeEditableData: (state, action: PayloadAction<tableData[]>) => {
      state.editableData = action.payload;
    },
  }
});

export const { 
  setFieldSelection,
  toggleSidebar,
  setSidebarOpen,
  updateEditableData,
  initializeEditableData
  } = flexSheetSlice.actions
export default flexSheetSlice.reducer;