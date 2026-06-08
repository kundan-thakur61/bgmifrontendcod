import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Pune', 'Maharashtra');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Pune 2026 - Win Cash Daily',
  excerpt: 'Pune gamers: Join daily BGMI and Free Fire cash tournaments on BattleXZone. Play from Hinjewadi, Koregaon Park, Baner, Viman Nagar and win real money prizes.',
  datePublished: '2026-02-01T00:00:00+05:30',
  dateModified: '2026-02-01T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/pune-tournaments',
  image: 'https://www.battlexzone.com/locations/pune-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Pune', 'Free Fire Pune', 'gaming tournaments Hinjewadi', 'esports Pune', 'Pune BGMI'],
  wordCount: 2000,
};

const localBusinessData = {
  name: 'BattleXZone Pune',
  description: 'Pune\'s fastest growing BGMI & Free Fire tournament platform. Daily cash matches for players in Hinjewadi, Koregaon Park, Baner and across the city.',
  url: 'https://www.battlexzone.com/locations/pune-tournaments',
  areaServed: { '@type': 'City', name: 'Pune', containedInPlace: { '@type': 'State', name: 'Maharashtra' } },
};

const puneFAQs = [
  { question: 'Can I join Pune BGMI tournaments from Hinjewadi or Baner?', answer: 'Yes. All BattleXZone tournaments are fully online. Pune players from Hinjewadi, Baner, Koregaon Park, Viman Nagar, Wakad, Kharadi, and Magarpatta regularly compete and win.' },
  { question: 'What are typical prize pools for Pune players?', answer: 'Daily entry-level matches (₹10-25) have ₹1,000-5,000 prize pools. Higher stake tournaments offer ₹10,000 - ₹40,000+. Many Pune IT professionals play in the evenings and weekends.' },
  { question: 'Is BattleXZone legal for Pune gamers?', answer: 'Yes. Skill-based BGMI and Free Fire tournaments are legal across Maharashtra. BattleXZone requires KYC and follows all applicable rules.' },
];

export default function PuneTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Pune Tournaments', url: 'https://www.battlexzone.com/locations/pune-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-green-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Pune Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">Pune</span>
              <span className="text-dark-400 text-sm">February 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              BGMI &amp; Free Fire Tournaments in <span className="gradient-text">Pune</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mb-8">
              Daily cash tournaments for Pune gamers. Join from Hinjewadi, Koregaon Park, Baner, Viman Nagar, Wakad and everywhere in the city. Low entry, real prizes, fast UPI cashouts.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/matches" className="btn-primary">See Pune Matches</Link>
              <Link href="/register" className="btn-secondary">Register &amp; Play Now</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[{label:'Pune Players',value:'600+'},{label:'Daily Matches',value:'30+'},{label:'This Month Prizes',value:'₹6L+'}].map((s,i)=>(
              <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700"><div className="text-3xl font-bold text-primary-400">{s.value}</div><div className="text-dark-400 mt-1">{s.label}</div></div>
            ))}
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Top Pune Areas for Tournaments</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              {['Hinjewadi','Koregaon Park','Baner','Viman Nagar','Wakad','Kharadi','Magarpatta','Kalyani Nagar','Aundh','Hadapsar'].map(a=><div key={a} className="bg-dark-800 p-3 rounded text-center border border-dark-700">{a}</div>)}
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Pune Player Success Path</h2>
            <div className="prose prose-invert max-w-none text-dark-300">
              <p>Many Pune players (especially from the IT crowd in Hinjewadi and Kharadi) treat evening tournaments as a serious side hustle. Consistent top 3 finishes in ₹50-100 entry squads can easily net ₹15k-40k extra per month after a few months of practice.</p>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Pune Tournament FAQs</h2>
            <FAQ faqs={puneFAQs} title="Pune Gamer Questions" />
          </div>
        </section>

        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/20 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Pune Gamers — Time to Cash In</h2>
            <p className="text-dark-300 mb-8">The Pune esports scene is exploding. Get in early and start building your winning record on BattleXZone today.</p>
            <Link href="/tournaments" className="btn-primary px-8 py-3">Browse All Tournaments</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
