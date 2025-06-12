// client/src/components/Users/UserForm.js
import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'MAHASISWA',
    nip: '',
    nim: '',
    no_telp: '',
    bidang_keahlian: '',
    jurusanId: '',
    prodiId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        email: user.email || '',
        password: '', // Always empty for edit mode
        role: user.role || 'MAHASISWA',
        nip: user.nip || '',
        nim: user.nim || '',
        no_telp: user.no_telp || '',
        bidang_keahlian: user.bidang_keahlian || '',
        jurusanId: user.jurusan?.id || '',
        prodiId: user.prodi?.id || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear NIP/NIM based on role change
    if (name === 'role') {
      if (value === 'MAHASISWA') {
        setFormData(prev => ({ ...prev, nip: '' }));
      } else {
        setFormData(prev => ({ ...prev, nim: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Password validation - required for create, optional for edit
    if (!user && !formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // Role-specific validation
    if ((formData.role === 'DOSEN' || formData.role === 'REVIEWER') && !formData.nip.trim()) {
      newErrors.nip = 'NIP wajib diisi untuk dosen/reviewer';
    }
    if (formData.role === 'MAHASISWA' && !formData.nim.trim()) {
      newErrors.nim = 'NIM wajib diisi untuk mahasiswa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Clean up data before submitting
      const submitData = { ...formData };
      
      // Remove password if empty (for edit mode)
      if (!submitData.password) {
        delete submitData.password;
      }
      
      // Remove NIP if role is MAHASISWA
      if (submitData.role === 'MAHASISWA') {
        delete submitData.nip;
      } else {
        delete submitData.nim;
      }

      // Convert jurusanId and prodiId to numbers or null
      submitData.jurusanId = submitData.jurusanId ? parseInt(submitData.jurusanId) : null;
      submitData.prodiId = submitData.prodiId ? parseInt(submitData.prodiId) : null;

      onSubmit(submitData);
    }
  };

  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DOSEN', label: 'Dosen' },
    { value: 'MAHASISWA', label: 'Mahasiswa' },
    { value: 'REVIEWER', label: 'Reviewer' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap *
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nama ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="contoh@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password {!user && '*'}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={user ? "Kosongkan jika tidak ingin mengubah password" : "Masukkan password"}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      {/* NIP/NIM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(formData.role === 'DOSEN' || formData.role === 'REVIEWER' || formData.role === 'ADMIN') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIP {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') ? '*' : ''}
            </label>
            <input
              type="text"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nip ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan NIP"
            />
            {errors.nip && <p className="text-red-500 text-xs mt-1">{errors.nip}</p>}
          </div>
        )}

        {formData.role === 'MAHASISWA' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIM *
            </label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nim ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan NIM"
            />
            {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No. Telepon
          </label>
          <input
            type="text"
            name="no_telp"
            value={formData.no_telp}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nomor telepon"
          />
        </div>
      </div>

      {/* Bidang Keahlian for Dosen/Reviewer */}
      {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bidang Keahlian
          </label>
          <input
            type="text"
            name="bidang_keahlian"
            value={formData.bidang_keahlian}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan bidang keahlian"
          />
        </div>
      )}

      {/* Jurusan & Prodi IDs - Hidden inputs for now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Jurusan
          </label>
          <input
            type="number"
            name="jurusanId"
            value={formData.jurusanId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan ID jurusan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Program Studi
          </label>
          <input
            type="number"
            name="prodiId"
            value={formData.prodiId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan ID program studi"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : user ? 'Update' : 'Simpan'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;