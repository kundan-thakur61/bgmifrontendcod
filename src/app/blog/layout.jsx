import { PAGE_SEO, SITE } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.blog;

export default function BlogLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: `${SITE.baseUrl}` },
        { name: 'Blog', url: `${SITE.baseUrl}/blog` },
      ]} />
      {children}
    </>
  );
}
