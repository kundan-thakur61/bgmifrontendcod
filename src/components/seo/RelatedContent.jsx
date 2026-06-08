'use client';

import Link from 'next/link';

/**
 * RelatedContent - Automatic Internal Linking Component
 * Used for related tournaments, matches, blogs, teams, games.
 * Improves internal linking, crawlability, and user engagement.
 */
export default function RelatedContent({ 
  items = [], 
  title = "Related Content", 
  type = "tournament" 
}) {
  if (!items || items.length === 0) return null;

  const getHref = (item) => {
    if (item.href) return item.href;
    if (type === 'tournament') return `/tournaments/${item.id || item.slug}`;
    if (type === 'match') return `/matches/${item.id || item.slug}`;
    if (type === 'blog') return `/blog/${item.slug}`;
    if (type === 'team') return `/teams/${item.id || item.slug}`;
    if (type === 'game') return `/tournaments/${item.slug || item.game?.toLowerCase()}`;
    return '#';
  };

  const getLabel = (item) => {
    return item.title || item.name || item.label || 'View';
  };

  return (
    <section className="mt-8 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-white/90">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.slice(0, 6).map((item, index) => (
          <Link
            key={index}
            href={getHref(item)}
            className="block p-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/50 rounded-xl transition-all text-sm"
          >
            <div className="font-medium text-white mb-1 line-clamp-2">
              {getLabel(item)}
            </div>
            {item.subtitle && (
              <div className="text-xs text-white/60">{item.subtitle}</div>
            )}
            {item.prizePool && (
              <div className="text-xs text-emerald-400 mt-1">
                Prize: ₹{item.prizePool}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
