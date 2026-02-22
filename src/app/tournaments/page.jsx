import { Navbar, Footer } from '@/components/layout';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo';
import TournamentList from '@/components/tournaments/TournamentList';
import { PAGE_SEO } from '@/lib/seo-config';

// Metadata optimized for "BGMI tournament online India" keyword
export const metadata = PAGE_SEO.tournaments;

// FAQ data optimized for PAA questions (PILLAR 1)
const tournamentFAQs = [
  {
    question: 'How to join BGMI tournament online in India?',
    answer: 'To join a BGMI tournament online: 1) Register on BattleXZone, 2) Complete KYC verification, 3) Add money to wallet (min ₹10), 4) Browse BGMI tournaments, 5) Click "Join Now" and pay entry fee. Room ID and password are sent 10-15 minutes before match start.',
  },
  {
    question: 'What is the entry fee for BGMI tournament?',
    answer: 'BGMI tournament entry fees on BattleXZone start from just ₹10. We also offer free tournaments for beginners with real cash prizes. Premium tournaments range from ₹20-₹500 entry with prize pools up to ₹50,000.',
  },
  {
    question: 'How much can I earn from BGMI tournament?',
    answer: 'You can earn ₹100 to ₹50,000+ from BGMI tournaments on BattleXZone. Entry-level tournaments have ₹500-₹5,000 prize pools. Weekend special tournaments offer ₹25,000-₹50,000 prizes. Top players earn ₹30,000-₹50,000 monthly.',
  },
  {
    question: 'Is BGMI tournament legal in India?',
    answer: 'Yes, BGMI tournaments are legal in India when hosted on skill-based gaming platforms like BattleXZone. These are competitive skill games, not gambling. Players from Andhra Pradesh, Telangana, Assam, Odisha, Nagaland, and Sikkim should check local regulations.',
  },
  {
    question: 'How do tournament prize pools work?',
    answer: 'Prize pools are distributed based on final standings. Typically: 1st place gets 40-50%, 2nd place gets 25-30%, 3rd place gets 15-20%. Kill bonuses are also awarded. Exact distribution is shown on each tournament page.',
  },
  {
    question: 'Can I participate in multiple tournaments?',
    answer: 'Yes, you can register for multiple BGMI and Free Fire tournaments as long as their schedules do not overlap. The system will warn you if there are timing conflicts.',
  },
];

export default function TournamentsPage() {
  return (
    <>
      <FAQSchema faqs={tournamentFAQs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlexzone.com' },
        { name: 'Tournaments', url: 'https://battlexzone.com/tournaments' },
      ]} />
      <Navbar />
      
      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header - H1 optimized for primary keyword */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2">
              BGMI Daily Scrims & Custom Room Tournaments
            </h1>
            <p className="text-dark-400 text-lg">
              Ready to test your skills? Browse our schedule of <strong>BGMI daily scrims</strong> and paid tournaments. We offer a variety of match types including classic battle royale on Erangel and Miramar, as well as intense TDM matchups. Check the entry fee, prize pool, and match timings below. Make sure to read the rules carefully before you <a href="/register" className="text-cyan-400 hover:underline">register for BGMI tournament</a> matches to avoid disqualification.
            </p>
          </div>
          
          {/* Quick Stats for Trust Signals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-500">50,000+</div>
              <div className="text-sm text-dark-400">Active Players</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-500">₹10L+</div>
              <div className="text-sm text-dark-400">Monthly Prizes</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">₹10</div>
              <div className="text-sm text-dark-400">Min Entry</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">5 min</div>
              <div className="text-sm text-dark-400">UPI Withdrawal</div>
            </div>
          </div>
          
          <TournamentList />
        </div>
      </main>
      
      <Footer />
    </>
  );
}
