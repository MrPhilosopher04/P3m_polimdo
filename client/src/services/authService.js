// src/services/authService.js 
import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      const errorMessage = error.response?.data?.message || 'Login gagal';
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register service error:', error);
      const errorMessage = error.response?.data?.message || 'Registrasi gagal';
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      const errorMessage = error.response?.data?.message || 'Gagal mengambil profil';
      throw new Error(errorMessage);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || 'Gagal mengupdate profil';
      throw new Error(errorMessage);
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Gagal mengubah password';
      throw new Error(errorMessage);
    }
  }
};

export default authService;