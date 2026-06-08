import { SITE } from '@/lib/seo-config';

/**
 * Sitemap Index for large-scale SEO (TASK 7)
 * Points to main sitemap + future segmented sitemaps (blogs, tournaments, etc.)
 * Next.js will serve this at /sitemap-index.xml
 */
export async function GET() {
  const base = SITE.baseUrl;
  const now = new Date().toISOString();

  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <!-- Future segmented sitemaps can be added here for 50k+ urls -->
</sitemapindex>`;

  return new Response(index, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
