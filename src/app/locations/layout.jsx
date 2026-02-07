import { PAGE_SEO } from '@/lib/seo-config';

export const metadata = PAGE_SEO.locations;

export default function LocationsLayout({ children }) {
  return children;
}
