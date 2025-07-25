import { configureStore } from '@reduxjs/toolkit'
// import type { Action } from '@reduxjs/toolkit'
import notesReducer from "../components/notes/noteSlice.ts"
import ordersReducer from "../components/orders/orderSlice.ts"
import flexSheetReducer from "../components/flexSheets/flexSheetSlice.ts"
import { apiSlice } from './apiSlice.ts'

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    orders: ordersReducer,
    flexSheet: flexSheetReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store


