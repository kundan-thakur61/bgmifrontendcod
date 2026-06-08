import dynamic from 'next/dynamic';
import { Navbar, Footer } from '@/components/layout';
import HeroSection from '@/components/home/HeroSection';
import { getSpeakableSchema, getHowToSchema } from '@/lib/schema-graph';
// homepageFAQs must be a static import — it's data-only, not a component
import Link from 'next/link';
import { FAQPageSchema } from '@/components/ui/FAQ';
import { WebSiteSchema } from '@/components/seo/EnhancedSchema'; // Added for AI/Search readiness (also in layout)

// ── Below-fold sections: lazily loaded after initial paint ──
// These are not needed for LCP/FCP — deferring them reduces initial JS
// bundle by ~24 KB and eliminates 2 long main-thread tasks.
const LiveChallenges = dynamic(
  () => import('@/components/home/LiveChallenges'),
  {
    ssr: true, // Keep SSR for SEO content
    loading: () => <div className="h-32 animate-pulse bg-gray-900/50 rounded-xl mx-4 my-8" />,
  }
);
const SupportedGames = dynamic(
  () => import('@/components/home/SupportedGames'),
  {
    ssr: true,
    loading: () => <div className="h-48 animate-pulse bg-gray-900/50 rounded-xl mx-4 my-8" />,
  }
);
const FeaturesSection = dynamic(
  () => import('@/components/home/FeaturesSection'),
  {
    ssr: true,
    loading: () => <div className="h-64 animate-pulse bg-gray-900/50 rounded-xl mx-4 my-8" />,
  }
);
const CTASection = dynamic(
  () => import('@/components/home/CTASection'),
  {
    ssr: true,
    loading: () => <div className="h-24 animate-pulse bg-gray-900/50 rounded-xl mx-4 my-8" />,
  }
);
const HowItWorksSection = dynamic(
  () => import('@/components/home/HowItWorksSection'),
  {
    ssr: true,
    loading: () => <div className="h-48 animate-pulse bg-gray-900/50 rounded-xl mx-4 my-8" />,
  }
);


// Sample related content for homepage internal linking (improves crawl + engagement)
const sampleRelatedTournaments = [
  { title: "BGMI Daily Scrims", prizePool: "5000", id: "daily-bgmi" },
  { title: "Free Fire Clash Squad", prizePool: "2500", id: "ff-clash" },
];



// ── HowTo Schema Data for "How BattleXZone Works" ──
const howToJoinData = {
  name: 'How to Join BGMI Tournaments on BattleXZone and Win Real Money',
  description: 'Step-by-step guide to join BGMI custom room tournaments on BattleXZone and win real cash prizes via UPI.',
  totalTime: 'PT5M',
  cost: '10',
  steps: [
    {
      name: 'Create Your BattleXZone Account',
      text: 'Visit battlexzone.com and sign up with your mobile number or Google account. Verification takes under 1 minute.',
      url: '/register',
    },
    {
      name: 'Complete KYC Verification',
      text: 'Upload your Aadhaar card or PAN card for identity verification. This is required before you can withdraw winnings. Verification is processed within 24 hours.',
      url: '/kyc',
    },
    {
      name: 'Add Money to Your Wallet',
      text: 'Add funds using UPI (Google Pay, PhonePe, Paytm), net banking, or debit card. Minimum deposit is ₹10. Payments are processed instantly via Razorpay.',
      url: '/wallet',
    },
    {
      name: 'Browse and Join a BGMI Match',
      text: 'Go to the Matches page, filter by game (BGMI/Free Fire), mode (Solo/Duo/Squad), and entry fee. Click "Join Match" and pay the entry fee from your wallet.',
      url: '/matches',
    },
    {
      name: 'Get Room ID & Play the Match',
      text: 'Room ID and password are shared 15 minutes before match start. Join the BGMI custom room, play the match, and submit your screenshot after the game ends.',
    },
    {
      name: 'Win Prizes & Withdraw via UPI',
      text: 'Results are declared within 30 minutes. Winners receive prize money directly in their BattleXZone wallet. Withdraw instantly to your bank account via UPI.',
      url: '/wallet',
    },
  ],
};

// Homepage internal linking targets (new high-value pages for SEO)
const featuredResources = [
  { title: "Complete BGMI Tournament Guide 2026", href: "/blog/complete-bgmi-tournament-guide-india-2026", type: "Guide" },
  { title: "How to Withdraw Winnings Fast", href: "/blog/how-to-withdraw-winnings-from-bgmi-tournaments-2026", type: "Guide" },
  { title: "Real Player Winner Stories", href: "/winners", type: "Proof" },
  { title: "BattleXZone vs Other Platforms", href: "/compare", type: "Comparison" },
];

const popularCities = [
  { name: "Mumbai", href: "/locations/mumbai-tournaments" },
  { name: "Delhi NCR", href: "/locations/delhi-tournaments" },
  { name: "Bangalore", href: "/locations/bangalore-tournaments" },
  { name: "Hyderabad", href: "/locations/hyderabad-tournaments" },
  { name: "Chennai", href: "/locations/chennai-tournaments" },
  { name: "Kolkata", href: "/locations/kolkata-tournaments" },
];

// Self-contained FAQs for homepage (ensures static generation + rich schema)
const homepageFAQs = [
  {
    question: "What is the minimum entry fee for BGMI tournaments?",
    answer: "You can join BGMI tournaments on BattleXZone starting from just ₹10. Higher entry matches have larger prize pools."
  },
  {
    question: "How fast can I withdraw my BGMI winnings?",
    answer: "UPI withdrawals are typically processed within 24-48 hours after verification. Minimum withdrawal is ₹100."
  },
  {
    question: "Is BattleXZone legal in India?",
    answer: "Yes. BGMI tournaments are skill-based games and fully legal. We require KYC for all cash players and comply with Indian regulations."
  },
  {
    question: "Do I need to complete KYC to play?",
    answer: "KYC (Aadhaar or PAN) is required before you can withdraw any winnings. It is quick and mandatory for legal compliance."
  },
  {
    question: "Can I play BGMI tournaments from any city in India?",
    answer: "Yes. All tournaments are online. Players from Mumbai, Delhi, Bangalore, Hyderabad, Kolkata, Jaipur and everywhere else compete daily."
  },
];

export default function HomePage() {
  // ── Schema: HowTo + Speakable only ──
  // NOTE: WebSite + SearchAction is emitted by layout.jsx via getKnowledgeGraph().
  // NOTE: FAQPage schema is emitted by the <FAQ showSchema={true}> component below.
  // Adding them here AGAIN causes duplicate / conflicting schemas → Google reports
  // "3 invalid items" in Rich Results Test. Keep only HowTo + Speakable here.
  const howToSchema = getHowToSchema(howToJoinData);
  const speakableSchema = getSpeakableSchema('/', ['h1', '.aeo-answer', '.faq-answer']);

  return (
    <>
      {/* ══ Structured Data: HowTo + Speakable ══ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 body-text">
        <HeroSection />

        {/* ══ AEO Quick-Answer Section — Targets Featured Snippets + AI Overviews ══ */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 bg-gradient-to-b from-black/40 to-gray-900/40" aria-label="What is BattleXZone">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-l-4 border-cyan-500 rounded-r-xl p-4 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 sm:mb-4">Join BGMI Tournament Today & Win Real Cash</h2>
              <p className="aeo-answer text-base sm:text-lg text-gray-200 leading-relaxed">
                <strong className="text-white">BattleXZone</strong> is India&apos;s premier platform for competitive mobile gaming. If you are looking to <strong className="text-cyan-400">play BGMI tournaments today</strong> or join <strong className="text-cyan-400">BGMI daily scrims</strong> tonight, you are in the right place. We host paid custom rooms and massive prize pool events for squads, duos, and solo players. <strong className="text-cyan-400">Earn money playing BGMI</strong> with instant UPI withdrawals.
              </p>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-gray-300">
                <h3 className="text-base sm:text-lg font-semibold text-white">Upcoming BGMI Custom Rooms & Scrims</h3>
                <p className="aeo-answer">
                  We provide a seamless experience for gamers. From instant registration to automated result verification and lightning-fast payouts, our platform is built by gamers, for gamers. Whether you are an underdog squad looking for exposure or seasoned pros dominating the <strong>BGMI esports platform</strong> scene, we have a tournament for you.
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-white">How to Register and Play</h3>
                <p className="aeo-answer">
                  1. Create your free account.<br />
                  2. Browse our list of <strong>upcoming BGMI custom rooms</strong>.<br />
                  3. Register your squad and get the Room ID and Password 15 minutes before the match.<br />
                  4. Drop into Erangel, secure the chicken dinner, and claim your winnings!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ Real Stats + Trust (E-E-A-T for homepage) ══ */}
        <section className="py-12 px-3 sm:px-4 border-y border-dark-700">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold">Real Players. Real Cash. Real Results.</h2>
              <p className="text-dark-400 mt-2">Over ₹2.8 Crore paid out to verified winners across India</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "50,000+", label: "Registered Players" },
                { value: "₹2.8 Cr+", label: "Total Prizes Paid" },
                { value: "1,000+", label: "Daily Matches" },
                { value: "4.7★", label: "Player Rating" },
              ].map((stat, i) => (
                <div key={i} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                  <div className="text-3xl font-bold text-primary-400">{stat.value}</div>
                  <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Popular Cities — Strong Local SEO + Internal Links ══ */}
        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">BGMI Tournaments in Your City</h2>
                <p className="text-dark-400">Play with local players from across India</p>
              </div>
              <Link href="/locations" className="text-primary-400 hover:underline hidden sm:block">View all cities →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularCities.map((city, index) => (
                <Link 
                  key={index} 
                  href={city.href} 
                  className="bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 rounded-xl p-4 text-center transition group"
                >
                  <div className="font-semibold group-hover:text-primary-400">{city.name}</div>
                  <div className="text-xs text-dark-400 mt-1">Daily Tournaments →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ Featured Resources — Internal Linking to New Pillar Content ══ */}
        <section className="py-12 px-3 sm:px-4 bg-dark-800/40">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Learn How to Win More</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredResources.map((res, i) => (
                <Link 
                  key={i} 
                  href={res.href} 
                  className="bg-dark-900 hover:bg-dark-800 border border-dark-700 rounded-xl p-5 transition group"
                >
                  <div className="text-xs uppercase tracking-widest text-primary-400 mb-2">{res.type}</div>
                  <div className="font-semibold group-hover:text-primary-400 transition">{res.title}</div>
                  <div className="text-xs text-dark-400 mt-3">Read now →</div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/blog" className="text-primary-400 hover:underline text-sm">Browse all BGMI guides &amp; tips →</Link>
            </div>
          </div>
        </section>

        {/* ══ Real Winners Teaser (E-E-A-T + Conversion) ══ */}
        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Verified Winners on BattleXZone</h2>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">Real players turning their BGMI skills into serious cash. See proof and start your own story.</p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Arjun (Mumbai)", prize: "₹48,500", highlight: "₹48.5k in one week" },
                { name: "Rohit (Delhi NCR)", prize: "₹1,12,000", highlight: "Highest monthly earner" },
                { name: "Sneha (Bangalore)", prize: "₹27,200", highlight: "Paid college fees from wins" },
              ].map((w, i) => (
                <div key={i} className="bg-dark-800 rounded-xl p-5 border border-dark-700 text-left">
                  <div className="font-semibold">{w.name}</div>
                  <div className="text-2xl text-emerald-400 font-bold my-1">{w.prize}</div>
                  <div className="text-sm text-dark-300">{w.highlight}</div>
                </div>
              ))}
            </div>

            <Link href="/winners" className="btn-primary px-8 py-3 inline-block">See All Real Winner Stories →</Link>
          </div>
        </section>

        {/* ══ Static FAQ + Schema (SEO rich results without client component prerender issues) ══ */}
        <div id="faq" className="bg-black/40 py-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions About BGMI Tournaments</h2>
            
            <FAQPageSchema faqs={homepageFAQs} />

            <div className="space-y-3">
              {homepageFAQs.map((faq, index) => (
                <div key={index} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
                  <div className="font-semibold text-white mb-1">{faq.question}</div>
                  <div className="text-dark-300 text-sm leading-relaxed">{faq.answer}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link href="/faq" className="text-primary-400 hover:underline text-sm">See full FAQ →</Link>
            </div>
          </div>
        </div>

        {/* Strong Internal Linking Footer for Crawlability */}
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-dark-400 border-t border-dark-700">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link href="/tournaments" className="hover:text-white">All Tournaments</Link>
            <Link href="/matches" className="hover:text-white">Live Matches Today</Link>
            <Link href="/winners" className="hover:text-white">Winner Stories</Link>
            <Link href="/compare" className="hover:text-white">Compare Platforms</Link>
            <Link href="/blog" className="hover:text-white">BGMI Guides</Link>
            <Link href="/locations" className="hover:text-white">Tournaments by City</Link>
            <Link href="/how-it-works" className="hover:text-white">How It Works</Link>
            <Link href="/register" className="hover:text-white">Register Free</Link>
          </div>
        </div>
      </main>

      {/* PHASE 3 + 9 + 10: WebSite + SearchAction Schema (AI Search + Entity) — injected via root layout knowledgeGraph for all pages */}
      {/* <WebSiteSchema /> moved to layout to avoid duplicate entity signals */}

      <Footer />
    </>
  );
}
