// src/services/api.js
import axios from 'axios';

// قم بتغيير هذا الرابط ليتناسب مع رابط الباك إند الفعلي عند النشر
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  // ✅ [Security Improvement]
  // This option is crucial for sending secure, httpOnly cookies automatically with every request.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
