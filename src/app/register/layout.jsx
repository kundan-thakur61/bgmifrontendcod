import { generateSeoMetadata } from '@/lib/seo-config';

export const metadata = generateSeoMetadata({
  title: 'Register for BGMI Tournament | Join Custom Rooms',
  description: 'Sign up for BattleXZone to join daily BGMI custom rooms and tournaments. Register your squad, get room IDs, and win real cash prizes today!',
  keywords: ['register for BGMI tournament', 'BGMI tournament sign up', 'join BGMI custom room'],
  url: '/register',
});

export default function RegisterLayout({ children }) {
  return <>{children}</>;
}
