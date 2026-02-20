import { Navbar, Footer } from '@/components/layout';
import { PAGE_SEO } from '@/lib/seo-config';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo';
import { bgmiPlatformFaqs } from '@/lib/schema-graph';

export const metadata = PAGE_SEO.faq;

// Additional FAQ page-specific questions (not on homepage)
const additionalFaqs = [
  {
    question: 'What happens if I disconnect during a BGMI match?',
    answer: 'Disconnections are treated as part of gameplay — your final stats are counted from before the disconnect. We recommend a stable 4G/Wi-Fi connection before joining. For technical issues confirmed on our end, full refunds are processed within 24 hours.',
  },
  {
    question: 'How do I complete KYC verification on BattleXZone?',
    answer: 'Go to Profile → KYC Verification. Upload clear photos of your Aadhaar card (front and back) or PAN card, plus a selfie. Verification is processed within 24 hours. KYC is required before your first withdrawal to comply with RBI guidelines.',
  },
  {
    question: 'How do I report a cheater or fraudulent player?',
    answer: 'Create a support ticket with evidence (screenshots or screen recording) showing the suspected cheating. Our team reviews all reports within 24–48 hours, investigates using our anti-cheat system, and takes action up to permanent banning and prize forfeiture.',
  },
];

const allFaqs = [...bgmiPlatformFaqs, ...additionalFaqs];

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={allFaqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlexzone.com' },
        { name: 'FAQ', url: 'https://battlexzone.com/faq' },
      ]} />
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-dark-400">
              Everything you need to know about BGMI tournaments and earning money on BattleXZone
            </p>
          </div>

          {/* PAA Target Questions — shown first for SEO prominence */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4 px-2">About Earning &amp; Tournaments</h2>
            <div className="space-y-3">
              {bgmiPlatformFaqs.map((faq, index) => (
                <details key={`platform-${index}`} className="card group">
                  <summary className="p-5 sm:p-6 cursor-pointer list-none flex justify-between items-center">
                    <h3 className="font-semibold pr-4 text-sm sm:text-base">{faq.question}</h3>
                    <span className="text-primary-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-dark-300 text-sm sm:text-base faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Platform-specific questions */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4 px-2">Platform &amp; Account</h2>
            <div className="space-y-3">
              {additionalFaqs.map((faq, index) => (
                <details key={`additional-${index}`} className="card group">
                  <summary className="p-5 sm:p-6 cursor-pointer list-none flex justify-between items-center">
                    <h3 className="font-semibold pr-4 text-sm sm:text-base">{faq.question}</h3>
                    <span className="text-primary-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-dark-300 text-sm sm:text-base faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

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

