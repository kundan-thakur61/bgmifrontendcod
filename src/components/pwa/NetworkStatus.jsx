'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * NetworkStatus — persistent toast when user goes offline/online.
 * - Shows a red bar when offline
 * - Shows a green flash when reconnected, then auto-hides
 */
export default function NetworkStatus() {
  const [status, setStatus] = useState('online'); // 'online' | 'offline' | 'reconnected'
  const timerRef = useRef(null);

  useEffect(() => {
    const setOnline = () => {
      setStatus('reconnected');
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus('online'), 3000);
    };
    const setOffline = () => {
      clearTimeout(timerRef.current);
      setStatus('offline');
    };

    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    if (!navigator.onLine) setStatus('offline');

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (status === 'online') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[10000] flex justify-center pointer-events-none"
    >
      <div
        className={`
          mt-2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg pointer-events-auto
          transition-all duration-300
          ${status === 'offline'
            ? 'bg-red-600/95 text-white'
            : 'bg-green-600/95 text-white'}
        `}
      >
        {status === 'offline' ? (
          <>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M9 10a3 3 0 014.243 0M15 13a3 3 0 01-4.243 0" />
            </svg>
            You're offline — some features may be unavailable
          </>
        ) : (
          <>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Back online
          </>
        )}
      </div>
    </div>
  );
}
