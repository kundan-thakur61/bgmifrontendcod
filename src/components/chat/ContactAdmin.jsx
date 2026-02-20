'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { startConversation, getConversationMessages, sendDirectMessage, markConversationAsRead, getAdmins, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

/**
 * ContactAdmin – replaces the seller DM in Popularity listings.
 * Users can only message platform admins (not other users).
 */
export default function ContactAdmin({ listingId, listingTitle }) {
    const { user } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingAdmins, setLoadingAdmins] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [sending, setSending] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch admins on mount
    useEffect(() => {
        if (user) {
            fetchAdmins();
        }
    }, [user]);

    // Connect socket and init conversation when chat opens
    useEffect(() => {
        if (showChat && selectedAdmin && user) {
            initConversation(selectedAdmin._id);
            connectSocket();
        }
        return () => {
            if (socket) socket.disconnect();
        };
    }, [showChat, selectedAdmin]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Re-join socket room when conversation is ready
    useEffect(() => {
        if (socket && conversation?._id && socket.connected) {
            socket.emit('join_dm', conversation._id);
        }
    }, [socket, conversation?._id]);

    const fetchAdmins = async () => {
        try {
            setLoadingAdmins(true);
            const response = await getAdmins();
            if (response.success && response.data.length > 0) {
                setAdmins(response.data);
                setSelectedAdmin(response.data[0]); // default to first admin
            }
        } catch (err) {
            console.error('Failed to fetch admins:', err);
            setError('Unable to load support team.');
        } finally {
            setLoadingAdmins(false);
        }
    };

    const initConversation = async (adminId) => {
        try {
            setLoadingChat(true);
            setError(null);
            const response = await startConversation(adminId);
            if (response.success) {
                setConversation(response.data);
                if (response.data._id) {
                    const messagesRes = await getConversationMessages(response.data._id);
                    if (messagesRes.success) {
                        setMessages(messagesRes.data || []);
                    }
                    await markConversationAsRead(response.data._id);
                }
            }
        } catch (err) {
            setError('Failed to open chat. Please try again.');
            console.error('Failed to initialize conversation:', err);
        } finally {
            setLoadingChat(false);
        }
    };

    const connectSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socketInstance = io(SOCKET_URL, { auth: { token } });

        socketInstance.on('connect', () => {
            if (conversation?._id) {
                socketInstance.emit('join_dm', conversation._id);
            }
        });

        socketInstance.on('new_message', (message) => {
            if (
                message.conversation === conversation?._id ||
                message.conversation?._id === conversation?._id
            ) {
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            }
        });

        setSocket(socketInstance);
    };

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
        } catch (err) {
            console.error('Failed to send message:', err);
            setNewMessage(messageContent);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) =>
        new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    // Not logged in
    if (!user) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-400 text-sm">Login to contact support</p>
            </div>
        );
    }

    // Loading admins state
    if (loadingAdmins) {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-gray-400 text-sm">Loading support...</span>
            </div>
        );
    }

    // No admins available
    if (!loadingAdmins && admins.length === 0) {
        return (
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <p className="text-gray-400 text-sm">Support team is unavailable right now.</p>
                <p className="text-gray-500 text-xs mt-1">Please raise a support ticket instead.</p>
            </div>
        );
    }

    // Collapsed – show contact button
    if (!showChat) {
        return (
            <div className="space-y-3">
                {/* Info notice */}
                <div className="flex items-start gap-2 bg-blue-900/20 border border-blue-800/40 rounded-lg p-3">
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-blue-300">
                        Messages are monitored by our admin team to keep the platform safe and prevent fraud.
                    </p>
                </div>
                <button
                    onClick={() => setShowChat(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Contact Support
                </button>
                {/* Admin selector if multiple admins */}
                {admins.length > 1 && (
                    <select
                        value={selectedAdmin?._id || ''}
                        onChange={e => setSelectedAdmin(admins.find(a => a._id === e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                        {admins.map(admin => (
                            <option key={admin._id} value={admin._id}>
                                {admin.name} ({admin.role === 'super_admin' ? 'Super Admin' : 'Admin'})
                            </option>
                        ))}
                    </select>
                )}
            </div>
        );
    }

    // Expanded chat panel
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center overflow-hidden">
                            {selectedAdmin?.avatar ? (
                                <img src={selectedAdmin.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <svg className="w-5 h-5 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        {/* Admin badge */}
                        <span className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">A</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h3 className="font-semibold text-white text-sm">{selectedAdmin?.name || 'Support Team'}</h3>
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm9.358 6.78a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-xs text-purple-300">Platform Administrator</p>
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

            {/* Context Notice */}
            <div className="px-4 py-2 bg-purple-900/20 border-b border-gray-700">
                <p className="text-xs text-purple-300">
                    💬 Re: <span className="font-medium">{listingTitle || 'Popularity listing'}</span>
                </p>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
                {loadingChat ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                        <button
                            onClick={() => initConversation(selectedAdmin._id)}
                            className="mt-3 text-xs text-purple-400 hover:text-purple-300 underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-14 h-14 bg-purple-900/40 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <p className="text-gray-300 text-sm font-medium">Chat with our admin team</p>
                        <p className="text-xs text-gray-500 mt-1">Ask about {listingTitle || 'this listing'} or any concerns</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwn = message.sender?._id === user._id || message.sender === user._id;
                        const showDate =
                            index === 0 ||
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
                                            <p className="text-xs text-purple-400 mb-1 ml-1 flex items-center gap-1">
                                                {selectedAdmin?.name || 'Admin'}
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm9.358 6.78a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414l3-3z" clipRule="evenodd" />
                                                </svg>
                                            </p>
                                        )}
                                        <div className={`px-4 py-2 rounded-2xl ${isOwn
                                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-sm'
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
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type your message to the admin..."
                        maxLength={1000}
                        disabled={loadingChat || !!error}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending || loadingChat || !!error}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {sending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    🔒 Moderated by platform admins · Responses within 24 hrs
                </p>
            </form>
        </div>
    );
}
