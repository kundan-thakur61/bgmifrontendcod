'use client';

import InstallPrompt from './InstallPrompt';
import UpdateNotifier from './UpdateNotifier';
import NetworkStatus from './NetworkStatus';
import WakeLockGuard, { useWakeLock } from './WakeLockGuard';
import PWABootstrap from './PWABootstrap';

// Pull in SW/PWA utility helpers (re-exported for convenience from the PWA barrel)
import { 
  suggestPWAInstall,
  cacheCriticalUrls,
  registerSW,
  subscribeToPush,
  unsubscribeFromPush 
} from '@/lib/sw-register';

export {
  InstallPrompt,
  UpdateNotifier,
  NetworkStatus,
  WakeLockGuard,
  useWakeLock,
  PWABootstrap,
  suggestPWAInstall,
  cacheCriticalUrls,
  registerSW,
  subscribeToPush,
  unsubscribeFromPush,
};
