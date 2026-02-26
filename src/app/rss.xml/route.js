import { SITE } from '@/lib/seo-config';
import { getRssItems } from '@/lib/content/blog-posts';

export async function GET() {
  const baseUrl = SITE.baseUrl;
  const rssItems = getRssItems(baseUrl);

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>BattleZone Gaming Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert BGMI, Free Fire tips, tournament strategies, pro player guides, and latest esports news. Level up your game!</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/logo.png</url>
      <title>BattleZone Gaming Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${rssItems.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.link}</link>
      <guid isPermaLink="true">${post.guid}</guid>
      <pubDate>${post.pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
      ${post.categories.map((category) => `<category>${escapeXml(category)}</category>`).join('\n      ')}
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}
