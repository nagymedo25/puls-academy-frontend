// src/pages/student/Dashboard/ChatPage.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ChatInterface from '../../../components/admin/ChatInterface'; // إعادة استخدام نفس المكون
import AuthService from '../../../services/authService';
import './ChatPage.css';

const ChatPage = () => {
  // نحتاج إلى بيانات المستخدم الحالي لتمريرها
  const getUserPayload = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const currentUser = getUserPayload();

  // الأدمن دائمًا user_id = 1
  const adminUser = {
      user_id: 1,
      name: 'الدعم الفني'
  };

  if(!currentUser) {
      return <Typography>يرجى تسجيل الدخول للوصول لهذه الصفحة.</Typography>
  }

  return (
    <Box className="student-chat-container">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 3 }}>
            الدعم الفني
        </Typography>
        <Box className="chat-wrapper">
             <ChatInterface 
                currentUser={currentUser}
                otherUser={adminUser}
            />
        </Box>
    </Box>
  );
};

export default ChatPage;