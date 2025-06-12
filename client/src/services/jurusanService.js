// src/services/jurusanService.js

import api from './api';

const jurusanService = {
  // Get all jurusan
  getAllJurusan: async (publicAccess = false) => {
  try {
    const endpoint = publicAccess ? '/jurusan/public' : '/jurusan';
    const response = await api.get(endpoint);
    return {
      success: true,
      data: response?.data?.data || [],
      message: response?.data?.message || '',
    };
  } catch (error) {
    console.error('Error in getAllJurusan:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      data: []
    };
  }
},

  // Get jurusan by ID
  getJurusanById: async (id) => {
    try {
      if (!id || isNaN(parseInt(id))) throw new Error('ID jurusan tidak valid');

      const response = await api.get(`/jurusan/${id}`);
      if (response.data?.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Gagal mengambil data jurusan');
      }
    } catch (error) {
      console.error('Service Error getJurusanById:', error);
      if (error.response?.data) {
        if (error.response.status === 404) {
          throw new Error('Jurusan tidak ditemukan');
        }
        throw new Error(error.response.data.message || 'Gagal mengambil data jurusan');
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  },

  // Create new jurusan
  createJurusan: async (data) => {
    try {
      if (!data?.nama?.trim()) throw new Error('Nama jurusan harus diisi');

      const response = await api.post('/jurusan', {
        nama: data.nama.trim(),
      });

      if (response.data?.success) {
        return response.data;
      } else {
        const error = new Error(response.data?.message || 'Gagal membuat jurusan');
        if (response.data?.errors) error.errors = response.data.errors;
        throw error;
      }
    } catch (error) {
      console.error('Service Error createJurusan:', error);
      if (error.response?.data) {
        const newError = new Error(error.response.data.message || 'Gagal membuat jurusan');
        if (error.response.data.errors) newError.errors = error.response.data.errors;
        throw newError;
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw error;
      }
    }
  },

  // Update jurusan
  updateJurusan: async (id, data) => {
    try {
      if (!id || isNaN(parseInt(id))) throw new Error('ID jurusan tidak valid');
      if (!data?.nama?.trim()) throw new Error('Nama jurusan harus diisi');

      const response = await api.put(`/jurusan/${id}`, {
        nama: data.nama.trim(),
      });

      if (response.data?.success) {
        return response.data;
      } else {
        const error = new Error(response.data?.message || 'Gagal memperbarui jurusan');
        if (response.data?.errors) error.errors = response.data.errors;
        throw error;
      }
    } catch (error) {
      console.error('Service Error updateJurusan:', error);
      if (error.response?.data) {
        const newError = new Error(error.response.data.message || 'Gagal memperbarui jurusan');
        if (error.response.status === 404) {
          newError.message = 'Jurusan tidak ditemukan';
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

  // Delete jurusan
  deleteJurusan: async (id) => {
    try {
      if (!id || isNaN(parseInt(id))) throw new Error('ID jurusan tidak valid');

      const response = await api.delete(`/jurusan/${id}`);
      if (response.data?.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Gagal menghapus jurusan');
      }
    } catch (error) {
      console.error('Service Error deleteJurusan:', error);
      if (error.response?.data) {
        if (error.response.status === 404) {
          throw new Error('Jurusan tidak ditemukan');
        }
        if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Tidak dapat menghapus jurusan');
        }
        throw new Error(error.response.data.message || 'Gagal menghapus jurusan');
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  },

  // Get prodi by jurusan
  getProdiByJurusan: async (jurusanId) => {
    try {
      if (!jurusanId || isNaN(parseInt(jurusanId))) throw new Error('ID jurusan tidak valid');

      const response = await api.get(`/jurusan/${jurusanId}/prodi`);
      if (response.data?.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Gagal mengambil data prodi');
      }
    } catch (error) {
      console.error('Service Error getProdiByJurusan:', error);
      if (error.response?.data) {
        if (error.response.status === 404) {
          throw new Error('Jurusan tidak ditemukan');
        }
        throw new Error(error.response.data.message || 'Gagal mengambil data prodi');
      } else if (error.request) {
        throw new Error('Tidak dapat terhubung ke server');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan yang tidak diketahui');
      }
    }
  }
};

export default jurusanService;
