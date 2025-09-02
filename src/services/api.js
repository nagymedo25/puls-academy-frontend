// src/services/api.js
import axios from 'axios';

// قم بتغيير هذا الرابط ليتناسب مع رابط الباك إند الفعلي عند النشر
const API_BASE_URL = 'http://localhost:5000/api'; // مثال لرابط محلي

const api = axios.create({
  baseURL: API_BASE_URL,
  // ✅ [Security Improvement & FIX]
  // هذا الخيار ضروري لإرسال الكوكيز الآمنة تلقائيًا مع كل طلب
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// لم نعد بحاجة إلى معترض الطلبات لإضافة التوكن يدويًا
// لأن المتصفح سيتعامل الآن مع إرسال الكوكي httpOnly تلقائيًا.

// يمكنك الاحتفاظ بمعترض الاستجابة للتعامل مع الأخطاء
// على سبيل المثال، إعادة التوجيه التلقائي لتسجيل الدخول إذا تم تلقي خطأ 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default api;