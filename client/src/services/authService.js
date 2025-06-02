// src/services/authService.js - DIPERBAIKI
import api from './api';

export const authService = {
  // Login function - DIPERBAIKI
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // PERBAIKAN: Return langsung response.data karena sudah berisi structure yang benar
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      // PERBAIKAN: Throw error dengan structure yang konsisten
      const errorMessage = error.response?.data?.message || 'Login gagal';
      throw new Error(errorMessage);
    }
  },

  // Register function - DIPERBAIKI
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

  // PERBAIKAN: Hapus verifyToken, gunakan getProfile sebagai gantinya
  // verifyToken: async (token) => {
  //   try {
  //     const response = await api.get('/auth/verify', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     return response.data.user;
  //   } catch (error) {
  //     throw new Error('Token tidak valid');
  //   }
  // },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Handle error if needed - tidak perlu throw error untuk logout
      console.error('Logout error:', error);
    }
  },

  // Get user profile - DIPERBAIKI
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

  // PERBAIKAN: Tambahkan method untuk update profile
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

  // PERBAIKAN: Tambahkan method untuk change password
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