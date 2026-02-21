import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.matches;

export default function MatchesLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Matches', url: 'https://www.battlexzone.com/matches' },
      ]} />
      {children}
    </>
  );
}
