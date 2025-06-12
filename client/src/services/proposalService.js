// client/src/services/proposalService.js
import api from './api';

const proposalService = {
  // Get proposals dengan filter dan pagination
  getProposals: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status = '', skema = '' } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(skema && { skema })
      });

      const response = await api.get(`/proposals?${queryParams}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal mengambil data proposal'
      };
    }
  },

  // Get proposal by ID
  getProposalById: async (id) => {
    try {
      const response = await api.get(`/proposals/${id}`);
      return {
        success: true,
        data: response.data.data.proposal
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Proposal tidak ditemukan'
      };
    }
  },

  // Create proposal
  createProposal: async (proposalData) => {
    try {
      const response = await api.post('/proposals', proposalData);
      return {
        success: true,
        data: response.data.data.proposal
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal membuat proposal'
      };
    }
  },

  // Update proposal
  updateProposal: async (id, proposalData) => {
    try {
      const response = await api.put(`/proposals/${id}`, proposalData);
      return {
        success: true,
        data: response.data.data.proposal
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal memperbarui proposal'
      };
    }
  },

  // Submit proposal
  submitProposal: async (id) => {
    try {
      const response = await api.post(`/proposals/${id}/submit`);
      return {
        success: true,
        data: response.data.data.proposal
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal mengajukan proposal'
      };
    }
  },

  // Update proposal status (Admin/Reviewer)
  updateProposalStatus: async (id, statusData) => {
    try {
      const response = await api.patch(`/proposals/${id}/status`, statusData);
      return {
        success: true,
        data: response.data.data.proposal
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal memperbarui status'
      };
    }
  },

  // Delete proposal
  deleteProposal: async (id) => {
    try {
      await api.delete(`/proposals/${id}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal menghapus proposal'
      };
    }
  }
};

export default proposalService;