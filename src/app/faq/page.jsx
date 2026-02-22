import { Navbar, Footer } from '@/components/layout';
import { PAGE_SEO } from '@/lib/seo-config';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo';
import { bgmiPlatformFaqs } from '@/lib/schema-graph';
import FAQAccordion from '@/components/ui/FAQAccordion';

export const metadata = PAGE_SEO.faq;

// Additional FAQ page-specific questions (not on homepage)
const additionalFaqs = [
  {
    question: 'What happens if I disconnect during a BGMI match?',
    answer:
      'Disconnections are treated as part of gameplay — your final stats are counted from before the disconnect. We recommend a stable 4G/Wi-Fi connection before joining. For technical issues confirmed on our end, full refunds are processed within 24 hours.',
  },
  {
    question: 'How do I complete KYC verification on BattleXZone?',
    answer:
      'Go to Profile → KYC Verification. Upload clear photos of your Aadhaar card (front and back) or PAN card, plus a selfie. Verification is processed within 24 hours. KYC is required before your first withdrawal to comply with RBI guidelines.',
  },
  {
    question: 'How do I report a cheater or fraudulent player?',
    answer:
      'Create a support ticket with evidence (screenshots or screen recording) showing the suspected cheating. Our team reviews all reports within 24–48 hours, investigates using our anti-cheat system, and takes action up to permanent banning and prize forfeiture.',
  },
];

const allFaqs = [...bgmiPlatformFaqs, ...additionalFaqs];

export default function FAQPage() {
  return (
    <>
      {/* ── Structured Data (JSON-LD) ── */}
      <FAQSchema faqs={allFaqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://battlexzone.com' },
          { name: 'FAQ', url: 'https://battlexzone.com/faq' },
        ]}
      />

      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Page header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-dark-400">
              Everything you need to know about BGMI tournaments and earning money on BattleXZone
            </p>
          </header>

          {/* PAA Target Questions — shown first for SEO prominence */}
          <section aria-labelledby="faq-earning-heading" className="mb-6">
            <h2
              id="faq-earning-heading"
              className="text-lg font-semibold text-cyan-400 mb-4 px-2"
            >
              About Earning &amp; Tournaments
            </h2>
            <FAQAccordion
              faqs={bgmiPlatformFaqs}
              label="Earning and tournament questions"
            />
          </section>

          {/* Platform-specific questions */}
          <section aria-labelledby="faq-platform-heading" className="mb-6">
            <h2
              id="faq-platform-heading"
              className="text-lg font-semibold text-cyan-400 mb-4 px-2"
            >
              Platform &amp; Account
            </h2>
            <FAQAccordion
              faqs={additionalFaqs}
              label="Platform and account questions"
            />
          </section>

          {/* CTA */}
          <div className="mt-12 text-center card p-8">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-dark-400 mb-4">Our support team is available 24/7 via Discord and email</p>
            <a href="/tickets" className="btn-primary">
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
