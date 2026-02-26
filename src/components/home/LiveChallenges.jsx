import LiveChallengesClient from './LiveChallengesClient';
import { getMatches } from '@/lib/api';

const serverFilters = { isChallenge: 'true', status: 'upcoming,registration_open', limit: 6 };

async function fetchChallenges() {
  try {
    const data = await getMatches(serverFilters);
    return data.matches || [];
  } catch (error) {
    console.error('Failed to fetch challenges on server:', error);
    return [];
  }
}

export default async function LiveChallenges() {
  const challenges = await fetchChallenges();
  return <LiveChallengesClient initialChallenges={challenges} />;
}
