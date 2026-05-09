// src/features/orders/orderSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',

  initialState,

  reducers: {
    
    // START LOADING
    setOrdersLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // FETCH ORDERS
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD NEW ORDER
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },

    // UPDATE ORDER
    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      state.orders = state.orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      );
    },

    // DELETE/CANCEL ORDER
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload
      );
    },

    // ERROR
    setOrdersError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOrdersLoading,
  setOrders,
  addOrder,
  updateOrder,
  removeOrder,
  setOrdersError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;