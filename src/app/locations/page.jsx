import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BreadcrumbSchema } from '@/components/seo';


const cities = [
  {
    name: 'Mumbai',
    slug: 'mumbai-tournaments',
    state: 'Maharashtra',
    players: '1000+',
    dailyMatches: '50+',
    description: 'Join BGMI & Free Fire tournaments in Mumbai. Play from Andheri, Bandra, Thane, Navi Mumbai.',
    keywords: ['Andheri', 'Bandra', 'Thane', 'Navi Mumbai', 'Borivali'],
  },
  {
    name: 'Delhi NCR',
    slug: 'delhi-tournaments',
    state: 'Delhi',
    players: '1200+',
    dailyMatches: '60+',
    description: 'Compete in Delhi NCR gaming tournaments. Available in Delhi, Noida, Gurgaon, Ghaziabad.',
    keywords: ['South Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'],
  },
  {
    name: 'Bangalore',
    slug: 'bangalore-tournaments',
    state: 'Karnataka',
    players: '1500+',
    dailyMatches: '70+',
    description: 'India\'s Silicon Valley gaming hub. Tournaments in Koramangala, HSR, Whitefield, Electronic City.',
    keywords: ['Koramangala', 'HSR Layout', 'Whitefield', 'Electronic City', 'Indiranagar'],
  },
];

const upcomingCities = [
  'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh',
];

export default function LocationsPage() {
  return (
    <>
      <Navbar />
      
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Tournaments by City', url: 'https://www.battlexzone.com/locations' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="py-16 px-3 sm:px-4 bg-gradient-to-b from-primary-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Tournaments by City</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-6">
              BGMI & Free Fire Tournaments by <span className="gradient-text">City</span>
            </h1>
            
            <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
              Find online gaming tournaments in your city. Compete with local players from 
              Mumbai, Delhi NCR, Bangalore, and more. All tournaments are online - play from anywhere!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/matches" className="btn-primary">
                Browse All Tournaments
              </Link>
              <Link href="/register" className="btn-secondary">
                Register Free
              </Link>
            </div>
          </div>
        </section>

        {/* Active Cities */}
        <section className="py-16 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
              Active Tournament <span className="gradient-text">Cities</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Link 
                  key={city.slug}
                  href={`/locations/${city.slug}`}
                  className="group bg-dark-800 rounded-xl p-4 sm:p-6 border border-dark-700 hover:border-primary-500 transition-all hover:transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-sm text-dark-400">{city.state}</p>
                    </div>
                    <span className="text-3xl">📍</span>
                  </div>

                  <p className="text-dark-300 text-sm mb-4">
                    {city.description}
                  </p>

                  <div className="flex gap-4 mb-4">
                    <div className="bg-dark-900/50 rounded-lg px-3 py-2">
                      <p className="text-lg font-bold text-primary-400">{city.players}</p>
                      <p className="text-xs text-dark-500">Players</p>
                    </div>
                    <div className="bg-dark-900/50 rounded-lg px-3 py-2">
                      <p className="text-lg font-bold text-green-400">{city.dailyMatches}</p>
                      <p className="text-xs text-dark-500">Daily Matches</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {city.keywords.slice(0, 3).map((keyword) => (
                      <span 
                        key={keyword}
                        className="text-xs px-2 py-1 bg-dark-700 rounded text-dark-400"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center text-primary-400 text-sm font-medium">
                    View Tournaments
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">How City Tournaments Work</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Select Your City', desc: 'Choose your city or nearest location' },
                { step: '2', title: 'Browse Tournaments', desc: 'Find matches for your skill level' },
                { step: '3', title: 'Join & Compete', desc: 'Play online from anywhere in your city' },
                { step: '4', title: 'Win & Withdraw', desc: 'Get winnings via UPI or bank transfer' },
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

        {/* Upcoming Cities */}
        <section className="py-16 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon to More Cities</h2>
            <p className="text-dark-400 text-center mb-8">
              We are expanding! Soon you will be able to join city-specific tournaments in:
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {upcomingCities.map((city) => (
                <span 
                  key={city}
                  className="px-4 py-2 bg-dark-800 rounded-lg text-dark-300 border border-dark-700"
                >
                  {city}
                </span>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-dark-400">
                Can not find your city?{' '}
                <Link href="/matches" className="text-primary-400 hover:underline">
                  Browse all tournaments
                </Link>{' '}
                - they are online and available nationwide!
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Represent Your City?</h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of players from your city competing daily. Show them who is the best!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Register Free
              </Link>
              <Link href="/matches" className="btn-secondary text-lg px-8 py-4">
                Browse Tournaments
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
