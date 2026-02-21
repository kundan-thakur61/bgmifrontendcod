import { Navbar, Footer } from '@/components/layout';
import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.refundPolicy;

export default function RefundPolicyPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Refund Policy', url: 'https://www.battlexzone.com/refund-policy' },
      ]} />
      <Navbar />

      <main className="min-h-screen pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">Refund Policy</h1>
          <p className="text-dark-400 mb-8">Last updated: January 1, 2025</p>

          <div className="space-y-8 text-dark-300">
            <section className="card p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white mb-4">1. Eligibility for Refunds</h2>
              <p className="mb-4">
                BattleZone may issue refunds under the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Match cancelled by admin before start time — full refund.</li>
                <li>Technical issues on BattleZone&apos;s end that prevented participation — full refund.</li>
                <li>Room ID/password not shared within 30 minutes of scheduled time — full refund.</li>
                <li>Duplicate payment charged — excess amount refunded.</li>
              </ul>
            </section>

            <section className="card p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white mb-4">2. Non-Refundable Scenarios</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Player fails to join the match room on time.</li>
                <li>Player disconnects due to personal internet issues.</li>
                <li>Player is banned for cheating or rule violations.</li>
                <li>Player voluntarily leaves during an ongoing match.</li>
                <li>Match completed successfully but player disagrees with results.</li>
              </ul>
            </section>

            <section className="card p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white mb-4">3. Refund Process</h2>
              <p className="mb-4">
                Eligible refunds are automatically credited to your BattleZone wallet within 24 hours. For bank/UPI refunds, the processing time is 5–7 business days.
              </p>
              <p>
                To request a refund, raise a support ticket at <a href="/tickets" className="text-primary-400 hover:underline">Support Tickets</a> or email <a href="mailto:support@battlexzone.com" className="text-primary-400 hover:underline">support@battlexzone.com</a>.
              </p>
            </section>

            <section className="card p-4 sm:p-6">
              <h2 className="text-xl font-bold text-white mb-4">4. Dispute Resolution</h2>
              <p>
                All refund disputes are reviewed by our admin team within 48 hours. Our decision is final and based on match logs, screenshots, and system data. For further escalation, contact us at support@battlexzone.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
