// src/pages/student/Dashboard/ChatPage.jsx
import React from 'react';
import ChatInterface from '../../../components/admin/ChatInterface';
import { useAuth } from '../../../context/AuthContext';
import '../../../components/admin/Chat.css'; // ✨ استيراد ملف التنسيقات الجديد

const ChatPage = () => {
  const { user: currentUser } = useAuth();

  // الأدمن دائمًا user_id = 1
  const adminUser = {
      user_id: 1,
      name: 'الدعم الفني'
  };

  if(!currentUser) {
      return <div className="loading-spinner"><p>يرجى تسجيل الدخول للوصول لهذه الصفحة.</p></div>;
  }

  return (
    <div className="student-chat-page">
        <ChatInterface 
            currentUser={currentUser} 
            otherUser={adminUser}
        />
    </div>
  );
};

export default ChatPage;