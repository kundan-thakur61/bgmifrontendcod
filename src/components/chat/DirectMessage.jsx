'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { startConversation, getConversationMessages, sendDirectMessage, markConversationAsRead, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

export default function DirectMessage({ sellerId, sellerName, sellerAvatar, listingId, listingTitle }) {
    const { user } = useAuth();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (showChat && user && sellerId) {
            initConversation();
            connectSocket();
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [showChat, user, sellerId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initConversation = async () => {
        try {
            setLoading(true);
            const response = await startConversation(sellerId);
            if (response.success) {
                setConversation(response.data);
                // Fetch existing messages
                if (response.data._id) {
                    const messagesRes = await getConversationMessages(response.data._id);
                    if (messagesRes.success) {
                        setMessages(messagesRes.data || []);
                    }
                    // Mark as read
                    await markConversationAsRead(response.data._id);
                }
            }
        } catch (err) {
            console.error('Failed to initialize conversation:', err);
        } finally {
            setLoading(false);
        }
    };

    const connectSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socketInstance = io(SOCKET_URL, {
            auth: { token }
        });

        socketInstance.on('connect', () => {
            if (conversation?._id) {
                socketInstance.emit('join_dm', conversation._id);
            }
        });

        socketInstance.on('new_message', (message) => {
            if (message.conversation === conversation?._id || message.conversation?._id === conversation?._id) {
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) {
                        return prev;
                    }
                    return [...prev, message];
                });
            }
        });

        setSocket(socketInstance);
    };

    // Re-join socket room when conversation is set
    useEffect(() => {
        if (socket && conversation?._id && socket.connected) {
            socket.emit('join_dm', conversation._id);
        }
    }, [socket, conversation?._id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !conversation?._id) return;

        const messageContent = newMessage.trim();
        setNewMessage('');
        setSending(true);

        try {
            await sendDirectMessage(conversation._id, messageContent);
            // Message will be added via socket
        } catch (err) {
            console.error('Failed to send message:', err);
            setNewMessage(messageContent); // Restore message on error
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-center">Login to chat with seller</p>
            </div>
        );
    }

    if (user._id === sellerId) {
        return null; // Don't show chat for own listings
    }

    // Chat toggle button
    if (!showChat) {
        return (
            <button
                onClick={() => setShowChat(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-semibold transition-all"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat with Seller
            </button>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                        {sellerAvatar ? (
                            <img src={sellerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <span className="text-lg font-semibold">{sellerName?.charAt(0)?.toUpperCase()}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{sellerName}</h3>
                        <p className="text-xs text-gray-400">Replies typically within 1 hour</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 mb-1">Start a conversation</p>
                        <p className="text-xs text-gray-500">Ask about {listingTitle || 'this listing'}</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwn = message.sender?._id === user._id || message.sender === user._id;
                        const showDate = index === 0 || 
                            formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);
                        
                        return (
                            <div key={message._id || index}>
                                {showDate && (
                                    <div className="flex items-center justify-center my-3">
                                        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                                            {formatDate(message.createdAt)}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] ${isOwn ? 'order-2' : ''}`}>
                                        {!isOwn && (
                                            <p className="text-xs text-gray-400 mb-1 ml-1">{sellerName}</p>
                                        )}
                                        <div className={`px-4 py-2 rounded-2xl ${
                                            isOwn
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                                                : 'bg-gray-700 text-white rounded-bl-sm'
                                        }`}>
                                            <p className="text-sm break-words">{message.content}</p>
                                        </div>
                                        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                                            {formatTime(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-700 bg-gray-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        maxLength={1000}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {sending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}