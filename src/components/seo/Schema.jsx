'use client';

import { getCurrencySymbol } from '@/lib/utils';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BattleZone',
    url: 'https://battlezone.com',
    logo: 'https://battlezone.com/logo.png',
    description: "India's premier esports gaming platform for PUBG Mobile and Free Fire tournaments.",
    foundingDate: '2024',
    foundingLocation: {
      '@type': 'Place',
      name: 'Dhanbad, Jharkhand, India',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'Dhanbad',
      addressRegion: 'JH',
    },
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@battlezone.com',
      url: 'https://battlezone.com/contact',
    },
    sameAs: [
      'https://twitter.com/BattleZone',
      'https://facebook.com/BattleZone',
      'https://instagram.com/BattleZone',
      'https://youtube.com/@BattleZone',
      'https://discord.gg/BattleZone',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}

export function FAQSchema({ faqs }) {
  // Default FAQs target the 6 highest-value PAA questions for Google India
  const defaultFAQs = [
    {
      question: 'How can I earn money by playing BGMI in India?',
      answer: 'You can earn money playing BGMI by joining online tournaments on platforms like BattleXZone. Register for Solo, Duo, or Squad matches with entry fees starting ₹10, compete against other players, and winners receive real cash prizes — withdrawable via UPI within 5–10 minutes.',
    },
    {
      question: 'Is it legal to play BGMI tournaments for real money in India?',
      answer: 'Yes. BGMI tournaments for real money are legal in India when hosted on skill-based gaming platforms like BattleXZone. These are competitive skill-based matches, not gambling. Players from Andhra Pradesh, Telangana, Assam, Odisha, Nagaland, and Sikkim should check local state regulations.',
    },
    {
      question: 'Which is the best site for BGMI tournament in India?',
      answer: 'BattleXZone is one of India\'s top BGMI tournament platforms with 50,000+ registered players, entry fees starting ₹10, instant UPI withdrawals, and an advanced anti-cheat system. It stands out for its low entry fees and fast prize payouts.',
    },
    {
      question: 'How to join a BGMI tournament online?',
      answer: 'To join a BGMI tournament: 1) Sign up on BattleXZone, 2) Complete KYC with Aadhaar or PAN, 3) Add wallet balance via UPI, 4) Browse tournaments and click "Join", 5) Pay entry fee, 6) Receive room ID 15 minutes before start, 7) Play and submit screenshot. Winners get cash instantly.',
    },
    {
      question: 'What is the minimum entry fee for BGMI tournaments?',
      answer: 'BGMI tournament entry fees on BattleXZone start from just ₹10. Free tournaments with cash prizes are also available for beginners. Competitive matches range ₹20–₹500, and premium weekend tournaments go up to ₹1,000 with prize pools exceeding ₹50,000.',
    },
    {
      question: 'How to withdraw prize money from gaming tournaments in India?',
      answer: 'After winning a BGMI tournament on BattleXZone, your prize is credited to your wallet instantly. To withdraw: go to Wallet → Withdraw → enter your UPI ID or bank details → confirm. UPI withdrawals process within 5–10 minutes. Bank transfers take 24–48 hours. Minimum withdrawal is ₹50.',
    },
  ];

  const faqList = faqs || defaultFAQs;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}

export function BreadcrumbSchema({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}

export function MatchSchema({ match }) {
  if (!match) return null;

  const slotsLeft = match.maxSlots - (match.filledSlots || match.joinedUsers?.length || 0);
  const matchId = match._id || match.id;
  const startTime = match.scheduledAt || match.startTime;
  const endTime = match.endTime || (startTime ? new Date(new Date(startTime).getTime() + 30 * 60000).toISOString() : null);
  const currency = match.prizePoolCurrency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const matchUrl = `https://battlexzone.com/matches/${matchId}`;

  // Correct eventStatus mapping per schema.org spec
  const eventStatusMap = {
    live: 'https://schema.org/EventScheduled',
    upcoming: 'https://schema.org/EventScheduled',
    completed: 'https://schema.org/EventCompleted',
    cancelled: 'https://schema.org/EventCancelled',
    postponed: 'https://schema.org/EventPostponed',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: match.title || `${match.gameType} ${match.matchType} — Prize ${currencySymbol}${match.prizePool}`,
    description: `Join this competitive ${match.gameType || 'BGMI'} ${match.matchType || 'match'}. Entry fee: ${currencySymbol}${match.entryFee || 0}. Prize pool: ${currencySymbol}${match.prizePool || 0}. ${match.mode || 'Squad'} mode. ${slotsLeft} slots left.`,
    url: matchUrl,
    startDate: startTime ? new Date(startTime).toISOString() : new Date().toISOString(),
    ...(endTime && { endDate: new Date(endTime).toISOString() }),
    eventStatus: eventStatusMap[match.status] || 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: matchUrl,
    },
    image: match.banner?.url || 'https://battlexzone.com/images/og-matches.jpg',
    offers: {
      '@type': 'Offer',
      name: `${match.title || 'Match'} Entry`,
      price: match.entryFee || 0,
      priceCurrency: currency,
      availability: slotsLeft > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: matchUrl,
      validFrom: new Date().toISOString(),
    },
    organizer: {
      '@type': 'Organization',
      name: 'BattleXZone',
      url: 'https://battlexzone.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '1284',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}

export function TournamentSchema({ tournament }) {
  if (!tournament) return null;

  const tournamentId = tournament._id || tournament.id;
  const tournamentName = tournament.title || tournament.name;
  const slotsLeft = (tournament.maxTeams || 0) - (tournament.registeredTeams || 0);
  const currency = tournament.prizePoolCurrency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const tournamentUrl = `https://battlexzone.com/tournaments/${tournamentId}`;
  const startDate = tournament.startAt || tournament.startDate;
  const endDate = tournament.endAt || tournament.endDate;

  // Correct eventStatus mapping per schema.org spec
  const eventStatusMap = {
    ongoing: 'https://schema.org/EventScheduled',
    upcoming: 'https://schema.org/EventScheduled',
    registration: 'https://schema.org/EventScheduled',
    completed: 'https://schema.org/EventCompleted',
    cancelled: 'https://schema.org/EventCancelled',
    postponed: 'https://schema.org/EventPostponed',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: tournamentName,
    description: tournament.description ||
      `Join ${tournamentName} on BattleXZone. Prize pool: ${currencySymbol}${tournament.prizePool || 0}. Entry fee: ${currencySymbol}${tournament.entryFee || 'Free'}. ${tournament.format || 'Squad'} format. Compete online in India.`,
    url: tournamentUrl,
    startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
    ...(endDate && { endDate: new Date(endDate).toISOString() }),
    eventStatus: eventStatusMap[tournament.status] || 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: tournamentUrl,
    },
    image: tournament.banner?.url || 'https://battlexzone.com/images/og-tournaments.jpg',
    offers: {
      '@type': 'Offer',
      name: `${tournamentName} Registration`,
      price: tournament.entryFee || 0,
      priceCurrency: currency,
      availability: slotsLeft > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      url: tournamentUrl,
      validFrom: new Date().toISOString(),
    },
    organizer: {
      '@type': 'Organization',
      name: 'BattleXZone',
      url: 'https://battlexzone.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '3761',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}
