/**
 * ============================================================
 * BattleZone Entity SEO + AI Search Schema System
 * ============================================================
 * Implements:
 * - @graph-based Knowledge Graph for Google Entity SEO
 * - SportsEvent schema for BGMI matches/tournaments
 * - FAQPage schema for AEO (Answer Engine Optimization)
 * - Speakable schema for voice search / Google Assistant
 * - ItemList schema for match/tournament listing pages
 * - BreadcrumbList for navigation signals
 * - HowTo schema for step-by-step guides
 * - VideoGame entity for BGMI ecosystem mapping
 * ============================================================
 */

import { SITE } from './seo-config';

// ─── Organization Entity ────────────────────────────────────
export const organizationEntity = {
  '@type': 'Organization',
  '@id': `${SITE.baseUrl}/#organization`,
  name: SITE.name,
  url: SITE.baseUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE.baseUrl}/#logo`,
    url: `${SITE.baseUrl}/images/logo.png`,
    contentUrl: `${SITE.baseUrl}/images/logo.png`,
    width: 512,
    height: 512,
    caption: 'BattleZone Logo',
  },
  image: { '@id': `${SITE.baseUrl}/#logo` },
  description: SITE.defaultDescription,
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Place',
    name: `${SITE.location.city}, ${SITE.location.state}, ${SITE.location.country}`,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.state,
    postalCode: SITE.location.postalCode,
    addressCountry: 'IN',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE.contact.email,
      url: `${SITE.baseUrl}/contact`,
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
  ],
  sameAs: Object.values(SITE.social),
  knowsAbout: [
    'BGMI Tournaments',
    'Battlegrounds Mobile India',
    'PUBG Mobile India',
    'Free Fire Esports',
    'Mobile Esports',
    'Competitive Gaming India',
    'Esports Tournament Organization',
  ],
};

// ─── WebSite Entity (Search Action for Sitelinks Searchbox) ─
export const websiteEntity = {
  '@type': 'WebSite',
  '@id': `${SITE.baseUrl}/#website`,
  url: SITE.baseUrl,
  name: SITE.name,
  description: SITE.defaultDescription,
  publisher: { '@id': `${SITE.baseUrl}/#organization` },
  inLanguage: SITE.language,
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  ],
};

// ─── WebApplication Entity ──────────────────────────────────
export const webApplicationEntity = {
  '@type': 'WebApplication',
  '@id': `${SITE.baseUrl}/#webapp`,
  name: SITE.name,
  url: SITE.baseUrl,
  applicationCategory: 'GameApplication',
  applicationSubCategory: 'Esports Tournament Platform',
  operatingSystem: 'Web, Android, iOS',
  browserRequirements: 'Requires JavaScript. Modern browser recommended.',
  description: "India's premier BGMI esports tournament platform. Play competitive matches, win real cash prizes.",
  author: { '@id': `${SITE.baseUrl}/#organization` },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Free to join. Match entry fees start from ₹10.',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.6',
    ratingCount: '15000',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'BGMI Custom Room Tournaments',
    'Solo, Duo & Squad Matches',
    'Real Money Cash Prizes',
    'Instant UPI Withdrawals',
    'Advanced Anti-Cheat System',
    'KYC Verified Players',
    'Live Leaderboards',
    '24/7 Support via Discord',
  ],
};

// ─── VideoGame Entity (BGMI Ecosystem) ──────────────────────
export const bgmiGameEntity = {
  '@type': 'VideoGame',
  '@id': `${SITE.baseUrl}/#bgmi`,
  name: 'Battlegrounds Mobile India (BGMI)',
  alternateName: ['BGMI', 'PUBG Mobile India', 'Battlegrounds Mobile India'],
  gamePlatform: ['Android', 'iOS'],
  genre: ['Battle Royale', 'Esports', 'Competitive Shooter'],
  description: 'Battlegrounds Mobile India (BGMI) is the Indian version of PUBG Mobile, a battle royale game developed by Krafton.',
  publisher: {
    '@type': 'Organization',
    name: 'Krafton',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.2',
    ratingCount: '50000000',
  },
};

// ─── Full Knowledge Graph (@graph) for Root Layout ──────────
export function getKnowledgeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationEntity,
      websiteEntity,
      webApplicationEntity,
      bgmiGameEntity,
      getLocalBusinessSchema(),
      getSoftwareAppSchema(),
    ],
  };
}

// ─── SportsEvent Schema for Individual Matches ──────────────
export function getMatchSchema(match) {
  if (!match) return null;

  const matchId = match._id || match.id;
  const slotsLeft = match.maxSlots - (match.filledSlots || match.joinedUsers?.length || 0);
  const startTime = match.scheduledAt || match.startTime;
  const gameLabel = (match.gameType || 'BGMI').replace('_', ' ');

  const statusMap = {
    upcoming: 'https://schema.org/EventScheduled',
    registration_open: 'https://schema.org/EventScheduled',
    live: 'https://schema.org/EventScheduled',
    in_progress: 'https://schema.org/EventScheduled',
    completed: 'https://schema.org/EventPostponed',
    cancelled: 'https://schema.org/EventCancelled',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${SITE.baseUrl}/matches/${matchId}`,
    name: match.title || `${gameLabel} ${match.matchType} Match`,
    description: `Competitive ${gameLabel} ${match.mode || 'Squad'} match. Entry: ₹${match.entryFee}. Prize pool: ₹${match.prizePool}. ${slotsLeft} slots remaining.`,
    startDate: startTime ? new Date(startTime).toISOString() : undefined,
    endDate: match.endTime ? new Date(match.endTime).toISOString() : undefined,
    eventStatus: statusMap[match.status] || 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE.baseUrl}/matches/${matchId}`,
    },
    image: match.banner?.url || `${SITE.baseUrl}/images/og-matches.jpg`,
    organizer: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.baseUrl,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE.baseUrl}/matches/${matchId}`,
      price: match.entryFee || 0,
      priceCurrency: 'INR',
      availability: slotsLeft > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      validFrom: match.createdAt ? new Date(match.createdAt).toISOString() : undefined,
    },
    maximumAttendeeCapacity: match.maxSlots,
    remainingAttendeeCapacity: slotsLeft,
    sport: gameLabel,
    competitor: match.joinedUsers?.slice(0, 5).map(u => ({
      '@type': 'Person',
      name: u.user?.name || 'Player',
    })),
  };
}

// ─── SportsEvent Schema for Tournaments ─────────────────────
export function getTournamentSchema(tournament) {
  if (!tournament) return null;

  const tournamentId = tournament._id || tournament.id;
  const name = tournament.title || tournament.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${SITE.baseUrl}/tournaments/${tournamentId}`,
    name,
    description: tournament.description || `${name} — BGMI esports tournament with ₹${tournament.prizePool} prize pool on BattleZone.`,
    startDate: tournament.startAt ? new Date(tournament.startAt).toISOString() : undefined,
    endDate: tournament.endAt ? new Date(tournament.endAt).toISOString() : undefined,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE.baseUrl}/tournaments/${tournamentId}`,
    },
    organizer: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.baseUrl,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE.baseUrl}/tournaments/${tournamentId}`,
      price: tournament.entryFee || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    maximumAttendeeCapacity: tournament.maxTeams,
    sport: 'Battlegrounds Mobile India',
    image: tournament.banner?.url || `${SITE.baseUrl}/images/og-tournaments.jpg`,
  };
}

// ─── ItemList Schema (Match/Tournament Listings) ────────────
export function getItemListSchema(items, type = 'match') {
  const listItems = (items || []).slice(0, 10).map((item, index) => {
    const itemId = item._id || item.id;
    const path = type === 'match' ? 'matches' : 'tournaments';
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.title || item.name,
      url: `${SITE.baseUrl}/${path}/${itemId}`,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: type === 'match' ? 'Live BGMI Matches on BattleZone' : 'Upcoming BGMI Tournaments on BattleZone',
    description: type === 'match'
      ? 'Browse and join competitive BGMI matches with real cash prizes'
      : 'Register for upcoming BGMI tournaments with massive prize pools',
    numberOfItems: items?.length || 0,
    itemListElement: listItems,
  };
}

// ─── FAQPage Schema (AEO — Answer Engine Optimization) ──────
export function getFaqSchema(faqs) {
  // Filter out entries missing required fields to prevent Google Rich Results
  // "Unnamed item / 1 critical issue" errors in the Rich Results Test.
  const validFaqs = (faqs || []).filter(
    (faq) => faq && faq.question && faq.question.trim() && faq.answer && faq.answer.trim()
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  };
}

// ─── Comprehensive BGMI FAQs for AEO ───────────────────────
// Ordered to target Google "People Also Ask" (PAA) boxes first.
// Use concise, direct answers (40–60 words) for Featured Snippet capture.
// Updated with SEO Master Strategy PILLAR 1 PAA Questions
export const bgmiPlatformFaqs = [
  // ── PAA Target #1 (Primary Keyword: "BGMI win match online") ──
  {
    question: 'How can I earn money by playing BGMI in India?',
    answer: 'You can earn money playing BGMI by joining tournament platforms like BattleXZone that offer cash prizes. Register for free or paid tournaments (entry fees start at ₹10), compete in matches, and win prize money directly to your UPI/Paytm wallet. Top players earn ₹10,000-50,000 monthly.',
  },
  // ── PAA Target #2 (Primary Keyword: "BGMI tournament online India") ──
  {
    question: 'Which is the best app for BGMI tournaments?',
    answer: 'BattleXZone is India\'s leading BGMI tournament platform with 50,000+ active players, daily tournaments starting at ₹10 entry, instant UPI withdrawals, and ₹10 lakh+ monthly prize pools. It offers solo, duo, and squad matches with 24/7 customer support.',
  },
  // ── PAA Target #3 (Trust Signal) ──
  {
    question: 'Is BattleXZone safe for online tournaments?',
    answer: 'Yes, BattleXZone is 100% safe with RBI-compliant payment gateways, secure KYC verification, encrypted transactions, and transparent prize distribution. Over 1,00,000 players have successfully withdrawn winnings. The platform uses anti-cheat systems for fair gameplay.',
  },
  // ── PAA Target #4 (Primary Keyword: "Free Fire online earning tournament") ──
  {
    question: 'How do I join a Free Fire tournament?',
    answer: 'To join a Free Fire tournament: 1) Register on BattleXZone, 2) Complete KYC verification, 3) Add money to wallet (min ₹10), 4) Browse Free Fire tournaments, 5) Click "Join Now" and pay entry fee. You\'ll receive room ID and password 10 minutes before match.',
  },
  // ── PAA Target #5 (Primary Keyword: "PUBG tournament earn money India") ──
  {
    question: 'What is the entry fee for BGMI tournaments?',
    answer: 'BattleXZone offers BGMI tournaments starting from just ₹10 entry fee. Free tournaments are also available for beginners. Prize pools range from ₹100 to ₹50,000 depending on the tournament tier. Premium weekend tournaments have higher entry fees with bigger prizes.',
  },
  // ── PAA Target #6 (Primary Keyword: "online gaming earn money India") ──
  {
    question: 'Can I really win real money playing mobile games?',
    answer: 'Yes, you can win real money playing mobile games like BGMI and Free Fire on BattleXZone. It\'s a skill-based gaming platform where your performance determines your earnings. Winners receive cash prizes directly to their wallet, withdrawable via UPI within minutes.',
  },
  // ── Additional PAA Questions for Long-tail Keywords ──
  {
    question: 'How to join BGMI tournament with 10 rupees entry fee?',
    answer: 'To join a ₹10 BGMI tournament on BattleXZone: 1) Create your free account, 2) Add minimum ₹10 to wallet via UPI, 3) Go to Matches page, 4) Filter by "Entry: ₹10", 5) Click "Join" on any available match. Room credentials are sent 10-15 minutes before the match starts.',
  },
  {
    question: 'Is it legal to play BGMI tournaments for real money in India?',
    answer: 'Yes. BGMI tournaments for real money are legal in India when hosted on skill-based gaming platforms like BattleXZone. These are competitive skill-based matches, not gambling. However, players from Andhra Pradesh, Telangana, Assam, Odisha, Nagaland, and Sikkim should check local state regulations.',
  },
  {
    question: 'How to withdraw winnings from BattleXZone?',
    answer: 'After winning a tournament on BattleXZone, your prize is credited to your wallet instantly. To withdraw: go to Wallet → Withdraw → enter UPI ID or bank details → confirm. UPI withdrawals are processed within 5-10 minutes. Minimum withdrawal is ₹50.',
  },
  // ── Platform Trust FAQs ──
  {
    question: 'How does BattleXZone prevent cheating in BGMI matches?',
    answer: 'BattleXZone uses multi-layer anti-cheat: mandatory screenshot submission, EXIF metadata verification, duplicate image detection, device fingerprinting, and manual admin review for disputed results. Cheaters are permanently banned and forfeit all winnings.',
  },
  {
    question: 'What is a BGMI custom room and how do I get the room ID?',
    answer: 'A BGMI custom room is a private match lobby where only registered players can join using a room ID and password. On BattleXZone, after registration closes, the room ID and password are automatically shared with all registered players 10-15 minutes before match start via app notification.',
  },
];

// ─── BreadcrumbList Schema ──────────────────────────────────
export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE.baseUrl}${item.url}`,
    })),
  };
}

// ─── HowTo Schema ───────────────────────────────────────────
export function getHowToSchema({ name, description, steps, totalTime = 'PT5M', cost = '10' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: cost,
    },
    supply: [
      { '@type': 'HowToSupply', name: 'Smartphone with BGMI installed' },
      { '@type': 'HowToSupply', name: 'Stable internet connection' },
      { '@type': 'HowToSupply', name: 'Valid Aadhaar or PAN card for KYC' },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'BattleZone account (free)' },
      { '@type': 'HowToTool', name: 'UPI payment app (Google Pay, PhonePe, Paytm)' },
    ],
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      url: step.url ? `${SITE.baseUrl}${step.url}` : undefined,
      image: step.image,
    })),
  };
}

// ─── Speakable Schema (Voice Search / Google Assistant) ─────
export function getSpeakableSchema(url, cssSelectors = ['h1', '.aeo-answer', '.faq-answer']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url.startsWith('http') ? url : `${SITE.baseUrl}${url}`,
    name: SITE.name,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
    url: url.startsWith('http') ? url : `${SITE.baseUrl}${url}`,
  };
}

// ─── Article Schema ─────────────────────────────────────────
export function getArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.description,
    image: article.image || `${SITE.baseUrl}/images/og-default.jpg`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Organization',
      name: article.author || SITE.name,
      url: SITE.baseUrl,
    },
    publisher: { '@id': `${SITE.baseUrl}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url ? `${SITE.baseUrl}${article.url}` : SITE.baseUrl,
    },
    articleSection: article.category || 'BGMI',
    keywords: article.keywords?.join(', ') || 'BGMI, esports, tournaments',
    inLanguage: SITE.language,
    wordCount: article.wordCount,
  };
}

// ─── VideoObject Schema (PILLAR 3 - Technical SEO) ────────────
export function getVideoSchema(video) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail || `${SITE.baseUrl}/images/video-thumb.jpg`,
    uploadDate: video.uploadDate || new Date().toISOString(),
    duration: video.duration || 'PT5M', // ISO 8601 duration format
    contentUrl: video.url,
    embedUrl: video.embedUrl,
    publication: {
      '@type': 'BroadcastEvent',
      isLiveBroadcast: false,
      startDate: video.uploadDate || new Date().toISOString(),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.baseUrl}/images/logo.png`,
        width: 512,
        height: 512,
      },
    },
    author: {
      '@type': 'Organization',
      name: SITE.name,
    },
    inLanguage: SITE.language,
    regionAllowed: 'IN',
  };
}

// ─── Game-Specific Tournament Schema (Enhanced for PILLAR 3) ───
export function getGameTournamentSchema(tournament, gameType = 'BGMI') {
  const gameNames = {
    'BGMI': 'Battlegrounds Mobile India',
    'FREE_FIRE': 'Free Fire',
    'PUBG_MOBILE': 'PUBG Mobile',
  };
  
  const baseSchema = getTournamentSchema(tournament);
  
  return {
    ...baseSchema,
    '@type': ['SportsEvent', 'Event'],
    sport: gameNames[gameType] || 'BGMI',
    about: {
      '@type': 'VideoGame',
      name: gameNames[gameType] || 'BGMI',
      gamePlatform: ['Android', 'iOS'],
      genre: ['Battle Royale', 'Esports'],
    },
    // Add aggregate rating for rich snippets
    aggregateRating: tournament.rating ? {
      '@type': 'AggregateRating',
      ratingValue: tournament.rating.value || '4.8',
      ratingCount: tournament.rating.count || '1250',
      bestRating: '5',
    } : undefined,
    // Add offers with detailed pricing
    offers: {
      '@type': 'Offer',
      name: `${tournament.title || 'Tournament'} Entry`,
      price: tournament.entryFee || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: tournament.startAt ? new Date(tournament.startAt).toISOString() : undefined,
      eligibleRegion: {
        '@type': 'Country',
        name: 'IN',
      },
    },
  };
}

// ─── Product Schema for Tournament Entry (PILLAR 3) ────────────
export function getTournamentProductSchema(tournament) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${tournament.title || 'Tournament'} Entry`,
    description: `Entry for ${tournament.title || 'tournament'} with ₹${tournament.prizePool} prize pool. ${tournament.mode || 'Squad'} mode on ${tournament.gameType || 'BGMI'}.`,
    image: tournament.banner?.url || `${SITE.baseUrl}/images/og-tournaments.jpg`,
    offers: {
      '@type': 'Offer',
      price: tournament.entryFee || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: tournament.startAt ? new Date(tournament.startAt).toISOString() : undefined,
      seller: {
        '@type': 'Organization',
        name: SITE.name,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
    },
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
  };
}

// ─── LocalBusiness Schema for Indian Gaming Platform ───────────
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.baseUrl}/#business`,
    name: SITE.name,
    description: SITE.defaultDescription,
    url: SITE.baseUrl,
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.state,
      postalCode: SITE.location.postalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.location.lat,
      longitude: SITE.location.lng,
    },
    openingHours: 'Mo-Su 00:00-23:59', // 24/7 online platform
    priceRange: '₹₹',
    image: `${SITE.baseUrl}/images/logo.png`,
    sameAs: Object.values(SITE.social),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '15000',
      bestRating: '5',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };
}

// ─── SoftwareApplication Schema (PILLAR 3) ────────────────────
export function getSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '15000',
      bestRating: '5',
    },
    description: SITE.defaultDescription,
    downloadUrl: SITE.baseUrl,
    screenshot: `${SITE.baseUrl}/images/screenshot.png`,
    softwareVersion: '1.0.0',
    author: {
      '@type': 'Organization',
      name: SITE.name,
    },
  };
}

// ─── Enhanced Knowledge Graph with All Entities ────────────────
export function getEnhancedKnowledgeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationEntity,
      websiteEntity,
      webApplicationEntity,
      bgmiGameEntity,
      getLocalBusinessSchema(),
    ],
  };
}
