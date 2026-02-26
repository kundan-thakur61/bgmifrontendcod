'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { registerSW } from '@/lib/sw-register';

// All three UI components are client-only — lazy-import them here so the
// parent layout.jsx (server component) doesn't need to be a client component.
const InstallPrompt  = dynamic(() => import('./InstallPrompt'),  { ssr: false });
const UpdateNotifier = dynamic(() => import('./UpdateNotifier'), { ssr: false });
const NetworkStatus  = dynamic(() => import('./NetworkStatus'),  { ssr: false });

/**
 * PWABootstrap — mounts once in app layout.
 *
 * Responsibilities:
 *  1. Register /sw.js on first client render
 *  2. Render Install Prompt, Update Notifier, and Network Status overlays
 */
export default function PWABootstrap() {
  useEffect(() => {
    registerSW().catch(() => {});
  }, []);

  return (
    <>
      <InstallPrompt />
      <UpdateNotifier />
      <NetworkStatus />
    </>
  );
}
