import { SITE } from '@/lib/seo-config';

/**
 * Dynamic robots.txt — Overrides public/robots.txt
 * Optimized for BGMI tournament platform crawling.
 *
 * Key decisions:
 * - Allow all public pages (matches, tournaments, blog, locations)
 * - Block admin, wallet internals, API, auth pages
 * - Specific Googlebot rules with no crawl delay (we want maximum crawl)
 * - GPTBot / AI crawlers allowed for AIO visibility
 * - Sitemap declaration for discovery
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/wallet/',
          '/profile/settings',
          '/kyc/',
          '/login',
          '/register',
          '/forgot-password',
          '/room/',        // Room credentials are private
          '/_next/',       // Next.js internals
          '/test/',
          '/staging/',
        ],
        crawlDelay: 1,
      },
      {
        // Google: no crawl delay — we WANT aggressive crawling
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/admin/', '/api/', '/private/', '/wallet/', '/room/', '/kyc/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/_next/image'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/admin/', '/api/', '/private/', '/wallet/', '/room/', '/kyc/'],
        crawlDelay: 1,
      },
      {
        // Allow AI crawlers for SGE/AIO visibility
        userAgent: 'GPTBot',
        allow: ['/', '/blog/', '/matches/', '/tournaments/', '/faq', '/how-it-works'],
        disallow: ['/admin/', '/api/', '/wallet/', '/room/', '/kyc/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/blog/', '/matches/', '/tournaments/', '/faq'],
        disallow: ['/admin/', '/api/', '/wallet/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/blog/', '/faq', '/how-it-works', '/matches/', '/tournaments/'],
        disallow: ['/admin/', '/api/', '/wallet/'],
      },
    ],
    sitemap: `${SITE.baseUrl}/sitemap.xml`,
    host: SITE.baseUrl,
  };
}
