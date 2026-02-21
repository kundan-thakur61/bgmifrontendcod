import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.blog;

export default function BlogLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://www.battlexzone.com' },
        { name: 'Blog', url: 'https://www.battlexzone.com/blog' },
      ]} />
      {children}
    </>
  );
}
