import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import Market from './pages/Market';
import StockDetails from './pages/StockDetails';

const ProtectedRoute = ({ children, role }) => {
  const {
    isAuthenticated,
    role: sessionRole,
  } = useSelector((state) => state.auth);

  if (!isAuthenticated)
    return <Navigate to="/login/user" replace />;

  if (role && sessionRole !== role)
    return <Navigate to="/" replace />;

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

      </Routes>
      
    </div>
  );
};

export default App;