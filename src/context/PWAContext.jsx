'use client';

import { createContext, useContext, useEffect, useCallback } from 'react';
import { usePWA } from '@/hooks/usePWA';

const PWAContext = createContext(null);

/**
 * PWAProvider — wrap the app (in layout.jsx) to provide PWA state
 * to all child components via usePWAContext().
 */
export function PWAProvider({ children }) {
  const pwa = usePWA();

  // Register periodic background sync once on mount
  useEffect(() => {
    pwa.registerPeriodicSync('refresh-matches', 60 * 60 * 1000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <PWAContext.Provider value={pwa}>{children}</PWAContext.Provider>;
}

/**
 * usePWAContext — consume PWA state from any component.
 *
 * @example
 * const { isOnline, setBadge, shareContent } = usePWAContext();
 */
export function usePWAContext() {
  const ctx = useContext(PWAContext);
  if (!ctx) throw new Error('usePWAContext must be used within PWAProvider');
  return ctx;
}
