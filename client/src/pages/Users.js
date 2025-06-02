// src/pages/Users.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Users = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Kelola pengguna sistem (Admin Only)</p>
      </div>
      
      <div className="page-content">
        <div className="info-card">
          <h3>Informasi User</h3>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Nama:</strong> {user?.name}</p>
        </div>
        
        <div className="content-placeholder">
          <p>Halaman untuk mengelola users</p>
          <p>Fitur yang akan tersedia:</p>
          <ul>
            <li>Daftar semua users</li>
            <li>Approve/reject registrasi</li>
            <li>Edit role users</li>
            <li>Suspend/activate users</li>
            <li>Reset password users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;