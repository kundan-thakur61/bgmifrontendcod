import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';
import { Suspense } from 'react';

export const metadata = PAGE_SEO.search;

const searchData = [
  // Matches & Tournaments
  { title: 'BGMI Tournaments', url: '/tournaments', category: 'Tournaments', description: 'Compete in BGMI tournaments and win real money' },
  { title: 'Free Fire Tournaments', url: '/tournaments', category: 'Tournaments', description: 'Join Free Fire tournaments with cash prizes' },
  { title: 'Live Matches', url: '/matches', category: 'Matches', description: 'Browse ongoing and upcoming matches' },
  { title: 'My Matches', url: '/profile/history', category: 'Profile', description: 'View your match history and results' },
  
  // Guides
  { title: 'BGMI Tournament Guide 2026', url: '/blog/bgmi-tournament-guide-2026', category: 'Guide', description: 'Complete guide to winning BGMI tournaments' },
  { title: 'Free Fire Tournament Tips', url: '/blog/free-fire-tournament-tips', category: 'Guide', description: 'Pro strategies for Free Fire tournaments' },
  { title: 'How to Earn Money Gaming', url: '/blog/how-to-earn-money-gaming-india', category: 'Guide', description: 'Earn real money playing games in India' },
  { title: 'BGMI vs Free Fire', url: '/blog/bgmi-vs-free-fire-which-is-better', category: 'Guide', description: 'Which game is better for tournaments' },
  { title: 'How to Win BGMI Tournaments', url: '/blog/how-to-win-bgmi-tournaments-2024', category: 'Guide', description: 'Expert tips for winning BGMI' },
  
  // Cities
  { title: 'Mumbai Tournaments', url: '/locations/mumbai-tournaments', category: 'City', description: 'BGMI & Free Fire tournaments in Mumbai' },
  { title: 'Delhi NCR Tournaments', url: '/locations/delhi-tournaments', category: 'City', description: 'Gaming tournaments in Delhi, Noida, Gurgaon' },
  { title: 'Bangalore Tournaments', url: '/locations/bangalore-tournaments', category: 'City', description: 'Esports tournaments in Bangalore' },
  { title: 'All Cities', url: '/locations', category: 'City', description: 'Find tournaments in your city' },
  
  // Pages
  { title: 'How It Works', url: '/how-it-works', category: 'Info', description: 'Learn how BattleZone works' },
  { title: 'Leaderboard', url: '/leaderboard', category: 'Info', description: 'Top players and rankings' },
  { title: 'Wallet', url: '/wallet', category: 'Account', description: 'Add money and withdraw winnings' },
  { title: 'KYC Verification', url: '/kyc', category: 'Account', description: 'Verify your identity' },
  { title: 'Fair Play Policy', url: '/fair-play', category: 'Info', description: 'Our anti-cheat systems' },
  { title: 'Tournament Rules', url: '/rules', category: 'Info', description: 'Official tournament guidelines' },
  { title: 'FAQ', url: '/faq', category: 'Info', description: 'Frequently asked questions' },
  { title: 'Blog', url: '/blog', category: 'Info', description: 'Gaming tips and news' },
  { title: 'Contact Us', url: '/contact', category: 'Info', description: 'Get in touch with support' },
];

function SearchContent() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-dark-400">Enter a search term to find tournaments, guides, and more...</p>
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }) {
  const query = searchParams?.q?.toLowerCase() || '';
  
  const results = query 
    ? searchData.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    : [];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlezone.com' },
        { name: 'Search', url: 'https://battlezone.com/search' },
      ]} />
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Search */}
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-primary-900/30 to-dark-900">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-6">
              Search <span className="gradient-text">BattleZone</span>
            </h1>
            
            <form action="/search" method="GET" className="relative max-w-xl mx-auto">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search tournaments, guides, cities..."
                className="w-full px-6 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 pr-14"
                autoFocus
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            {query ? (
              <>
                <p className="text-dark-400 mb-6">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                </p>

                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <Link
                        key={index}
                        href={result.url}
                        className="block bg-dark-800 rounded-xl p-4 sm:p-5 border border-dark-700 hover:border-primary-500 transition-all hover:transform hover:-translate-x-1"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white hover:text-primary-400 transition-colors">
                            {result.title}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-dark-700 rounded text-dark-400">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-dark-400 text-sm">{result.description}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
                    <p className="text-dark-400 mb-6">Try searching for: tournaments, BGMI, Free Fire, Mumbai, Delhi...</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['tournaments', 'BGMI', 'Free Fire', 'Mumbai', 'earn money', 'guides'].map((term) => (
                        <Link
                          key={term}
                          href={`/search?q=${encodeURIComponent(term)}`}
                          className="px-3 py-1 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 transition-colors"
                        >
                          {term}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
                <SearchContent />
              </Suspense>
            )}
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">Popular Searches</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'BGMI Tournaments', url: '/tournaments' },
                { label: 'Free Fire Tips', url: '/blog/free-fire-tournament-tips' },
                { label: 'How to Earn Money', url: '/blog/how-to-earn-money-gaming-india' },
                { label: 'Mumbai Tournaments', url: '/locations/mumbai-tournaments' },
                { label: 'Live Matches', url: '/matches' },
                { label: 'Tournament Rules', url: '/rules' },
              ].map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className="flex items-center justify-between p-4 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500 transition-colors group"
                >
                  <span className="text-dark-300 group-hover:text-white transition-colors">{item.label}</span>
                  <svg className="w-4 h-4 text-dark-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
