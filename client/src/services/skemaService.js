// src/services/skemaService.js
export const skemaService = {
  getAll: async () => {
    try {
      const response = await api.get('/skema');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil data skema');
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/skema/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengambil detail skema');
    }
  },

  create: async (skemaData) => {
    try {
      const response = await api.post('/skema', skemaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal membuat skema');
    }
  },

  update: async (id, skemaData) => {
    try {
      const response = await api.put(`/skema/${id}`, skemaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal mengupdate skema');
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/skema/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus skema');
    }
  }
};