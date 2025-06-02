// src/services/proposalService.js
import api from './api';

export const proposalService = {
  // Get all proposals with optional filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/proposals', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data proposal');
    }
  },

  // Get proposal by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/proposals/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil detail proposal');
    }
  },

  // Create new proposal
  create: async (proposalData) => {
    try {
      const response = await api.post('/proposals', proposalData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal membuat proposal');
    }
  },

  // Update proposal
  update: async (id, proposalData) => {
    try {
      const response = await api.put(`/proposals/${id}`, proposalData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengupdate proposal');
    }
  },

  // Delete proposal
  delete: async (id) => {
    try {
      const response = await api.delete(`/proposals/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus proposal');
    }
  },

  // Upload document for proposal
  uploadDocument: async (id, formData) => {
    try {
      const response = await api.post(`/proposals/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengupload dokumen');
    }
  },

  // Get proposals by user (for dosen/mahasiswa)
  getByUser: async (userId) => {
    try {
      const response = await api.get(`/proposals/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil proposal pengguna');
    }
  },

  // Submit proposal for review
  submit: async (id) => {
    try {
      const response = await api.patch(`/proposals/${id}/submit`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal submit proposal');
    }
  },

  // Get proposal statistics (for dashboard)
  getStats: async () => {
    try {
      const response = await api.get('/proposals/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil statistik proposal');
    }
  }
};