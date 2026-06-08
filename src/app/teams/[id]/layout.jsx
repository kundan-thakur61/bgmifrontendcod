import { generateTeamMetadata, getApiBaseUrl } from '@/lib/seo-config';
import { BreadcrumbSchema, TeamSchema, PersonSchema } from '@/components/seo';

async function getTeam(id) {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      next: { revalidate: 120 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.team || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const team = await getTeam(id);
  return generateTeamMetadata(team);
}

export default async function TeamLayout({ children, params }) {
  const { id } = await params;
  const team = await getTeam(id);
  const teamTitle = team?.name || team?.tag || 'Team Profile';

  const captain = team?.members?.find((m) => m.role === 'captain')?.user || team?.captain;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.battlexzone.com' },
          { name: 'Teams', url: 'https://www.battlexzone.com/teams' },
          { name: teamTitle, url: `https://www.battlexzone.com/teams/${id}` },
        ]}
      />
      <TeamSchema team={team} />
      {captain && (
        <PersonSchema
          person={captain}
          additionalName={team?.tag ? `Captain of ${team.tag}` : 'Team Captain'}
          stats={team?.stats}
        />
      )}
      {children}
    </>
  );
}
