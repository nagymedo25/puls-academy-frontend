// src/pages/admin/MessageManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Grid, List, ListItem, ListItemText, ListItemAvatar,
    Avatar, Typography, Paper, CircularProgress, Alert, InputBase, 
    IconButton, ListItemButton // ✨ 1. Import ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatInterface from '../../components/admin/ChatInterface';
import MessageService from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import './MessageManagement.css';

const MessageManagementPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useAuth();

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await MessageService.getConversations();
            setConversations(response.data.conversations || []);
        } catch (err) {
            setError('فشل في تحميل المحادثات.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation({
            user_id: conversation.student_id,
            name: conversation.student_name,
        });
    };
    
    const filteredConversations = conversations.filter(conversation =>
        conversation.student_name && conversation.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Grid container component={Paper} className="chat-container">
            <Grid item xs={12} md={4} className="conversations-list-grid">
                <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                     <Typography variant="h6" gutterBottom>
                        المحادثات
                    </Typography>
                    <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1, direction: 'rtl' }}
                            placeholder="بحث عن طالب..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IconButton type="submit" sx={{ p: '10px' }}><SearchIcon /></IconButton>
                    </Paper>
                </Box>
                <List className="conversations-list">
                    {filteredConversations.map((conversation) => (
                        // ✨ 2. Use ListItemButton instead of ListItem button
                        <ListItem key={conversation.student_id} disablePadding>
                            <ListItemButton
                                onClick={() => handleSelectConversation(conversation)}
                                selected={selectedConversation?.user_id === conversation.student_id}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {conversation.student_name ? conversation.student_name.charAt(0).toUpperCase() : '?'}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography noWrap>{conversation.student_name || 'طالب محذوف'}</Typography>}
                                    secondary={<Typography noWrap color={conversation.unread_count > 0 ? 'primary' : 'textSecondary'}>{conversation.last_message || 'لا توجد رسائل'}</Typography>}
                                />
                                {conversation.unread_count > 0 && (
                                    <Box className="unread-badge">
                                        {conversation.unread_count}
                                    </Box>
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
            <Grid item xs={12} md={8} className="chat-interface-grid">
                {selectedConversation ? (
                    <ChatInterface
                        currentUser={currentUser}
                        otherUser={selectedConversation}
                        onMessageSent={fetchConversations}
                    />
                ) : (
                    <Box className="no-chat-selected">
                        <Typography variant="h6">الرجاء تحديد محادثة لعرض الرسائل</Typography>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default MessageManagementPage;