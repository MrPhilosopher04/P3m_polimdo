// src/components/Auth/RegisterForm.js
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES, ROLE_LABELS, JURUSAN_LIST } from '../../utils/constants';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    nip: '', // untuk dosen, admin, reviewer
    nim: '', // untuk mahasiswa
    no_telp: '',
    bidang_keahlian: '', // untuk dosen dan reviewer
    institusi: '', // untuk reviewer eksternal
    jurusan: '' // untuk mahasiswa
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: USER_ROLES.MAHASISWA, label: ROLE_LABELS[USER_ROLES.MAHASISWA] },
    { value: USER_ROLES.DOSEN, label: ROLE_LABELS[USER_ROLES.DOSEN] },
    { value: USER_ROLES.REVIEWER, label: ROLE_LABELS[USER_ROLES.REVIEWER] }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    // Validasi role-specific fields
    if ((formData.role === USER_ROLES.DOSEN || formData.role === USER_ROLES.REVIEWER) && !formData.nip) {
      alert('NIP wajib diisi untuk dosen dan reviewer!');
      return;
    }

    if (formData.role === USER_ROLES.MAHASISWA && !formData.nim) {
      alert('NIM wajib diisi untuk mahasiswa!');
      return;
    }

    if (formData.role === USER_ROLES.MAHASISWA && !formData.jurusan) {
      alert('Jurusan wajib diisi untuk mahasiswa!');
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case USER_ROLES.DOSEN:
        return (
          <>
            <div className="form-group">
              <label htmlFor="nip">NIP</label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="Masukkan NIP"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bidang_keahlian">Bidang Keahlian</label>
              <input
                type="text"
                id="bidang_keahlian"
                name="bidang_keahlian"
                value={formData.bidang_keahlian}
                onChange={handleChange}
                placeholder="Masukkan bidang keahlian"
              />
            </div>
          </>
        );
      case USER_ROLES.MAHASISWA:
        return (
          <>
            <div className="form-group">
              <label htmlFor="nim">NIM</label>
              <input
                type="text"
                id="nim"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Masukkan NIM"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jurusan">Jurusan</label>
              <select
                id="jurusan"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Jurusan</option>
                {JURUSAN_LIST.map(jurusan => (
                  <option key={jurusan} value={jurusan}>
                    {jurusan}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case USER_ROLES.REVIEWER:
        return (
          <>
            <div className="form-group">
              <label htmlFor="nip">NIP</label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="Masukkan NIP"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="bidang_keahlian">Bidang Keahlian</label>
              <input
                type="text"
                id="bidang_keahlian"
                name="bidang_keahlian"
                value={formData.bidang_keahlian}
                onChange={handleChange}
                placeholder="Masukkan bidang keahlian"
              />
            </div>
            <div className="form-group">
              <label htmlFor="institusi">Institusi</label>
              <input
                type="text"
                id="institusi"
                name="institusi"
                value={formData.institusi}
                onChange={handleChange}
                placeholder="Masukkan institusi (untuk reviewer eksternal)"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form-card">
        <div className="form-header">
          <h2>Daftar P3M Polimdo</h2>
          <p>Buat akun baru untuk mengakses sistem</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <span>✅ {successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Role</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {renderRoleSpecificFields()}

          <div className="form-group">
            <label htmlFor="no_telp">No. Telepon</label>
            <input
              type="tel"
              id="no_telp"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              placeholder="Masukkan nomor telepon"
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
                placeholder="Masukkan password"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi password"
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Sudah punya akun? 
            <button 
              onClick={() => navigate('/login')}
              className="link-button"
            >
              Login di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;