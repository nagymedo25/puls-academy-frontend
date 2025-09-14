// src/services/api.js
import axios from 'axios';

// The new base URL points to the proxy path on the SAME domain
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;