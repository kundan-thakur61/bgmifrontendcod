'use client';

const LEVEL_STYLES = {
  bronze: 'bg-gradient-to-r from-amber-700 to-yellow-800 text-amber-100 border-amber-600/60',
  silver: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 border-slate-300',
  gold: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 border-yellow-500',
  platinum: 'bg-gradient-to-r from-cyan-300 to-slate-200 text-slate-950 border-cyan-300',
  diamond: 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 text-white border-white/60',
};

export default function LevelBadge({ level = 'bronze', xp = 0, className = '' }) {
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.bronze;
  const label = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style} ${className}`}
      title={`${label} • ${xp} XP`}
    >
      <span>{label}</span>
      {xp > 0 && <span className="opacity-75 font-mono text-[9px] tabular-nums">{xp} XP</span>}
    </div>
  );
}
