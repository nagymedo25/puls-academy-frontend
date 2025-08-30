// src/pages/student/Dashboard/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemIcon, ListItemText, Divider, Button } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import NotificationService from '../../../services/notificationService';
import './Notifications.css'; // استيراد ملف التنسيق

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getNotifications();
      setNotifications(response.data.notifications || []);
    } catch (err) {
      setError('فشل في جلب الإشعارات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
        await NotificationService.markAllAsRead();
        // Optimistically update UI
        const updatedNotifications = notifications.map(n => ({...n, is_read: 1}));
        setNotifications(updatedNotifications);
    } catch (err) {
        setError('فشل في تحديث الإشعارات.');
    }
  };
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Box className="notifications-page-container">
      <Box className="notifications-header">
        <Typography variant="h4" component="h1" fontWeight={800}>الإشعارات</Typography>
        {unreadCount > 0 && (
          <Button variant="contained" startIcon={<MarkEmailReadIcon />} onClick={handleMarkAllAsRead}>
            تعليم الكل كمقروء ({unreadCount})
          </Button>
        )}
      </Box>

      <Paper className="notifications-paper">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <React.Fragment key={notif.notification_id}>
                  <ListItem className={`notification-item ${!notif.is_read ? 'unread' : ''}`}>
                    <ListItemIcon>
                      <div className="notification-icon-wrapper">
                        <NotificationImportantIcon />
                      </div>
                    </ListItemIcon>
                    <ListItemText
                      primary={notif.message}
                      secondary={new Date(notif.created_at).toLocaleString('ar-EG')}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">لا توجد لديك إشعارات حاليًا.</Typography>
              </Box>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default NotificationsPage;
