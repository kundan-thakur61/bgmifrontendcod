'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function GoogleAnalytics({ gaId }) {
  useEffect(() => {
    if (!gaId || typeof window === 'undefined') return;

    // ── Defer analytics setup to idle time ──
    // Registering click/scroll listeners synchronously blocks the main thread
    // during first paint. requestIdleCallback defers this to when the browser
    // is idle, with a 2s max timeout so it always runs eventually.
    const setup = () => {
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args) => {
        window.dataLayer.push(args);
      };

      window.gtag = window.gtag || gtag;
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        page_path: window.location.pathname,
        page_title: document.title,
        anonymize_ip: true,
      });

      const handleClick = (event) => {
        if (!window.gtag) return;

        const registerTarget = event.target.closest('a[href="/register"], button[data-track="register"]');
        if (registerTarget) {
          window.gtag('event', 'registration_click', {
            event_category: 'engagement',
            event_label: 'BGMI_Tournament_Signup',
            page_location: window.location.href,
          });
          // SEO-critical funnel start
          window.gtag('event', 'registration_started', {
            method: 'click',
            source: 'organic_search_or_direct',
            page_location: window.location.href,
          });
        }

        const joinTarget = event.target.closest('button[data-track="join-match"], a[data-track="join-match"], button[data-track="join-tournament"]');
        if (joinTarget) {
          const matchId = joinTarget.dataset.matchId || joinTarget.dataset.tournamentId || 'unknown';
          const entryFee = joinTarget.dataset.entryFee || '0';
          window.gtag('event', 'join_match_click', {
            event_category: 'engagement',
            event_label: matchId,
            page_location: window.location.href,
          });
          window.gtag('event', 'tournament_joined', {
            tournament_id: matchId,
            entry_fee: parseFloat(entryFee) || 0,
            source: 'organic_search',
            page_location: window.location.href,
          });
        }

        const blogTarget = event.target.closest('a[href^="/blog/"]');
        if (blogTarget) {
          window.gtag('event', 'blog_click', {
            event_category: 'content',
            event_label: blogTarget.getAttribute('href') || 'unknown',
          });
        }

        const walletTarget = event.target.closest('a[href*="/wallet"], button[data-track="deposit"]');
        if (walletTarget) {
          window.gtag('event', 'wallet_deposit_initiated', {
            event_category: 'monetization',
          });
        }
      };

      const scrollMarks = [25, 50, 75, 100];
      const trackedMarks = new Set();
      const handleScroll = () => {
        if (!window.gtag) return;
        const denominator = document.body.scrollHeight - window.innerHeight;
        if (denominator <= 0) return;
        const scrollPct = Math.round((window.scrollY / denominator) * 100);

        scrollMarks.forEach((mark) => {
          if (scrollPct >= mark && !trackedMarks.has(mark)) {
            trackedMarks.add(mark);
            window.gtag('event', 'scroll_depth', {
              event_category: 'engagement',
              event_label: `${mark}%`,
              value: mark,
              non_interaction: true,
            });
          }
        });
      };

      document.addEventListener('click', handleClick);
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Store cleanup refs on window for teardown
      window.__ga_cleanup_click = handleClick;
      window.__ga_cleanup_scroll = handleScroll;
    };

    // Use requestIdleCallback if available (Chrome/Edge), else setTimeout(0) fallback
    const idleHandle =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(setup, { timeout: 2000 })
        : setTimeout(setup, 0);

    return () => {
      // Cancel idle callback if component unmounts before it fires
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleHandle);
      } else {
        clearTimeout(idleHandle);
      }
      // Clean up event listeners if they were attached
      if (window.__ga_cleanup_click) {
        document.removeEventListener('click', window.__ga_cleanup_click);
        window.removeEventListener('scroll', window.__ga_cleanup_scroll);
        delete window.__ga_cleanup_click;
        delete window.__ga_cleanup_scroll;
      }
    };
  }, [gaId]);

  if (!gaId) return null;

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
    />
  );
}

/**
 * Programmatic SEO + Business Event Tracker
 * Usage from any page/component after successful actions:
 *   import { trackSEOEvent } from '@/components/seo/Analytics';
 *   trackSEOEvent('registration_completed', { user_id: '...', kyc: 'pending' });
 */
export function trackSEOEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const enhancedParams = {
    ...params,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
  };

  window.gtag('event', eventName, enhancedParams);
}

// Pre-defined high-value events for BattleXZone SEO funnel (use these constants)
export const SEO_EVENTS = {
  REGISTRATION_STARTED: 'registration_started',
  REGISTRATION_COMPLETED: 'registration_completed',
  TOURNAMENT_VIEWED: 'tournament_viewed',
  TOURNAMENT_JOINED: 'tournament_joined',
  TOURNAMENT_PAYMENT_COMPLETED: 'tournament_payment_completed',
  TEAM_CREATED: 'team_created',
  MATCH_VIEWED: 'match_viewed',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  WALLET_DEPOSIT_COMPLETED: 'wallet_deposit_completed',
};

export function GoogleSearchConsole({ verificationCode }) {
  if (!verificationCode) return null;

  return (
    <meta
      name="google-site-verification"
      content={verificationCode}
    />
  );
}

