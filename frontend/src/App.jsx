import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Role-Based Dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vet"
            element={
              <ProtectedRoute roles={['VET', 'ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cashier"
            element={
              <ProtectedRoute roles={['CASHIER', 'ADMIN']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route redirects to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
