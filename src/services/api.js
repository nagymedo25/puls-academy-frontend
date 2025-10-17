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

// Add request interceptor to log outgoing requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 [API REQUEST]', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      headers: config.headers
    });

    // Log cookies for debugging
    if (document.cookie) {
      console.log('🍪 [API REQUEST] Cookies:', document.cookie);
    } else {
      console.log('⚠️ [API REQUEST] No cookies found');
    }

    return config;
  },
  (error) => {
    console.error('❌ [API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// ✨ --- START: Interceptor Update --- ✨
// This interceptor will now pass the specific error message from the backend.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Create a custom event with the detailed error message from the API response.
      const sessionExpiredEvent = new CustomEvent('session-expired', {
        detail: { 
          message: error.response.data?.error || 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.' 
        }
      });
      window.dispatchEvent(sessionExpiredEvent);
    }
    return Promise.reject(error);
  }
);
// ✨ --- END: Interceptor Update --- ✨

export default api;