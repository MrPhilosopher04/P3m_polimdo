// src/components/Auth/ProtectedRoute.js
import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ✅ Redirect to login page if not authenticated
  // Simpan current location untuk redirect kembali setelah login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Check role-based access
  if (
    allowedRoles.length > 0 &&
    (!user || !allowedRoles.includes(user.role))
  ) {
    // Redirect ke halaman unauthorized atau dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Higher-order component to wrap any component with role-based protection
export const withRoleCheck = (Component, allowedRoles = []) => {
  return memo((props) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  ));
};

export default ProtectedRoute;