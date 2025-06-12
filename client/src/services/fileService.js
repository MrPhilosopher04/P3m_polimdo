import api from './api';

const fileService = {
  uploadDocument: async (formData) => {
    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload document'
      };
    }
  },

  getDocuments: async (proposalId) => {
    try {
      const response = await api.get(`/files?proposalId=${proposalId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch documents'
      };
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await api.delete(`/files/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete document'
      };
    }
  }
};

export default fileService;