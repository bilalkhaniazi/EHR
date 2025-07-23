import { configureStore } from '@reduxjs/toolkit'
// import type { Action } from '@reduxjs/toolkit'
import notesReducer from "../components/notes/noteSlice.ts"
import ordersReducer from "../components/orders/orderSlice.ts"

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    orders: ordersReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store


