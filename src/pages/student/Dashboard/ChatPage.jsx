// src/pages/student/Dashboard/ChatPage.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ChatInterface from '../../../components/admin/ChatInterface'; // إعادة استخدام نفس المكون
import { useAuth } from '../../../context/AuthContext'; // ✨ 1. استيراد useAuth
import './ChatPage.css';

const ChatPage = () => {
  // ✨ 2. استخدام useAuth لجلب بيانات المستخدم الحالي بشكل آمن
  const { user: currentUser } = useAuth();

  // الأدمن دائمًا user_id = 1
  const adminUser = {
      user_id: 1,
      name: 'الدعم الفني'
  };

  // ✨ 3. التحقق من وجود المستخدم قبل عرض أي شيء
  if(!currentUser) {
      return <Typography sx={{ p: 3, textAlign: 'center' }}>يرجى تسجيل الدخول للوصول لهذه الصفحة.</Typography>;
  }

  return (
    <Box className="student-chat-container">
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 3 }}>
            الدعم الفني
        </Typography>
        <Box className="chat-wrapper">
             <ChatInterface 
                // ✨ 4. تمرير بيانات المستخدم الصحيحة
                currentUser={currentUser} 
                otherUser={adminUser}
            />
        </Box>
    </Box>
  );
};

export default ChatPage;