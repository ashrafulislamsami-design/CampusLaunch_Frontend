import { Trophy, Users } from 'lucide-react';

const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const PitchArenaHero = ({ stats }) => {
  return (
    <header className="bg-[#18181B] border border-[#27272A] mb-8">
      <div className="p-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">

        {/* Left — title block */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Live Pitch Platform
            </span>
          </div>
          <h1 className="text-4xl font-bold text-zinc-100 mb-2" style={OUTFIT}>
            Virtual Pitch Arena
          </h1>
          <p className="text-zinc-500 text-sm max-w-xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Compete, judge, and watch live startup pitches from the brightest student founders across Bangladesh.
          </p>
        </div>

        {/* Right — stats strip */}
        {stats && (
          <div className="flex flex-wrap items-center gap-6 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-zinc-100" style={OUTFIT}>{stats.totalEvents || 0}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>Events</span>
            </div>
            <div className="w-px h-8 bg-[#27272A]" />
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-zinc-100" style={OUTFIT}>{stats.totalTeams || 0}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>Teams Pitched</span>
            </div>
            <div className="w-px h-8 bg-[#27272A]" />
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-zinc-100" style={OUTFIT}>
                ৳{(stats.totalPrize || 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>Prize Pool</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PitchArenaHero;
