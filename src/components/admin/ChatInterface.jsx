// src/components/admin/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import MessageService from '../../services/messageService';
import './Chat.css'; // ✨ استيراد ملف التنسيقات الجديد
import { formatTimestamp } from '../../utils/formatDate'; // ✨ 1. استيراد الدالة الجديدة


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
            
            setMessages(prevMessages => [...prevMessages, response.data.message]);
            setNewMessage('');
            if (onMessageSent) onMessageSent();
        } catch (err) {
            setError('فشل في إرسال الرسالة.');
        }
    };

    if (!currentUser || !otherUser) {
        return <div className="loading-spinner"><p>يرجى تحديد محادثة.</p></div>;
    }

    return (
        <div className="chat-window">
            <header className="chat-header">
                <h6>{otherUser.name}</h6>
            </header>
            
            <div className="messages-list">
                {loading ? (
                    <div className="loading-spinner">
                        {/* يمكنك إضافة أيقونة تحميل هنا */}
                        <p>جارٍ تحميل الرسائل...</p> 
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.message_id} className={`message-item ${msg.sender_id === currentUser.user_id ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                                <p className="message-sender-name">{msg.sender_name}</p>
                                <p className="message-text">{msg.message_content}</p>
                            </div>
                            <span className="message-timestamp">
                               {formatTimestamp(msg.created_at)}
                            </span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                    type="text"
                    placeholder="اكتب رسالتك..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                />
                <button type="submit" disabled={!newMessage.trim()}>
                    <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;