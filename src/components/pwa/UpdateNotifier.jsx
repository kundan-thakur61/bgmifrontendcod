'use client';

import { useState, useEffect } from 'react';

/**
 * UpdateNotifier — shows a banner when a new service worker version is waiting.
 * Clicking "Update" sends SKIP_WAITING to the SW, then reloads the page.
 */
export default function UpdateNotifier() {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleSWUpdate = (registration) => {
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShow(true);
      }
    };

    navigator.serviceWorker.ready.then((registration) => {
      // Already waiting on load (e.g. user had tab open)
      if (registration.waiting) {
        setWaitingWorker(registration.waiting);
        setShow(true);
      }

      // New update found while page is open
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShow(true);
          }
        });
      });
    });

    // Listen for SW-triggered reload (after skipWaiting)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (!waitingWorker) return;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-[#1e293b] border border-blue-500/40 rounded-2xl px-4 py-3 shadow-2xl shadow-black/60 flex items-center gap-3">
        {/* Spinner icon */}
        <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">Update available</p>
          <p className="text-slate-400 text-xs">New version ready to install</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShow(false)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
