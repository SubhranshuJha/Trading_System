import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Market from './pages/Market';
import StockDetails from './pages/StockDetails';
import Ipo from './pages/Ipo';
import IpoDetails from './pages/IpoDetails';
import UserProfile from './pages/UserProfile';
import CompanyProfile from './pages/CompanyProfile';
import ViewStock from './pages/ViewStocks';
import ManageIPO from './pages/ManageIpo';
import Portfolio from './pages/Portfolio';
import Orders from './pages/Orders';
import Trades from './pages/Trades';
import Wallet from './pages/Wallet';

const ProtectedRoute = ({
  children,
  role,
}) => {
  const {
    isAuthenticated,
    role: sessionRole,
  } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login/user" replace />;
  }

  if (role && sessionRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <div>

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MARKET */}
        <Route path="/market" element={<Market />}  />

        {/* STOCK DETAILS */}
        <Route path="/market/:symbol" element={<StockDetails />} />

        <Route path='/ipo' element={<Ipo />} />

        <Route path="/ipo/:id" element={<IpoDetails />} />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute role="user">
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="user">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trades"
          element={
            <ProtectedRoute role="user">
              <Trades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute role="user">
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <ProtectedRoute role="company">
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/stock"
          element={
            <ProtectedRoute role="company">
              <ViewStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/ipo"
          element={
            <ProtectedRoute role="company">
              <ManageIPO />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/ipo/create"
          element={
            <ProtectedRoute role="company">
              <ManageIPO />
            </ProtectedRoute>
          }
        />



      </Routes>
      
    </div>
  );
};

export default App;
