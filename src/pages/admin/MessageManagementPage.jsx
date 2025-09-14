// src/pages/admin/MessageManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // أيقونة للعودة في وضع الموبايل
import DeleteIcon from '@mui/icons-material/Delete'; // ✨ 1. استيراد أيقونة الحذف
import ChatInterface from '../../components/admin/ChatInterface';
import MessageService from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../../components/common/ConfirmationModal'; // ✨ 2. استيراد نافذة التأكيد
import '../../components/admin/Chat.css'; 

const MessageManagementPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useAuth();
    
    // ✨ 3. حالات جديدة لنافذة الحذف
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);


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

    // ✨ 4. دوال جديدة للتعامل مع الحذف
    const handleDeleteRequest = (e, conversation) => {
        e.stopPropagation(); // منع فتح المحادثة عند الضغط على زر الحذف
        setConversationToDelete(conversation);
        setConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!conversationToDelete) return;
        setDeleteLoading(true);
        try {
            await MessageService.deleteConversation(conversationToDelete.student_id);
            // إذا كانت المحادثة المحذوفة هي المفتوحة حالياً، قم بإغلاقها
            if (selectedConversation?.user_id === conversationToDelete.student_id) {
                setSelectedConversation(null);
            }
            fetchConversations(); // إعادة تحميل المحادثات
        } catch (err) {
            setError('فشل في حذف المحادثة.');
        } finally {
            setDeleteLoading(false);
            setConfirmModalOpen(false);
            setConversationToDelete(null);
        }
    };
    
    const filteredConversations = conversations.filter(conversation =>
        conversation.student_name && conversation.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-spinner"><p>جارٍ تحميل المحادثات...</p></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
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
                            {/* ✨ 5. إضافة زر الحذف */}
                            <div className="conversation-actions">
                                {conversation.unread_count > 0 && (
                                    <span className="unread-badge">
                                        {conversation.unread_count}
                                    </span>
                                )}
                                <button className="delete-conversation-btn" onClick={(e) => handleDeleteRequest(e, conversation)}>
                                    <DeleteIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Chat Window */}
            <main className="chat-window-wrapper">
                {selectedConversation ? (
                    <>
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

            {/* ✨ 6. إضافة نافذة تأكيد الحذف */}
            <ConfirmationModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="تأكيد حذف المحادثة"
                message={`هل أنت متأكد من رغبتك في حذف المحادثة مع "${conversationToDelete?.student_name}"؟ سيتم حذف جميع الرسائل للطرفين بشكل نهائي.`}
                loading={deleteLoading}
            />
        </div>
    );
};

export default MessageManagementPage;