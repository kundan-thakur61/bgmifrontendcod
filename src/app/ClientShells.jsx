'use client';

/**
 * ClientShells — holds all `dynamic(..., { ssr: false })` imports for layout.jsx.
 *
 * Next.js 13+ App Router does not allow `ssr: false` in Server Components.
 * This thin client wrapper owns those dynamic imports and is itself imported
 * as a plain (non-dynamic) component from the server layout.
 */

import dynamic from 'next/dynamic';

const PerformanceMonitor = dynamic(
  () => import('@/components/seo/PerformanceMonitor'),
  { ssr: false }
);

const PWABootstrap = dynamic(
  () => import('@/components/pwa/PWABootstrap'),
  { ssr: false }
);

// Only load console cleaner in development to reduce HMR/Fast Refresh spam
const DevConsoleCleaner =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@/components/dev/DevConsoleCleaner'), { ssr: false })
    : () => null;

export default function ClientShells() {
  return (
    <>
      <PerformanceMonitor />
      <PWABootstrap />
      <DevConsoleCleaner />
    </>
  );
}
