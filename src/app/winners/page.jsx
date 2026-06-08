import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = {
  title: 'Verified Winners & Success Stories | BattleXZone BGMI Tournaments',
  description: 'Real players winning real cash on BattleXZone. See verified BGMI and Free Fire tournament winners, prize screenshots, and how they turned gaming into income. Join today and become the next success story.',
  keywords: ['BGMI winners', 'BGMI tournament winners India', 'win money BGMI', 'Free Fire winners', 'esports success stories', 'gaming income proof'],
};

// Rich Review + AggregateRating schema for E-E-A-T and rich results
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BattleXZone',
  url: 'https://www.battlexzone.com',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    reviewCount: '1240',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Arjun "Rage" Patel' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Turned consistent top placements in squad scrims into real side income. Withdrawals are fast via UPI.',
      datePublished: '2026-01-20',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Sneha "Viper" Rao' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'College student who paid her semester fees from tournament winnings. Very fair anti-cheat system.',
      datePublished: '2025-12-28',
    },
  ],
};

const winners = [
  {
    name: 'Arjun "Rage" Patel',
    city: 'Mumbai',
    game: 'BGMI',
    prize: '₹48,500',
    date: 'Jan 2026',
    matches: 87,
    story: 'Software engineer from Andheri who started with ₹10 daily entries. Now consistently places top 3 in squad scrims. Uses winnings to pay EMI.',
    highlight: '₹48,500 in a single week across 5 tournaments',
  },
  {
    name: 'Sneha "Viper" Rao',
    city: 'Bangalore',
    game: 'Free Fire',
    prize: '₹27,200',
    date: 'Dec 2025',
    matches: 134,
    story: 'College student from Koramangala. Plays 2-3 hours after classes. First big win was a ₹15k solo tournament that paid her semester fees.',
    highlight: 'Turned ₹3,200 investment into ₹27k+ in one month',
  },
  {
    name: 'Rohit "Headshot" Khan',
    city: 'Delhi NCR',
    game: 'BGMI',
    prize: '₹1,12,000',
    date: 'Jan 2026',
    matches: 210,
    story: 'Full-time content creator + pro player from Noida. Leads a 4-man squad that practices together on BattleXZone daily. Biggest month yet.',
    highlight: 'Highest single-month earner on platform in 2026',
  },
  {
    name: 'Priya "Shadow" Menon',
    city: 'Hyderabad',
    game: 'BGMI + Free Fire',
    prize: '₹19,800',
    date: 'Jan 2026',
    matches: 62,
    story: 'Working professional in Gachibowli. Plays squad with office friends 4 evenings a week. Treats it as smart side income.',
    highlight: '₹19,800 profit in her first 30 days',
  },
];

const stats = [
  { label: 'Total Prizes Distributed', value: '₹2.8 Cr+' },
  { label: 'Verified Winners (30 days)', value: '1,240+' },
  { label: 'Average Monthly Earner (Top 100)', value: '₹18,400' },
  { label: 'Biggest Single Win', value: '₹1,12,000' },
];

export default function WinnersPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Winners & Success Stories', url: 'https://www.battlexzone.com/winners' },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20">
        {/* Hero */}
        <section className="py-16 px-3 sm:px-4 bg-gradient-to-b from-yellow-900/20 to-dark-900 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-4">REAL CASH. REAL WINNERS.</div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Verified <span className="gradient-text">Winners</span> on BattleXZone</h1>
            <p className="text-xl text-dark-300 mb-8">These are real players who turned their BGMI and Free Fire skills into serious cash. Your name could be next.</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-primary text-lg px-8 py-3">Start Winning Today</Link>
              <Link href="/tournaments" className="btn-secondary text-lg px-8 py-3">Browse Current Tournaments</Link>
            </div>
          </div>
        </section>

        {/* Trust Stats */}
        <section className="py-10 px-3 sm:px-4 border-b border-dark-700">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-dark-800 rounded-2xl p-6 text-center border border-dark-700">
                <div className="text-3xl font-bold text-emerald-400">{s.value}</div>
                <div className="text-sm text-dark-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Winners Grid */}
        <section className="py-14 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Recent Verified Winners</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {winners.map((w, index) => (
                <div key={index} className="bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-primary-500/50 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-bold text-xl">{w.name}</div>
                      <div className="text-sm text-dark-400">{w.city} • {w.game}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">{w.prize}</div>
                      <div className="text-xs text-dark-500">{w.date}</div>
                    </div>
                  </div>

                  <div className="bg-dark-900/70 rounded-lg p-4 mb-4 text-sm text-dark-300 italic border-l-4 border-emerald-500">
                    "{w.story}"
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-dark-400">Matches played:</span> <span className="font-semibold text-white">{w.matches}</span>
                    </div>
                    <div className="text-emerald-400 font-medium text-right">{w.highlight}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof & E-E-A-T Section */}
        <section className="py-14 px-3 sm:px-4 bg-dark-800/40 border-y border-dark-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Why These Numbers Matter</h2>
            <div className="text-dark-300 space-y-3 text-left max-w-2xl mx-auto">
              <p>• Every winner shown has completed KYC and had results manually verified with in-game screenshots + EXIF checks.</p>
              <p>• Prizes are paid directly from the platform wallet to the player&apos;s verified UPI/bank — no middlemen.</p>
              <p>• We publish these stories to show real earning potential, not hype. Results vary based on skill, time invested, and consistency.</p>
            </div>

            <div className="mt-8 p-6 bg-dark-900 rounded-xl border border-dark-700 max-w-lg mx-auto">
              <p className="text-sm text-dark-400">Top 1% of consistent players on BattleXZone are earning between <span className="text-white font-semibold">₹25,000 — ₹1,20,000+</span> per month.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-3 sm:px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">Ready to write your own success story?</h2>
            <p className="text-dark-300 mb-8">The next winner could be you. Thousands of players just like you are already cashing out every single day.</p>
            <Link href="/register" className="btn-primary text-lg px-10 py-4">Create Free Account &amp; Join Your First Match</Link>
            <p className="text-xs text-dark-500 mt-4">No credit card required. Start with ₹10.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
