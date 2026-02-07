import { SITE } from '@/lib/seo-config';

export async function GET() {
  const baseUrl = SITE.baseUrl;
  
  const blogPosts = [
    {
      title: 'BGMI Tournament Guide 2026 - Complete Guide to Winning Real Money',
      slug: 'bgmi-tournament-guide-2026',
      description: 'Master BGMI tournaments in 2026. Learn how to join tournaments, win real money, pro strategies, and step-by-step registration process.',
      date: '2026-01-15',
    },
    {
      title: 'Free Fire Tournament Tips 2026 - Pro Strategies to Win Real Money',
      slug: 'free-fire-tournament-tips',
      description: 'Master Free Fire tournaments with expert tips. Learn character combos, weapon choices, and winning strategies for 1vs1 matches.',
      date: '2026-01-20',
    },
    {
      title: 'How to Earn Money Playing Games in India 2026 - Complete Guide',
      slug: 'how-to-earn-money-gaming-india',
      description: 'Learn how to earn real money playing BGMI, Free Fire, and other games in India. Discover tournament platforms, earning methods, and income potential.',
      date: '2026-01-22',
    },
    {
      title: 'BGMI vs Free Fire 2026 - Which is Better for Tournaments & Earning?',
      slug: 'bgmi-vs-free-fire-which-is-better',
      description: 'Complete comparison of BGMI vs Free Fire. Graphics, gameplay, earning potential, tournaments, and which game is better for you.',
      date: '2026-01-25',
    },
    {
      title: 'How to Win BGMI Tournaments in 2024 - Expert Guide',
      slug: 'how-to-win-bgmi-tournaments-2024',
      description: 'Master competitive BGMI with these expert strategies and start winning real cash prizes.',
      date: '2024-01-15',
    },
  ];

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
    ${blogPosts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>Gaming</category>
      <category>Esports</category>
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
