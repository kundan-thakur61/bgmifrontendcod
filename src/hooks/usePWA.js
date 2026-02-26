'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * usePWA — unified hook for all PWA capabilities:
 *  - isInstalled        : running as standalone PWA
 *  - isInstallable      : browser has an install prompt available
 *  - promptInstall()    : trigger A2HS install dialog
 *  - isOnline           : current network status
 *  - swUpdate           : new service worker waiting
 *  - applyUpdate()      : activate waiting SW + reload
 *  - setBadge(n)        : update app icon badge count
 *  - clearBadge()       : remove app icon badge
 *  - queueRequest()     : queue a failed request for background sync
 *  - requestWakeLock()  : prevent screen sleep
 *  - releaseWakeLock()  : release screen wake lock
 *  - shareContent()     : Web Share API
 *  - canShare           : whether Web Share API is available
 */
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [swUpdate, setSwUpdate] = useState(null); // waiting SW registration

  const deferredPromptRef = useRef(null);
  const wakeLockRef = useRef(null);

  // ── Detect install state ──────────────────────────────────────────────────
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);
  }, []);

  // ── Install prompt ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPromptRef.current = null;
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPromptRef.current) return false;
    deferredPromptRef.current.prompt();
    const { outcome } = await deferredPromptRef.current.userChoice;
    deferredPromptRef.current = null;
    setIsInstallable(false);
    return outcome === 'accepted';
  }, []);

  // ── Network status ────────────────────────────────────────────────────────
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ── Service Worker updates ────────────────────────────────────────────────
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.waiting) setSwUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) {
            setSwUpdate(w);
          }
        });
      });
    });
  }, []);

  const applyUpdate = useCallback(() => {
    if (!swUpdate) return;
    swUpdate.postMessage({ type: 'SKIP_WAITING' });
    setSwUpdate(null);
  }, [swUpdate]);

  // ── Badging API ───────────────────────────────────────────────────────────
  const setBadge = useCallback((count) => {
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(count).catch(() => {});
    }
    // Also notify SW to handle it from push context
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SET_BADGE', count });
    }
  }, []);

  const clearBadge = useCallback(() => {
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(() => {});
    }
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_BADGE' });
    }
  }, []);

  // ── Background Sync queue ─────────────────────────────────────────────────
  const queueRequest = useCallback(async (queueKey, requestData) => {
    if (!('serviceWorker' in navigator)) return;
    const ctrl = navigator.serviceWorker.controller;
    if (ctrl) {
      ctrl.postMessage({ type: 'QUEUE_REQUEST', queueKey, request: requestData });
    }
    if ('SyncManager' in window) {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register(queueKey).catch(() => {});
    }
  }, []);

  // ── Screen Wake Lock ──────────────────────────────────────────────────────
  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
    } catch {
      // Silently fail (permission denied or not supported)
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  // ── Web Share API ─────────────────────────────────────────────────────────
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const shareContent = useCallback(async ({ title, text, url, files } = {}) => {
    if (!('share' in navigator)) return false;
    try {
      await navigator.share({ title, text, url, files });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('[PWA] Share failed:', err);
      return false;
    }
  }, []);

  // ── Periodic Sync registration ────────────────────────────────────────────
  const registerPeriodicSync = useCallback(async (tag = 'refresh-matches', minInterval = 60 * 60 * 1000) => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('periodicSync' in reg) {
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
        if (status.state === 'granted') {
          await reg.periodicSync.register(tag, { minInterval });
        }
      }
    } catch {
      // Not supported or permission denied — silent fail
    }
  }, []);

  return {
    isInstalled,
    isInstallable,
    promptInstall,
    isOnline,
    swUpdate: !!swUpdate,
    applyUpdate,
    setBadge,
    clearBadge,
    queueRequest,
    requestWakeLock,
    releaseWakeLock,
    canShare,
    shareContent,
    registerPeriodicSync,
  };
}
