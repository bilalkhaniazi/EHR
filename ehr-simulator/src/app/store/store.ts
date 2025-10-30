import { configureStore } from '@reduxjs/toolkit'
// import type { Action } from '@reduxjs/toolkit'
import notesReducer from "@/app/simulation/[sessionId]/chart/notes/components/noteSlice"
import ordersReducer from "../simulation/[sessionId]/chart/orders/components/orderSlice"
import flexSheetReducer from "@/app/simulation/[sessionId]/chart/charting/components/flexSheetSlice"
import marReducer from "@/app/simulation/[sessionId]/chart/mar/components/marSlice"
import timeReducer from "@/app/simulation/[sessionId]/chart/components/timeSlice"
import { apiSlice } from '@/app/store/apiSlice'

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    orders: ordersReducer,
    flexSheet: flexSheetReducer,
    mar: marReducer,
    time: timeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store


