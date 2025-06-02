// src/components/Layout/Footer.js
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {currentYear} P3M Politeknik Negeri Manado. All rights reserved.
          </p>
          <p className="footer-subtitle">
            Sistem Penelitian, Pengabdian Masyarakat & Publikasi
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;