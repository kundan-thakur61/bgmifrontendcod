import GamingTournamentProductPage from '@/components/seo/GamingTournamentProductPage';

export const metadata = {
  title: 'Premium BGMI & Free Fire Tournament Platform - Win Real Cash Prizes India',
  description: 'Join India\'s #1 competitive gaming platform for BGMI, Free Fire, and PUBG tournaments. Compete in professional esports events, win real money prizes up to ₹1,00,000, and showcase your gaming skills.',
  keywords: 'BGMI tournaments, Free Fire tournaments, PUBG tournaments, win money gaming, esports India, online gaming tournaments, real cash prizes, competitive gaming',
  openGraph: {
    title: 'Premium BGMI & Free Fire Tournament Platform - Win Real Cash Prizes India',
    description: 'Join India\'s #1 competitive gaming platform for professional esports tournaments with real cash prizes up to ₹1,00,000.',
    url: 'https://yourdomain.com/tournaments/gaming',
    siteName: 'BattleZone Gaming',
    images: [
      {
        url: 'https://yourdomain.com/images/gaming-tournament-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BGMI & Free Fire Tournament Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium BGMI & Free Fire Tournament Platform - Win Real Cash Prizes India',
    description: 'Join India\'s #1 competitive gaming platform for professional esports tournaments with real cash prizes up to ₹1,00,000.',
    images: ['https://yourdomain.com/images/gaming-tournament-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://yourdomain.com/tournaments/gaming',
    languages: {
      'en-IN': 'https://yourdomain.com/tournaments/gaming',
      'hi': 'https://yourdomain.com/hi/tournaments/gaming',
    },
  },
};

export default function GamingTournamentsPage() {
  return <GamingTournamentProductPage />;
}