'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useWakeLock — Prevent screen from sleeping during active matches.
 * Call `requestWakeLock()` when a match starts, `releaseWakeLock()` when it ends.
 * Automatically re-acquires lock after tab regains visibility.
 */
export function useWakeLock() {
  const wakeLockRef = useRef(null);
  const activeRef = useRef(false);

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      activeRef.current = true;
      wakeLockRef.current.addEventListener('release', () => {
        activeRef.current = false;
      });
    } catch (err) {
      console.warn('[WakeLock] Could not acquire:', err.message);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    activeRef.current = false;
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  // Re-acquire on visibility change (browser releases on tab hide)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && activeRef.current) {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [requestWakeLock]);

  // Release on unmount
  useEffect(() => {
    return () => { releaseWakeLock(); };
  }, [releaseWakeLock]);

  return { requestWakeLock, releaseWakeLock };
}

/**
 * WakeLockGuard — Wrapper component that acquires wake lock on mount.
 * Use inside match detail pages to keep screen on.
 *
 * @example
 * <WakeLockGuard active={matchIsLive}>
 *   <MatchView />
 * </WakeLockGuard>
 */
export default function WakeLockGuard({ active = true, children }) {
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  useEffect(() => {
    if (active) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => { releaseWakeLock(); };
  }, [active, requestWakeLock, releaseWakeLock]);

  return children;
}
