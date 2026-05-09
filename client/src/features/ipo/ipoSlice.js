import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ipos: [],
  selectedIPO: null,
  bids: [],

  loading: false,
  error: null,
};

const ipoSlice = createSlice({
  name: 'ipo',

  initialState,

  reducers: {
    // START LOADING
    setIPOLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // SET ALL IPOS
    setIPOs: (state, action) => {
      state.ipos = action.payload;
      state.loading = false;
      state.error = null;
    },

    // SET SINGLE IPO
    setSelectedIPO: (state, action) => {
      state.selectedIPO = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD IPO
    addIPO: (state, action) => {
      state.ipos.unshift(action.payload);
    },

    // UPDATE IPO
    updateIPO: (state, action) => {
      const updatedIPO = action.payload;

      state.ipos = state.ipos.map((ipo) =>
        ipo._id === updatedIPO._id
          ? updatedIPO
          : ipo
      );

      if (
        state.selectedIPO &&
        state.selectedIPO._id === updatedIPO._id
      ) {
        state.selectedIPO = updatedIPO;
      }
    },

    // REMOVE IPO
    removeIPO: (state, action) => {
      state.ipos = state.ipos.filter(
        (ipo) => ipo._id !== action.payload
      );
    },

    // SET BIDS
    setBids: (state, action) => {
      state.bids = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ADD BID
    addBid: (state, action) => {
      state.bids.unshift(action.payload);
    },

    // ERROR
    setIPOError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CLEAR SELECTED IPO
    clearSelectedIPO: (state) => {
      state.selectedIPO = null;
    },

    // CLEAR ALL
    clearIPOs: (state) => {
      state.ipos = [];
      state.selectedIPO = null;
      state.bids = [];

      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setIPOLoading,
  setIPOs,
  setSelectedIPO,
  addIPO,
  updateIPO,
  removeIPO,
  setBids,
  addBid,
  setIPOError,
  clearSelectedIPO,
  clearIPOs,
} = ipoSlice.actions;

export default ipoSlice.reducer;