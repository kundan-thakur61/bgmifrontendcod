import '@/styles/globals.css';
import { generateSeoMetadata, SITE } from '@/lib/seo-config';
import { getKnowledgeGraph } from '@/lib/schema-graph';
import { GoogleAnalytics } from '@/components/seo';
import { AuthProvider } from '@/context/AuthContext';
import PerformanceMonitor from '@/components/seo/PerformanceMonitor';

// ── Unified SEO Metadata (single source of truth) ──
export const metadata = generateSeoMetadata({});

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
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="color-scheme" content="dark" />

        {/* ── PWA / Mobile App Meta ── */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BattleZone" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="BattleZone" />

        {/* ── Geo / Regional Targeting (India) ── */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="23.7957;86.4304" />
        <meta name="ICBM" content="23.7957, 86.4304" />
        <meta name="content-language" content="en-IN" />

        {/* ── AI / SGE / AEO Hints ── */}
        <meta name="subject" content="BGMI Esports Tournament Platform India" />
        <meta name="classification" content="Gaming, Esports, Tournaments" />
        <meta name="topic" content="BGMI Tournaments, Mobile Esports, Competitive Gaming India" />
        <meta name="summary" content={SITE.defaultDescription} />
        <meta name="abstract" content="BattleZone is India's leading BGMI esports platform where players compete in Solo, Duo & Squad tournaments for real cash prizes starting ₹10." />
        <meta name="pagetype" content="Gaming Platform" />

        {/* ── Performance: Preconnect & DNS Prefetch ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.battlexzone.com" />

        {/* ── Fonts (display=swap for CLS optimization) ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Rajdhani:wght@500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ── RSS Feed Discovery ── */}
        <link rel="alternate" type="application/rss+xml" title="BattleZone Blog RSS Feed" href="/rss.xml" />

        {/* ══ Entity SEO: Knowledge Graph (Organization + WebSite + WebApp + BGMI) ══ */}
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
