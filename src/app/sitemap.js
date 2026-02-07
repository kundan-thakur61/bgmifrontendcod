import { SITE, getApiBaseUrl } from '@/lib/seo-config';

/**
 * Dynamic Sitemap Generator
 * ─────────────────────────
 * Generates a comprehensive XML sitemap including:
 * - All static pages with correct priorities & change frequencies
 * - Dynamic match pages (fetched from API)
 * - Dynamic tournament pages (fetched from API)
 * - Blog articles & Location-specific SEO pages
 *
 * This REPLACES the outdated public/sitemap.xml.
 */
export default async function sitemap() {
  const baseUrl = SITE.baseUrl;
  const now = new Date().toISOString();

  // ── Static Routes ──────────────────────────────────────────
  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/matches', changeFrequency: 'hourly', priority: 0.95 },
    { path: '/tournaments', changeFrequency: 'daily', priority: 0.95 },
    { path: '/leaderboard', changeFrequency: 'daily', priority: 0.85 },
    { path: '/how-it-works', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/search', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/blog', changeFrequency: 'daily', priority: 0.85 },
    { path: '/blog/bgmi-tournament-guide-2026', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/blog/how-to-win-bgmi-tournaments-2024', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog/free-fire-tournament-tips', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog/how-to-earn-money-gaming-india', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/blog/bgmi-vs-free-fire-which-is-better', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog/pubg-mobile-tips-for-beginners', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog/best-landing-spots-erangel', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog/free-fire-character-guide', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog/how-to-improve-aim-mobile', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog/esports-career-india', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog/bgmi-update-latest-features', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/locations', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/locations/mumbai-tournaments', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/locations/delhi-tournaments', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/locations/bangalore-tournaments', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/achievements', changeFrequency: 'daily', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/rules', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/fair-play', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms-conditions', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
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

  return [
    ...staticRoutes.map(route => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...dynamicRoutes,
  ];
}
