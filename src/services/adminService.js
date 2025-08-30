// src/services/adminService.js
import api from "./api";

const AdminService = {
  // --- Dashboard ---
  getDashboardStats: () => {
    return api.get("/admin/dashboard");
  },

  // --- Payments ---
  getPendingPayments: () => {
    return api.get("/payments/pending");
  },
  approvePayment: (paymentId) => {
    return api.put(`/payments/${paymentId}/approve`);
  },
  rejectPayment: (paymentId) => {
    return api.put(`/payments/${paymentId}/reject`);
  },

  // --- Courses ---
  getAllCourses: () => {
    return api.get("/admin/courses");
  },
  createCourse: (courseData) => {
    // courseData should be an object with course details
    return api.post("/courses", courseData);
  },
  updateCourse: (courseId, courseData) => {
    return api.put(`/courses/${courseId}`, courseData);
  },
  deleteCourse: (courseId) => {
    return api.delete(`/courses/${courseId}`);
  },

  // --- Lessons ---
  getLessonsForCourse: (courseId) => {
    return api.get(`/courses/${courseId}/lessons-admin`);
  },
  addLessonToCourse: (courseId, lessonData) => {
    return api.post(`/courses/${courseId}/lessons`, lessonData);
  },
  deleteLesson: (lessonId) => {
    return api.delete(`/courses/lessons/${lessonId}`);
  },

  // --- Students (Users) ---
  getAllUsers: (params) => {
    return api.get("/admin/users", { params });
  },
  searchUsers: (query) => {
    return api.get("/admin/users/search", { params: { q: query } });
  },
  getUserDetails: (userId) => {
    return api.get(`/admin/users/${userId}`);
  },
};

export default AdminService;
