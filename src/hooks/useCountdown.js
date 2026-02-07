'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getTimeRemaining } from '@/lib/utils';

/**
 * Countdown timer hook.
 * @param {string|Date} targetDate - The end time to count down to
 * @param {object} options - Configuration
 */
export default function useCountdown(targetDate, options = {}) {
  const { onComplete, interval = 1000, autoStart = true } = options;
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTimeLeft(getTimeRemaining(targetDate));
    setIsRunning(autoStart);
  }, [targetDate, autoStart]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        onCompleteRef.current?.();
      }
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, targetDate, interval]);

  const isExpired = timeLeft.total <= 0;

  const formatted = {
    days: String(timeLeft.days).padStart(2, '0'),
    hours: String(timeLeft.hours).padStart(2, '0'),
    minutes: String(timeLeft.minutes).padStart(2, '0'),
    seconds: String(timeLeft.seconds).padStart(2, '0'),
    display: timeLeft.days > 0
      ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
      : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`,
  };

  return {
    ...timeLeft,
    formatted,
    isRunning,
    isExpired,
    start,
    pause,
    reset,
  };
}
