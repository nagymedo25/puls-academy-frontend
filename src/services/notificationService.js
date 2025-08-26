// src/services/notificationService.js
import api from './api';

const NotificationService = {
  // جلب إشعارات المستخدم
  getNotifications: () => {
    return api.get('/notifications');
  },

  // جلب عدد الإشعارات غير المقروءة
  getUnreadCount: () => {
    return api.get('/notifications/unread-count');
  },

  // تحديد إشعار كمقروء
  markAsRead: (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
  },

  // تحديد كل الإشعارات كمقروءة
  markAllAsRead: () => {
    return api.put('/notifications/mark-all-read');
  },
    
  // حذف إشعار
  deleteNotification: (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
  },
};

export default NotificationService;