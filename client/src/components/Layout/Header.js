// src/components/Layout/Header.js - Updated version
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };

  const getRoleLabel = (role) => {
    return {
      ADMIN: 'Administrator',
      DOSEN: 'Dosen',
      MAHASISWA: 'Mahasiswa',
      REVIEWER: 'Reviewer'
    }[role?.toUpperCase()] || 'User';
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'text-red-600',
      DOSEN: 'text-blue-600',
      MAHASISWA: 'text-green-600',
      REVIEWER: 'text-purple-600'
    };
    return colors[role?.toUpperCase()] || 'text-gray-600';
  };

  return (
    <header className="flex justify-between items-center bg-white border-b px-6 py-3 sticky top-0 z-50 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="text-2xl">🏛️</div>
        <div className="leading-tight">
          <button 
            onClick={() => navigate('/dashboard')}
            className="hover:text-blue-800 transition-colors"
          >
            <p className="font-semibold text-lg text-blue-700">P3M POLIMDO</p>
            <p className="text-xs text-gray-500">Penelitian, Pengabdian & Publikasi</p>
          </button>
        </div>
      </div>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full focus:outline-none transition"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => { 
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
            <UserIcon className="w-4 h-4" />
          </div>
          
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-800 max-w-32 truncate">
              {user?.nama || 'User'}
            </p>
            <p className={`text-xs font-medium ${getRoleColor(user?.role)}`}>
              {getRoleLabel(user?.role)}
            </p>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform text-gray-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            role="menu"
          >
            {/* User Info in Dropdown */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nama}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full bg-gray-100 mt-1 ${getRoleColor(user?.role)}`}>
                {getRoleLabel(user?.role)}
              </span>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className={`flex items-center w-full gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  location.pathname === '/profile' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <UserIcon className="w-4 h-4" />
                Profil Saya
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;