'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getConversations, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

// Context for sharing unread count across components
const UnreadMessagesContext = createContext({
  unreadCount: 0,
  setUnreadCount: () => {}
});

export function useUnreadMessages() {
  return useContext(UnreadMessagesContext);
}

export function UnreadMessagesProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Fetch initial unread count
    fetchUnreadCount();
    
    // Connect socket for real-time updates
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketInstance = io(SOCKET_URL, {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      // Join user's personal room for notifications
      socketInstance.emit('join_user_room', user._id);
    });

    // Listen for new messages
    socketInstance.on('new_message', (message) => {
      // Only increment if not the sender
      if (message.sender?._id !== user._id && message.sender !== user._id) {
        setUnreadCount(prev => prev + 1);
      }
    });

    // Listen for conversation read events
    socketInstance.on('conversation_read', () => {
      fetchUnreadCount();
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await getConversations();
      if (response && response.success) {
        const total = (response.data || []).reduce(
          (sum, conv) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadCount(total);
      }
    } catch (err) {
      // Silently fail - don't crash the app if unread count can't be fetched
      // This can happen if the backend is unavailable or user is not fully authenticated
      // Only log in development to reduce console noise
      if (process.env.NODE_ENV === 'development') {
        console.warn('Could not fetch unread count:', err.message);
      }
    }
  };

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount, fetchUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

// Messages link component for navbar
export default function MessagesLink({ className = '', showLabel = false, isMobile = false, asLink = true }) {
  const { unreadCount } = useUnreadMessages();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const content = (
    <>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {showLabel && <span>Messages</span>}
      {unreadCount > 0 && (
        <span className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-2 -right-2'} min-w-[18px] h-[18px] bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </>
  );

  if (!asLink) {
    return (
      <div className={`relative flex items-center gap-2 ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <Link 
      href="/messages" 
      className={`relative flex items-center gap-2 ${className}`}
    >
      {content}
    </Link>
  );
}
