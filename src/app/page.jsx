'use client';

import { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components/layout';
import FAQ, { homepageFAQs } from '@/components/ui/FAQ';
import HeroSection from '@/components/home/HeroSection';
import LiveChallenges from '@/components/home/LiveChallenges';
import SupportedGames from '@/components/home/SupportedGames';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import { bgmiPlatformFaqs, getFaqSchema, getSpeakableSchema, getHowToSchema } from '@/lib/schema-graph';

// Import external CSS for performance (enables browser caching)
import '@/styles/hero-styles.css';

// ── HowTo Schema Data for "How BattleZone Works" ──
const howToJoinData = {
  name: 'How to Join BGMI Tournaments on BattleZone and Win Real Money',
  description: 'Step-by-step guide to join BGMI custom room tournaments on BattleZone and win real cash prizes via UPI.',
  totalTime: 'PT5M',
  cost: '10',
  steps: [
    {
      name: 'Create Your BattleZone Account',
      text: 'Visit battlezone.com and sign up with your mobile number or Google account. Verification takes under 1 minute.',
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
      text: 'Results are declared within 30 minutes. Winners receive prize money directly in their BattleZone wallet. Withdraw instantly to your bank account via UPI.',
      url: '/wallet',
    },
  ],
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handlePerformance = () => {
      if (typeof window !== 'undefined') {
        if (window.performance?.memory &&
          window.performance.memory.usedJSHeapSize > 500 * 1024 * 1024) {
          document.body.classList.add('performance-mode');
        }

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e) => {
          document.body.classList.toggle('reduce-motion', e.matches);
        };

        if (motionQuery.matches) {
          document.body.classList.add('reduce-motion');
        }

        motionQuery.addEventListener('change', handleMotionChange);
        return () => motionQuery.removeEventListener('change', handleMotionChange);
      }
    };

    return handlePerformance();
  }, []);

  // ── Schema: WebSite SearchAction + FAQ + HowTo + Speakable ──
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BattleZone',
    url: 'https://battlezone.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://battlezone.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema = getFaqSchema(bgmiPlatformFaqs);
  const howToSchema = getHowToSchema(howToJoinData);
  const speakableSchema = getSpeakableSchema('/', ['h1', '.aeo-answer', '.faq-answer']);

  return (
    <>
      {/* ══ Structured Data: SearchAction + FAQ (AEO) + HowTo + Speakable ══ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 body-text">
        <HeroSection />
        <LiveChallenges />
        <SupportedGames />
        <FeaturesSection />
        <CTASection />
        <HowItWorksSection />

        {/* ══ AEO Quick-Answer Section — Targets Featured Snippets + AI Overviews ══ */}
        <section className="py-16 px-4 bg-gradient-to-b from-black/40 to-gray-900/40" aria-label="What is BattleZone">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-l-4 border-cyan-500 rounded-r-xl p-8">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">What is BattleZone?</h2>
              <p className="aeo-answer text-lg text-gray-200 leading-relaxed">
                <strong className="text-white">BattleZone</strong> is India&apos;s premier esports tournament platform for
                <strong className="text-cyan-400"> BGMI (Battlegrounds Mobile India), PUBG Mobile, and Free Fire</strong>.
                Players compete in <strong className="text-cyan-400">Solo, Duo &amp; Squad</strong> custom room matches with
                real money prizes. Join <strong className="text-cyan-400">50,000+ active players</strong> competing daily
                with entry fees starting from <strong className="text-cyan-400">₹10</strong>. Winners receive prizes directly
                to their wallet and can withdraw via <strong className="text-cyan-400">UPI within 5–10 minutes</strong>.
                Every match is verified through our advanced <strong className="text-cyan-400">anti-cheat system</strong> ensuring
                fair play for all participants.
              </p>

              {/* ── Additional AEO paragraphs for long-tail queries ── */}
              <div className="mt-6 space-y-4 text-gray-300">
                <h3 className="text-lg font-semibold text-white">How BGMI Tournaments Work on BattleZone</h3>
                <p className="aeo-answer">
                  BGMI tournaments on BattleZone use the <strong>custom room format</strong>. After registering and paying
                  the entry fee, players receive the room ID and password 15 minutes before the match.
                  All players join the same BGMI custom room, play the match, and submit screenshots.
                  Results are verified within 30 minutes and prizes are credited instantly.
                </p>

                <h3 className="text-lg font-semibold text-white">Why Choose BattleZone for BGMI Esports?</h3>
                <p className="aeo-answer">
                  BattleZone is trusted by <strong>50,000+ Indian BGMI players</strong> because of instant UPI withdrawals,
                  KYC-verified fair play, 24/7 Discord support, and the lowest entry fees starting at ₹10.
                  We host <strong>500+ daily matches</strong> across Solo, Duo, and Squad formats with prize pools
                  up to ₹50,000.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FAQ Section (AEO — powers Google's "People Also Ask") ══ */}
        <FAQ
          faqs={homepageFAQs}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about playing BGMI tournaments on BattleZone"
          showSchema={true}
          className="bg-black/40"
        />
      </main>

      <Footer />
    </>
  );
}