// src/services/authService.js

import api from './api';

const AuthService = {
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  refreshToken: () => {
    return api.post('/auth/refresh-token');
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  changePassword: (passwordData) => {
    return api.put('/auth/change-password', passwordData);
  },
  
  logout: () => {
    // We no longer need to remove items from localStorage.
    // The backend will handle invalidating the session.
    return api.post('/auth/logout');
  },
};

export default AuthService;