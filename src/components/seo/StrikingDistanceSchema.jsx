'use client';

/**
 * Schema markup component for "striking distance" keywords optimization
 * Targets keywords in positions 11-20 to improve rankings to page 1
 */

import { useEffect } from 'react';
import { SITE } from '@/lib/seo-config';

export function StrikingDistanceSchema({ 
  currentPage = 'home', 
  targetKeywords = [], 
  contentDepth = 1, 
  competitionLevel = 'medium' 
}) {
  // Define schema for striking distance keyword optimization
  const generateStrikingDistanceSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: getHeadlineByPage(currentPage),
      description: getDescriptionByPage(currentPage),
      author: {
        '@type': 'Organization',
        name: SITE.name,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE.name,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE.baseUrl}/images/logo.png`,
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      articleSection: getSectionByPage(currentPage),
      keywords: targetKeywords.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE.baseUrl}${getWindowPath()}`
      },
      image: {
        '@type': 'ImageObject',
        url: `${SITE.baseUrl}/images/og-${currentPage}.jpg`,
        width: 1200,
        height: 630,
      },
      hasPart: generateContentSections(targetKeywords, contentDepth),
      mentions: generateGameEntities(currentPage),
    };

    // Add additional properties based on competition level
    if (competitionLevel === 'high') {
      baseSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '2500',
        bestRating: '5',
        worstRating: '1',
      };
    }

    return baseSchema;
  };

  const getHeadlineByPage = (page) => {
    const headlines = {
      home: 'Play BGMI Tournaments Online & Win Real Cash - Complete Guide 2026',
      matches: 'BGMI Win Match Online - Join Live Tournaments & Compete Today',
      tournaments: 'BGMI Tournament Online India - Register & Earn Money 2026',
      blog: 'BGMI Tips & Strategies - How to Win Tournaments & Earn Money',
      'how-it-works': 'How to Join BGMI Tournament & Earn Money Online - Step by Step Guide'
    };
    return headlines[page] || headlines.home;
  };

  const getDescriptionByPage = (page) => {
    const descriptions = {
      home: 'Join daily BGMI tournaments and custom rooms. Compete with top players in India, showcase your skills, and win real cash prizes. Entry from ₹10.',
      matches: 'Join live BGMI matches online and compete for cash prizes. Solo, Duo, Squad modes available. Register now and start winning real money.',
      tournaments: 'Register for BGMI tournaments in India with cash prizes. Daily scrims, custom rooms, and championship events. Play BGMI and earn money.',
      blog: 'Expert BGMI tips, tricks, and strategies. Learn how to win tournaments, latest esports news India, pro player guides, and earning guides.',
      'how-it-works': 'Complete guide on how to join BGMI tournaments and earn money online. Step-by-step process from registration to withdrawal.'
    };
    return descriptions[page] || descriptions.home;
  };

  const getSectionByPage = (page) => {
    const sections = {
      home: 'BGMI Gaming',
      matches: 'BGMI Matches',
      tournaments: 'BGMI Tournaments',
      blog: 'Gaming Guides',
      'how-it-works': 'Gaming Tutorials'
    };
    return sections[page] || 'Gaming';
  };

  const generateContentSections = (keywords, depth) => {
    // Generate content sections based on target keywords to improve content depth
    return keywords.slice(0, 3).map((keyword, index) => ({
      '@type': 'ArticleSection',
      headline: `How to ${keyword.split(' ').slice(1).join(' ')}`,
      description: `Complete guide on ${keyword} with step-by-step instructions, tips, and strategies.`,
      position: index + 1,
    }));
  };

  const generateGameEntities = (page) => {
    const entities = [];
    
    if (page.includes('bgmi') || page === 'home' || page === 'tournaments' || page === 'matches') {
      entities.push({
        '@type': 'VideoGame',
        name: 'Battlegrounds Mobile India',
        alternateName: ['BGMI'],
        genre: ['Battle Royale', 'Esports'],
        publisher: {
          '@type': 'Organization',
          name: 'Krafton'
        }
      });
    }
    
    if (page.includes('free-fire') || page === 'home') {
      entities.push({
        '@type': 'VideoGame',
        name: 'Free Fire',
        genre: ['Battle Royale', 'Esports'],
        publisher: {
          '@type': 'Organization',
          name: 'Garena'
        }
      });
    }
    
    if (page.includes('pubg') || page === 'home') {
      entities.push({
        '@type': 'VideoGame',
        name: 'PUBG Mobile',
        genre: ['Battle Royale', 'Esports'],
        publisher: {
          '@type': 'Organization',
          name: 'Tencent Games'
        }
      });
    }
    
    return entities;
  };

  const getWindowPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  };

  const strikingDistanceSchema = generateStrikingDistanceSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(strikingDistanceSchema) 
      }}
      suppressHydrationWarning
    />
  );
}

/**
 * Component for FAQ schema targeting striking distance keywords
 */
export function StrikingDistanceFAQ({ 
  pageType = 'general', 
  targetKeywords = [],
  additionalQuestions = [] 
}) {
  const generateFAQs = () => {
    // Base FAQs for striking distance keyword optimization
    const baseFAQs = [
      {
        question: `How to ${targetKeywords[0] || 'play BGMI tournaments'}?`,
        answer: `To ${targetKeywords[0]?.toLowerCase() || 'play BGMI tournaments'}, you need to register on BattleXZone, complete KYC verification, add money to your wallet, browse available tournaments, and join matches with your desired entry fee. Our platform offers various tournament formats for different skill levels.`
      },
      {
        question: `Is it legal to ${targetKeywords[1] || 'earn money playing BGMI'} in India?`,
        answer: `Yes, ${targetKeywords[1]?.toLowerCase() || 'earning money playing BGMI'} is legal in India when done through skill-based gaming platforms like BattleXZone. These are considered games of skill rather than gambling. However, please check local regulations in your state as some states have specific restrictions.`
      },
      {
        question: `What are the best platforms for ${targetKeywords[2] || 'BGMI tournament online India'}?`,
        answer: `BattleXZone is one of India's top platforms for BGMI tournaments with 50,000+ active players, entry fees starting from ₹10, instant UPI withdrawals, and an advanced anti-cheat system. We offer daily scrims, custom rooms, and championship events for players of all skill levels.`
      }
    ];

    // Combine with additional questions
    const allFAQs = [...baseFAQs, ...additionalQuestions];

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: allFAQs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  };

  const faqSchema = generateFAQs();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(faqSchema) 
      }}
      suppressHydrationWarning
    />
  );
}