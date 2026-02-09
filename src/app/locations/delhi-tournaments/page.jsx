import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

// SEO Metadata for Delhi
export const metadata = generateLocationMetadata('Delhi', 'Delhi NCR');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Delhi NCR 2026 - Win Cash Prizes',
  excerpt: 'Join BGMI and Free Fire tournaments in Delhi NCR. Play daily online gaming tournaments in Delhi, Noida, and Gurgaon. Win real cash prizes.',
  datePublished: '2026-01-26T00:00:00+05:30',
  dateModified: '2026-01-26T00:00:00+05:30',
  author: 'BattleZone Team',
  url: 'https://battlezone.com/locations/delhi-tournaments',
  image: 'https://battlezone.com/locations/delhi-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Delhi', 'Free Fire tournaments Delhi', 'gaming Delhi NCR', 'esports Delhi'],
  wordCount: 2500,
};

const localBusinessData = {
  name: 'BattleZone Delhi NCR',
  description: 'Join BGMI and Free Fire tournaments in Delhi NCR. Play daily online gaming tournaments in Delhi, Noida, and Gurgaon.',
  url: 'https://battlezone.com/locations/delhi-tournaments',
  areaServed: {
    '@type': 'City',
    name: 'Delhi',
    containedInPlace: {
      '@type': 'State',
      name: 'Delhi',
    },
  },
};

const delhiFAQs = [
  {
    question: 'How can I join BGMI tournaments in Delhi NCR?',
    answer: 'To join BGMI tournaments in Delhi NCR, register on BattleZone, complete KYC verification, add money via UPI, and browse available tournaments. Delhi players from areas like South Delhi, West Delhi, Noida, and Gurgaon can all participate. Matches are online, so you can play from anywhere in the NCR region.',
  },
  {
    question: 'Are there gaming tournaments in Noida and Gurgaon?',
    answer: 'Yes, BattleZone tournaments are available for all NCR regions including Noida, Gurgaon (Gurugram), Ghaziabad, and Faridabad. Since tournaments are online, players from the entire Delhi NCR region can participate equally. Many top players from these areas compete daily.',
  },
  {
    question: 'What are the best internet providers for gaming in Delhi?',
    answer: 'For the best gaming experience in Delhi NCR, we recommend: Airtel Xstream Fiber (low latency), Jio Fiber (good coverage), Excitel (affordable plans), and Tata Play Fiber. For mobile gaming, Airtel and Jio 5G provide excellent speeds across Delhi, Noida, and Gurgaon.',
  },
  {
    question: 'How do Delhi players withdraw tournament winnings?',
    answer: 'Delhi NCR players can withdraw winnings via UPI (Google Pay, PhonePe, Paytm), bank transfer (NEFT/IMPS), or digital wallets. Minimum withdrawal is Rs.100 with 24-48 hour processing. All major Delhi banks are supported including SBI, HDFC, ICICI, and Axis Bank.',
  },
  {
    question: 'Is it legal to play cash tournaments in Delhi?',
    answer: 'Yes, playing skill-based gaming tournaments is completely legal in Delhi NCR. BGMI, Free Fire, and other skill games are protected under Indian law as games of skill, not gambling. BattleZone operates legally with proper verification and tax compliance.',
  },
  {
    question: 'Are there any offline gaming events in Delhi?',
    answer: 'While BattleZone focuses on online tournaments (allowing play from anywhere), Delhi NCR occasionally hosts offline gaming events and LAN tournaments in venues across South Delhi, Noida, and Gurgaon. Online tournaments remain the most accessible way to compete daily.',
  },
];

export default function DelhiTournaments() {
  return (
    <>
      <Navbar />
      
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlezone.com' },
        { name: 'Delhi NCR Tournaments', url: 'https://battlezone.com/locations/delhi-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-red-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Delhi NCR Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-medium">
                Delhi NCR
              </span>
              <span className="text-dark-400 text-sm">January 26, 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-6 leading-tight">
              BGMI & Free Fire Tournaments in <span className="gradient-text">Delhi NCR</span>
            </h1>

            <div className="bg-dark-800 border-l-4 border-red-500 rounded-r-lg p-4 sm:p-6 mb-8">
              <p className="text-lg text-white leading-relaxed">
                Join <strong>daily BGMI and Free Fire tournaments</strong> for Delhi NCR players. 
                Compete with gamers from Delhi, Noida, Gurgaon, Ghaziabad and win 
                <strong> real cash prizes</strong>. Entry fees start from just <strong>Rs.10</strong>. 
                Play from anywhere in the NCR region!
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/matches" className="btn-primary">
                Browse Delhi Tournaments
              </Link>
              <Link href="/register" className="btn-secondary">
                Register Free
              </Link>
            </div>
          </div>
        </section>

        {/* Delhi NCR Areas */}
        <section className="py-12 px-3 sm:px-4 border-b border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Across Delhi NCR</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {['New Delhi', 'South Delhi', 'West Delhi', 'East Delhi', 'North Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad', 'Dwarka', 'Rohini', 'Greater Noida'].map((area) => (
                <div key={area} className="bg-dark-800 rounded-lg p-3 text-center text-sm text-dark-300 border border-dark-700">
                  {area}
                </div>
              ))}
            </div>
            <p className="text-dark-400 text-sm mt-4 text-center">
              Play from anywhere in Delhi NCR - all tournaments are online!
            </p>
          </div>
        </section>

        {/* Tournament Types */}
        <section className="py-16 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Tournament Types for Delhi NCR Players</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 border border-dark-700">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="text-xl font-bold mb-2 text-white">BGMI Tournaments</h3>
                <p className="text-dark-400 mb-4">Solo, Duo & Squad formats available</p>
                <ul className="space-y-2 text-dark-300 text-sm">
                  <li>• Entry: Rs.10 - Rs.500</li>
                  <li>• Prize pools: Rs.500 - Rs.50000+</li>
                  <li>• Multiple daily matches</li>
                  <li>• All skill levels welcome</li>
                </ul>
              </div>

              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 border border-dark-700">
                <div className="text-3xl mb-3">🔥</div>
                <h3 className="text-xl font-bold mb-2 text-white">Free Fire Tournaments</h3>
                <p className="text-dark-400 mb-4">BR & CS modes for all skill levels</p>
                <ul className="space-y-2 text-dark-300 text-sm">
                  <li>• Entry: Rs.10 - Rs.300</li>
                  <li>• Prize pools: Rs.500 - Rs.30000+</li>
                  <li>• High-frequency daily events</li>
                  <li>• Quick 15-20 min matches</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Join */}
        <section className="py-16 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">How to Join Delhi NCR Tournaments</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Register', desc: 'Create free account on BattleZone' },
                { step: '2', title: 'Verify KYC', desc: 'Upload Aadhaar/PAN for verification' },
                { step: '3', title: 'Add Money', desc: 'Deposit via UPI (min Rs.50)' },
                { step: '4', title: 'Play & Win', desc: 'Join tournaments & withdraw winnings' },
              ].map((item) => (
                <div key={item.step} className="bg-dark-800 rounded-xl p-5 text-center border border-dark-700">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-dark-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary-400">1200+</p>
                <p className="text-sm text-dark-400">NCR Players</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-green-400">60+</p>
                <p className="text-sm text-dark-400">Daily Matches</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">₹6L+</p>
                <p className="text-sm text-dark-400">Monthly Prizes</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-purple-400">24h</p>
                <p className="text-sm text-dark-400">Withdrawal Time</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-3 sm:px-4 border-t border-dark-700">
          <FAQ 
            faqs={delhiFAQs}
            title="Delhi NCR Tournament FAQs"
            subtitle="Common questions about gaming tournaments in Delhi NCR"
            showSchema={true}
          />
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Compete, Delhi?</h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of Delhi NCR gamers already winning cash prizes. Play from Delhi, Noida, Gurgaon, or anywhere in NCR!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Register Free
              </Link>
              <Link href="/matches" className="btn-secondary text-lg px-8 py-4">
                View Tournaments
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
