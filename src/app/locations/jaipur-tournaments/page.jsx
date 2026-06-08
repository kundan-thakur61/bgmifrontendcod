import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Jaipur', 'Rajasthan');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Jaipur 2026 - Win Cash Prizes Daily',
  excerpt: 'Join BGMI and Free Fire cash tournaments in Jaipur. Play from Vaishali Nagar, Mansarovar, Malviya Nagar, C-Scheme and win real money prizes. Entry from ₹10 on BattleXZone.',
  datePublished: '2026-02-02T00:00:00+05:30',
  dateModified: '2026-02-02T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/jaipur-tournaments',
  image: 'https://www.battlexzone.com/locations/jaipur-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Jaipur', 'Free Fire Jaipur', 'gaming Jaipur', 'esports Rajasthan', 'Mansarovar BGMI'],
  wordCount: 2000,
};

const localBusinessData = {
  name: 'BattleXZone Jaipur',
  description: 'Daily BGMI & Free Fire online tournaments with real cash prizes for Jaipur players. Low entry fees and fast UPI withdrawals.',
  url: 'https://www.battlexzone.com/locations/jaipur-tournaments',
  areaServed: { '@type': 'City', name: 'Jaipur', containedInPlace: { '@type': 'State', name: 'Rajasthan' } },
};

const jaipurFAQs = [
  {
    question: 'How can Jaipur players participate in BGMI tournaments?',
    answer: 'Register free on BattleXZone, verify with KYC (Aadhaar/PAN), add ₹10 or more via UPI, and join daily matches. Tournaments are 100% online so you can play from Vaishali Nagar, Mansarovar, Malviya Nagar, C-Scheme, or any area with decent internet.',
  },
  {
    question: 'What prize money can Jaipur players expect?',
    answer: 'Entry-level ₹10-25 matches usually have ₹800-4,000 prize pools. Regular squad and premium events offer ₹8,000-25,000+ total prizes. Several Jaipur players are earning consistent side income through evening tournaments.',
  },
  {
    question: 'Is BattleXZone legal in Rajasthan?',
    answer: 'Yes. Skill-based BGMI and Free Fire tournaments are legal across Rajasthan. BattleXZone operates with proper KYC and compliance for all cash players.',
  },
];

export default function JaipurTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Jaipur Tournaments', url: 'https://www.battlexzone.com/locations/jaipur-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-rose-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Jaipur Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-rose-600/20 text-rose-400 rounded-full text-sm font-medium">Jaipur</span>
              <span className="text-dark-400 text-sm">February 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              BGMI &amp; Free Fire Tournaments in <span className="gradient-text">Jaipur</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mb-8">
              Daily cash tournaments for Jaipur gamers. Compete from Vaishali Nagar, Mansarovar, Malviya Nagar, C-Scheme and across the Pink City. Entry from ₹10. Real prizes paid fast via UPI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/matches" className="btn-primary">View Jaipur Matches</Link>
              <Link href="/register" className="btn-secondary">Start Playing Free</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[{label:'Jaipur Players',value:'420+'},{label:'Daily Matches',value:'25+'},{label:'Recent Payouts',value:'₹4L+'}].map((s,i)=>(
              <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700"><div className="text-3xl font-bold text-primary-400">{s.value}</div><div className="text-dark-400 mt-1">{s.label}</div></div>
            ))}
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Popular Jaipur Gaming Localities</h2>
            <div className="flex flex-wrap gap-2">
              {['Vaishali Nagar','Mansarovar','Malviya Nagar','C-Scheme','Tonk Road','Raja Park','Bani Park','Jagatpura','Sanganer','Pratap Nagar'].map(a => <span key={a} className="px-3 py-1 bg-dark-800 rounded text-sm border border-dark-700">{a}</span>)}
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Quick Start for Jaipur Players</h2>
            <ol className="list-decimal list-inside space-y-2 text-dark-300">
              <li>Register on BattleXZone (free, 30 seconds)</li>
              <li>Complete KYC with Aadhaar or PAN</li>
              <li>Add money via UPI (minimum ₹10)</li>
              <li>Join matches that fit your schedule</li>
              <li>Play, submit screenshots, and withdraw winnings</li>
            </ol>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Jaipur Tournament FAQs</h2>
            <FAQ faqs={jaipurFAQs} title="Jaipur Player Questions" />
          </div>
        </section>

        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Jaipur Gamers — Your Turn to Win</h2>
            <p className="text-dark-300 mb-8">The Rajasthan BGMI community is strong and growing. Start building your record and earnings on BattleXZone right now.</p>
            <Link href="/register" className="btn-primary px-10 py-3 text-lg">Create Account &amp; Join First Match</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
