// services/dashboardService.js
import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard stats',
        data: getDefaultStats() // Provide fallback data
      };
    }
  },

  // Get recent proposals
  getRecentProposals: async (limit = 5) => {
    try {
      const response = await api.get(`/dashboard/recent-proposals?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching recent proposals:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent proposals',
        data: []
      };
    }
  },

  // Get recent users
  getRecentUsers: async (limit = 5) => {
    try {
      const response = await api.get(`/dashboard/recent-users?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching recent users:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent users',
        data: []
      };
    }
  },

  // Get recent reviews
  getRecentReviews: async (limit = 5) => {
    try {
      const response = await api.get(`/dashboard/recent-reviews?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch recent reviews',
        data: []
      };
    }
  },

  // Get announcements
  getAnnouncements: async (limit = 3) => {
    try {
      const response = await api.get(`/dashboard/announcements?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch announcements',
        data: []
      };
    }
  },

  // Admin specific endpoints
  getSystemHealth: async () => {
    try {
      const response = await api.get('/dashboard/system-health');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching system health:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch system health',
        data: null
      };
    }
  },

  // Get activity logs
  getActivityLogs: async (limit = 10) => {
    try {
      const response = await api.get(`/dashboard/activity-logs?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch activity logs',
        data: []
      };
    }
  }
};

// Provide default stats to prevent UI breaking
function getDefaultStats() {
  return {
    totalProposals: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalSkema: 0,  // TAMBAHKAN FALLBACK
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0,
    activeUsers: 0
  };
}

export default dashboardService;