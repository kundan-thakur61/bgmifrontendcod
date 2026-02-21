import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

// SEO Metadata for Mumbai
export const metadata = generateLocationMetadata('Mumbai', 'Maharashtra');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Mumbai 2026 - Win Cash Prizes',
  excerpt: 'Join BGMI and Free Fire tournaments in Mumbai. Play daily online gaming tournaments, win real cash prizes. Complete guide for Mumbai gamers.',
  datePublished: '2026-01-26T00:00:00+05:30',
  dateModified: '2026-01-26T00:00:00+05:30',
  author: 'BattleZone Team',
  url: 'https://www.battlexzone.com/locations/mumbai-tournaments',
  image: 'https://www.battlexzone.com/locations/mumbai-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Mumbai', 'Free Fire tournaments Mumbai', 'gaming Mumbai', 'esports Mumbai'],
  wordCount: 2500,
};

const localBusinessData = {
  name: 'BattleZone Mumbai',
  description: 'Join BGMI and Free Fire tournaments in Mumbai. Play daily online gaming tournaments and win real cash prizes.',
  url: 'https://www.battlexzone.com/locations/mumbai-tournaments',
  areaServed: {
    '@type': 'City',
    name: 'Mumbai',
    containedInPlace: {
      '@type': 'State',
      name: 'Maharashtra',
    },
  },
};

const mumbaiFAQs = [
  {
    question: 'How can I join BGMI tournaments in Mumbai?',
    answer: 'To join BGMI tournaments in Mumbai, register on BattleZone, complete KYC verification with your Aadhaar/PAN, add money to your wallet via UPI, and browse Mumbai-based tournaments. You can participate from anywhere in Mumbai including Andheri, Bandra, Thane, Navi Mumbai, and all suburbs. Room credentials are shared online before match time.',
  },
  {
    question: 'Are there Free Fire tournaments for Mumbai players?',
    answer: 'Yes, BattleZone hosts daily Free Fire tournaments for Mumbai players. Entry fees start from Rs.10 and you can win cash prizes up to Rs.10,000+ depending on the tournament tier. Both Battle Royale and Clash Squad formats are available. Mumbai players can join from anywhere in the city.',
  },
  {
    question: 'What is the prize pool for Mumbai gaming tournaments?',
    answer: 'Mumbai gaming tournaments on BattleZone offer varying prize pools: Entry-level tournaments (Rs.10-20 entry) have prize pools of Rs.500-2000. Mid-tier tournaments (Rs.50-100 entry) offer Rs.2000-10000 prizes. Premium tournaments (Rs.200+ entry) can have prize pools exceeding Rs.50000. Special Mumbai events may have even larger prizes.',
  },
  {
    question: 'Can I play Mumbai tournaments from anywhere in the city?',
    answer: 'Yes, all BattleZone tournaments are online, so you can participate from anywhere in Mumbai including South Mumbai, Western Suburbs (Andheri, Bandra, Borivali), Central Suburbs (Thane, Mulund), Navi Mumbai, and beyond. You just need a stable internet connection and your mobile device.',
  },
  {
    question: 'How do I withdraw winnings in Mumbai?',
    answer: 'Mumbai players can withdraw tournament winnings via UPI (Google Pay, PhonePe, Paytm), direct bank transfer (NEFT/IMPS), or Paytm wallet. Minimum withdrawal is Rs.100 and processing takes 24-48 hours. Ensure your KYC documents match your bank account name for smooth withdrawals.',
  },
  {
    question: 'Are there any gaming cafes in Mumbai for tournaments?',
    answer: 'While BattleZone tournaments are online and can be played from home, Mumbai has several gaming cafes including in Andheri, Bandra, and Thane. However, for best performance in tournaments, we recommend playing from a location with stable WiFi and minimal distractions.',
  },
  {
    question: 'What internet speed do I need for Mumbai tournaments?',
    answer: 'For smooth tournament gameplay in Mumbai, we recommend minimum 10 Mbps internet speed with low ping (under 50ms). Jio Fiber, Airtel Xstream, and local broadband providers offer good connectivity across Mumbai. Mobile data (4G/5G) also works well if WiFi is unavailable.',
  },
  {
    question: 'Is playing tournaments legal in Mumbai?',
    answer: 'Yes, playing skill-based gaming tournaments is completely legal in Mumbai and Maharashtra. BGMI, Free Fire, and other skill games are protected under Indian law. BattleZone operates legally with proper verification and taxation compliance. Players must be 18+ to participate in cash tournaments.',
  },
];

export default function MumbaiTournaments() {
  return (
    <>
      <Navbar />
      
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Mumbai Tournaments', url: 'https://www.battlexzone.com/locations/mumbai-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-blue-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Mumbai Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium">
                Mumbai
              </span>
              <span className="text-dark-400 text-sm">January 26, 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-6 leading-tight">
              BGMI & Free Fire Tournaments in <span className="gradient-text">Mumbai</span>
            </h1>

            <div className="bg-dark-800 border-l-4 border-blue-500 rounded-r-lg p-4 sm:p-6 mb-8">
              <p className="text-lg text-white leading-relaxed">
                Join <strong>daily BGMI and Free Fire tournaments</strong> for Mumbai players. 
                Compete with gamers from Andheri, Bandra, Thane, Navi Mumbai and win 
                <strong> real cash prizes</strong>. Entry fees start from just <strong>Rs.10</strong>. 
                Play from anywhere in Mumbai - all you need is your mobile and internet!
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/matches" className="btn-primary">
                Browse Mumbai Tournaments
              </Link>
              <Link href="/register" className="btn-secondary">
                Register Free
              </Link>
            </div>
          </div>
        </section>

        {/* Mumbai Areas */}
        <section className="py-12 px-3 sm:px-4 border-b border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Across All Mumbai Areas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {['Andheri', 'Bandra', 'Thane', 'Navi Mumbai', 'Borivali', 'Mulund', 'Chembur', 'Powai', 'Vashi', 'Dadar', 'South Mumbai', 'Kurla'].map((area) => (
                <div key={area} className="bg-dark-800 rounded-lg p-3 text-center text-sm text-dark-300 border border-dark-700">
                  {area}
                </div>
              ))}
            </div>
            <p className="text-dark-400 text-sm mt-4 text-center">
              Play from anywhere in Mumbai - all tournaments are online!
            </p>
          </div>
        </section>

        {/* Tournament Types */}
        <section className="py-16 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Tournament Types for Mumbai Players</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 border border-dark-700">
                <div className="text-3xl mb-3">🎮</div>
                <h3 className="text-xl font-bold mb-2 text-white">BGMI Tournaments</h3>
                <p className="text-dark-400 mb-4">Solo, Duo & Squad formats available</p>
                <ul className="space-y-2 text-dark-300 text-sm">
                  <li>• Entry: Rs.10 - Rs.500</li>
                  <li>• Prize pools: Rs.500 - Rs.50000+</li>
                  <li>• Multiple daily matches</li>
                  <li>• 1vs1, 1vs2, 1vs3, 1vs4 formats</li>
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
                  <li>• Fast 15-20 min matches</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Join */}
        <section className="py-16 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">How to Join Mumbai Tournaments</h2>
            
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
                <p className="text-2xl sm:text-3xl font-bold text-primary-400">1000+</p>
                <p className="text-sm text-dark-400">Mumbai Players</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-green-400">50+</p>
                <p className="text-sm text-dark-400">Daily Matches</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">₹5L+</p>
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
            faqs={mumbaiFAQs}
            title="Mumbai Tournament FAQs"
            subtitle="Common questions about gaming tournaments in Mumbai"
            showSchema={true}
          />
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Compete, Mumbai?</h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of Mumbai gamers already winning cash prizes. Your first tournament is just minutes away!
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
