// src/services/courseService.js
import api from './api';

const CourseService = {
  // جلب كل الكورسات مع إمكانية الفلترة
  getAllCourses: (params) => {
    return api.get('/courses', { params }); // e.g., { category: 'pharmacy' }
  },

  // البحث عن كورس
  searchCourses: (query) => {
    return api.get('/courses/search', { params: { q: query } });
  },

  // جلب تفاصيل كورس معين
  getCourseById: (courseId) => {
    return api.get(`/courses/${courseId}`);
  },

  // جلب الدرس التجريبي لكورس
  getCoursePreview: (courseId) => {
    return api.get(`/courses/${courseId}/preview`);
  },

  // جلب الكورسات المتاحة للمستخدم المسجل
  getAvailableCourses: () => {
    return api.get('/courses/available');
  },

  // جلب دروس كورس معين (للمستخدم المشترك)
  getCourseLessons: (courseId) => {
    return api.get(`/courses/${courseId}/lessons`);
  },
    
  // جلب درس معين من كورس
  getLesson: (courseId, lessonId) => {
    return api.get(`/courses/${courseId}/lessons/${lessonId}`);
  },
};

export default CourseService;