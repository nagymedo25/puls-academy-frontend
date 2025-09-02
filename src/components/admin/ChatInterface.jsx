// src/components/admin/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageService from '../../services/messageService';

const ChatInterface = ({ currentUser, otherUser, onMessageSent }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        if (!otherUser?.user_id) return;
        setLoading(true);
        try {
            const response = await MessageService.getConversationWithUser(otherUser.user_id);
            setMessages(response.data.conversation || []);
        } catch (err) {
            setError('فشل في تحميل الرسائل.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchMessages();
    }, [otherUser?.user_id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                receiver_id: otherUser.user_id,
                message_content: newMessage,
            };
            const response = await MessageService.sendMessage(messageData);
            
            // ✨ --- START: التعديل الرئيسي هنا --- ✨
            // الآن نستخدم كائن الرسالة الكامل العائد من الخادم مباشرة
            setMessages(prevMessages => [...prevMessages, response.data.message]);
            // ✨ --- END: نهاية التعديل --- ✨

            setNewMessage('');
            if (onMessageSent) onMessageSent();
        } catch (err) {
            setError('فشل في إرسال الرسالة.');
        }
    };

    if (!currentUser || !otherUser) {
        return <Typography sx={{ p: 2, textAlign: 'center' }}>يرجى تحديد محادثة.</Typography>;
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper className="chat-header">
                <Typography variant="h6">{otherUser.name}</Typography>
            </Paper>
            <Box className="chat-messages-area">
                {loading ? <CircularProgress sx={{ display: 'block', margin: 'auto' }} /> : error ? <Alert severity="error">{error}</Alert> : (
                    messages.map(msg => (
                        <Box key={msg.message_id} className={`message-bubble ${msg.sender_id === currentUser.user_id ? 'sent' : 'received'}`}>
                           <Typography variant="body2" sx={{fontWeight:'bold', mb:0.5}}>{msg.sender_name}</Typography>
                           {msg.message_content}
                           <Typography variant="caption" className="message-timestamp">
                               {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                           </Typography>
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>
            <Paper component="form" onSubmit={handleSendMessage} className="chat-input-area">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="اكتب رسالتك..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                />
                <IconButton type="submit" color="primary" disabled={!newMessage.trim()}><SendIcon /></IconButton>
            </Paper>
        </Box>
    );
};

export default ChatInterface;