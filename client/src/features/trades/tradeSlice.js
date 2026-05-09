// src/features/trades/tradeSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trades: [],

  loading: false,
  error: null,
};

const tradeSlice = createSlice({
  name: 'trades',

  initialState,

  reducers: {
    // START LOADING
    setTradesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // SET ALL TRADES
    setTrades: (state, action) => {
      state.trades = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD TRADE
    addTrade: (state, action) => {
      state.trades.unshift(action.payload);
    },

    // UPDATE TRADE
    updateTrade: (state, action) => {
      const updatedTrade = action.payload;

      state.trades = state.trades.map((trade) =>
        trade._id === updatedTrade._id
          ? updatedTrade
          : trade
      );
    },

    // REMOVE TRADE
    removeTrade: (state, action) => {
      state.trades = state.trades.filter(
        (trade) => trade._id !== action.payload
      );
    },

    // ERROR
    setTradesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR
    clearTrades: (state) => {
      state.trades = [];

      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setTradesLoading,
  setTrades,
  addTrade,
  updateTrade,
  removeTrade,
  setTradesError,
  clearTrades,
} = tradeSlice.actions;

export default tradeSlice.reducer;