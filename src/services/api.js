// src/services/api.js
import axios from 'axios';

// قم بتغيير هذا الرابط ليتناسب مع رابط الباك إند الفعلي عند النشر
const API_BASE_URL = 'http://localhost:5000/api'; // مثال لرابط محلي

const api = axios.create({
  baseURL: API_BASE_URL,
  // ✅ [Security Improvement]
  // This option is crucial for sending secure, httpOnly cookies automatically with every request.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We no longer need the request interceptor to manually add the token,
// as the browser will now handle sending the httpOnly cookie automatically.

// You can still keep an interceptor for handling responses, for example,
// to automatically redirect to login if a 401 Unauthorized error is received.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If the server responds with 401, it means the session is invalid or expired.
    // Redirect the user to the login page.
    if (error.response && error.response.status === 401) {
      // Avoid redirect loops if the error is on the login page itself
      if (window.location.pathname !== '/login') {
        window.location = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default api;
