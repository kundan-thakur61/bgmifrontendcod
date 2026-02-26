'use client';

import { useState, useEffect } from 'react';

/**
 * InstallPrompt — Add to Home Screen banner.
 * Appears after the user has been on the site for 30s and hasn't installed yet.
 * Remembers dismissal in localStorage (shows again after 7 days).
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Already installed (standalone mode) — don't show
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (window.navigator.standalone === true) return; // iOS standalone

    // Dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 30s before showing — don't interrupt initial browsing
      setTimeout(() => setShow(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', String(Date.now()));
    setShow(false);
  };

  if (!show || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pointer-events-none">
      <div
        className="max-w-sm mx-auto bg-[#1e293b] border border-yellow-400/40 rounded-2xl p-4 shadow-2xl shadow-black/60 pointer-events-auto animate-slide-up"
        role="dialog"
        aria-label="Install BattleZone app"
      >
        <div className="flex items-start gap-3">
          {/* App icon */}
          <img
            src="/images/icon-96.png"
            alt="BattleZone"
            className="w-12 h-12 rounded-xl shrink-0"
          />

          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">Install BattleZone</p>
            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
              Add to your home screen for faster access, offline support & native feel.
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Perks row */}
        <div className="flex gap-3 mt-3 mb-4">
          {[
            { icon: '⚡', text: 'Faster' },
            { icon: '📡', text: 'Offline' },
            { icon: '🔔', text: 'Alerts' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex-1 bg-[#0f172a] rounded-lg py-2 flex flex-col items-center gap-0.5"
            >
              <span className="text-base">{icon}</span>
              <span className="text-xs text-slate-400">{text}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 px-3 text-sm text-slate-400 hover:text-white border border-[#334155] rounded-xl transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 px-3 text-sm font-semibold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl transition-colors"
          >
            Install
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
