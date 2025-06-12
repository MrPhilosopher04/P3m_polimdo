import api from './api';

const userService = {
  // Mendapatkan semua users dengan pagination
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get(`/users?${queryParams.toString()}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: { users: [], pagination: { total: 0, pages: 0, page: 1, limit: 10 } },
        error: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  },

  // Mendapatkan user berdasarkan ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  // Membuat user baru
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user'
      };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user'
      };
    }
  },

  // Update status user - diperbaiki sesuai dengan controller
  updateUserStatus: async (id, status) => {
    try {
      const response = await api.put(`/users/${id}/status`, { status });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user status'
      };
    }
  },

  // Hapus user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user'
      };
    }
  },

  // Mendapatkan profil sendiri
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update profil sendiri
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Mendapatkan reviewers
  getReviewers: async () => {
    try {
      const response = await api.get('/users/reviewers');
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error fetching reviewers:', error);
      return {
        success: false,
        data: { reviewers: [] },
        error: error.response?.data?.message || 'Failed to fetch reviewers'
      };
    }
  },

  // PERBAIKAN UTAMA: Mendapatkan team members
  getTeamMembers: async () => {
    try {
      console.log('🔄 Fetching team members...');
      
      const response = await api.get('/users/team-members');
      
      console.log('📥 Team members response:', response.data);
      
      // PERBAIKAN: Handle berbagai format response yang mungkin
      let users = [];
      
      if (response.data.data && response.data.data.users) {
        // Format: { data: { users: [...] } }
        users = response.data.data.users;
      } else if (response.data.users) {
        // Format: { users: [...] }
        users = response.data.users;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        users = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Format: [...]
        users = response.data;
      } else {
        console.warn('⚠️ Unexpected response format:', response.data);
        users = [];
      }

      console.log('✅ Processed team members:', users);
      
      return {
        success: true,
        data: users
      };
    } catch (error) {
      console.error('❌ Error fetching team members:', error);
      
      // PERBAIKAN: Lebih detail dalam error handling
      let errorMessage = 'Failed to fetch team members';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: [],
        error: errorMessage
      };
    }
  }
};

export default userService;