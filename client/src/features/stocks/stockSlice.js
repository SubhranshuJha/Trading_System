// src/features/stocks/stockSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stocks: [],
  selectedStock: null,

  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stocks',

  initialState,

  reducers: {
    // START LOADING
    setStocksLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // SET ALL STOCKS
    setStocks: (state, action) => {
      state.stocks = action.payload;
      state.loading = false;
      state.error = null;
    },

    // SET SINGLE STOCK
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD STOCK
    addStock: (state, action) => {
      state.stocks.unshift(action.payload);
    },

    // UPDATE STOCK
    updateStock: (state, action) => {
      const updatedStock = action.payload;

      state.stocks = state.stocks.map((stock) =>
        stock._id === updatedStock._id
          ? updatedStock
          : stock
      );

      if (
        state.selectedStock &&
        state.selectedStock._id === updatedStock._id
      ) {
        state.selectedStock = updatedStock;
      }
    },

    // REMOVE STOCK
    removeStock: (state, action) => {
      state.stocks = state.stocks.filter(
        (stock) => stock._id !== action.payload
      );
    },

    // ERROR
    setStocksError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR SELECTED STOCK
    clearSelectedStock: (state) => {
      state.selectedStock = null;
    },

    // CLEAR ALL
    clearStocks: (state) => {
      state.stocks = [];
      state.selectedStock = null;

      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setStocksLoading,
  setStocks,
  setSelectedStock,
  addStock,
  updateStock,
  removeStock,
  setStocksError,
  clearSelectedStock,
  clearStocks,
} = stockSlice.actions;

export default stockSlice.reducer;