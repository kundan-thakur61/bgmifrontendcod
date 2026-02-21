import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.tournaments;

export default function TournamentsLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Tournaments', url: 'https://www.battlexzone.com/tournaments' },
      ]} />
      {children}
    </>
  );
}
