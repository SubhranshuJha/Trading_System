import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  // isAuthenticated: !!localStorage.getItem('token'),
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = 'user';
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', 'user');
    },

    loginCompany: (state, action) => {
      state.user = action.payload.company;
      state.token = action.payload.token;
      state.role = 'company';
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', 'company');
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },

    logoutCompany: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const {
  loginUser,
  loginCompany,
  logoutUser,
  logoutCompany,
} = authSlice.actions;

export default authSlice.reducer;