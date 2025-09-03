// src/services/api.js
import axios from 'axios';

// قم بتغيير هذا الرابط ليتناسب مع رابط الباك إند الفعلي عند النشر
const API_BASE_URL = 'http://localhost:5000/api'; // مثال لرابط محلي

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// تم حذف معترض الاستجابة الذي كان يسبب التحويل التلقائي
// المكونات الخاصة بالمسارات (PrivateRoute) هي المسؤولة الآن عن الحماية

export default api;