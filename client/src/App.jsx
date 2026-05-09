import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Home from './pages/Home'
import Login from './pages/Login'
import Pricing from './pages/Pricing'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Portfolio from './pages/Portfolio'
import Ipo from './pages/Ipo'
import Company from './pages/Company'

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: sessionRole } = useSelector((state) => state.auth)
  if (!isAuthenticated) return <Navigate to="/login/user" replace />
  if (role && sessionRole !== role) return <Navigate to="/" replace />
  return children
}

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login/:role' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/market' element={<Market />} />
        <Route path='/ipo' element={<Ipo />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/portfolio' element={<ProtectedRoute role="user"><Portfolio /></ProtectedRoute>} />
        <Route path='/company' element={<ProtectedRoute role="company"><Company /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App

