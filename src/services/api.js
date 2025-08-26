// src/services/api.js
import axios from 'axios';

// قم بتغيير هذا الرابط ليتناسب مع رابط الباك إند الفعلي عند النشر
const API_BASE_URL = 'http://localhost:5000/api'; // مثال لرابط محلي

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor لإرفاق التوكن مع كل طلب تلقائيًا
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;