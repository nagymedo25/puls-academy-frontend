// src/services/messageService.js
import api from './api';

const MessageService = {
  // --- Admin Routes ---
  getConversations: () => {
    return api.get('/messages/admin/conversations');
  },
  deleteConversation: (studentId) => {
    return api.delete(`/messages/admin/conversations/${studentId}`);
  },

  // --- Common Routes ---
  sendMessage: (messageData) => {
    // messageData should be { receiver_id, message_content }
    return api.post('/messages', messageData);
  },
  getConversationWithUser: (userId) => {
    return api.get(`/messages/conversation/${userId}`);
  },
};

export default MessageService;