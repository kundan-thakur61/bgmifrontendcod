'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Debounces a value by the specified delay.
 * @param {*} value - The value to debounce
 * @param {number} delay - Debounce delay in ms (default 300)
 * @returns The debounced value
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
