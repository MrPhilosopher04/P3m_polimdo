// src/pages/NotFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        
        <div className="not-found-actions">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Kembali ke Dashboard
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;