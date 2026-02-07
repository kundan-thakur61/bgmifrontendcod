import { generateArticleMetadata } from '@/lib/seo-config';

export const metadata = generateArticleMetadata({
  title: 'How to Win BGMI Tournaments in 2024 — Expert Strategies & Pro Tips',
  description: 'Master BGMI tournaments with pro tips, strategies, and winning tactics. Learn hot drops, rotations, endgame plays, and earn real money on BattleZone.',
  slug: 'how-to-win-bgmi-tournaments-2024',
  tags: ['BGMI tournament tips', 'BGMI winning strategy', 'BGMI pro tips', 'how to win BGMI', 'BGMI competitive guide'],
  datePublished: '2024-01-15',
  dateModified: '2026-01-01',
  category: 'BGMI Strategy',
});

export default function BlogLayout({ children }) {
  return children;
}
