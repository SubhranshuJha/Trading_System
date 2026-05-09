import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import orderReducer from '../features/orders/orderSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import stockReducer from '../features/stocks/stockSlice';
import tradeReducer from '../features/trades/tradeSlice';
import walletReducer from '../features/wallet/walletSlice';
import ipoReducer from '../features/ipo/ipoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    portfolio: portfolioReducer,
    stocks: stockReducer,
    trades: tradeReducer,
    wallet: walletReducer,
    ipo: ipoReducer,
  },
});

export default store;