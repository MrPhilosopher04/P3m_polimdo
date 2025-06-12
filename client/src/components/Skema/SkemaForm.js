// src/components/Skema/SkemaForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SkemaForm = ({ skema, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    kategori: 'PENELITIAN',
    luaran_wajib: '',
    dana_min: '',
    dana_max: '',
    batas_anggota: 5,
    tahun_aktif: new Date().getFullYear(),
    tanggal_buka: '',
    tanggal_tutup: '',
    status: 'AKTIF'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (skema) {
      setFormData({
        kode: skema.kode,
        nama: skema.nama,
        kategori: skema.kategori,
        luaran_wajib: skema.luaran_wajib || '',
        dana_min: skema.dana_min ? skema.dana_min.toString() : '',
        dana_max: skema.dana_max ? skema.dana_max.toString() : '',
        batas_anggota: skema.batas_anggota,
        tahun_aktif: skema.tahun_aktif,
        tanggal_buka: skema.tanggal_buka ? skema.tanggal_buka.split('T')[0] : '',
        tanggal_tutup: skema.tanggal_tutup ? skema.tanggal_tutup.split('T')[0] : '',
        status: skema.status
      });
    }
  }, [skema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.kode) newErrors.kode = 'Kode wajib diisi';
    if (!formData.nama) newErrors.nama = 'Nama wajib diisi';
    if (!formData.kategori) newErrors.kategori = 'Kategori wajib diisi';
    if (!formData.tahun_aktif) newErrors.tahun_aktif = 'Tahun aktif wajib diisi';
    
    if (formData.dana_min && formData.dana_max) {
      const min = parseFloat(formData.dana_min);
      const max = parseFloat(formData.dana_max);
      
      if (min > max) {
        newErrors.dana_min = 'Dana min tidak boleh lebih besar dari dana max';
        newErrors.dana_max = 'Dana max tidak boleh lebih kecil dari dana min';
      }
    }
    
    if (formData.tanggal_buka && formData.tanggal_tutup) {
      const startDate = new Date(formData.tanggal_buka);
      const endDate = new Date(formData.tanggal_tutup);
      
      if (startDate > endDate) {
        newErrors.tanggal_buka = 'Tanggal buka tidak boleh setelah tanggal tutup';
        newErrors.tanggal_tutup = 'Tanggal tutup tidak boleh sebelum tanggal buka';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Convert number fields
    const payload = {
      ...formData,
      dana_min: formData.dana_min ? parseFloat(formData.dana_min) : null,
      dana_max: formData.dana_max ? parseFloat(formData.dana_max) : null,
      batas_anggota: parseInt(formData.batas_anggota, 10)
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom 1 */}
        <div>
          <div className="mb-4">
            <label htmlFor="kode" className="block text-sm font-medium text-gray-700 mb-1">Kode Skema *</label>
            <input
              type="text"
              id="kode"
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.kode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.kode && <p className="mt-1 text-sm text-red-600">{errors.kode}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Skema *</label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.nama ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select
              id="kategori"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.kategori ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="PENELITIAN">Penelitian</option>
              <option value="PENGABDIAN">Pengabdian</option>
              <option value="HIBAH_INTERNAL">Hibah Internal</option>
              <option value="HIBAH_EKSTERNAL">Hibah Eksternal</option>
            </select>
            {errors.kategori && <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="luaran_wajib" className="block text-sm font-medium text-gray-700 mb-1">Luaran Wajib</label>
            <input
              type="text"
              id="luaran_wajib"
              name="luaran_wajib"
              value={formData.luaran_wajib}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Jurnal, Produk, dll"
            />
          </div>
        </div>

        {/* Kolom 2 */}
        <div>
          <div className="mb-4">
            <label htmlFor="dana_min" className="block text-sm font-medium text-gray-700 mb-1">Dana Minimum (Rp)</label>
            <input
              type="number"
              id="dana_min"
              name="dana_min"
              value={formData.dana_min}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.dana_min ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              min="0"
              step="100000"
            />
            {errors.dana_min && <p className="mt-1 text-sm text-red-600">{errors.dana_min}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="dana_max" className="block text-sm font-medium text-gray-700 mb-1">Dana Maksimum (Rp)</label>
            <input
              type="number"
              id="dana_max"
              name="dana_max"
              value={formData.dana_max}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.dana_max ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              min="0"
              step="100000"
            />
            {errors.dana_max && <p className="mt-1 text-sm text-red-600">{errors.dana_max}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="batas_anggota" className="block text-sm font-medium text-gray-700 mb-1">Batas Anggota</label>
            <input
              type="number"
              id="batas_anggota"
              name="batas_anggota"
              value={formData.batas_anggota}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tahun_aktif" className="block text-sm font-medium text-gray-700 mb-1">Tahun Aktif *</label>
            <input
              type="number"
              id="tahun_aktif"
              name="tahun_aktif"
              value={formData.tahun_aktif}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.tahun_aktif ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              min="2000"
              max="2100"
            />
            {errors.tahun_aktif && <p className="mt-1 text-sm text-red-600">{errors.tahun_aktif}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="mb-4">
          <label htmlFor="tanggal_buka" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Buka</label>
          <input
            type="date"
            id="tanggal_buka"
            name="tanggal_buka"
            value={formData.tanggal_buka}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.tanggal_buka ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.tanggal_buka && <p className="mt-1 text-sm text-red-600">{errors.tanggal_buka}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="tanggal_tutup" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Tutup</label>
          <input
            type="date"
            id="tanggal_tutup"
            name="tanggal_tutup"
            value={formData.tanggal_tutup}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.tanggal_tutup ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.tanggal_tutup && <p className="mt-1 text-sm text-red-600">{errors.tanggal_tutup}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="AKTIF">Aktif</option>
          <option value="NONAKTIF">Non-Aktif</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          {skema ? 'Perbarui Skema' : 'Simpan Skema'}
        </button>
      </div>
    </form>
  );
};

export default SkemaForm;