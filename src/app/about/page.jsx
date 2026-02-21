import { Navbar, Footer } from '@/components/layout';
import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';
import Link from 'next/link';

export const metadata = PAGE_SEO.about;

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'About Us', url: 'https://www.battlexzone.com/about' },
      ]} />
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-12">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              About <span className="gradient-text">BattleZone</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-2xl mx-auto">
              India&apos;s fastest-growing BGMI esports platform — where 50,000+ players compete daily for real cash prizes.
            </p>
          </div>

          {/* Story */}
          <section className="card p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-primary-400 mb-4">🎮 Our Story</h2>
            <p className="text-dark-300 mb-4">
              Founded in 2024 in Dhanbad, Jharkhand, BattleZone was born from a simple idea: make competitive mobile gaming accessible to every Indian gamer. We saw millions of talented BGMI and Free Fire players with no affordable platform to compete and win real money.
            </p>
            <p className="text-dark-300">
              Today, BattleZone hosts <strong className="text-white">500+ daily matches</strong> across Solo, Duo, and Squad formats, with entry fees starting from just <strong className="text-cyan-400">₹10</strong>. Our anti-cheat verified platform ensures fair play for every participant.
            </p>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Players', value: '50,000+', icon: '👥' },
              { label: 'Daily Matches', value: '500+', icon: '🎮' },
              { label: 'Total Prize Pool', value: '₹1Cr+', icon: '💰' },
              { label: 'Cities', value: '100+', icon: '🏙️' },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 sm:p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <section className="card p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-primary-400 mb-6">🛡️ Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Fair Play First', desc: 'Advanced anti-cheat with screenshot verification, EXIF analysis, and manual admin review.' },
                { title: 'Instant Payouts', desc: 'Win prizes and withdraw via UPI within 5–10 minutes. No waiting, no hassle.' },
                { title: 'Player-Centric', desc: 'Lowest entry fees, highest prize pools, and 24/7 Discord support for every player.' },
                { title: 'Transparency', desc: 'All results, rankings, and prize distributions are publicly visible. No hidden fees.' },
              ].map((value) => (
                <div key={value.title} className="bg-dark-700/50 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-dark-300 text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Compete?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-center">
              <Link href="/register" className="btn-primary px-8 py-3 w-full sm:w-auto text-center">Join BattleZone</Link>
              <Link href="/matches" className="btn-secondary px-8 py-3 w-full sm:w-auto text-center">Browse Matches</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
