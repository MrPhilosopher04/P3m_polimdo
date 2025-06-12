import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import prodiService from '../../services/prodiService';
import jurusanService from '../../services/jurusanService';
import Loading from '../../components/Common/Loading';

const ProdiForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    nama: '',
    jurusanId: ''
  });
  const [jurusanList, setJurusanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchJurusan();
    if (isEdit) {
      fetchProdi();
    }
  }, [id, isEdit]);

  const fetchJurusan = async () => {
    try {
      const response = await jurusanService.getAllJurusan();
      setJurusanList(response.data);
    } catch (error) {
      console.error('Error fetching jurusan:', error);
      alert('Gagal mengambil data jurusan');
    }
  };

  const fetchProdi = async () => {
    try {
      setLoading(true);
      const response = await prodiService.getProdiById(id);
      setFormData({
        nama: response.data.nama,
        jurusanId: response.data.jurusanId.toString()
      });
    } catch (error) {
      console.error('Error fetching prodi:', error);
      alert('Prodi tidak ditemukan');
      navigate('/prodi');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama prodi harus diisi';
    }

    if (!formData.jurusanId) {
      newErrors.jurusanId = 'Jurusan harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        nama: formData.nama.trim(),
        jurusanId: parseInt(formData.jurusanId)
      };

      if (isEdit) {
        await prodiService.updateProdi(id, submitData);
        alert('Prodi berhasil diupdate');
      } else {
        await prodiService.createProdi(submitData);
        alert('Prodi berhasil dibuat');
      }
      
      navigate('/prodi');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Gagal menyimpan data prodi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/prodi');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/prodi')}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Program Studi' : 'Tambah Program Studi'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Ubah data program studi' : 'Tambah program studi baru'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Prodi */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Program Studi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nama ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama program studi"
            />
            {errors.nama && (
              <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
            )}
          </div>

          {/* Jurusan */}
          <div>
            <label htmlFor="jurusanId" className="block text-sm font-medium text-gray-700 mb-2">
              Jurusan <span className="text-red-500">*</span>
            </label>
            <select
              id="jurusanId"
              name="jurusanId"
              value={formData.jurusanId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.jurusanId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Jurusan</option>
              {jurusanList.map(jurusan => (
                <option key={jurusan.id} value={jurusan.id}>
                  {jurusan.nama}
                </option>
              ))}
            </select>
            {errors.jurusanId && (
              <p className="mt-1 text-sm text-red-600">{errors.jurusanId}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdiForm;