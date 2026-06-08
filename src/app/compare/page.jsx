import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = {
  title: 'Best BGMI Tournament Apps India 2026 | BattleXZone vs Winzo vs MPL vs Rush',
  description: 'Honest comparison of top BGMI & Free Fire tournament platforms in India. BattleXZone vs Winzo, MPL, Rush, Gamezy — entry fees, withdrawal speed, prize pools, fair play, and which is best for real cash in 2026.',
  keywords: ['best BGMI tournament app India', 'BattleXZone vs Winzo', 'BGMI cash tournament comparison', 'best Free Fire earning app', 'MPL vs BattleXZone', 'real money gaming platforms India 2026'],
};

const platforms = [
  {
    name: 'BattleXZone',
    bestFor: 'Daily low-stake scrims + serious cash',
    entry: '₹10 — ₹500',
    withdrawal: '24-48 hrs (UPI fastest)',
    prizePool: 'High (₹500 - ₹1L+ daily)',
    fairPlay: 'Screenshot + EXIF + manual review',
    games: 'BGMI, Free Fire',
    score: 9.4,
    highlight: 'Best for beginners & consistent daily play',
  },
  {
    name: 'Winzo',
    bestFor: 'Casual + fantasy style games',
    entry: '₹5 — ₹200+',
    withdrawal: 'Instant to 72 hrs',
    prizePool: 'Medium-High',
    fairPlay: 'AI + manual',
    games: 'Multiple (incl BGMI/FF)',
    score: 8.1,
    highlight: 'Good for variety but higher competition on popular modes',
  },
  {
    name: 'MPL',
    bestFor: 'Pro players & big prize pools',
    entry: '₹25 — ₹1000+',
    withdrawal: 'Instant (selected) to 48 hrs',
    prizePool: 'Very High',
    fairPlay: 'Strong (proprietary)',
    games: 'BGMI + many others',
    score: 8.7,
    highlight: 'Higher entry barrier, established brand',
  },
  {
    name: 'Rush',
    bestFor: 'Quick matches',
    entry: '₹10 — ₹100',
    withdrawal: 'Fast',
    prizePool: 'Medium',
    fairPlay: 'Standard',
    games: 'BGMI/FF focused',
    score: 7.6,
    highlight: 'Smaller community, fewer daily options',
  },
];

const comparisonPoints = [
  'Lowest entry fees starting at ₹10 (BattleXZone wins for accessibility)',
  'Fastest verified withdrawals for serious players',
  'Strongest focus on pure BGMI + Free Fire (no dilution)',
  'Transparent anti-cheat with published methods',
  'City-wise player base + local SEO targeting',
];

export default function ComparePage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Platform Comparison 2026', url: 'https://www.battlexzone.com/compare' },
      ]} />
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-14 px-3 sm:px-4 bg-gradient-to-b from-slate-900/40 to-dark-900">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">Best BGMI Tournament Apps in India 2026</h1>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              Head-to-head comparison of BattleXZone vs Winzo, MPL, Rush and other real money gaming platforms. Data based on player reports, payout speed, entry accessibility, and fair play systems.
            </p>
            <div className="mt-6 text-sm text-dark-500">Last updated: February 2026 • For informational purposes only</div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-10 px-3 sm:px-4 overflow-x-auto">
          <div className="max-w-6xl mx-auto">
            <table className="w-full text-sm border border-dark-700 rounded-xl overflow-hidden">
              <thead className="bg-dark-800">
                <tr>
                  <th className="p-4 text-left">Platform</th>
                  <th className="p-4 text-left">Best For</th>
                  <th className="p-4 text-left">Entry Fee</th>
                  <th className="p-4 text-left">Withdrawal Speed</th>
                  <th className="p-4 text-left">Fair Play</th>
                  <th className="p-4 text-center">Score</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p, i) => (
                  <tr key={i} className={p.name === 'BattleXZone' ? 'bg-primary-900/10 border-l-4 border-primary-500' : 'border-t border-dark-700'}>
                    <td className="p-4 font-bold">{p.name} {p.name === 'BattleXZone' && <span className="text-xs ml-1 text-primary-400">(Recommended)</span>}</td>
                    <td className="p-4 text-dark-300">{p.bestFor}</td>
                    <td className="p-4">{p.entry}</td>
                    <td className="p-4">{p.withdrawal}</td>
                    <td className="p-4">{p.fairPlay}</td>
                    <td className="p-4 text-center font-bold text-lg text-emerald-400">{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Why BattleXZone Ranks Highest for Most Indian Players in 2026</h2>
          <ul className="space-y-3 text-dark-300">
            {comparisonPoints.map((point, idx) => (
              <li key={idx} className="flex gap-3"><span className="text-emerald-400 mt-1">✓</span> {point}</li>
            ))}
          </ul>

          <div className="mt-10 p-6 bg-dark-800 rounded-2xl border border-dark-700">
            <h3 className="font-bold mb-3">Quick Recommendation</h3>
            <p className="text-dark-300">
              If you want the lowest barrier to entry (₹10 matches), transparent anti-cheat, and focus purely on BGMI + Free Fire with fast UPI payouts — <strong>BattleXZone is currently the best choice for the majority of Indian players</strong> in 2026.
            </p>
            <p className="mt-3 text-sm text-dark-400">Players looking for massive brand-name tournaments with very high entry fees may prefer MPL.</p>
          </div>
        </section>

        <section className="py-14 px-3 sm:px-4 bg-dark-800/50 text-center border-y border-dark-700">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to try the top-rated platform?</h2>
            <p className="text-dark-300 mb-6">Join 50,000+ players already competing daily. Your first match can start in under 3 minutes.</p>
            <Link href="/register" className="btn-primary px-10 py-3 text-lg inline-block">Create Account &amp; Play ₹10 Match</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
