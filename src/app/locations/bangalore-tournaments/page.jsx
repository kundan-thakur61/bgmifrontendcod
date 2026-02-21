import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

// SEO Metadata for Bangalore
export const metadata = generateLocationMetadata('Bangalore', 'Karnataka');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Bangalore 2026 - Win Cash Prizes',
  excerpt: 'Join BGMI and Free Fire tournaments in Bangalore - India Silicon Valley. Play daily online gaming tournaments. Win real cash prizes. Tech city gaming hub.',
  datePublished: '2026-01-26T00:00:00+05:30',
  dateModified: '2026-01-26T00:00:00+05:30',
  author: 'BattleZone Team',
  url: 'https://www.battlexzone.com/locations/bangalore-tournaments',
  image: 'https://www.battlexzone.com/locations/bangalore-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Bangalore', 'Free Fire tournaments Bangalore', 'gaming Bangalore', 'esports Bangalore'],
  wordCount: 2500,
};

const localBusinessData = {
  name: 'BattleZone Bangalore',
  description: 'Join BGMI and Free Fire tournaments in Bangalore - India Silicon Valley. Play daily online gaming tournaments and win real cash prizes.',
  url: 'https://www.battlexzone.com/locations/bangalore-tournaments',
  areaServed: {
    '@type': 'City',
    name: 'Bangalore',
    containedInPlace: {
      '@type': 'State',
      name: 'Karnataka',
    },
  },
};

const bangaloreFAQs = [
  {
    question: 'How can I join BGMI tournaments in Bangalore?',
    answer: 'To join BGMI tournaments in Bangalore, register on BattleZone, complete KYC verification with Aadhaar/PAN, add money via UPI, and browse available tournaments. Bangalore players from Koramangala, HSR Layout, Whitefield, Electronic City, and all areas can participate. All tournaments are online.',
  },
  {
    question: 'Is Bangalore good for esports and gaming tournaments?',
    answer: 'Yes, Bangalore is one of India\'s top gaming hubs with excellent internet infrastructure, a large tech-savvy population, and many gaming enthusiasts. The city has produced numerous professional esports players and hosts a thriving gaming community. BattleZone has a strong Bangalore player base with daily tournaments.',
  },
  {
    question: 'What is the best internet for gaming in Bangalore?',
    answer: 'Bangalore has excellent internet options for gaming: Airtel Xstream Fiber (widely available), Jio Fiber (good speeds), ACT Fibernet (gaming-optimized), and Tata Play Fiber. Most tech areas like Koramangala, HSR Layout, and Whitefield have fiber connectivity with low latency ideal for competitive gaming.',
  },
  {
    question: 'Are there gaming cafes in Bangalore for tournaments?',
    answer: 'Bangalore has numerous gaming cafes in areas like Koramangala, Indiranagar, and MG Road. However, BattleZone tournaments are fully online, allowing you to compete from home with your own setup. Many Bangalore gamers prefer playing from home with their personalized gaming phones and WiFi setups.',
  },
  {
    question: 'How do Bangalore players withdraw winnings?',
    answer: 'Bangalore players can withdraw tournament winnings via UPI (Google Pay, PhonePe, Paytm), bank transfer, or digital wallets. Minimum withdrawal is Rs.100 with 24-48 hour processing. All major banks operating in Bangalore are supported. The tech-savvy population makes digital transactions smooth and quick.',
  },
  {
    question: 'Which areas in Bangalore have the most gamers?',
    answer: 'Top gaming areas in Bangalore include Koramangala, HSR Layout, Whitefield, Electronic City, Indiranagar, and Marathahalli. These tech hubs have high concentrations of IT professionals who actively participate in mobile gaming tournaments. However, players from all Bangalore areas can compete equally online.',
  },
];

export default function BangaloreTournaments() {
  return (
    <>
      <Navbar />
      
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Bangalore Tournaments', url: 'https://www.battlexzone.com/locations/bangalore-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-green-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Bangalore Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">
                Bangalore
              </span>
              <span className="text-dark-400 text-sm">January 26, 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-6 leading-tight">
              BGMI & Free Fire Tournaments in <span className="gradient-text">Bangalore</span>
            </h1>

            <div className="bg-dark-800 border-l-4 border-green-500 rounded-r-lg p-4 sm:p-6 mb-8">
              <p className="text-lg text-white leading-relaxed">
                Join <strong>daily BGMI and Free Fire tournaments</strong> in India's Silicon Valley. 
                Compete with tech professionals and gaming enthusiasts from Koramangala, HSR Layout, 
                Whitefield, Electronic City and win <strong>real cash prizes</strong>. 
                Entry fees start from just <strong>Rs.10</strong>!
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/matches" className="btn-primary">
                Browse Bangalore Tournaments
              </Link>
              <Link href="/register" className="btn-secondary">
                Register Free
              </Link>
            </div>
          </div>
        </section>

        {/* Bangalore Areas */}
        <section className="py-12 px-3 sm:px-4 border-b border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Across Bangalore</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {['Koramangala', 'HSR Layout', 'Whitefield', 'Electronic City', 'Indiranagar', 'Marathahalli', 'BTM Layout', 'JP Nagar', 'Jayanagar', 'MG Road', 'Bellandur', 'Sarjapur'].map((area) => (
                <div key={area} className="bg-dark-800 rounded-lg p-3 text-center text-sm text-dark-300 border border-dark-700">
                  {area}
                </div>
              ))}
            </div>
            <p className="text-dark-400 text-sm mt-4 text-center">
              Play from anywhere in Bangalore - all tournaments are online!
            </p>
          </div>
        </section>

        {/* Why Bangalore */}
        <section className="py-12 px-3 sm:px-4 bg-dark-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Bangalore is India's Gaming Hub</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                <div className="text-3xl mb-3">🌐</div>
                <h3 className="font-bold text-white mb-2">Best Internet</h3>
                <p className="text-sm text-dark-400">Fiber connectivity across tech areas with low latency</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="font-bold text-white mb-2">Tech Community</h3>
                <p className="text-sm text-dark-400">Large IT professional base with gaming passion</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-bold text-white mb-2">Esports Talent</h3>
                <p className="text-sm text-dark-400">Home to many professional esports players</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tournament Types */}
        <section className="py-16 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Tournament Types for Bangalore Players</h2>
            
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
            <h2 className="text-2xl font-bold mb-8 text-center">How to Join Bangalore Tournaments</h2>
            
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
                <p className="text-2xl sm:text-3xl font-bold text-primary-400">1500+</p>
                <p className="text-sm text-dark-400">Bangalore Players</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-green-400">70+</p>
                <p className="text-sm text-dark-400">Daily Matches</p>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">₹7L+</p>
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
            faqs={bangaloreFAQs}
            title="Bangalore Tournament FAQs"
            subtitle="Common questions about gaming tournaments in Bangalore"
            showSchema={true}
          />
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Compete, Bangalore?</h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
              Join Bangalore's thriving gaming community. Compete with tech professionals and win cash prizes!
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
