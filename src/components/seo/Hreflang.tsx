'use client';

import { useEffect } from 'react';

/**
 * Hreflang Component for International SEO
 * BattleXZone Multi-Market Support (en-IN primary + en-AE, en-GB, en-CA, en-US, en-AU)
 * 
 * Usage: <Hreflang currentPath="/tournaments" />
 * Or add to root layout / specific pages.
 * 
 * For full power, also set in Next.js metadata.alternates.languages (see seo-config.js).
 */
interface HreflangProps {
  currentPath?: string;
  baseUrl?: string;
}

const SUPPORTED_LOCALES = [
  { code: 'en-IN', path: '' },
  { code: 'en-AE', path: '/en-ae' },
  { code: 'en-GB', path: '/en-gb' },
  { code: 'en-CA', path: '/en-ca' },
  { code: 'en-US', path: '/en-us' },
  { code: 'en-AU', path: '/en-au' },
];

export function Hreflang({ currentPath = '', baseUrl = 'https://www.battlexzone.com' }: HreflangProps) {
  useEffect(() => {
    // Remove any previous hreflang links injected by us
    document.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());

    SUPPORTED_LOCALES.forEach(({ code, path }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hrefLang = code;
      link.href = `${baseUrl}${path}${currentPath}`;
      link.setAttribute('data-hreflang', code);
      document.head.appendChild(link);
    });

    // x-default
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hrefLang = 'x-default';
    xDefault.href = `${baseUrl}${currentPath}`;
    xDefault.setAttribute('data-hreflang', 'x-default');
    document.head.appendChild(xDefault);
  }, [currentPath, baseUrl]);

  return null;
}

// Server-friendly version for use in generateMetadata or layout
export function generateHreflangAlternates(currentPath: string, baseUrl = 'https://www.battlexzone.com') {
  const languages: Record<string, string> = {
    'en-IN': `${baseUrl}${currentPath}`,
    'en-AE': `${baseUrl}/en-ae${currentPath}`,
    'en-GB': `${baseUrl}/en-gb${currentPath}`,
    'en-CA': `${baseUrl}/en-ca${currentPath}`,
    'en-US': `${baseUrl}/en-us${currentPath}`,
    'en-AU': `${baseUrl}/en-au${currentPath}`,
    'x-default': `${baseUrl}${currentPath}`,
  };

  return {
    canonical: `${baseUrl}${currentPath}`,
    languages,
  };
}
