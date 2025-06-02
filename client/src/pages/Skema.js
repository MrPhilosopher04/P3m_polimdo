// src/pages/Skema.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Skema = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Skema Penelitian</h1>
        <p>Kelola skema penelitian dan pengabdian (Admin Only)</p>
      </div>
      
      <div className="page-content">
        <div className="info-card">
          <h3>Informasi User</h3>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Nama:</strong> {user?.name}</p>
        </div>
        
        <div className="content-placeholder">
          <p>Halaman untuk mengelola skema penelitian</p>
          <p>Fitur yang akan tersedia:</p>
          <ul>
            <li>Daftar skema penelitian</li>
            <li>Tambah skema baru</li>
            <li>Edit skema</li>
            <li>Atur deadline</li>
            <li>Atur kriteria review</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Skema;