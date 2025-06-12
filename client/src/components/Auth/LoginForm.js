import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, ChevronDown } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setFormData(prev => ({ ...prev, role: savedRole }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email' ? value.trim().toLowerCase() : value
    }));
    if (error) setError(null);
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData(prev => ({ ...prev, role: selectedRole }));
    localStorage.setItem('selectedRole', selectedRole);
    setRoleDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    if (!email || !password || !role) {
      setError('Email, password, dan role wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Login failed:', result.message);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'DOSEN': return 'Dosen';
      case 'MAHASISWA': return 'Mahasiswa';
      case 'REVIEWER': return 'Reviewer';
      default: return 'Pilih Role';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
            <div className="text-white text-4xl">🏛️</div>
          </div>
          <h2 className="text-2xl font-bold text-white">Login P3M Polimdo</h2>
          <p className="text-blue-100 mt-1">
            Masuk ke sistem Penelitian, Pengabdian & Publikasi
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="animate-fade-in p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Pilih Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  disabled={loading || isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 flex justify-between items-center ${
                    formData.role ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-300'
                  }`}
                >
                  <span className={formData.role ? 'text-blue-700 font-medium' : 'text-gray-400'}>
                    {getRoleLabel(formData.role)}
                  </span>
                  <ChevronDown className={`transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {roleDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-dropdown">
                    <div 
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleRoleSelect('DOSEN')}
                    >
                      Dosen
                    </div>
                    <div 
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleRoleSelect('MAHASISWA')}
                    >
                      Mahasiswa
                    </div>
                    <div 
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => handleRoleSelect('REVIEWER')}
                    >
                      Reviewer
                    </div>
                  </div>
                )}
              </div>
              
              {formData.role && (
                <div className="mt-2 text-xs text-blue-600 flex items-center animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Anda akan login sebagai {getRoleLabel(formData.role)}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email Anda"
                  required
                  disabled={loading || isSubmitting}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none disabled:bg-gray-100 transition-colors"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="flex text-sm font-medium text-gray-700 mb-2 items-center">
                <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password Anda"
                  required
                  disabled={loading || isSubmitting}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none disabled:bg-gray-100 transition-colors"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isSubmitting}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting || !formData.role}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Login
                </div>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
            <p>
              Belum punya akun?{' '}
              <button
                onClick={() => navigate('/register')}
                disabled={loading || isSubmitting}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors disabled:text-gray-400"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
