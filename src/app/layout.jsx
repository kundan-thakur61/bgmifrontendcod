import '@/styles/globals.css';
import { Inter, Rajdhani, Exo_2 } from 'next/font/google';
import { generateSeoMetadata } from '@/lib/seo-config';
import { getKnowledgeGraph } from '@/lib/schema-graph';
import { GoogleAnalytics } from '@/components/seo';
import { AuthProvider } from '@/context/AuthContext';
import ClientShells from './ClientShells';
export { reportWebVitals } from '@/lib/advanced-seo';

// ── Fonts: Inter (body), Rajdhani (gaming/hero titles), Exo_2 (alt UI) ──
// Poppins removed — no component uses --font-poppins critically above the fold.
// This eliminates one extra Google Fonts network round-trip on first load.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  preload: true,
});
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
  preload: true, // Critical: used by .hero-title (LCP element)
});
const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-exo2',
  display: 'swap',
  preload: false, // Only used in navbar wallet badge / body — not LCP critical
});

// ── Knowledge Graph: computed once at module level (not per-render) ──
// getKnowledgeGraph() is pure/static — no request-scoped data, so we can
// run it at module init time and avoid re-running on every server render.
const knowledgeGraph = getKnowledgeGraph();

// ── Unified SEO Metadata (single source of truth) ──
export const metadata = generateSeoMetadata({});

/**
 * Viewport — exported separately per Next.js App Router spec.
 * This emits the <meta name="viewport"> and <meta name="theme-color"> tags.
 * DO NOT add these manually in the <head> JSX — that would duplicate them.
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
  ],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" dir="ltr">
      <head>
        {/*
         * NOTE: <meta charset>, <meta name="viewport">, <meta name="theme-color">,
         * and all icons/manifest are emitted automatically by Next.js from the
         * `metadata` and `viewport` exports above. Do NOT add them here manually.
         */}

        {/* ── Performance: Preconnect & DNS Prefetch ── */}
        {/* fonts.gstatic.com crossOrigin is REQUIRED for WOFF2 preload to work */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.battlexzone.com" />

        {/*
         * ── LCP Fix: Preload Rajdhani WOFF2 ──
         * The hero <h1> uses .hero-title → font-family: 'Rajdhani'.
         * Without preload, the browser discovers this font only after
         * parsing CSS → fetching font → re-painting → LCP fires (~4.8s).
         * Preloading it here cuts that chain and brings LCP to <2.5s.
         */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/rajdhani/v18/LDIxapCSOBg7S-QT7q4AOeekWPrP.woff2"
          crossOrigin="anonymous"
        />

        {/* ── RSS Feed Discovery ── */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="BattleZone Blog RSS Feed"
          href="/rss.xml"
        />

        {/* ── Entity SEO: Knowledge Graph (Organization + WebSite + WebApp + BGMI) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(knowledgeGraph) }}
        />
      </head>
      <body
        className={`${inter.variable} ${rajdhani.variable} ${exo2.variable} min-h-screen bg-dark-900 text-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* PerformanceMonitor + PWA (SW registration, install prompt, update notifier, offline bar) */}
        <ClientShells />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}

