//client/src/components/Auth/RoleBasedRedirect.js
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import DosenDashboard from './DosenDashboard';
import MahasiswaDashboard from './MahasiswaDashboard';
import ReviewerDashboard from './ReviewerDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DOSEN':
      return <DosenDashboard />;
    case 'MAHASISWA':
      return <MahasiswaDashboard />;
    case 'REVIEWER':
      return <ReviewerDashboard />;
    default:
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Role tidak dikenali: {user.role}</p>
        </div>
      );
  }
};

export default RoleBasedDashboard;