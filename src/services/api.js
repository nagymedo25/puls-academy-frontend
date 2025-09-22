// src/services/api.js
import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response, // إذا كان الرد ناجحًا، قم بتمريره كما هو
  (error) => {
    if (error.response && error.response.status === 401 && error.response.data.error.includes('الجلسة غير صالحة')) {
      alert("تم تسجيل الدخول من جهاز آخر. سيتم تسجيل خروجك الآن.");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;