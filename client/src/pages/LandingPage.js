// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Selamat datang di P3M Polimdo</h1>
      <p>Platform untuk Penelitian, Pengabdian, dan Publikasi</p>
      <div className="actions">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-secondary">Daftar</Link>
      </div>
    </div>
  );
};

export default LandingPage;
