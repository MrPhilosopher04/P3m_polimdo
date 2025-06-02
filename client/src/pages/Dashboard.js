// src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import StatsCard from '../components/Dashboard/StatsCard';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Users', value: '150', icon: '👥', color: 'blue' },
          { title: 'Total Proposals', value: '45', icon: '📝', color: 'green' },
          { title: 'Pending Reviews', value: '12', icon: '⏳', color: 'orange' },
          { title: 'Active Skema', value: '8', icon: '⚙️', color: 'purple' }
        ];
      
      case 'dosen':
        return [
          { title: 'My Proposals', value: '5', icon: '📝', color: 'blue' },
          { title: 'Reviews Assigned', value: '3', icon: '📋', color: 'orange' },
          { title: 'Completed Projects', value: '8', icon: '✅', color: 'green' }
        ];
      
      case 'mahasiswa':
        return [
          { title: 'My Proposals', value: '2', icon: '📝', color: 'blue' },
          { title: 'Approved', value: '1', icon: '✅', color: 'green' },
          { title: 'In Review', value: '1', icon: '⏳', color: 'orange' }
        ];
      
      case 'reviewer':
        return [
          { title: 'Assigned Reviews', value: '7', icon: '📋', color: 'orange' },
          { title: 'Completed Reviews', value: '15', icon: '✅', color: 'green' },
          { title: 'Pending Reviews', value: '3', icon: '⏳', color: 'red' }
        ];
      
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (['admin', 'dosen', 'mahasiswa'].includes(user?.role)) {
      actions.push({
        label: 'Create Proposal',
        icon: '📝',
        action: () => console.log('Navigate to create proposal'),
        color: 'primary'
      });
    }
    
    if (['admin', 'reviewer', 'dosen'].includes(user?.role)) {
      actions.push({
        label: 'Review Proposals',
        icon: '📋',
        action: () => console.log('Navigate to reviews'),
        color: 'secondary'
      });
    }
    
    if (user?.role === 'admin') {
      actions.push({
        label: 'Manage Users',
        icon: '👥',
        action: () => console.log('Navigate to user management'),
        color: 'info'
      });
      actions.push({
        label: 'Manage Skema',
        icon: '⚙️',
        action: () => console.log('Navigate to skema management'),
        color: 'warning'
      });
    }
    
    actions.push({
      label: 'View Profile',
      icon: '👤',
      action: () => console.log('Navigate to profile'),
      color: 'light'
    });
    
    return actions;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrator',
      dosen: 'Dosen',
      mahasiswa: 'Mahasiswa',
      reviewer: 'Reviewer'
    };
    return roleNames[role] || role;
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">
            Selamat datang, {user?.name || 'User'}!
          </h1>
          <p className="welcome-subtitle">
            Selamat datang di sistem P3M Polimdo
          </p>
        </div>
        <div className="user-info-card">
          <div className="user-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">
              <span className={`role-badge role-${user?.role}`}>
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
            <div className="user-email">{user?.email}</div>
            {user?.fakultas && (
              <div className="user-fakultas">Fakultas: {user.fakultas}</div>
            )}
            {user?.prodi && (
              <div className="user-prodi">Program Studi: {user.prodi}</div>
            )}
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {getDashboardStats().length > 0 && (
        <div className="stats-section">
          <h2 className="section-title">Dashboard Overview</h2>
          <div className="stats-grid">
            {getDashboardStats().map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {getQuickActions().map((action, index) => (
            <button
              key={index}
              className={`quick-action-btn btn-${action.color}`}
              onClick={action.action}
              type="button"
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-card">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <div className="activity-title">New proposal submitted</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <div className="activity-title">Review completed</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👥</div>
            <div className="activity-content">
              <div className="activity-title">New user registered</div>
              <div className="activity-time">2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;