// src/services/skemaService.js
import api from './api';

class SkemaService {
  async getAllSkema(filters = {}) {
    try {
      // Convert frontend filters to backend compatible format
      const params = {
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        kategori: filters.kategori === 'Semua Kategori' ? null : filters.kategori,
        status: filters.status === 'Semua Status' ? null : filters.status
      };

      // Remove undefined/null values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get('/skema', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching skema:', error);
      throw error;
    }
  }

  async getSkemaById(id) {
    try {
      const response = await api.get(`/skema/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skema by ID:', error);
      throw error;
    }
  }

  // TAMBAHKAN METHOD UNTUK MENGAMBIL SKEMA AKTIF
  async getActiveSkema() {
    try {
      const response = await api.get('/skema/active');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching active skema:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch active skema',
        data: []
      };
    }
  }

  // TAMBAHKAN METHOD UNTUK STATS SKEMA
  async getSkemaStats() {
    try {
      const response = await api.get('/skema/stats');
      return {
        success: true,
        data: response.data.data || {}
      };
    } catch (error) {
      console.error('Error fetching skema stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch skema stats',
        data: {}
      };
    }
  }

  async createSkema(skemaData) {
    try {
      const payload = {
        ...skemaData,
        kategori: skemaData.kategori.toUpperCase(),
        status: skemaData.status || 'AKTIF'
      };
      
      const response = await api.post('/skema', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating skema:', error);
      throw error;
    }
  }

  async updateSkema(id, skemaData) {
    try {
      const payload = {
        ...skemaData,
        kategori: skemaData.kategori.toUpperCase()
      };
      
      const response = await api.put(`/skema/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating skema:', error);
      throw error;
    }
  }

  async deleteSkema(id) {
    try {
      const response = await api.delete(`/skema/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting skema:', error);
      throw error;
    }
  }
}

const skemaService = new SkemaService();
export default skemaService;