'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getConversations, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    fetchConversations();
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, authLoading]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      if (response.success) {
        setConversations(response.data || []);
        // Calculate total unread
        const unread = (response.data || []).reduce(
          (total, conv) => total + (conv.unreadCount || 0),
          0
        );
        setTotalUnread(unread);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
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
      // Join all conversation rooms
      conversations.forEach(conv => {
        if (conv._id) {
          socketInstance.emit('join_dm', conv._id);
        }
      });
    });

    // Listen for new messages to update conversation list
    socketInstance.on('new_message', (message) => {
      setConversations(prev => {
        const convIndex = prev.findIndex(
          c => c._id === message.conversation || c._id === message.conversation?._id
        );

        if (convIndex >= 0) {
          const updated = [...prev];
          const conv = { ...updated[convIndex] };
          conv.lastMessage = message;
          conv.lastMessageAt = message.createdAt;

          // Increment unread if not the sender
          if (message.sender?._id !== user._id && message.sender !== user._id) {
            conv.unreadCount = (conv.unreadCount || 0) + 1;
          }

          // Move to top
          updated.splice(convIndex, 1);
          updated.unshift(conv);
          return updated;
        }
        return prev;
      });

      // Update total unread
      setTotalUnread(prev => prev + 1);
    });

    setSocket(socketInstance);
  };

  // Re-join socket rooms when conversations are loaded
  useEffect(() => {
    if (socket && socket.connected && conversations.length > 0) {
      conversations.forEach(conv => {
        if (conv._id) {
          socket.emit('join_dm', conv._id);
        }
      });
    }
  }, [socket, conversations]);

  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return msgDate.toLocaleDateString('en-IN', { weekday: 'short' });
    } else {
      return msgDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const getLastMessagePreview = (conv) => {
    if (!conv.lastMessage) return 'No messages yet';
    if (conv.lastMessage.isDeleted) return 'Message deleted';
    return conv.lastMessage.content?.substring(0, 50) +
      (conv.lastMessage.content?.length > 50 ? '...' : '');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold">Messages</h1>
              {totalUnread > 0 && (
                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalUnread}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Moderated Messaging Notice */}
        <div className="flex items-start gap-3 bg-purple-900/20 border border-purple-800/40 rounded-lg px-4 py-3 mb-6">
          <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-purple-300">Moderated Messaging</p>
            <p className="text-xs text-purple-400 mt-0.5">
              You can only message platform administrators. This keeps the community safe and prevents spam or harassment.
            </p>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
            <p className="text-gray-400 mb-6">
              Contact our admin team from any popularity listing to get help or ask questions.
            </p>
            <Link
              href="/popularity"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Browse Popularity Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => {
              const otherUser = conversation.otherParticipant;
              const hasUnread = conversation.unreadCount > 0;

              return (
                <Link
                  key={conversation._id}
                  href={`/messages/${conversation._id}`}
                  className={`block bg-gray-800 rounded-lg p-4 border transition hover:border-purple-500 ${hasUnread ? 'border-purple-500/50' : 'border-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                        {otherUser?.avatar ? (
                          <img
                            src={otherUser.avatar}
                            alt=""
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold">
                            {otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      {hasUnread && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold truncate ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
                          {otherUser?.name || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${hasUnread ? 'text-gray-300' : 'text-gray-500'}`}>
                        {getLastMessagePreview(conversation)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
