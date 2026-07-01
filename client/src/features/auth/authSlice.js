import { createSlice } from '@reduxjs/toolkit';

const storedRole = localStorage.getItem('role');
const storedUserToken = localStorage.getItem('userToken');
const storedCompanyToken = localStorage.getItem('companyToken');
const legacyToken = localStorage.getItem('token');

const resolveInitialToken = () => {
  if (storedRole === 'company') {
    return storedCompanyToken || legacyToken || null;
  }

  if (storedRole === 'user') {
    return storedUserToken || legacyToken || null;
  }

  return storedUserToken || storedCompanyToken || legacyToken || null;
};

const initialState = {
  user: null,
  token: resolveInitialToken(),
  role: storedRole || null,
  isAuthenticated: Boolean(resolveInitialToken()),
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

      localStorage.removeItem('companyToken');
      localStorage.setItem('userToken', action.payload.token);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', 'user');
    },

    loginCompany: (state, action) => {
      state.user = action.payload.company;
      state.token = action.payload.token;
      state.role = 'company';
      state.isAuthenticated = true;

      localStorage.removeItem('userToken');
      localStorage.setItem(
        'companyToken',
        action.payload.token
      );
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', 'company');
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem('userToken');
      localStorage.removeItem('companyToken');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },

    logoutCompany: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem('userToken');
      localStorage.removeItem('companyToken');
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
