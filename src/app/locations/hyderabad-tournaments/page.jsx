import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { generateLocationMetadata } from '@/lib/seo-config';
import FAQ from '@/components/ui/FAQ';
import { ArticleSchema, LocalBusinessSchema, BreadcrumbSchema } from '@/components/seo';

export const metadata = generateLocationMetadata('Hyderabad', 'Telangana');

const articleData = {
  title: 'BGMI & Free Fire Tournaments in Hyderabad 2026 - Win Cash Prizes',
  excerpt: 'Join BGMI and Free Fire tournaments in Hyderabad. Play daily online gaming tournaments from Gachibowli, HITEC City, Banjara Hills and win real cash prizes on BattleXZone.',
  datePublished: '2026-02-01T00:00:00+05:30',
  dateModified: '2026-02-01T00:00:00+05:30',
  author: 'BattleXZone Team',
  url: 'https://www.battlexzone.com/locations/hyderabad-tournaments',
  image: 'https://www.battlexzone.com/locations/hyderabad-tournaments.jpg',
  category: 'Local',
  keywords: ['BGMI tournaments Hyderabad', 'Free Fire tournaments Hyderabad', 'gaming Hyderabad', 'esports Hyderabad', 'HITEC City BGMI'],
  wordCount: 2200,
};

const localBusinessData = {
  name: 'BattleXZone Hyderabad',
  description: 'Daily BGMI & Free Fire cash tournaments for Hyderabad gamers. Play online from Gachibowli, Banjara Hills, HITEC City and win real prizes.',
  url: 'https://www.battlexzone.com/locations/hyderabad-tournaments',
  areaServed: {
    '@type': 'City',
    name: 'Hyderabad',
    containedInPlace: { '@type': 'State', name: 'Telangana' },
  },
};

const hyderabadFAQs = [
  {
    question: 'How do I join BGMI tournaments from Hyderabad?',
    answer: 'Register on BattleXZone, complete quick KYC with Aadhaar or PAN, add ₹10+ via UPI, then browse and join daily BGMI and Free Fire tournaments. Room ID and password are shared 15 mins before start. Play from Gachibowli, HITEC City, Banjara Hills, Kukatpally or anywhere in Hyderabad.',
  },
  {
    question: 'Are there Free Fire and BGMI cash tournaments for Hyderabad players?',
    answer: 'Yes. BattleXZone runs 40+ daily matches for Hyderabad players across Solo, Duo and Squad. Entry starts at ₹10. Top players from Hyderabad regularly win ₹5,000 - ₹50,000+ per month in cash prizes.',
  },
  {
    question: 'What are the best areas in Hyderabad for low ping BGMI tournaments?',
    answer: 'Gachibowli, HITEC City, Madhapur, Banjara Hills, Jubilee Hills, and Kondapur generally have excellent fiber connectivity (Airtel, Jio, ACT). Most players report <30ms ping which is perfect for competitive tournaments.',
  },
  {
    question: 'How fast can Hyderabad players withdraw winnings?',
    answer: 'UPI withdrawals (Google Pay, PhonePe, Paytm) are processed within 24-48 hours after admin verification. Bank transfers take 1-3 business days. Minimum withdrawal is ₹100.',
  },
  {
    question: 'Is skill-based gaming legal in Telangana/Hyderabad?',
    answer: 'Yes. BGMI and Free Fire tournaments are legal skill-based games in Telangana. BattleXZone is fully compliant with Indian gaming laws and requires KYC for all cash players.',
  },
];

export default function HyderabadTournaments() {
  return (
    <>
      <Navbar />
      <ArticleSchema article={articleData} />
      <LocalBusinessSchema business={localBusinessData} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Hyderabad Tournaments', url: 'https://www.battlexzone.com/locations/hyderabad-tournaments' },
      ]} />

      <main className="min-h-screen pt-16 sm:pt-20">
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-purple-900/30 to-dark-900">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-dark-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-400">Hyderabad Tournaments</span>
            </nav>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium">Hyderabad</span>
              <span className="text-dark-400 text-sm">February 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-4">
              BGMI &amp; Free Fire Tournaments in <span className="gradient-text">Hyderabad</span>
            </h1>
            <p className="text-lg text-dark-300 max-w-3xl mb-8">
              Join daily online BGMI and Free Fire cash tournaments from Hyderabad. Play from Gachibowli, HITEC City, Banjara Hills or anywhere in the city. Entry from ₹10. Real cash prizes paid via UPI.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/tournaments" className="btn-primary">Browse Hyderabad Tournaments</Link>
              <Link href="/register" className="btn-secondary">Register Free &amp; Play Today</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            {[
              { label: 'Active Players', value: '800+' },
              { label: 'Daily Matches', value: '40+' },
              { label: 'Avg. Prize Pool', value: '₹15,000+' },
            ].map((stat, i) => (
              <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                <div className="text-3xl font-bold text-primary-400">{stat.value}</div>
                <div className="text-dark-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Popular Hyderabad Gaming Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Gachibowli', 'HITEC City', 'Banjara Hills', 'Kukatpally', 'Secunderabad', 'Madhapur', 'Jubilee Hills', 'Kondapur'].map(area => (
                <div key={area} className="bg-dark-800 px-4 py-3 rounded-lg text-center text-sm border border-dark-700">{area}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4 border-t border-dark-700 bg-dark-800/40">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">How Hyderabad Players Win on BattleXZone</h2>
            <div className="space-y-4 text-dark-300">
              <p>1. <strong>Register</strong> with mobile number or Google — takes 30 seconds.</p>
              <p>2. <strong>Complete KYC</strong> (Aadhaar/PAN) so you can withdraw winnings.</p>
              <p>3. <strong>Add funds</strong> starting ₹10 via UPI (instant).</p>
              <p>4. <strong>Join a match</strong> — filter by time, entry fee, or mode (Solo/Duo/Squad).</p>
              <p>5. <strong>Play &amp; submit screenshot</strong> after the game for verification.</p>
              <p>6. <strong>Withdraw via UPI</strong> within 24-48 hours when you win.</p>
            </div>
            <div className="mt-8">
              <Link href="/how-it-works" className="text-primary-400 hover:underline">See full step-by-step guide →</Link>
            </div>
          </div>
        </section>

        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Hyderabad BGMI &amp; Free Fire Tournament FAQs</h2>
            <FAQ faqs={hyderabadFAQs} title="Hyderabad Tournament Questions" />
          </div>
        </section>

        <section className="py-16 px-3 sm:px-4 bg-gradient-to-t from-primary-900/20 to-dark-900 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Compete from Hyderabad?</h2>
            <p className="text-dark-300 mb-8">Thousands of Hyderabad gamers are already winning cash every day. Your first tournament is just minutes away.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-10 py-4">Create Free Account</Link>
              <Link href="/matches" className="btn-secondary text-lg px-10 py-4">See Today&apos;s Matches</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
