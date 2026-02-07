import { generateMatchMetadata } from '@/lib/seo-config';
import { getApiBaseUrl } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return generateMatchMetadata(null);
    }

    const data = await response.json();
    return generateMatchMetadata(data.match);
  } catch (error) {
    return generateMatchMetadata(null);
  }
}

export default function MatchLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlezone.com' },
        { name: 'Matches', url: 'https://battlezone.com/matches' },
        { name: 'Match Details', url: 'https://battlezone.com/matches' },
      ]} />
      {children}
    </>
  );
}

