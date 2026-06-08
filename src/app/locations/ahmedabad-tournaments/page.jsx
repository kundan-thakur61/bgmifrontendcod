import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Ahmedabad', 'Gujarat');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Ahmedabad 2026 - Real Cash Prizes',
  excerpt: 'Daily BGMI and Free Fire cash tournaments for Ahmedabad players. Join from SG Highway, Manekbaug, Vastrapur, Prahlad Nagar and win real money. Entry from ₹10 on BattleXZone.',
  datePublished: '2026-02-02T00:00:00+05:30',
  dateModified: '2026-02-02T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/ahmedabad-tournaments',
  image: 'https://www.battlexzone.com/locations/ahmedabad-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Ahmedabad', 'Free Fire Ahmedabad', 'gaming tournaments SG Highway', 'esports Gujarat', 'Ahmedabad BGMI'],
  wordCount: 2050,
};

const localBusinessData = {
  name: 'BattleXZone Ahmedabad',
  description: 'Ahmedabad\'s daily BGMI & Free Fire tournament platform. Low entry fees, real cash prizes, fast UPI withdrawals for players across the city.',
  url: 'https://www.battlexzone.com/locations/ahmedabad-tournaments',
  areaServed: { '@type': 'City', name: 'Ahmedabad', containedInPlace: { '@type': 'State', name: 'Gujarat' } },
};

const ahmedabadFAQs = [
  {
    question: 'Can I play BGMI tournaments from SG Highway or Vastrapur in Ahmedabad?',
    answer: 'Yes. All BattleXZone tournaments are fully online. Players from SG Highway, Vastrapur, Manekbaug, Prahlad Nagar, Bodakdev, and across Ahmedabad regularly join and win cash prizes.',
  },
  {
    question: 'What are the best entry-level tournaments for Ahmedabad beginners?',
    answer: 'Start with ₹10-25 entry matches. These have solid prize pools (₹1,000-5,000) and are perfect for building experience. Many Ahmedabad players move up to ₹50-100 squad events within a few weeks.',
  },
  {
    question: 'Is internet reliable enough for competitive tournaments in Ahmedabad?',
    answer: 'Yes — Jio Fiber, Airtel, and local providers in most areas of Ahmedabad deliver low ping suitable for BGMI and Free Fire. Evening hours are popular and generally stable.',
  },
];

export default function AhmedabadTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Ahmedabad Tournaments', url: 'https://www.battlexzone.com/locations/ahmedabad-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-amber-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Ahmedabad Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-amber-600/20 text-amber-400 rounded-full text-sm font-medium">Ahmedabad</span>
              <span className="text-dark-400 text-sm">February 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              BGMI &amp; Free Fire Tournaments in <span className="gradient-text">Ahmedabad</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mb-8">
              Daily real-cash BGMI and Free Fire tournaments for Ahmedabad gamers. Play from SG Highway, Vastrapur, Manekbaug or anywhere in the city. Entry fees from ₹10. Fast UPI withdrawals on BattleXZone.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/matches" className="btn-primary">See Today&apos;s Ahmedabad Matches</Link>
              <Link href="/register" className="btn-secondary">Join Free</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[{label:'Ahmedabad Players',value:'580+'},{label:'Daily Matches',value:'28+'},{label:'Prizes Paid (30d)',value:'₹5.5L+'}].map((s,i)=>(
              <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700"><div className="text-3xl font-bold text-primary-400">{s.value}</div><div className="text-dark-400 mt-1">{s.label}</div></div>
            ))}
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Top Gaming Areas in Ahmedabad</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              {['SG Highway','Vastrapur','Manekbaug','Prahlad Nagar','Bodakdev','Ghatlodia','Navrangpura','Satellite','Bopal','Thaltej'].map(a => <div key={a} className="bg-dark-800 p-3 rounded text-center border border-dark-700">{a}</div>)}
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Ahmedabad Player Path to Cash</h2>
            <p className="text-dark-300">Many players from the IT and student communities in Ahmedabad treat 1-2 hours of evening tournaments as reliable side income. Consistent performance in squad formats has helped several local players earn ₹12,000–30,000+ extra per month.</p>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Ahmedabad Tournament FAQs</h2>
            <FAQ faqs={ahmedabadFAQs} title="Ahmedabad Gamer Questions" />
          </div>
        </section>

        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ahmedabad — Time to Compete</h2>
            <p className="text-dark-300 mb-8">The Gujarat gaming scene is growing fast. Start your winning run on BattleXZone today.</p>
            <Link href="/tournaments" className="btn-primary px-8 py-3">Browse All Tournaments</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
