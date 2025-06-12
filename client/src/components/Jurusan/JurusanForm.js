import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import jurusanService from '../../services/jurusanService';
import Loading from '../Common/Loading';

const JurusanForm = ({ mode = 'create' }) => {
  const [formData, setFormData] = useState({ nama: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchJurusan();
    }
  }, [mode, id]);

  const fetchJurusan = async () => {
    try {
      setInitialLoading(true);
      setError('');
      const response = await jurusanService.getJurusanById(id);
      
      // Pastikan data ada sebelum set form
      if (response?.data?.nama) {
        setFormData({ nama: response.data.nama });
      } else {
        throw new Error('Data jurusan tidak ditemukan');
      }
    } catch (err) {
      const message = err?.message || 'Gagal memuat data jurusan';
      setError(message);
      console.error('Error saat mengambil data jurusan:', err);
      
      // Redirect ke list jika data tidak ditemukan
      if (err?.message?.includes('tidak ditemukan')) {
        setTimeout(() => {
          navigate('/jurusan', { 
            state: { 
              message: 'Jurusan tidak ditemukan',
              type: 'error'
            }
          });
        }, 2000);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error saat user mulai mengetik
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    
    // Clear general error jika ada
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedNama = formData.nama.trim();
    
    if (!trimmedNama) {
      errors.nama = 'Nama jurusan harus diisi';
    } else if (trimmedNama.length < 3) {
      errors.nama = 'Nama jurusan minimal 3 karakter';
    } else if (trimmedNama.length > 100) {
      errors.nama = 'Nama jurusan maksimal 100 karakter';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setFieldErrors({});

      const submitData = { nama: formData.nama.trim() };

      let response;
      if (mode === 'create') {
        response = await jurusanService.createJurusan(submitData);
      } else {
        response = await jurusanService.updateJurusan(id, submitData);
      }

      // Navigasi dengan state message
      navigate('/jurusan', {
        replace: true,
        state: {
          message: `Jurusan berhasil ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}`,
          type: 'success'
        }
      });
    } catch (err) {
      console.error(`Error ${mode} jurusan:`, err);
      
      // Handle validation errors dari backend
      if (err?.errors) {
        setFieldErrors(err.errors);
      } else {
        const message = err?.message || `Gagal ${mode === 'create' ? 'menambahkan' : 'memperbarui'} jurusan`;
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/jurusan');
  };

  // Loading state untuk edit mode
  if (initialLoading) {
    return <Loading />;
  }

  // Error state dengan option retry untuk edit mode
  if (error && mode === 'edit' && !formData.nama) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex justify-between items-center">
            <div className="text-red-700">{error}</div>
            <button
              onClick={fetchJurusan}
              className="text-red-600 hover:text-red-800 text-sm underline ml-4"
              disabled={initialLoading}
            >
              {initialLoading ? 'Loading...' : 'Coba Lagi'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Tambah Jurusan' : 'Edit Jurusan'}
        </h1>
        <p className="text-gray-600">
          {mode === 'create' ? 'Tambahkan jurusan baru' : 'Perbarui data jurusan'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Jurusan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                fieldErrors.nama ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama jurusan"
              disabled={loading}
              maxLength={100}
              autoComplete="off"
            />
            {fieldErrors.nama && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.nama}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.nama.length}/100 karakter
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading || !formData.nama.trim()}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {mode === 'create' ? 'Tambah' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JurusanForm;