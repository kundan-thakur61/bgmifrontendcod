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
  // Additional FAQs targeting high-volume keywords from research (today, tonight, free entry, cities)
  {
    question: 'How to join BGMI tournament today?',
    answer: 'Browse current BGMI tournaments and custom rooms on BattleXZone. Register instantly, pay the small entry fee via UPI, and get room details 15 minutes before the match. Many tournaments run daily including tonight and weekend slots.',
  },
  {
    question: 'BGMI tournament tonight registration?',
    answer: 'Yes — many BGMI custom room scrims and paid tournaments start in the evening. Filter the list for live or upcoming tonight matches, join with your squad, and compete for real cash prizes with fast payouts.',
  },
  {
    question: 'Free entry BGMI tournament India?',
    answer: 'BattleXZone regularly runs free entry BGMI tournaments alongside paid ones (from ₹10). Check the schedule for no-entry-fee events with real cash prize pools. Perfect for beginners in Delhi, Mumbai, Bangalore and other cities.',
  },
  {
    question: 'BGMI tournament Delhi or Mumbai today?',
    answer: 'Our platform is online and open to players across India. Join BGMI tournaments today from anywhere — including Delhi, Mumbai, Bangalore, Hyderabad, Chennai or Kolkata. No location restrictions, just good internet and your BGMI ID.',
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
          {/* Header - H1 optimized for primary keyword from research: "bgmi tournament today" + "join bgmi tournament" */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-2">
              BGMI Tournament Today | Daily Scrims & Custom Rooms
            </h1>
            <p className="text-dark-400 text-lg">
              Join <strong>BGMI tournament today</strong>, tonight or this weekend. Free entry options and paid custom rooms starting at just ₹10. Play <strong>BGMI daily scrims</strong>, win real cash prizes, and get instant UPI withdrawal. Squad up for Erangel, Miramar or TDM matches. <a href="/register" className="text-cyan-400 hover:underline">Register for BGMI tournament</a> now and dominate the battlegrounds.
            </p>
            {/* Additional H2s for long-tail keyword targeting (today, tonight, cities, free entry) */}
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-white">Join BGMI Tournament Today or Tonight</h2>
            <p className="text-dark-300">Find live BGMI custom rooms and scrims happening right now. Filter by entry fee, prize pool or game mode. Perfect for players in Delhi, Mumbai, Bangalore, Hyderabad, Chennai and across India looking to win cash playing BGMI.</p>
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
