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
        }

        const joinTarget = event.target.closest('button[data-track="join-match"], a[data-track="join-match"]');
        if (joinTarget) {
          window.gtag('event', 'join_match_click', {
            event_category: 'engagement',
            event_label: joinTarget.dataset.matchId || 'unknown',
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

export function GoogleSearchConsole({ verificationCode }) {
  if (!verificationCode) return null;

  return (
    <meta
      name="google-site-verification"
      content={verificationCode}
    />
  );
}

