// src/services/paymentService.js
import api from './api';

const PaymentService = {
  // إنشاء طلب دفع جديد
  createPayment: (paymentData) => {
    // paymentData يجب أن يكون FormData لإرسال الصورة
    return api.post('/payments', paymentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // جلب دفعات المستخدم الحالي
  getMyPayments: () => {
    return api.get('/payments/my-payments');
  },
};

export default PaymentService;