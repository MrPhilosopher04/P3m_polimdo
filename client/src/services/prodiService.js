//client/src/services/prodiService.js
import api from './api';

const prodiService = {
  // Get all prodi
  getAllProdi: async () => {
    try {
      const response = await api.get('/prodi');
      return {
        success: true,
        data: response?.data?.data || [],
        message: response?.data?.message || ''
      };
    } catch (error) {
      console.error('Error in getAllProdi:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  // Get prodi by ID
  getProdiById: async (id) => {
    try {
      if (!id || isNaN(parseInt(id))) throw new Error('ID prodi tidak valid');

      const response = await api.get(`/prodi/${id}`);
      if (response.data?.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Gagal mengambil data prodi');
      }
    } catch (error) {
      console.error('Service Error getProdiById:', error);
      if (error.response?.data) {
        if (error.response.status === 404) {
          throw new Error('Prodi tidak ditemukan');
        }
        throw new Error(error.response.data.message || 'Gagal mengambil data prodi');
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  },

  // Create new prodi
  createProdi: async (prodiData) => {
    try {
      if (!prodiData?.nama?.trim()) throw new Error('Nama prodi harus diisi');
      if (!prodiData?.jurusanId) throw new Error('Jurusan harus dipilih');

      const response = await api.post('/prodi', prodiData);
      if (response.data?.success) {
        return response.data;
      } else {
        const error = new Error(response.data?.message || 'Gagal membuat prodi');
        if (response.data?.errors) error.errors = response.data.errors;
        throw error;
      }
    } catch (error) {
      console.error('Service Error createProdi:', error);
      if (error.response?.data) {
        const newError = new Error(error.response.data.message || 'Gagal membuat prodi');
        if (error.response.data.errors) newError.errors = error.response.data.errors;
        throw newError;
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw error;
      }
    }
  },

  // Update prodi
  updateProdi: async (id, prodiData) => {
    try {
      if (!id || isNaN(parseInt(id))) throw new Error('ID prodi tidak valid');
      if (!prodiData?.nama?.trim()) throw new Error('Nama prodi harus diisi');

      const response = await api.put(`/prodi/${id}`, prodiData);
      if (response.data?.success) {
        return response.data;
      } else {
        const error = new Error(response.data?.message || 'Gagal memperbarui prodi');
        if (response.data?.errors) error.errors = response.data.errors;
        throw error;
      }
    } catch (error) {
      console.error('Service Error updateProdi:', error);
      if (error.response?.data) {
        const newError = new Error(error.response.data.message || 'Gagal memperbarui prodi');
        if (error.response.status === 404) {
          newError.message = 'Prodi tidak ditemukan';
        }
        if (error.response.data.errors) newError.errors = error.response.data.errors;
        throw newError;
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw error;
      }
    }
  },

  // Delete prodi
  deleteProdi: async (id) => {
    try {
      if (!id || isNaN(parseInt(id))) throw new Error('ID prodi tidak valid');

      const response = await api.delete(`/prodi/${id}`);
      if (response.data?.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Gagal menghapus prodi');
      }
    } catch (error) {
      console.error('Service Error deleteProdi:', error);
      if (error.response?.data) {
        if (error.response.status === 404) {
          throw new Error('Prodi tidak ditemukan');
        }
        if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Tidak dapat menghapus prodi');
        }
        throw new Error(error.response.data.message || 'Gagal menghapus prodi');
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  },

  // Get prodi by jurusan - DIPERBAIKI: menggunakan endpoint yang benar
  getProdiByJurusan: async (jurusanId) => {
    try {
      if (!jurusanId || isNaN(parseInt(jurusanId))) throw new Error('ID jurusan tidak valid');

      // PERBAIKAN: Menggunakan endpoint /jurusan/:id/prodi sesuai dengan routes
      const response = await api.get(`/jurusan/${jurusanId}/prodi`);
      return {
        success: true,
        data: response?.data?.data || [],
        message: response?.data?.message || ''
      };
    } catch (error) {
      console.error('Service Error getProdiByJurusan:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Gagal mengambil data prodi',
        data: []
      };
    }
  }
};

export default prodiService;