// src/services/adminService.js
import api from "./api";

const AdminService = {
  // --- Dashboard ---
  getDashboardStats: () => api.get("/admin/dashboard"),

  // --- Payments ---
  getPendingPayments: () => api.get("/payments/pending"),
  approvePayment: (paymentId) => api.put(`/payments/${paymentId}/approve`),
  rejectPayment: (paymentId) => api.put(`/payments/${paymentId}/reject`),

  // --- Courses & Lessons ---
  getAllCourses: () => api.get("/admin/courses"),
  createCourse: (courseData) => api.post("/courses", courseData),
  updateCourse: (courseId, courseData) => api.put(`/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
  getLessonsForCourse: (courseId) => api.get(`/courses/${courseId}/lessons-admin`),
  addLessonToCourse: (courseId, lessonData) => api.post(`/courses/${courseId}/lessons`, lessonData),
  deleteLesson: (lessonId) => api.delete(`/courses/lessons/${lessonId}`),
  
  // --- Students (Users) ---
  getAllUsers: (params) => api.get("/admin/users", { params }),
  searchUsers: (query) => api.get("/admin/users/search", { params: { q: query } }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // --- Revenue ---
  getRevenueReport: () => api.get("/admin/revenue/report"),
  getApprovedPayments: () => api.get("/admin/payments/approved"),
  resetRevenue: () => api.delete("/admin/revenue/reset"),
  
  // === START: دوال جديدة لنظام الحماية ===
  
  // جلب طلبات الأجهزة الجديدة
  getDeviceRequests: () => {
    return api.get("/admin/device-requests");
  },

  // الموافقة على طلب جهاز
  approveDeviceRequest: (requestId) => {
    return api.put(`/admin/device-requests/${requestId}/approve`);
  },

  // رفض طلب جهاز
  rejectDeviceRequest: (requestId) => {
    return api.put(`/admin/device-requests/${requestId}/reject`);
  },

  // جلب الطلاب المخالفين
  getViolators: () => {
    return api.get("/admin/violations");
  },

  // تعليق حساب مستخدم
  suspendUser: (userId) => {
    return api.put(`/admin/users/${userId}/suspend`);
  },

  // إعادة تفعيل حساب مستخدم
  reactivateUser: (userId) => {
    return api.put(`/admin/users/${userId}/reactivate`);
  },
  
};

export default AdminService;