import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = {
  title: 'BGMI Tournaments India 2026 - Daily Cash Prize Events | BattleXZone',
  description: 'Join the best BGMI tournaments in India. Daily matches with real cash prizes starting from ₹10 entry. Play solo, duo, squad and win big.',
  keywords: ['BGMI tournaments India', 'BGMI cash tournament', 'daily BGMI events', 'BGMI India 2026', 'esports India'],
};

const articleData = {
  title: 'Best BGMI Tournaments in India 2026',
  excerpt: 'Daily online BGMI tournaments with cash prizes across India. Low entry fees, fast UPI payouts, and fair play.',
  datePublished: '2026-02-01T00:00:00+05:30',
  dateModified: '2026-02-01T00:00:00+05:30',
  url: 'https://www.battlexzone.com/bgmi-tournaments-india',
};

export default function BGMITournamentsIndia() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://www.battlexzone.com' }, { name: 'BGMI Tournaments India', url: 'https://www.battlexzone.com/bgmi-tournaments-india' }]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">BGMI Tournaments in India 2026</h1>
          <p className="text-xl text-dark-300 mb-8">Play daily BGMI cash tournaments from anywhere in India. Entry fees from ₹10. Real money prizes paid instantly via UPI.</p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link href="/matches" className="card p-6 hover:border-primary-500">Browse All Matches →</Link>
            <Link href="/register" className="card p-6 hover:border-primary-500">Create Free Account →</Link>
          </div>

          <section className="prose prose-invert max-w-none">
            <h2>Why BattleXZone is India’s Top BGMI Platform</h2>
            <ul>
              <li>50+ daily matches across solo, duo, squad</li>
              <li>Entry starting at just ₹10</li>
              <li>Fast UPI withdrawals (usually under 10 minutes)</li>
              <li>Strong anti-cheat + KYC for fair play</li>
              <li>Active in every major city and tier-2/3 towns</li>
            </ul>
          </section>

          <div className="mt-10 text-center">
            <Link href="/tournaments" className="btn-primary px-10 py-3 text-lg">Explore Today’s Tournaments</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
