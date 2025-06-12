// src/pages/Dashboard/RoleBasedDashboard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Import dashboard untuk masing-masing role
import AdminDashboard from './AdminDashboard';
import DosenDashboard from './DosenDashboard';
import MahasiswaDashboard from './MahasiswaDashboard';
import ReviewerDashboard from './ReviewerDashboard';

const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();

  // Tampilkan loading spinner jika masih memuat
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Jika user tidak login atau tidak memiliki role, arahkan ke login
  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }

  // Tampilkan dashboard sesuai peran
  switch (user.role.toUpperCase()) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DOSEN':
      return <DosenDashboard />;
    case 'MAHASISWA':
      return <MahasiswaDashboard />;
    case 'REVIEWER':
      return <ReviewerDashboard />;
    default:
      // Jika role tidak dikenali, arahkan ke halaman akses ditolak
      return <Navigate to="/403" replace />;
  }
};

export default RoleBasedDashboard;
