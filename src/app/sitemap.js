import { SITE, getApiBaseUrl } from '@/lib/seo-config';
import { getBlogSitemapEntries } from '@/lib/content/blog-posts';

/**
 * Dynamic Sitemap Generator - PILLAR 3 Technical SEO
 * ─────────────────────────────────────────────────
 * Generates a comprehensive XML sitemap including:
 * - All static pages with correct priorities & change frequencies
 * - Dynamic match pages (fetched from API)
 * - Dynamic tournament pages (fetched from API)
 * - Blog articles & Location-specific SEO pages
 * - Game-specific tournament pages (BGMI, Free Fire, PUBG)
 * 
 * Core Web Vitals Impact:
 * - Helps search engines discover pages faster
 * - Improves crawl efficiency with proper priorities
 * - Supports dynamic content discovery
 *
 * This REPLACES the outdated public/sitemap.xml.
 */
export default async function sitemap() {
  const baseUrl = SITE.baseUrl;
  const now = new Date().toISOString();

  // ── Static Routes with SEO-Optimized Priorities ─────────────
  const staticRoutes = [
    // Homepage - Highest Priority
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    
    // Primary Tournament Pages (Target Keywords)
    { path: '/tournaments', changeFrequency: 'daily', priority: 0.95 },
    { path: '/tournaments/bgmi', changeFrequency: 'daily', priority: 0.95 },
    { path: '/tournaments/free-fire', changeFrequency: 'daily', priority: 0.95 },
    { path: '/tournaments/pubg-mobile', changeFrequency: 'daily', priority: 0.9 },
    
    // Matches Page (Target: "BGMI win match online")
    { path: '/matches', changeFrequency: 'hourly', priority: 0.95 },
    
    // Key Conversion Pages
    { path: '/how-it-works', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/register', changeFrequency: 'weekly', priority: 0.85 },
    
    // Blog hub — individual posts injected dynamically via getBlogSitemapEntries
    { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
    
    // Leaderboard & Community
    { path: '/leaderboard', changeFrequency: 'daily', priority: 0.85 },
    { path: '/achievements', changeFrequency: 'daily', priority: 0.7 },
    
    // Location Pages for Local SEO
    { path: '/locations', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/locations/mumbai-tournaments', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/locations/delhi-tournaments', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/locations/bangalore-tournaments', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/locations/hyderabad-tournaments', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/locations/kolkata-tournaments', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/locations/chennai-tournaments', changeFrequency: 'weekly', priority: 0.7 },
    
    // Support & Trust Pages
    { path: '/faq', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/rules', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/fair-play', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    
    // Search & Discovery
    { path: '/search', changeFrequency: 'weekly', priority: 0.6 },
    
    // Legal Pages (Lower priority but important for trust)
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/terms-conditions', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.4 },
  ];

  // ── Dynamic Routes (matches + tournaments from API) ────────
  const dynamicRoutes = [];

  try {
    const API_BASE_URL = getApiBaseUrl();

    const [matchesRes, tournamentsRes] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/matches?status=upcoming,registration_open&limit=200`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${API_BASE_URL}/tournaments?status=upcoming,registration_open&limit=100`, {
        next: { revalidate: 3600 },
      }),
    ]);

    if (matchesRes.status === 'fulfilled' && matchesRes.value.ok) {
      const matchesData = await matchesRes.value.json();
      const matches = matchesData.matches || matchesData.data || [];
      matches.forEach(match => {
        dynamicRoutes.push({
          url: `${baseUrl}/matches/${match._id || match.id}`,
          lastModified: match.updatedAt || match.createdAt || now,
          changeFrequency: 'hourly',
          priority: 0.8,
        });
      });
    }

    if (tournamentsRes.status === 'fulfilled' && tournamentsRes.value.ok) {
      const tournamentsData = await tournamentsRes.value.json();
      const tournaments = tournamentsData.tournaments || tournamentsData.data || [];
      tournaments.forEach(tournament => {
        dynamicRoutes.push({
          url: `${baseUrl}/tournaments/${tournament._id || tournament.id}`,
          lastModified: tournament.updatedAt || tournament.createdAt || now,
          changeFrequency: 'daily',
          priority: 0.85,
        });
      });
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching dynamic routes:', error.message);
  }

  const blogEntries = getBlogSitemapEntries(baseUrl);

  return [
    ...staticRoutes.map(route => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogEntries,
    ...dynamicRoutes,
  ];
}
