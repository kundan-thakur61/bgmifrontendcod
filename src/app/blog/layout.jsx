import { PAGE_SEO } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export const metadata = PAGE_SEO.blog;

export default function BlogLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlezone.com' },
        { name: 'Blog', url: 'https://battlezone.com/blog' },
      ]} />
      {children}
    </>
  );
}
