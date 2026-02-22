import '@/styles/globals.css';
import { generateSeoMetadata, SITE } from '@/lib/seo-config';
import { getKnowledgeGraph } from '@/lib/schema-graph';
import { GoogleAnalytics } from '@/components/seo';
import { AuthProvider } from '@/context/AuthContext';
import PerformanceMonitor from '@/components/seo/PerformanceMonitor';

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
  // ── Knowledge Graph: Organization + WebSite + WebApp + BGMI Entity ──
  const knowledgeGraph = getKnowledgeGraph();

  return (
    <html lang="en-IN" dir="ltr">
      <head>
        {/*
         * NOTE: <meta charset>, <meta name="viewport">, <meta name="theme-color">,
         * and all icons/manifest are emitted automatically by Next.js from the
         * `metadata` and `viewport` exports above. Do NOT add them here manually.
         *
         * Apple PWA tags (apple-mobile-web-app-capable etc.) are handled by
         * metadata.appleWebApp in generateSeoMetadata — no manual tags needed.
         */}

        {/* ── Performance: Preconnect & DNS Prefetch ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.battlexzone.com" />

        {/*
         * Fonts — display=swap prevents invisible text during load (FOIT fix).
         * Rajdhani + Exo 2 are used by the Navbar; Inter + Poppins for body/display.
         * All four combined in one request to minimise connection overhead.
         */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Rajdhani:wght@500;600;700&family=Exo+2:wght@400;500;600&display=swap"
          rel="stylesheet"
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
      <body className="min-h-screen bg-dark-900 text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
        <PerformanceMonitor />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
