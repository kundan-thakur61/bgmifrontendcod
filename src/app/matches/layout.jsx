import { PAGE_SEO, SITE } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.matches;

export default function MatchesLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: `${SITE.baseUrl}` },
        { name: 'Matches', url: `${SITE.baseUrl}/matches` },
      ]} />
      {children}
    </>
  );
}
