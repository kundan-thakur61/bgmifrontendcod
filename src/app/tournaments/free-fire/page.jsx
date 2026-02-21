import { Navbar, Footer } from '@/components/layout';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo';
import TournamentList from '@/components/tournaments/TournamentList';
import { Metadata } from 'next';
import { generateSeoMetadata, SITE } from '@/lib/seo-config';

// Metadata optimized for "Free Fire online earning tournament" keyword
export const metadata = generateSeoMetadata({
  title: 'Free Fire Online Earning Tournament | Win Cash ₹10,000 | Entry ₹10',
  description: 'Join Free Fire online earning tournament. Win real cash prizes starting ₹10 entry. Solo, Duo & Squad matches. Instant UPI withdrawal. Register Free Now!',
  keywords: [
    // Primary keyword
    'Free Fire online earning tournament',
    'Free Fire tournament',
    'Free Fire tournament app India',
    // LSI keywords
    'Free Fire cash prize game',
    'Free Fire esports India',
    'Free Fire tournament registration free',
    'Free Fire diamond tournament',
    // Long-tail keywords
    'Free Fire tournament free entry real money',
    'Free Fire tournament 5 rupees entry',
    'play Free Fire and earn money',
    'Free Fire tournament India',
  ],
  url: '/tournaments/free-fire',
});

// FAQ data optimized for PAA questions
const freeFireFAQs = [
  {
    question: 'How to join Free Fire tournament and earn money?',
    answer: 'To join a Free Fire tournament: 1) Register on BattleXZone, 2) Complete KYC verification, 3) Add money to wallet (min ₹10), 4) Browse Free Fire tournaments, 5) Click "Join Now" and pay entry fee. Room ID and password are sent 10 minutes before match. Win and withdraw instantly via UPI.',
  },
  {
    question: 'What is the entry fee for Free Fire tournament?',
    answer: 'Free Fire tournament entry fees on BattleXZone start from just ₹10. We also offer free tournaments with real cash prizes for beginners. Premium tournaments range from ₹20-₹200 with prize pools up to ₹25,000.',
  },
  {
    question: 'Can I earn real money playing Free Fire?',
    answer: 'Yes, you can earn real money playing Free Fire tournaments on BattleXZone. It\'s a skill-based gaming platform where your performance determines earnings. Winners receive cash prizes directly to wallet, withdrawable via UPI within 5-10 minutes.',
  },
  {
    question: 'Is Free Fire tournament legal in India?',
    answer: 'Yes, Free Fire tournaments are legal in India when hosted on skill-based gaming platforms like BattleXZone. These are competitive skill games, not gambling. Players from restricted states should check local regulations.',
  },
  {
    question: 'How much can I earn from Free Fire tournament?',
    answer: 'You can earn ₹100 to ₹25,000+ from Free Fire tournaments. Entry-level tournaments have ₹500-₹5,000 prize pools. Weekend special tournaments offer ₹10,000-₹25,000 prizes. Regular players earn ₹5,000-₹15,000 monthly.',
  },
];

export default function FreeFireTournamentPage() {
  return (
    <>
      <FAQSchema faqs={freeFireFAQs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: SITE.baseUrl },
        { name: 'Tournaments', url: `${SITE.baseUrl}/tournaments` },
        { name: 'Free Fire', url: `${SITE.baseUrl}/tournaments/free-fire` },
      ]} />
      <Navbar />
      
      <main className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-b from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🔥</span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display">
                    Free Fire Online Earning Tournament
                  </h1>
                </div>
                <p className="text-dark-300 text-lg mb-4">
                  Join Free Fire tournaments & win real cash prizes. Entry fee ₹10. 
                  Solo, Duo & Squad modes. Instant UPI withdrawal.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#tournaments" className="btn-primary">
                    🔥 Join Tournament Now
                  </a>
                  <a href="#how-to-join" className="btn-secondary">
                    Learn How to Play
                  </a>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-dark-800/50 rounded-xl p-6 border border-orange-500/20">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-400">₹25,000</div>
                    <div className="text-dark-400">Weekly Prize Pool</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
              <div className="text-2xl font-bold text-orange-400">30,000+</div>
              <div className="text-sm text-dark-400">Free Fire Players</div>
            </div>
            <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
              <div className="text-2xl font-bold text-green-400">₹5L+</div>
              <div className="text-sm text-dark-400">Monthly Prizes</div>
            </div>
            <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
              <div className="text-2xl font-bold text-blue-400">₹10</div>
              <div className="text-sm text-dark-400">Min Entry</div>
            </div>
            <div className="bg-dark-800 rounded-xl p-4 text-center border border-dark-700">
              <div className="text-2xl font-bold text-yellow-400">5 min</div>
              <div className="text-sm text-dark-400">UPI Withdrawal</div>
            </div>
          </div>

          {/* Tournament Types */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Free Fire Tournament Types</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-orange-500/50 transition">
                <div className="text-3xl mb-3">👤</div>
                <h3 className="text-xl font-semibold mb-2">Solo Tournament</h3>
                <p className="text-dark-400 text-sm mb-3">
                  Battle alone against 49 other players. Show your individual skills.
                </p>
                <div className="text-sm">
                  <span className="text-green-400">Entry: ₹10-₹50</span>
                  <span className="text-dark-500 mx-2">|</span>
                  <span className="text-orange-400">Prize: ₹500-₹5,000</span>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-orange-500/50 transition">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-xl font-semibold mb-2">Duo Tournament</h3>
                <p className="text-dark-400 text-sm mb-3">
                  Team up with a partner. Coordinate and dominate together.
                </p>
                <div className="text-sm">
                  <span className="text-green-400">Entry: ₹20-₹100</span>
                  <span className="text-dark-500 mx-2">|</span>
                  <span className="text-orange-400">Prize: ₹1,000-₹10,000</span>
                </div>
              </div>
              <div className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-orange-500/50 transition">
                <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-semibold mb-2">Squad Tournament</h3>
                <p className="text-dark-400 text-sm mb-3">
                  Full 4-player squad. Best for teams with coordination.
                </p>
                <div className="text-sm">
                  <span className="text-green-400">Entry: ₹40-₹200</span>
                  <span className="text-dark-500 mx-2">|</span>
                  <span className="text-orange-400">Prize: ₹2,000-₹25,000</span>
                </div>
              </div>
            </div>
          </section>

          {/* How to Join Section */}
          <section id="how-to-join" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How to Join Free Fire Tournament & Earn Money</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: 1, title: 'Register', desc: 'Sign up on BattleXZone with mobile number. Free registration.' },
                { step: 2, title: 'Add Money', desc: 'Add ₹10+ to wallet via UPI, Paytm, or bank transfer.' },
                { step: 3, title: 'Join Match', desc: 'Browse Free Fire tournaments and click "Join Now".' },
                { step: 4, title: 'Win & Withdraw', desc: 'Play, win cash prizes, withdraw via UPI in 5 min!' },
              ].map((item) => (
                <div key={item.step} className="bg-dark-800 rounded-xl p-4 border border-dark-700 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mt-2 mb-2">{item.title}</h3>
                  <p className="text-dark-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tournament List */}
          <section id="tournaments" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">🔥 Live Free Fire Tournaments</h2>
            <TournamentList gameFilter="free_fire" />
          </section>

          {/* Prize Distribution */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Prize Distribution</h2>
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Prize Share</th>
                      <th className="text-left py-3 px-4">Example (₹10,000 Pool)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">🥇 #1 (Booyah!)</td>
                      <td className="py-3 px-4 text-yellow-400">40%</td>
                      <td className="py-3 px-4">₹4,000</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">🥈 #2</td>
                      <td className="py-3 px-4 text-gray-400">25%</td>
                      <td className="py-3 px-4">₹2,500</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">🥉 #3</td>
                      <td className="py-3 px-4 text-orange-400">15%</td>
                      <td className="py-3 px-4">₹1,500</td>
                    </tr>
                    <tr className="border-b border-dark-700">
                      <td className="py-3 px-4">#4-5</td>
                      <td className="py-3 px-4">5% each</td>
                      <td className="py-3 px-4">₹500 each</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Per Kill Bonus</td>
                      <td className="py-3 px-4 text-green-400">₹10/kill</td>
                      <td className="py-3 px-4">Extra earnings</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {freeFireFAQs.map((faq, index) => (
                <div key={index} className="bg-dark-800 rounded-xl p-4 border border-dark-700">
                  <h3 className="font-semibold text-orange-400 mb-2">{faq.question}</h3>
                  <p className="text-dark-300 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Win Cash Playing Free Fire?</h2>
            <p className="text-dark-100 mb-4">
              Join 30,000+ Free Fire players already earning on BattleXZone. Start with just ₹10!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/register" className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-dark-100 transition">
                Register Free - Start Earning
              </a>
              <a href="/how-it-works" className="bg-dark-900/50 text-white font-semibold px-6 py-3 rounded-lg hover:bg-dark-900/70 transition border border-white/20">
                How It Works
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
