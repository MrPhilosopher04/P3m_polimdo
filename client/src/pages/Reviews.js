// src/pages/Reviews.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Reviews = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reviews</h1>
        <p>Kelola review proposal</p>
      </div>
      
      <div className="page-content">
        <div className="info-card">
          <h3>Informasi User</h3>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Nama:</strong> {user?.name}</p>
        </div>
        
        <div className="content-placeholder">
          <p>Halaman untuk mengelola review proposal</p>
          <p>Fitur yang akan tersedia:</p>
          <ul>
            <li>Daftar proposal untuk direview</li>
            <li>Form review proposal</li>
            <li>History review</li>
            <li>Status review</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reviews;