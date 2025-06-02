// src/pages/Register.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect ke dashboard jika sudah login
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="brand-logo">
            <h1>P3M POLIMDO</h1>
            <p>Penelitian, Pengabdian & Publikasi</p>
            <p>Politeknik Negeri Manado</p>
          </div>
        </div>
        <div className="auth-form">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;