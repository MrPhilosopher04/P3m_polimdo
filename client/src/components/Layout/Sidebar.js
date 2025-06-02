// src/components/Layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user, hasRole, hasAnyRole } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      roles: ['admin', 'dosen', 'mahasiswa', 'reviewer']
    },
    {
      path: '/proposals',
      label: 'Proposal',
      icon: '📝',
      roles: ['admin', 'dosen', 'mahasiswa']
    },
    {
      path: '/reviews',
      label: 'Review',
      icon: '📋',
      roles: ['admin', 'dosen', 'reviewer']
    },
    {
      path: '/skema',
      label: 'Skema',
      icon: '⚙️',
      roles: ['admin']
    },
    {
      path: '/users',
      label: 'Pengguna',
      icon: '👥',
      roles: ['admin']
    }
  ];

  // Safely check if hasAnyRole exists and is a function
  const filteredMenuItems = menuItems.filter(item => {
    if (hasAnyRole && typeof hasAnyRole === 'function') {
      return hasAnyRole(item.roles);
    }
    // Fallback: check if user role is in the allowed roles
    return item.roles.includes(user?.role);
  });

  const getUserRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Administrator',
      dosen: 'Dosen',
      mahasiswa: 'Mahasiswa',
      reviewer: 'Reviewer'
    };
    return roleLabels[role] || role || 'Unknown';
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <nav className="sidebar-nav">
        <ul className="nav-list" role="list">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="nav-item" role="listitem">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                aria-label={item.label}
              >
                <span className="nav-icon" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                <span className="nav-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-footer">
          <div className="user-info-sidebar">
            <div className="user-avatar">
              <span role="img" aria-label="user avatar">👤</span>
            </div>
            <div className="user-details">
              <span className="user-name" title={user?.name}>
                {user?.name || 'User'}
              </span>
              <span className="user-role" title={getUserRoleLabel(user?.role)}>
                {getUserRoleLabel(user?.role)}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;