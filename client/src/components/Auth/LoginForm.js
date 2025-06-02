// src/components/Auth/LoginForm.js - DIPERBAIKI
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // PERBAIKAN: Validasi input di frontend
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      console.log('Login result:', result); // Debug log
      
      if (result.success) {
        // PERBAIKAN: Redirect berdasarkan role user
        const userRole = result.user?.role;
        console.log('User role:', userRole); // Debug log
        
        // Redirect ke dashboard dengan role-based routing
        navigate('/dashboard', { replace: true });
      } else {
        // Error sudah di-handle di AuthContext
        console.error('Login failed:', result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <div className="form-header">
          <h2>Login P3M Polimdo</h2>
          <p>Masuk ke sistem Penelitian, Pengabdian & Publikasi</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password Anda"
                required
                disabled={loading || isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isSubmitting}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Belum punya akun? 
            <button 
              onClick={() => navigate('/register')}
              className="link-button"
              disabled={loading || isSubmitting}
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;