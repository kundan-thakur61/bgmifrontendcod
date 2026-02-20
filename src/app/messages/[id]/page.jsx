'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  getConversationMessages, 
  sendDirectMessage, 
  markConversationAsRead,
  startConversation,
  SOCKET_URL 
} from '@/lib/api';
import { io } from 'socket.io-client';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    // The ID from URL could be a conversation ID or a user ID
    initConversation();
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [params.id, user, authLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initConversation = async () => {
    try {
      setLoading(true);
      
      // Try to fetch messages directly (if it's a conversation ID)
      // If that fails, try to start a conversation (if it's a user ID)
      let conversationData = null;
      let messagesData = null;
      
      // First, try to get messages (assuming it's a conversation ID)
      try {
        const messagesRes = await getConversationMessages(params.id);
        if (messagesRes.success) {
          messagesData = messagesRes.data || [];
          setConversationId(params.id);
          setMessages(messagesData);
          // Mark as read
          await markConversationAsRead(params.id);
        }
      } catch (err) {
        // Not a conversation ID, try as user ID
        console.log('Not a conversation ID, trying as user ID...');
      }
      
      // If no messages, try starting a conversation (user ID case)
      if (!messagesData) {
        try {
          const convRes = await startConversation(params.id);
          if (convRes.success) {
            conversationData = convRes.data;
            setConversationId(conversationData._id);
            setOtherUser(conversationData.otherParticipant);
            setMessages([]);
          }
        } catch (err) {
          console.error('Failed to start conversation:', err);
          setError('Failed to load conversation');
        }
      } else {
        // Extract other user from messages
        const uniqueSenders = [...new Set(messagesData.map(m => m.sender?._id || m.sender))];
        const otherSenderId = uniqueSenders.find(id => id !== user._id);
        if (otherSenderId && messagesData.length > 0) {
          const otherMessage = messagesData.find(m => 
            (m.sender?._id || m.sender) === otherSenderId
          );
          if (otherMessage?.sender) {
            setOtherUser(otherMessage.sender);
          }
        }
      }
    } catch (err) {
      console.error('Error initializing conversation:', err);
      setError('Failed to load conversation');
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
      if (conversationId) {
        socketInstance.emit('join_dm', conversationId);
      }
    });

    socketInstance.on('new_message', (message) => {
      const msgConvId = message.conversation?._id || message.conversation;
      if (msgConvId === conversationId) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
        
        // Mark as read
        markConversationAsRead(conversationId);
      }
    });

    setSocket(socketInstance);
  };

  // Re-join socket room when conversation is set
  useEffect(() => {
    if (socket && conversationId && socket.connected) {
      socket.emit('join_dm', conversationId);
    }
  }, [socket, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !conversationId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      await sendDirectMessage(conversationId, messageContent);
      // Message will be added via socket
    } catch (err) {
      console.error('Failed to send message:', err);
      setNewMessage(messageContent); // Restore message on error
      setError('Failed to send message');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/messages" className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            {/* Other user info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                {otherUser?.avatar ? (
                  <img src={otherUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold">
                    {otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-semibold">{otherUser?.name || 'Chat'}</h1>
                <p className="text-xs text-gray-400">
                  {otherUser?.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Options */}
            <button className="text-gray-400 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-1">No messages yet</p>
              <p className="text-sm text-gray-500">Say hello to start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => {
                const isOwn = message.sender?._id === user._id || message.sender === user._id;
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);
                
                return (
                  <div key={message._id || index}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] md:max-w-[60%]`}>
                        {!isOwn && (
                          <div className="flex items-center gap-2 mb-1 ml-1">
                            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                              {otherUser?.avatar ? (
                                <img src={otherUser.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <span className="text-xs font-semibold">
                                  {otherUser?.name?.charAt(0)?.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-400">{otherUser?.name}</span>
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          isOwn
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm'
                            : 'bg-gray-700 text-white rounded-bl-sm'
                        }`}>
                          <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                          {formatTime(message.createdAt)}
                          {isOwn && message.readBy?.length > 0 && (
                            <span className="ml-1 text-purple-400">✓✓</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder-gray-400 resize-none max-h-32"
                style={{ minHeight: '44px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
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
    </div>
  );
}