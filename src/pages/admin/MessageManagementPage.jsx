// src/pages/admin/MessageManagementPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Paper, List, ListItemButton,
  ListItemAvatar, Avatar, ListItemText, Badge, IconButton, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageService from '../../services/messageService';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ChatInterface from '../../components/admin/ChatInterface'; // سيتم إنشاؤه لاحقًا
import './MessageManagement.css';

const MessageManagementPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await MessageService.getConversations();
      setConversations(response.data.conversations || []);
    } catch (err) {
      setError('فشل في جلب المحادثات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // تحديث الحالة محليًا لتعكس أن الرسائل قد قُرئت
    const updatedConversations = conversations.map(c =>
        c.user_id === conversation.user_id ? { ...c, unread_count: 0 } : c
    );
    setConversations(updatedConversations);
  };

  const handleDeleteRequest = (e, studentId) => {
    e.stopPropagation(); // منع فتح المحادثة عند الضغط على الحذف
    setConversationToDelete(studentId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;
    try {
      await MessageService.deleteConversation(conversationToDelete);
      fetchConversations(); // إعادة تحميل المحادثات
      if(selectedConversation?.user_id === conversationToDelete) {
        setSelectedConversation(null); // إغلاق المحادثة المحذوفة
      }
    } catch (err) {
      setError('فشل في حذف المحادثة.');
    } finally {
      setConfirmOpen(false);
      setConversationToDelete(null);
    }
  };
  
  const handleMessageSent = () => {
      // إعادة تحميل المحادثات لتحديث "آخر رسالة"
      fetchConversations();
  };


  return (
    <Box className="chat-container">
      <Grid container spacing={0}>
        <Grid item xs={12} md={4} className="conversation-list-panel">
          <Typography variant="h5" className="panel-header">المحادثات</Typography>
          {loading ? <CircularProgress sx={{ display: 'block', margin: 'auto' }} /> : error ? <Alert severity="error">{error}</Alert> : (
            <List sx={{ p: 0 }}>
              {conversations.length > 0 ? conversations.map(conv => (
                <ListItemButton
                  key={conv.user_id}
                  onClick={() => handleSelectConversation(conv)}
                  selected={selectedConversation?.user_id === conv.user_id}
                  className="conversation-item"
                >
                  <ListItemAvatar>
                    <Badge color="error" badgeContent={conv.unread_count} max={9}>
                      <Avatar>{conv.name.charAt(0)}</Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conv.name}
                    secondary={conv.last_message || "لا توجد رسائل بعد"}
                    secondaryTypographyProps={{ noWrap: true, component: 'span' }}
                  />
                   <IconButton edge="end" onClick={(e) => handleDeleteRequest(e, conv.user_id)}>
                        <DeleteIcon color="error" />
                   </IconButton>
                </ListItemButton>
              )) : <Typography sx={{p:2, textAlign:'center'}}>لا توجد محادثات لعرضها.</Typography>}
            </List>
          )}
        </Grid>
        <Grid item xs={12} md={8} className="chat-interface-panel">
            {selectedConversation ? (
                <ChatInterface 
                    key={selectedConversation.user_id} // لإعادة تحميل المكون عند تغيير المحادثة
                    currentUser={{ userId: 1, role: 'admin' }} // الأدمن دائمًا 1
                    otherUser={selectedConversation}
                    onMessageSent={handleMessageSent}
                />
            ) : (
                <Box className="no-chat-selected">
                    <Typography variant="h6">اختر محادثة</Typography>
                    <Typography color="text.secondary">اختر محادثة من القائمة لبدء المراسلة.</Typography>
                </Box>
            )}
        </Grid>
      </Grid>
       <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="تأكيد حذف المحادثة"
        message="هل أنت متأكد من رغبتك في حذف هذه المحادثة بالكامل؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </Box>
  );
};

export default MessageManagementPage;