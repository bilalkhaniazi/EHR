import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { nursingOrders, labratoryOrders, respiratoryOrders, medOrders } from './orderData'
import type { OrderData, MedOrderData } from "./orderData";

export interface OrdersState {
  nursingOrders: OrderData[];
  labratoryOrders: OrderData[];
  respiratoryOrders: OrderData[];
  medicationOrders: MedOrderData[];
}

const initialState: OrdersState = {
  nursingOrders: nursingOrders,
  labratoryOrders: labratoryOrders,
  respiratoryOrders: respiratoryOrders,
  medicationOrders: medOrders,
};

export const orderSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<OrderData>) => {
      state.nursingOrders.push(action.payload)
    }
  }
});

export const { addOrder } = orderSlice.actions
export default orderSlice.reducer;