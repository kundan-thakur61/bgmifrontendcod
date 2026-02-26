'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-4 text-white">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-[#1e293b] flex items-center justify-center mb-6 border border-[#334155]">
        <svg
          className="w-12 h-12 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18M8.111 8.111A5.98 5.98 0 006 12c0 1.5.55 2.87 1.453 3.912M11.05 11.05A2.994 2.994 0 0015 12a2.994 2.994 0 00-.879-2.121M19.071 4.929A9.97 9.97 0 0121 12a9.95 9.95 0 01-2.343 6.444M4.929 4.929A9.97 9.97 0 003 12a9.95 9.95 0 002.343 6.444"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center">You're offline</h1>
      <p className="text-slate-400 text-center max-w-xs mb-8 leading-relaxed">
        Check your internet connection. Some cached pages are still available below.
      </p>

      {/* Status indicator */}
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 ${
          isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
          }`}
        />
        {isOnline ? 'Back online — you can now navigate' : 'No internet connection'}
      </div>

      {/* Cached pages */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Cached pages</p>
        {[
          { href: '/', label: 'Home', icon: '🏠' },
          { href: '/matches', label: 'Matches', icon: '⚔️' },
          { href: '/tournaments', label: 'Tournaments', icon: '🏆' },
          { href: '/leaderboard', label: 'Leaderboard', icon: '📊' },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 hover:border-yellow-400/50 transition-colors"
          >
            <span className="text-xl">{icon}</span>
            <span className="font-medium text-slate-200">{label}</span>
            <svg
              className="w-4 h-4 text-slate-500 ml-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Retry */}
      <button
        onClick={() => window.location.reload()}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
