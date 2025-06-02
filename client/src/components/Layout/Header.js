// src/components/Layout/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    if (navigate) {
      navigate('/login');
    }
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    if (navigate) {
      navigate('/profile');
    }
    setDropdownOpen(false);
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Administrator',
      dosen: 'Dosen',
      mahasiswa: 'Mahasiswa',
      reviewer: 'Reviewer'
    };
    return roleLabels[role] || 'User';
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">
            <span className="logo-icon">🏛️</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">P3M POLIMDO</h1>
            <p className="brand-subtitle">Sistem Penelitian, Pengabdian & Publikasi</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="user-menu" ref={dropdownRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <div className="user-avatar-small">
                <span>👤</span>
              </div>
              <div className="user-info-small">
                <span className="user-name-small">{user?.name || 'User'}</span>
                <span className="user-role-small">{getRoleLabel(user?.role)}</span>
              </div>
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>
            
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <button
                  className="dropdown-menu-item"
                  onClick={handleProfileClick}
                  type="button"
                >
                  <span className="menu-icon">👤</span>
                  <span>Profile</span>
                </button>
                <button
                  className="dropdown-menu-item logout-item"
                  onClick={handleLogout}
                  type="button"
                >
                  <span className="menu-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;