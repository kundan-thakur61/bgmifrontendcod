'use client';

import Script from 'next/script';

export function GoogleAnalytics({ gaId }) {
  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              page_title: document.title,
              anonymize_ip: true,
            });
          `,
        }}
      />
      {/* GA4 Event Tracking Helpers */}
      <Script
        id="ga4-event-helpers"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track registration button clicks
            document.addEventListener('click', function(e) {
              var target = e.target.closest('a[href="/register"], button[data-track="register"]');
              if (target && window.gtag) {
                gtag('event', 'registration_click', {
                  event_category: 'engagement',
                  event_label: 'BGMI_Tournament_Signup',
                  page_location: window.location.href,
                });
              }
              // Track tournament join clicks
              var joinTarget = e.target.closest('button[data-track="join-match"], a[data-track="join-match"]');
              if (joinTarget && window.gtag) {
                gtag('event', 'join_match_click', {
                  event_category: 'engagement',
                  event_label: joinTarget.dataset.matchId || 'unknown',
                  page_location: window.location.href,
                });
              }
              // Track blog article clicks
              var blogTarget = e.target.closest('a[href^="/blog/"]');
              if (blogTarget && window.gtag) {
                gtag('event', 'blog_click', {
                  event_category: 'content',
                  event_label: blogTarget.getAttribute('href'),
                });
              }
            });

            // Track scroll depth
            var scrollMarks = [25, 50, 75, 100];
            var scrollTracked = {};
            window.addEventListener('scroll', function() {
              var scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
              scrollMarks.forEach(function(mark) {
                if (scrollPct >= mark && !scrollTracked[mark] && window.gtag) {
                  scrollTracked[mark] = true;
                  gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: mark + '%',
                    value: mark,
                    non_interaction: true,
                  });
                }
              });
            }, { passive: true });
          `,
        }}
      />
    </>
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
