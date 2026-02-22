import { generateArticleMetadata } from '@/lib/seo-config';
import { Navbar, Footer } from '@/components/layout';
import Breadcrumb from '@/components/seo/Breadcrumb';
import Link from 'next/link';

// SEO Metadata — canonical auto-set via generateArticleMetadata → generateSeoMetadata
export const metadata = generateArticleMetadata({
  title: 'How to Win BGMI Tournaments in 2026 - Expert Pro Guide',
  excerpt: 'Master competitive BGMI with expert strategies and start winning real cash prizes. Drop spots, sensitivity settings, circle tactics, and more.',
  slug: 'how-to-win-bgmi-tournaments-2024',
  image: '/api/og?title=How+to+Win+BGMI+Tournaments&subtitle=Expert+Guide+2026&category=Guide',
  datePublished: '2024-01-15T00:00:00+05:30',
  dateModified: '2026-02-22T00:00:00+05:30',
  author: 'BattleXZone Team',
  category: 'BGMI Guides',
  tags: [
    'how to win BGMI tournaments',
    'BGMI tournament tips',
    'BGMI winning strategies',
    'BGMI pro guide',
    'BGMI tournament India',
  ],
});

export default function BlogPost() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Win BGMI Tournaments in 2026 - Expert Guide',
    author: { '@type': 'Organization', name: 'BattleXZone' },
    publisher: { '@type': 'Organization', name: 'BattleXZone', logo: { '@type': 'ImageObject', url: 'https://www.battlexzone.com/images/logo.png' } },
    datePublished: '2024-01-15',
    dateModified: '2026-02-22',
    description: 'Master BGMI tournaments with pro tips and winning strategies',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-dark-900 text-white py-24 px-4">
        <article className="max-w-4xl mx-auto">
          <Breadcrumb items={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: 'How to Win BGMI Tournaments', url: '/blog/how-to-win-bgmi-tournaments-2024' }]} />

          <h1 className="text-4xl md:text-5xl font-bold mb-6">How to Win BGMI Tournaments in 2026</h1>
          <p className="text-xl text-dark-400 mb-8">Master competitive BGMI with these expert strategies and start winning real cash prizes</p>

          <div className="prose prose-invert max-w-none">
            <h2>1. Master Your Drop Locations</h2>
            <p>Choosing the right landing spot is crucial. Hot drops offer high loot but intense combat. Safe zones provide steady progression.</p>

            <h2>2. Optimize Your Sensitivity Settings</h2>
            <p>Fine-tune your controls for better aim and recoil control. Pro players recommend 3x-4x sensitivity for mid-range combat.</p>

            <h2>3. Communication is Key</h2>
            <p>In squad tournaments, clear callouts and team coordination separate winners from losers. Use voice chat effectively.</p>

            <h2>4. Study the Circle</h2>
            <p>Position yourself early in the safe zone. Avoid getting caught in late rotations where you&apos;re vulnerable.</p>

            <h2>5. Practice on BattleXZone</h2>
            <p>Join daily practice matches on <Link href="/matches" className="text-primary-400 hover:underline">BattleXZone</Link> to improve your skills before entering high-stakes tournaments.</p>
          </div>

          <div className="mt-12 p-6 bg-primary-500/10 border border-primary-500/30 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Ready to Compete?</h3>
            <p className="mb-4">Join BattleXZone today and start winning real money in BGMI tournaments</p>
            <Link href="/register" className="btn-primary inline-block">Register Now</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
