// src/features/wallet/walletSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  ledger: [],

  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',

  initialState,

  reducers: {
    // START LOADING
    setWalletLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // SET BALANCE
    setBalance: (state, action) => {
      state.balance = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD FUNDS
    addFunds: (state, action) => {
      state.balance += action.payload;
    },

    // DEDUCT FUNDS
    deductFunds: (state, action) => {
      state.balance -= action.payload;
    },

    // SET LEDGER
    setLedger: (state, action) => {
      state.ledger = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD LEDGER ENTRY
    addLedgerEntry: (state, action) => {
      state.ledger.unshift(action.payload);
    },

    // ERROR
    setWalletError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR
    clearWallet: (state) => {
      state.balance = 0;
      state.ledger = [];

      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setWalletLoading,
  setBalance,
  addFunds,
  deductFunds,
  setLedger,
  addLedgerEntry,
  setWalletError,
  clearWallet,
} = walletSlice.actions;

export default walletSlice.reducer;