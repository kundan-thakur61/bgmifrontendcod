'use client';

import { useState, useEffect } from 'react';

/**
 * Responsive media query hook.
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the query matches
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience presets
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const usePrefersDark = () => useMediaQuery('(prefers-color-scheme: dark)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
