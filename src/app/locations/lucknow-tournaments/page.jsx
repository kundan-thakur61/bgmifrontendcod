import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Lucknow', 'Uttar Pradesh');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Lucknow 2026 - Daily Cash Prizes',
  excerpt: 'Lucknow BGMI tournaments with real money prizes. Play from Gomti Nagar, Indira Nagar, Aliganj. Entry fees starting at ₹10 on BattleXZone.',
  datePublished: '2026-02-02T00:00:00+05:30',
  dateModified: '2026-02-02T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/lucknow-tournaments',
  image: 'https://www.battlexzone.com/locations/lucknow-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI Lucknow', 'Free Fire Lucknow', 'Lucknow esports', 'Gomti Nagar gaming', 'UP tournaments'],
  wordCount: 1750,
};

const localBusinessData = {
  name: 'BattleXZone Lucknow',
  description: 'Daily online BGMI and Free Fire cash tournaments for players across Lucknow and Uttar Pradesh.',
  url: 'https://www.battlexzone.com/locations/lucknow-tournaments',
  areaServed: { '@type': 'City', name: 'Lucknow', containedInPlace: { '@type': 'State', name: 'Uttar Pradesh' } },
};

const lucknowFAQs = [
  {
    question: 'How can I join BGMI tournaments from Lucknow?',
    answer: 'Create a free account on BattleXZone, complete KYC with Aadhaar/PAN, add funds via UPI, and join any of the daily matches. 100% online — play from Gomti Nagar, Indira Nagar, or any area with good internet.',
  },
  {
    question: 'Are there regular tournaments in Lucknow?',
    answer: 'Yes. We run 25-30+ matches daily for Lucknow and UP players across solo, duo and squad formats. Prize pools range from a few thousand to over ₹25,000 in premium events.',
  },
];
 
export default function LucknowTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Lucknow Tournaments', url: 'https://www.battlexzone.com/locations/lucknow-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-emerald-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">BGMI Tournaments in Lucknow</h1>
            <p className="text-xl text-dark-300">Daily cash prize BGMI &amp; Free Fire events for Lucknow players. Low entry, real winnings, fast payouts.</p>
            <div className="mt-6">
              <Link href="/matches" className="btn-primary px-8 py-3">Join a Match</Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-12">
          <FAQ faqs={lucknowFAQs} title="Lucknow FAQ" />
          <div className="text-center mt-10">
            <Link href="/register" className="text-primary-400 hover:underline">Sign up free and start earning →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
