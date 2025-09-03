// src/pages/admin/MessageManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // أيقونة للعودة في وضع الموبايل
import ChatInterface from '../../components/admin/ChatInterface';
import MessageService from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import '../../components/admin/Chat.css'; // ✨ استخدام نفس ملف التنسيقات الموحد

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

    if (loading) return <div className="loading-spinner"><p>جارٍ تحميل المحادثات...</p></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        // ✨ أضفنا كلاس للتحكم في العرض على الموبايل
        <div className={`admin-chat-container ${selectedConversation ? 'chat-view-active' : ''}`}>
            {/* Conversations Sidebar */}
            <aside className="chat-sidebar">
                <div className="sidebar-header">
                    <h3>المحادثات</h3>
                    <form className="search-form">
                        <input
                            type="text"
                            placeholder="بحث عن طالب..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" onClick={(e) => e.preventDefault()}><SearchIcon /></button>
                    </form>
                </div>
                <ul className="conversations-list">
                    {filteredConversations.map((conversation) => (
                        <li 
                            key={conversation.student_id} 
                            className={`conversation-item ${selectedConversation?.user_id === conversation.student_id ? 'active' : ''}`}
                            onClick={() => handleSelectConversation(conversation)}
                        >
                            <div className="avatar-initials">
                                {conversation.student_name ? conversation.student_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="conversation-details">
                                <p className="conversation-name">{conversation.student_name || 'طالب محذوف'}</p>
                                <p className={`conversation-preview ${conversation.unread_count > 0 ? 'unread' : ''}`}>
                                    {conversation.last_message || 'لا توجد رسائل'}
                                </p>
                            </div>
                            {conversation.unread_count > 0 && (
                                <span className="unread-badge">
                                    {conversation.unread_count}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Chat Window */}
            <main className="chat-window-wrapper">
                {selectedConversation ? (
                    <>
                        {/* زر العودة (يظهر فقط في الموبايل) */}
                        <div className="chat-header-mobile-back">
                            <button onClick={() => setSelectedConversation(null)}>
                                <ArrowBackIcon />
                                <span>عودة</span>
                            </button>
                        </div>
                        <ChatInterface
                            currentUser={currentUser}
                            otherUser={selectedConversation}
                            onMessageSent={fetchConversations}
                        />
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>الرجاء تحديد محادثة لعرض الرسائل</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MessageManagementPage;