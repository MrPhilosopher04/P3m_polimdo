// src/pages/Profile.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Informasi dan pengaturan akun</p>
      </div>
      
      <div className="page-content">
        <div className="profile-card">
          <h3>Informasi Personal</h3>
          <div className="profile-info">
            <div className="info-row">
              <label>Nama Lengkap:</label>
              <span>{user?.name}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-row">
              <label>Role:</label>
              <span className="role-badge">{user?.role}</span>
            </div>
            <div className="info-row">
              <label>Fakultas:</label>
              <span>{user?.fakultas}</span>
            </div>
            <div className="info-row">
              <label>Program Studi:</label>
              <span>{user?.prodi}</span>
            </div>
            {user?.nidn && (
              <div className="info-row">
                <label>NIDN:</label>
                <span>{user?.nidn}</span>
              </div>
            )}
            {user?.nim && (
              <div className="info-row">
                <label>NIM:</label>
                <span>{user?.nim}</span>
              </div>
            )}
          </div>
          
          <div className="profile-actions">
            <button className="btn-primary">Edit Profile</button>
            <button className="btn-secondary">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;