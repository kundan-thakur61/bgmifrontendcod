/**
 * Client-side logger utility
 * 
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   
 *   logger.debug('SW', 'Registration started');
 *   logger.info('PWA', 'App installed');
 *   logger.warn('API', 'Slow response', { duration });
 *   logger.error('Auth', 'Login failed', err);
 *
 * In development you can enable verbose logs with:
 *   NEXT_PUBLIC_DEBUG_LOGS=true
 *
 * All logs are automatically disabled or reduced in production.
 */

const isDev = process.env.NODE_ENV === 'development';
const forceDebug = process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true';

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Minimum level to show (can be adjusted)
const minLevel = forceDebug ? 0 : (isDev ? 1 : 2); // In prod only warn+

function shouldLog(level) {
  return LEVELS[level] >= minLevel;
}

function format(prefix, level, ...args) {
  const time = new Date().toISOString().substring(11, 19);
  const p = prefix ? `[${prefix}]` : '';
  return [`${time} ${level.toUpperCase()} ${p}`, ...args];
}

export const logger = {
  debug(prefix, ...args) {
    if (shouldLog('debug')) {
      console.debug(...format(prefix, 'debug', ...args));
    }
  },

  info(prefix, ...args) {
    if (shouldLog('info')) {
      console.info(...format(prefix, 'info', ...args));
    }
  },

  warn(prefix, ...args) {
    if (shouldLog('warn')) {
      console.warn(...format(prefix, 'warn', ...args));
    }
  },

  error(prefix, ...args) {
    // Errors are always shown
    console.error(...format(prefix, 'error', ...args));
  },

  /**
   * Group logs together (useful for complex operations)
   */
  group(label, fn) {
    if (!isDev && !forceDebug) return;
    console.group(label);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Temporarily enable full debug output at runtime
   */
  enableVerbose() {
    if (typeof window !== 'undefined') {
      window.__DEBUG_LOGS__ = true;
      console.info('%c[Logger] Verbose debug logging enabled', 'color:#0ea5e9');
    }
  },

  disableVerbose() {
    if (typeof window !== 'undefined') {
      window.__DEBUG_LOGS__ = false;
      console.info('%c[Logger] Verbose debug logging disabled', 'color:#64748b');
    }
  },
};

// Expose to window in development for easy debugging
if (isDev && typeof window !== 'undefined') {
  window.logger = logger;
  // Quick command: logger.enableVerbose()
}

export default logger;
