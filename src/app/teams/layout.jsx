import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.teams;

export default function TeamsLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.battlexzone.com' },
          { name: 'Teams', url: 'https://www.battlexzone.com/teams' },
        ]}
      />
      {children}
    </>
  );
}
