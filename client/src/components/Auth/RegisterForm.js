import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import jurusanService from '../../services/jurusanService';
import prodiService from '../../services/prodiService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [jurusanList, setJurusanList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    nip: '',
    nim: '',
    no_telp: '',
    bidang_keahlian: '',
    jurusanId: '',
    prodiId: ''
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);
        const jurusanResponse = await jurusanService.getAllJurusan();
        
        if (jurusanResponse.success) {
          setJurusanList(jurusanResponse.data || []);
        } else {
          console.error('Failed to load jurusan:', jurusanResponse.message);
          setJurusanList([]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        setJurusanList([]);
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Load prodi when jurusan changes
  useEffect(() => {
    const loadProdiByJurusan = async (jurusanId) => {
      try {
        const response = await prodiService.getProdiByJurusan(jurusanId);
        if (response.success) {
          setProdiList(response.data || []);
        } else {
          console.error('Failed to load prodi:', response.message);
          setProdiList([]);
        }
      } catch (error) {
        console.error('Error loading prodi:', error);
        setProdiList([]);
      }
    };

    if (formData.jurusanId) {
      loadProdiByJurusan(formData.jurusanId);
    } else {
      setProdiList([]);
      setFormData(prev => ({ ...prev, prodiId: '' }));
    }
  }, [formData.jurusanId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama lengkap harus diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    if (!formData.role) {
      newErrors.role = 'Role harus dipilih';
    }

    // Role-specific validations
    if (formData.role === 'DOSEN' && !formData.nip.trim()) {
      newErrors.nip = 'NIP harus diisi untuk dosen';
    }

    if (formData.role === 'REVIEWER' && !formData.nip.trim()) {
      newErrors.nip = 'NIP harus diisi untuk reviewer';
    }

    if (formData.role === 'MAHASISWA' && !formData.nim.trim()) {
      newErrors.nim = 'NIM harus diisi untuk mahasiswa';
    }

    // Jurusan and Prodi required for MAHASISWA and DOSEN
    if (formData.role === 'MAHASISWA' || formData.role === 'DOSEN') {
      if (!formData.jurusanId) {
        newErrors.jurusanId = 'Jurusan harus dipilih';
      }

      if (!formData.prodiId) {
        newErrors.prodiId = 'Program studi harus dipilih';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const registerData = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        jurusanId: formData.jurusanId ? parseInt(formData.jurusanId) : null,
        prodiId: formData.prodiId ? parseInt(formData.prodiId) : null
      };

      // Add role-specific fields
      if (formData.role === 'DOSEN') {
        if (formData.nip.trim()) registerData.nip = formData.nip.trim();
        if (formData.bidang_keahlian.trim()) registerData.bidang_keahlian = formData.bidang_keahlian.trim();
      }

      if (formData.role === 'REVIEWER') {
        if (formData.nip.trim()) registerData.nip = formData.nip.trim();
        if (formData.bidang_keahlian.trim()) registerData.bidang_keahlian = formData.bidang_keahlian.trim();
      }

      if (formData.role === 'MAHASISWA' && formData.nim.trim()) {
        registerData.nim = formData.nim.trim();
      }

      if (formData.no_telp.trim()) {
        registerData.no_telp = formData.no_telp.trim();
      }

      const response = await authService.register(registerData);

      if (response.success) {
        alert('Registrasi berhasil! Silakan login dengan akun Anda.');
        navigate('/login');
      } else {
        if (response.errors) {
          setErrors(response.errors);
        } else {
          alert(response.message || 'Registrasi gagal');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        alert(error.message || 'Terjadi kesalahan saat registrasi');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="md:col-span-2">
                  <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.nama ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                  {errors.nama && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.nama}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="nama@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* No Telepon */}
                <div>
                  <label htmlFor="no_telp" className="block text-sm font-semibold text-gray-700 mb-2">
                    No. Telepon
                  </label>
                  <input
                    id="no_telp"
                    name="no_telp"
                    type="tel"
                    value={formData.no_telp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Role Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Peran & Identitas
              </h3>

              {/* Role Selection */}
              <div className="mb-6">
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Peran <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Pilih Peran Anda --</option>
                  <option value="MAHASISWA">👨‍🎓 Mahasiswa</option>
                  <option value="DOSEN">👨‍🏫 Dosen</option>
                  <option value="REVIEWER">👨‍💼 Reviewer</option>
                </select>
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Role-specific fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NIP for DOSEN and REVIEWER */}
                {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') && (
                  <div>
                    <label htmlFor="nip" className="block text-sm font-semibold text-gray-700 mb-2">
                      NIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nip"
                      name="nip"
                      type="text"
                      value={formData.nip}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.nip ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan NIP"
                    />
                    {errors.nip && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.nip}
                      </p>
                    )}
                  </div>
                )}

                {/* NIM for MAHASISWA */}
                {formData.role === 'MAHASISWA' && (
                  <div>
                    <label htmlFor="nim" className="block text-sm font-semibold text-gray-700 mb-2">
                      NIM <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nim"
                      name="nim"
                      type="text"
                      value={formData.nim}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.nim ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan NIM"
                    />
                    {errors.nim && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.nim}
                      </p>
                    )}
                  </div>
                )}

                {/* Bidang Keahlian for DOSEN and REVIEWER */}
                {(formData.role === 'DOSEN' || formData.role === 'REVIEWER') && (
                  <div className={formData.role === 'REVIEWER' ? 'md:col-span-1' : ''}>
                    <label htmlFor="bidang_keahlian" className="block text-sm font-semibold text-gray-700 mb-2">
                      Bidang Keahlian
                    </label>
                    <input
                      id="bidang_keahlian"
                      name="bidang_keahlian"
                      type="text"
                      value={formData.bidang_keahlian}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Contoh: Sistem Informasi, Jaringan Komputer"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information Section */}
            {(formData.role === 'DOSEN' || formData.role === 'MAHASISWA') && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Informasi Akademik
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Jurusan */}
                  <div>
                    <label htmlFor="jurusanId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Jurusan <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="jurusanId"
                      name="jurusanId"
                      value={formData.jurusanId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.jurusanId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">-- Pilih Jurusan --</option>
                      {jurusanList.map((jurusan) => (
                        <option key={jurusan.id} value={jurusan.id}>
                          {jurusan.nama}
                        </option>
                      ))}
                    </select>
                    {errors.jurusanId && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.jurusanId}
                      </p>
                    )}
                  </div>

                  {/* Program Studi */}
                  <div>
                    <label htmlFor="prodiId" className="block text-sm font-semibold text-gray-700 mb-2">
                      Program Studi <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="prodiId"
                      name="prodiId"
                      value={formData.prodiId}
                      onChange={handleInputChange}
                      disabled={!formData.jurusanId}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.prodiId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } ${!formData.jurusanId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">
                        {formData.jurusanId ? '-- Pilih Program Studi --' : '-- Pilih jurusan terlebih dahulu --'}
                      </option>
                      {prodiList.map((prodi) => (
                        <option key={prodi.id} value={prodi.id}>
                          {prodi.nama}
                        </option>
                      ))}
                    </select>
                    {errors.prodiId && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.prodiId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Password Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Keamanan Akun
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Ulangi password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-blue-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-semibold text-white transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses Registrasi...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Daftar Sekarang
                  </>
                )}
              </button>
            </div>

            {/* Footer Info */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Dengan mendaftar, Anda menyetujui{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Syarat & Ketentuan
                </a>{' '}
                dan{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Kebijakan Privasi
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Alternative Login */}
        <div className="text-center mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 mb-4">Sudah memiliki akun?</p>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-blue-600 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;