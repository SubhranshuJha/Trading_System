// src/features/portfolio/portfolioSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  portfolio: {
    stocks: [],
  },

  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',

  initialState,

  reducers: {
    // START LOADING
    setPortfolioLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // SET FULL PORTFOLIO
    setPortfolio: (state, action) => {
      state.portfolio = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD STOCK
    addStockToPortfolio: (state, action) => {
      const newStock = action.payload;

      const existingStock = state.portfolio.stocks.find(
        (stock) =>
          stock.stockId.symbol === newStock.stockId.symbol
      );

      if (existingStock) {
        existingStock.quantity += newStock.quantity;

        existingStock.averagePrice =
          (
            existingStock.averagePrice +
            newStock.averagePrice
          ) / 2;
      } else {
        state.portfolio.stocks.push(newStock);
      }
    },

    // UPDATE STOCK
    updatePortfolioStock: (state, action) => {
      const updatedStock = action.payload;

      state.portfolio.stocks =
        state.portfolio.stocks.map((stock) =>
          stock.stockId.symbol === updatedStock.stockId.symbol
            ? updatedStock
            : stock
        );
    },

    // REMOVE STOCK
    removePortfolioStock: (state, action) => {
      const symbol = action.payload;

      state.portfolio.stocks =
        state.portfolio.stocks.filter(
          (stock) => stock.stockId.symbol !== symbol
        );
    },

    // ERROR
    setPortfolioError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR
    clearPortfolio: (state) => {
      state.portfolio = {
        stocks: [],
      };

      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setPortfolioLoading,
  setPortfolio,
  addStockToPortfolio,
  updatePortfolioStock,
  removePortfolioStock,
  setPortfolioError,
  clearPortfolio,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;