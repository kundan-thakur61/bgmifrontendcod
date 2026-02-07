import { generateTournamentMetadata, getApiBaseUrl } from '@/lib/seo-config';
import { BreadcrumbSchema } from '@/components/seo';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return generateTournamentMetadata(null);
    }

    const data = await response.json();
    return generateTournamentMetadata(data.tournament);
  } catch (error) {
    return generateTournamentMetadata(null);
  }
}

export default function TournamentLayout({ children }) {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlezone.com' },
        { name: 'Tournaments', url: 'https://battlezone.com/tournaments' },
        { name: 'Tournament Details', url: 'https://battlezone.com/tournaments' },
      ]} />
      {children}
    </>
  );
}

