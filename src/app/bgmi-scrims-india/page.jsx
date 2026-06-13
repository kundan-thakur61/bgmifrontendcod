import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = {
  title: 'BGMI Scrims India 2026 - Custom Room Scrims & Practice Matches',
  description: 'Find and join daily BGMI scrims and custom room practice matches across India. Improve your game with serious players.',
  keywords: ['BGMI scrims India', 'BGMI custom room', 'BGMI practice matches', 'scrims India'],
};

const articleData = {
  title: 'BGMI Scrims India - Daily Custom Room Practice',
  excerpt: 'Join high-quality BGMI scrims and custom rooms. Perfect for serious players looking to improve.',
  url: 'https://www.battlexzone.com/bgmi-scrims-india',
};

export default function BGMIScrimsIndia() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://www.battlexzone.com' }, { name: 'BGMI Scrims India', url: 'https://www.battlexzone.com/bgmi-scrims-india' }]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-black mb-4">BGMI Scrims India 2026</h1>
          <p className="text-xl text-dark-300">Daily custom room scrims and practice matches for competitive BGMI players across India.</p>

          <div className="mt-8">
            <Link href="/matches?type=scrim" className="btn-primary px-8 py-3">Find Scrims Now</Link>
          </div>

          <div className="mt-12 prose prose-invert">
            <p>BattleXZone hosts regular scrims for players who want serious practice. Filter by time, mode, and region. Many top Indian teams use our platform for daily warm-ups.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
