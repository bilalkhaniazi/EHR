import { createSlice } from "@reduxjs/toolkit"



export interface TimeState {
  sessionStartTime: number | null;
  simulationNow: number | null;
}

export const initialState: TimeState = {
  sessionStartTime: null,
  simulationNow: null
}

export const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    initializeTime: (state) => {
      const now = Date.now()
      if (state.sessionStartTime === null) {
        state.sessionStartTime = now;
      }
      state.simulationNow = now;
    }, 
    updateSimulationTime: (state) => {
      state.simulationNow = Date.now();
    }
  } 
})



export const { initializeTime, updateSimulationTime } = timeSlice.actions;
export default timeSlice.reducer;