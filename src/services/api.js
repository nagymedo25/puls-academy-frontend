import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✨ --- START: تحديث الـ Interceptor --- ✨
// هذا الجزء سيعترض الردود من الخادم
api.interceptors.response.use(
  (response) => response, // إذا كان الرد ناجحًا، قم بتمريره كما هو
  (error) => {
    // إذا كان الخطأ بسبب انتهاء الجلسة أو توكن غير صالح
    if (error.response && error.response.status === 401) {
      // نقوم بإطلاق حدث مخصص يمكن لأي جزء في التطبيق الاستماع إليه.
      // هذا أفضل من إعادة التوجيه القسرية أو استخدام alert مباشرة من هنا.
      window.dispatchEvent(new Event('session-expired'));
    }
    // قم بتمرير الخطأ لباقي أجزاء التطبيق للتعامل معه
    return Promise.reject(error);
  }
);
// ✨ --- END: تحديث الـ Interceptor --- ✨

export default api;
