import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Proposals from './pages/Proposals';
import Reviews from './pages/Reviews';
import Skema from './pages/Skema';
import Users from './pages/Users';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Styles
import './styles/index.css';
import './styles/App.css';
import './styles/auth.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/footer.css';
import './components/Dashboard/StatsCard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/proposals" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'DOSEN', 'MAHASISWA']}>
                  <Proposals />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reviews" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'REVIEWER', 'DOSEN']}>
                  <Reviews />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/skema" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Skema />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Users />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;