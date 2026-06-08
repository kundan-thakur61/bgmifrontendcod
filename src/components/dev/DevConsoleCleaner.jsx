'use client';

import { useEffect } from 'react';

/**
 * DevConsoleCleaner
 * 
 * Reduces console spam during development:
 * - Silences Next.js HMR / Fast Refresh messages (very noisy with Turbopack)
 * - You can still see real errors and warnings
 * 
 * Only active in development.
 */
export default function DevConsoleCleaner() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const originalLog = console.log;
    const originalDebug = console.debug;

    const NOISY_PATTERNS = [
      '[HMR]',
      '[Fast Refresh]',
      'forward-logs-shared',
      'webpack',
      'turbopack',
      'Download the React DevTools',
    ];

    function isNoisy(args) {
      try {
        const message = args
          .map((a) => (typeof a === 'string' ? a : ''))
          .join(' ');
        return NOISY_PATTERNS.some((p) => message.includes(p));
      } catch {
        return false;
      }
    }

    console.log = (...args) => {
      if (isNoisy(args)) return;
      originalLog(...args);
    };

    console.debug = (...args) => {
      if (isNoisy(args)) return;
      originalDebug(...args);
    };

    // Optional: expose a way to disable the filter temporarily
    if (typeof window !== 'undefined') {
      window.__showHMRLogs = () => {
        console.log = originalLog;
        console.debug = originalDebug;
        console.info('%c[HMR logs] Restored full Next.js dev logs', 'color:#eab308');
      };
    }

    // Cleanup on unmount (mainly for hot reload of this component itself)
    return () => {
      console.log = originalLog;
      console.debug = originalDebug;
    };
  }, []);

  return null;
}
