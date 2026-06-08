import { PAGE_SEO } from '@/lib/seo-config';
import { Hreflang } from '@/components/seo';

export const metadata = PAGE_SEO.locations;

export default function LocationsLayout({ children }) {
  return (
    <>
      {/* International SEO: Hreflang for multi-market support (see master strategy) */}
      <Hreflang currentPath="/locations" />
      {children}
    </>
  );
}
