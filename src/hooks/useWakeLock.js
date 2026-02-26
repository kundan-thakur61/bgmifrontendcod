import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useWakeLock — prevents the screen from sleeping during active match sessions.
 *
 * Usage (in a match detail page):
 *   const { isActive, request, release, supported } = useWakeLock();
 *   useEffect(() => { request(); return () => release(); }, []);
 */
export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const [supported] = useState(() =>
    typeof window !== 'undefined' && 'wakeLock' in navigator
  );
  const wakeLockRef = useRef(null);

  const request = useCallback(async () => {
    if (!supported) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsActive(true);
      wakeLockRef.current.addEventListener('release', () => setIsActive(false), { once: true });
    } catch (err) {
      // Can fail if document is hidden (battery saver, etc.)
      console.warn('[WakeLock] Request failed:', err.message);
    }
  }, [supported]);

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  // Re-acquire lock after page becomes visible again (e.g. tab switch)
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible' && isActive && !wakeLockRef.current) {
        await request();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isActive, request]);

  // Release on unmount
  useEffect(() => () => { release(); }, [release]);

  return { isActive, request, release, supported };
}

/**
 * useVibration — haptic feedback helper.
 *
 * Usage:
 *   const { vibrate } = useVibration();
 *   vibrate('success'); // gentle double-tap
 *   vibrate('error');   // long buzz
 */
export function useVibration() {
  const supported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern = 'default') => {
    if (!supported) return;
    const patterns = {
      default: [50],
      success: [50, 50, 100],
      error: [200, 50, 200],
      notification: [100],
      join: [80, 60, 80],
    };
    navigator.vibrate(patterns[pattern] ?? patterns.default);
  }, [supported]);

  return { vibrate, supported };
}
