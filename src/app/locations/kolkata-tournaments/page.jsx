import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Kolkata', 'West Bengal');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Kolkata 2026 - Win Real Cash Prizes',
  excerpt: 'Join daily BGMI and Free Fire cash tournaments in Kolkata. Play from Salt Lake, Park Street, Howrah, New Town and win real money on BattleXZone. Low entry from ₹10.',
  datePublished: '2026-02-02T00:00:00+05:30',
  dateModified: '2026-02-02T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/kolkata-tournaments',
  image: 'https://www.battlexzone.com/locations/kolkata-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Kolkata', 'Free Fire tournaments Kolkata', 'gaming Kolkata', 'esports Kolkata', 'Salt Lake BGMI'],
  wordCount: 2150,
};

const localBusinessData = {
  name: 'BattleXZone Kolkata',
  description: 'Daily online BGMI & Free Fire tournaments for Kolkata players. Real cash prizes, fast UPI withdrawals, entry from ₹10.',
  url: 'https://www.battlexzone.com/locations/kolkata-tournaments',
  areaServed: { '@type': 'City', name: 'Kolkata', containedInPlace: { '@type': 'State', name: 'West Bengal' } },
};

const kolkataFAQs = [
  {
    question: 'How do Kolkata players join BGMI tournaments on BattleXZone?',
    answer: 'Create a free account, complete KYC with Aadhaar/PAN, add money starting at ₹10 via UPI (PhonePe, GPay, Paytm), then join daily matches. All tournaments are online — play from Salt Lake, Park Street, New Town, Howrah, Behala or anywhere with a stable connection.',
  },
  {
    question: 'Are there good prize pools for Kolkata gamers?',
    answer: 'Yes. Daily low-entry tournaments (₹10-25) have ₹1,000-6,000 prize pools. Mid-tier and squad events frequently cross ₹15,000-40,000 total prizes. Kolkata players have cashed out significant amounts in evening and night scrims.',
  },
  {
    question: 'What internet works best for low ping in Kolkata tournaments?',
    answer: 'Most players in Salt Lake, New Town, and central Kolkata report excellent results on Jio Fiber, Airtel Xstream, or local broadband (under 40ms ping). 5G also performs well for most BGMI and Free Fire matches.',
  },
  {
    question: 'How fast are withdrawals for Kolkata winners?',
    answer: 'UPI withdrawals are typically processed within 24-48 hours after result verification. Bank transfers take 1-3 working days. Minimum withdrawal is ₹100.',
  },
];

export default function KolkataTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Kolkata Tournaments', url: 'https://www.battlexzone.com/locations/kolkata-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-blue-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Kolkata Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">Kolkata</span>
              <span className="text-dark-400 text-sm">February 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              BGMI &amp; Free Fire Tournaments in <span className="gradient-text">Kolkata</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mb-8">
              Daily cash prize BGMI and Free Fire tournaments for Kolkata players. Join from Salt Lake, New Town, Park Street, Howrah or anywhere in the city. Entry starts at just ₹10. Fast UPI payouts.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/tournaments" className="btn-primary">Browse Kolkata Matches</Link>
              <Link href="/register" className="btn-secondary">Register Free</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[{label:'Active Kolkata Players',value:'650+'},{label:'Daily Matches',value:'35+'},{label:'Prizes This Month',value:'₹7L+'}].map((s,i)=>(
              <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700"><div className="text-3xl font-bold text-primary-400">{s.value}</div><div className="text-dark-400 mt-1">{s.label}</div></div>
            ))}
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Popular Areas in Kolkata</h2>
            <div className="flex flex-wrap gap-2">
              {['Salt Lake','New Town','Park Street','Howrah','Behala','Garia','Dumdum','Ballygunge','Rajarhat','Tollygunge'].map(a => <span key={a} className="px-3 py-1.5 bg-dark-800 rounded-lg text-sm border border-dark-700">{a}</span>)}
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">How Kolkata Players Are Winning on BattleXZone</h2>
            <div className="space-y-3 text-dark-300">
              <p>1. Sign up with mobile (30 seconds) or Google.</p>
              <p>2. Complete KYC once (Aadhaar or PAN) — required for all cash withdrawals.</p>
              <p>3. Add funds via UPI starting ₹10.</p>
              <p>4. Join evening or night scrims that suit your schedule.</p>
              <p>5. Submit verified screenshots after matches.</p>
              <p>6. Withdraw winnings directly to UPI or bank.</p>
            </div>
            <p className="mt-4"><Link href="/how-it-works" className="text-primary-400 hover:underline">Full step-by-step →</Link></p>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Kolkata Tournament FAQs</h2>
            <FAQ faqs={kolkataFAQs} title="Kolkata Player Questions" />
          </div>
        </section>

        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Kolkata Gamers — Start Earning Today</h2>
            <p className="text-dark-300 mb-8">The city has a massive and passionate gaming community. Join thousands of Kolkata players already competing and cashing out on BattleXZone.</p>
            <Link href="/register" className="btn-primary px-10 py-3 text-lg">Create Free Account &amp; Play Now</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
