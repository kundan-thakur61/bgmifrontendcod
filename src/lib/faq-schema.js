export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I join BGMI tournaments on BattleXZone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Register on BattleXZone, add funds to your wallet, browse available BGMI tournaments, pay the entry fee, and join. You\'ll receive room details before the match starts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is BattleXZone safe and legal in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, BattleXZone is 100% legal in India. We operate as a skill-based gaming platform with secure payment processing and KYC verification for all users.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast are withdrawals on BattleXZone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Withdrawals are processed instantly to your bank account or UPI. Most users receive their winnings within 5-10 minutes after withdrawal request.',
      },
    },
    {
      '@type': 'Question',
      name: 'What games are available on BattleXZone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BattleXZone currently supports BGMI (Battlegrounds Mobile India) and Free Fire tournaments in Solo, Duo, and Squad formats with daily competitions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum entry fee for tournaments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entry fees start from as low as ₹10 for practice matches. Premium tournaments range from ₹50 to ₹500 with prize pools up to ₹50,000.',
      },
    },
  ],
};
