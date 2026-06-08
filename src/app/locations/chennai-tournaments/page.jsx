import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Chennai', 'Tamil Nadu');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Chennai 2026 - Win Real Cash',
  excerpt: 'Daily BGMI and Free Fire cash tournaments for Chennai players. Join from T Nagar, Velachery, Anna Nagar, Tambaram and win prizes on BattleXZone.',
  datePublished: '2026-02-01T00:00:00+05:30',
  dateModified: '2026-02-01T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/chennai-tournaments',
  image: 'https://www.battlexzone.com/locations/chennai-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Chennai', 'Free Fire tournaments Chennai', 'gaming Chennai', 'esports Chennai', 'T Nagar BGMI'],
  wordCount: 2100,
};

const localBusinessData = {
  name: 'BattleXZone Chennai',
  description: 'Chennai\'s daily BGMI & Free Fire online tournaments. Low entry fees, real cash prizes, fast UPI withdrawals.',
  url: 'https://www.battlexzone.com/locations/chennai-tournaments',
  areaServed: { '@type': 'City', name: 'Chennai', containedInPlace: { '@type': 'State', name: 'Tamil Nadu' } },
};

const chennaiFAQs = [
  {
    question: 'How can Chennai players join BGMI tournaments?',
    answer: 'Sign up on BattleXZone (free), complete KYC, add money starting at ₹10 via UPI, then join any of the daily BGMI or Free Fire matches. All tournaments are online — play from T Nagar, Velachery, Anna Nagar, Tambaram, Porur or anywhere with stable internet.',
  },
  {
    question: 'What entry fees and prize pools are available in Chennai?',
    answer: 'Entry fees start from just ₹10. Daily low-stake matches have ₹500-3000 prize pools. Mid and premium tournaments (₹50-200 entry) regularly offer ₹5,000 - ₹30,000+ total prizes. Chennai players have won over ₹1 Lakh combined on the platform.',
  },
  {
    question: 'Is low ping possible from Chennai for BGMI tournaments?',
    answer: 'Yes. Most Chennai players on fiber (Airtel, Jio, ACT, BSNL) report excellent ping under 40ms to our servers. 4G/5G also works well for most matches.',
  },
  {
    question: 'How do I withdraw money won in Chennai tournaments?',
    answer: 'UPI withdrawals are the fastest (usually within 24 hours after verification). You can also withdraw to bank account. Minimum withdrawal amount is ₹100.',
  },
];

export default function ChennaiTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Chennai Tournaments', url: 'https://www.battlexzone.com/locations/chennai-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-orange-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Chennai Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm font-medium">Chennai</span>
              <span className="text-dark-400 text-sm">February 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              BGMI &amp; Free Fire Tournaments in <span className="gradient-text">Chennai</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mb-8">
              Compete in daily BGMI and Free Fire cash prize tournaments from Chennai. Entry fees from ₹10. Play online from T Nagar, Velachery, Anna Nagar or any part of the city. Fast UPI payouts.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/tournaments" className="btn-primary">Join Chennai Matches Today</Link>
              <Link href="/register" className="btn-secondary">Start Playing Free</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[{label:'Chennai Players',value:'700+'},{label:'Daily Matches',value:'35+'},{label:'Prizes Paid',value:'₹8L+'}].map((s,i)=>(
              <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                <div className="text-3xl font-bold text-primary-400">{s.value}</div><div className="text-dark-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Chennai Areas We See Most Players From</h2>
            <div className="flex flex-wrap gap-2">
              {['T Nagar','Velachery','Anna Nagar','Tambaram','Porur','Adyar','OMR','Guindy','Nungambakkam','Kodambakkam'].map(a => <span key={a} className="px-3 py-1 bg-dark-800 rounded text-sm border border-dark-700">{a}</span>)}
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Quick Start for Chennai Gamers</h2>
            <ol className="space-y-3 text-dark-300 list-decimal list-inside">
              <li>Create your free BattleXZone account</li>
              <li>Verify with Aadhaar or PAN (required for withdrawals)</li>
              <li>Add money via UPI (minimum ₹10)</li>
              <li>Filter matches for your preferred time or entry fee</li>
              <li>Play the match and submit result screenshot</li>
              <li>Withdraw winnings to UPI or bank</li>
            </ol>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Chennai Tournament FAQs</h2>
            <FAQ faqs={chennaiFAQs} title="Chennai Player Questions" />
          </div>
        </section>

        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Chennai&apos;s Top Gamers Play Here</h2>
            <p className="text-dark-300 mb-8">Be the next Chennai champion. Thousands of local players are already competing and cashing out daily.</p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4 inline-block">Join BattleXZone Free</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
