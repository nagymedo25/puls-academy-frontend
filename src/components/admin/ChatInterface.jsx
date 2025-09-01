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
    }, [otherUser.user_id]);

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
            setMessages([...messages, { ...response.data.message, sender_name: 'Admin' }]);
            setNewMessage('');
            if (onMessageSent) onMessageSent();
        } catch (err) {
            setError('فشل في إرسال الرسالة.');
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper className="chat-header">
                <Typography variant="h6">{otherUser.name}</Typography>
            </Paper>
            <Box className="chat-messages-area">
                {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
                    messages.map(msg => (
                        <Box key={msg.message_id} className={`message-bubble ${msg.sender_id === currentUser.userId ? 'sent' : 'received'}`}>
                           <Typography variant="body2" sx={{fontWeight:'bold', mb:0.5}}>{msg.sender_name}</Typography>
                           {msg.message_content}
                           {/* ✨ FIX: Append 'Z' to treat the timestamp as UTC before formatting */}
                           <Typography variant="caption" className="message-timestamp">
                               {new Date(msg.created_at + 'Z').toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' })}
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
                />
                <IconButton type="submit" color="primary"><SendIcon /></IconButton>
            </Paper>
        </Box>
    );
};

export default ChatInterface;
