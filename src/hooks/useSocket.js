'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/api';

/**
 * Hook for managing Socket.IO connections with auto-reconnect
 * @param {string} namespace - Optional socket namespace
 * @param {object} options - Connection options
 */
export default function useSocket(namespace = '', options = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const url = namespace ? `${SOCKET_URL}/${namespace}` : SOCKET_URL;

    socketRef.current = io(url, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
      ...options,
    });

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));
    socketRef.current.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
    });

    // Re-register any existing listeners
    listenersRef.current.forEach((handler, event) => {
      socketRef.current.on(event, handler);
    });
  }, [namespace, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event, handler) => {
    listenersRef.current.set(event, handler);
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
    return () => {
      listenersRef.current.delete(event);
      socketRef.current?.off(event, handler);
    };
  }, []);

  const off = useCallback((event, handler) => {
    listenersRef.current.delete(event);
    socketRef.current?.off(event, handler);
  }, []);

  const joinRoom = useCallback((roomId) => {
    emit('join_room', roomId);
  }, [emit]);

  const leaveRoom = useCallback((roomId) => {
    emit('leave_room', roomId);
  }, [emit]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    lastEvent,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
  };
}
