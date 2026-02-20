import { generateTournamentMetadata, getApiBaseUrl } from '@/lib/seo-config';
import { BreadcrumbSchema, TournamentSchema } from '@/components/seo';

async function getTournament(id) {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.tournament || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const tournament = await getTournament(id);
  return generateTournamentMetadata(tournament);
}

export default async function TournamentLayout({ children, params }) {
  const { id } = await params;
  const tournament = await getTournament(id);
  const tournamentTitle = tournament?.title || tournament?.name || 'Tournament Details';

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://battlexzone.com' },
        { name: 'Tournaments', url: 'https://battlexzone.com/tournaments' },
        { name: tournamentTitle, url: `https://battlexzone.com/tournaments/${id}` },
      ]} />
      <TournamentSchema tournament={tournament} />
      {children}
    </>
  );
}

