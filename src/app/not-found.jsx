import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';

export const metadata = {
  title: 'Page Not Found | BattleZone',
  description: 'The page you are looking for does not exist. Browse our BGMI tournaments, matches, and gaming guides.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="text-8xl mb-6">🎮</div>
          
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4">
            <span className="gradient-text">404</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Player Eliminated!
          </h2>
          
          <p className="text-dark-400 text-lg mb-8 max-w-md mx-auto">
            The page you are looking for has been dropped from the zone. 
            Respawn back to safety!
          </p>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home Base
            </Link>
            <Link 
              href="/matches"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl transition-colors border border-dark-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Join Match
            </Link>
          </div>

          {/* Suggested Links */}
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Popular Drops:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Tournaments', href: '/tournaments' },
                { label: 'Live Matches', href: '/matches' },
                { label: 'Gaming Blog', href: '/blog' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Leaderboard', href: '/leaderboard' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <p className="text-dark-500 text-sm mt-8">
            Think this is a bug?{' '}
            <Link href="/tickets" className="text-primary-400 hover:underline">
              Report it here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
