import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Get user profile
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.success) {
      const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
      const updatedUser = { ...currentUser, ...response.data.data.user };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
    return response.data;
  },

  // Change password
  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout user
  logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
}; 