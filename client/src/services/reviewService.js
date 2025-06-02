// src/services/reviewService.js
import api from './api';

export const reviewService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/reviews', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data review');
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/reviews/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil detail review');
    }
  },

  create: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal membuat review');
    }
  },

  update: async (id, reviewData) => {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengupdate review');
    }
  },

  getByProposal: async (proposalId) => {
    try {
      const response = await api.get(`/reviews/proposal/${proposalId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil review proposal');
    }
  }
};