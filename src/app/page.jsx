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
import { getSpeakableSchema, getHowToSchema } from '@/lib/schema-graph';

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
        <LiveChallenges />
        <SupportedGames />
        <FeaturesSection />
        <CTASection />
        <HowItWorksSection />

        {/* ══ AEO Quick-Answer Section — Targets Featured Snippets + AI Overviews ══ */}
        <section className="py-10 sm:py-16 px-3 sm:px-4 bg-gradient-to-b from-black/40 to-gray-900/40" aria-label="What is BattleXZone">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-l-4 border-cyan-500 rounded-r-xl p-4 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-cyan-400 mb-3 sm:mb-4">Why Choose BattleXZone for BGMI Esports?</h2>
              <p className="aeo-answer text-base sm:text-lg text-gray-200 leading-relaxed">
                <strong className="text-white">BattleXZone</strong> is India&apos;s premier platform for competitive mobile gaming. If you are looking to <strong className="text-cyan-400">play BGMI tournaments</strong> and turn your gaming skills into real cash, you are in the right place. We host <strong className="text-cyan-400">BGMI daily scrims</strong>, paid custom rooms, and massive prize pool events for squads, duos, and solo players.
              </p>

              {/* ── Additional AEO paragraphs for long-tail queries ── */}
              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-gray-300">
                <h3 className="text-base sm:text-lg font-semibold text-white">Upcoming BGMI Custom Rooms & Scrims</h3>
                <p className="aeo-answer">
                  We provide a seamless experience for gamers. From instant registration to automated result verification and lightning-fast payouts, our platform is built by gamers, for gamers. Whether you are an underdog squad looking for exposure or seasoned pros dominating the <strong>BGMI esports platform</strong> scene, we have a tournament for you.
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-white">How to Register and Play</h3>
                <p className="aeo-answer">
                  1. Create your free account.<br/>
                  2. Browse our list of <strong>upcoming BGMI custom rooms</strong>.<br/>
                  3. Register your squad and get the Room ID and Password 15 minutes before the match.<br/>
                  4. Drop into Erangel, secure the chicken dinner, and claim your winnings!
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
