// src/pages/Proposals.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Proposals = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Proposals</h1>
        <p>Kelola proposal penelitian dan pengabdian</p>
      </div>
      
      <div className="page-content">
        <div className="info-card">
          <h3>Informasi User</h3>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Nama:</strong> {user?.name}</p>
        </div>
        
        <div className="content-placeholder">
          <p>Halaman untuk mengelola proposal penelitian dan pengabdian</p>
          <p>Fitur yang akan tersedia:</p>
          <ul>
            <li>Daftar proposal</li>
            <li>Tambah proposal baru</li>
            <li>Edit proposal</li>
            <li>Submit proposal</li>
            <li>Track status proposal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Proposals;