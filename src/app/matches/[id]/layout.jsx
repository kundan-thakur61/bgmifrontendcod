import { generateMatchMetadata, getApiBaseUrl } from '@/lib/seo-config';
import { BreadcrumbSchema, MatchSchema } from '@/components/seo';

async function getMatch(id) {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.match || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const match = await getMatch(id);
  return generateMatchMetadata(match);
}

export default async function MatchLayout({ children, params }) {
  const { id } = await params;
  const match = await getMatch(id);
  const matchTitle = match?.title || 'Match Details';

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlexzone.com' },
        { name: 'Matches', url: 'https://battlexzone.com/matches' },
        { name: matchTitle, url: `https://battlexzone.com/matches/${id}` },
      ]} />
      <MatchSchema match={match} />
      {children}
    </>
  );
}

