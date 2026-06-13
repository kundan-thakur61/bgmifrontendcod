import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Patna', 'Bihar');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Patna 2026 - Win Real Cash Daily',
  excerpt: 'Join BGMI and Free Fire cash tournaments in Patna, Bihar. Low entry fees from ₹10, fast UPI withdrawals. Play from Kankarbagh, Bailey Road, or anywhere in Bihar.',
  datePublished: '2026-02-02T00:00:00+05:30',
  dateModified: '2026-02-02T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/patna-tournaments',
  image: 'https://www.battlexzone.com/locations/patna-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Patna', 'Free Fire Patna', 'Patna esports', 'Bihar gaming', 'Kankarbagh BGMI'],
  wordCount: 1800,
};

const localBusinessData = {
  name: 'BattleXZone Patna',
  description: 'Daily online BGMI & Free Fire tournaments with cash prizes for Patna and Bihar players.',
  url: 'https://www.battlexzone.com/locations/patna-tournaments',
  areaServed: { '@type': 'City', name: 'Patna', containedInPlace: { '@type': 'State', name: 'Bihar' } },
};

const patnaFAQs = [
  {
    question: 'How do Patna players join BGMI tournaments?',
    answer: 'Sign up on BattleXZone (free), complete quick KYC, add money via UPI (minimum ₹10), and join daily matches. Everything is online — play from Kankarbagh, Bailey Road, or any part of Bihar.',
  },
  {
    question: 'What are the prize pools in Patna tournaments?',
    answer: 'Entry-level matches (₹10-25) have ₹1,000-5,000 prize pools. Larger squad events regularly offer ₹10,000-30,000+. Many Patna players earn consistent side income.',
  },
  {
    question: 'Is cash gaming legal in Bihar?',
    answer: 'Yes. Skill-based BGMI and Free Fire tournaments are legal in Bihar. BattleXZone is fully compliant with KYC and fair play rules.',
  },
];

export default function PatnaTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Patna Tournaments', url: 'https://www.battlexzone.com/locations/patna-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-blue-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span>Patna Tournaments</span>
            </nav>

            <h1 className="text-4xl sm:text-5xl font-black mb-4">BGMI Tournaments in Patna 2026</h1>
            <p className="text-xl text-dark-300 max-w-3xl">
              Daily cash prize BGMI &amp; Free Fire tournaments for Patna players. Low entry, high rewards. Play online from anywhere in Bihar.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/matches" className="btn-primary px-8 py-3 text-lg">Browse Matches</Link>
              <Link href="/register" className="btn-outline px-8 py-3 text-lg">Join Free</Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-12 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Why Patna Gamers Choose BattleXZone</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-5">🏆 <strong>₹10 entry</strong> — Start winning from just 10 rupees.</div>
              <div className="card p-5">💸 <strong>Fast UPI payouts</strong> — Withdraw winnings in minutes.</div>
              <div className="card p-5">🎮 <strong>Daily matches</strong> — 25+ tournaments every day for Patna players.</div>
            </div>
          </section>

          <FAQ faqs={patnaFAQs} title="Patna Gaming FAQ" />

          <div className="text-center pt-8 border-t border-dark-700">
            <p className="text-dark-400">Ready to compete? Join thousands of Patna gamers earning real money.</p>
            <Link href="/matches" className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-primary-500 to-gaming-purple rounded-xl font-semibold">Start Playing Now →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
