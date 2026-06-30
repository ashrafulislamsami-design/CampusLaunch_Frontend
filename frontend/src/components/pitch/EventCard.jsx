import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, ChevronRight } from 'lucide-react';
import EventStatusBadge from './EventStatusBadge';

const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const STATUS_ACCENT = {
  live:               { bg: '#DC262618', color: '#F87171', border: '#DC262635' },
  registration_open:  { bg: '#16A34A18', color: '#4ADE80', border: '#16A34A35' },
  results_published:  { bg: '#71717A18', color: '#A1A1AA', border: '#3F3F4635' },
  registration_closed:{ bg: '#CA8A0418', color: '#FCD34D', border: '#CA8A0435' },
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const date = new Date(event.eventDate);
  const mon  = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day  = date.toLocaleDateString('en-US', { day: '2-digit' });
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const totalPrize = (event.prizeMoney?.first || 0) + (event.prizeMoney?.second || 0) + (event.prizeMoney?.third || 0);

  const getAction = () => {
    switch (event.status) {
      case 'registration_open':  return { label: 'Register',     path: `/pitch-arena/event/${event._id}` };
      case 'live':               return { label: 'Watch Live',   path: `/pitch-arena/event/${event._id}/audience` };
      case 'results_published':  return { label: 'View Results', path: `/pitch-arena/event/${event._id}/results` };
      default:                   return { label: 'View Details', path: `/pitch-arena/event/${event._id}` };
    }
  };

  const action  = getAction();
  const accent  = STATUS_ACCENT[event.status] || STATUS_ACCENT['registration_open'];
  const isLive  = event.status === 'live';

  return (
    <article
      className="bg-[#18181B] border border-[#27272A] border-l-2 flex flex-col group cursor-pointer"
      style={{ borderLeftColor: isLive ? '#DC2626' : '#27272A' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#202022'; e.currentTarget.style.borderLeftColor = '#2563EB'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#18181B'; e.currentTarget.style.borderLeftColor = isLive ? '#DC2626' : '#27272A'; }}
      onClick={() => navigate(action.path)}
      tabIndex={0}
      role="button"
      aria-label={`${event.title} — ${action.label}`}
      onKeyDown={e => e.key === 'Enter' && navigate(action.path)}
    >
      {/* Header strip — date + status */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase" style={MONO}>{mon}</span>
          <span className="text-sm font-bold text-zinc-300" style={MONO}>{day}</span>
          <span className="text-zinc-700 text-[10px]" style={MONO}>·</span>
          <span className="text-[10px] text-zinc-600" style={MONO}>{time}</span>
        </div>
        <EventStatusBadge status={event.status} />
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-zinc-100 leading-snug line-clamp-2" style={OUTFIT}>
          {event.title}
        </h3>

        {/* Live badge */}
        {isLive && (
          <div
            className="inline-flex items-center gap-1.5 px-2 py-1 self-start text-[10px] font-bold uppercase tracking-widest border"
            style={{ ...MONO, backgroundColor: accent.bg, color: accent.color, borderColor: accent.border }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {event.registeredTeamsCount || 0} teams watching
          </div>
        )}

        <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          {event.description}
        </p>

        <div className="flex flex-wrap gap-3 text-[10px] text-zinc-500 mt-auto pt-2 border-t border-[#27272A]" style={MONO}>
          <span className="flex items-center gap-1">
            <Users size={10} className="text-zinc-600" />
            {event.registeredTeamsCount || 0}/{event.maxTeams} teams
          </span>
          {totalPrize > 0 && (
            <span className="flex items-center gap-1 text-amber-500">
              <Trophy size={10} />
              {totalPrize.toLocaleString()} {event.prizeMoney?.currency}
            </span>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div
        className="px-5 py-3 border-t border-[#27272A] flex items-center justify-between"
        style={{ backgroundColor: isLive ? '#DC262608' : 'transparent' }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ ...MONO, color: isLive ? '#F87171' : '#2563EB' }}
        >
          {action.label}
        </span>
        <ChevronRight size={13} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
      </div>
    </article>
  );
};

export default React.memo(EventCard);
