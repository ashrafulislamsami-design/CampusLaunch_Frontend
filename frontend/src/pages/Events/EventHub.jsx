import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL as API } from '@/config';
import {
  Search, Filter, MapPin, Video, Calendar, Users,
  Clock, Tag, Rocket, Plus, ExternalLink, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Filter option constants (UNCHANGED) ───────────────────────── */
const TYPE_OPTIONS   = ['All', 'pitch-competition', 'hackathon', 'workshop', 'networking', 'webinar', 'other'];
const FORMAT_OPTIONS = ['All', 'online', 'in-person', 'hybrid'];
const STATUS_OPTIONS = ['All', 'upcoming', 'live', 'completed'];

/* ─── Swiss Blueprint type badge styles ─────────────────────────── */
const TYPE_BADGE = {
  'pitch-competition': { bg: '#2563EB18', color: '#60A5FA', border: '#2563EB40' },
  'hackathon':         { bg: '#16A34A18', color: '#4ADE80', border: '#16A34A40' },
  'workshop':          { bg: '#7C3AED18', color: '#C084FC', border: '#7C3AED40' },
  'networking':        { bg: '#CA8A0418', color: '#FCD34D', border: '#CA8A0440' },
  'webinar':           { bg: '#0891B218', color: '#22D3EE', border: '#0891B240' },
  'other':             { bg: '#71717A18', color: '#A1A1AA', border: '#3F3F4640' },
};

const STATUS_BADGE = {
  'upcoming':  { bg: '#2563EB18', color: '#60A5FA', border: '#2563EB30' },
  'live':      { bg: '#16A34A18', color: '#4ADE80', border: '#16A34A30' },
  'completed': { bg: '#27272A',   color: '#71717A', border: '#3F3F46'   },
  'cancelled': { bg: '#DC262618', color: '#F87171', border: '#DC262630' },
};

const FORMAT_ICON = {
  'online':    Video,
  'in-person': MapPin,
  'hybrid':    MapPin,
};

const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

/* ─── Dummy data — 6 realistic events ──────────────────────────── */
const DUMMY_EVENTS = [
  {
    _id: 'de-1',
    title: 'National AI Build-a-thon 2026',
    eventType: 'hackathon',
    format: 'in-person',
    status: 'upcoming',
    date: '2026-07-12T09:00:00Z',
    venue: 'BUET Auditorium, Dhaka',
    organizerName: 'ICT Division BD',
    hostingOrg: 'a2i',
    capacityLimit: 300,
    tags: ['AI', 'ML', 'BuildAI'],
  },
  {
    _id: 'de-2',
    title: 'Investor Pitch Night — Q3 2026',
    eventType: 'pitch-competition',
    format: 'hybrid',
    status: 'upcoming',
    date: '2026-07-20T18:00:00Z',
    venue: 'GP House, Bashundhara',
    organizerName: 'YY Ventures',
    hostingOrg: 'YY Ventures',
    capacityLimit: 120,
    tags: ['Pitch', 'Seed', 'Fundraising'],
  },
  {
    _id: 'de-3',
    title: 'Embedded Systems & IoT Seminar',
    eventType: 'workshop',
    format: 'in-person',
    status: 'upcoming',
    date: '2026-07-28T10:00:00Z',
    venue: 'NSU Engineering Block',
    organizerName: 'NSU IEEE Chapter',
    hostingOrg: 'NSU',
    capacityLimit: 80,
    tags: ['IoT', 'Hardware', 'Embedded'],
  },
  {
    _id: 'de-4',
    title: 'Founder Networking Breakfast',
    eventType: 'networking',
    format: 'in-person',
    status: 'upcoming',
    date: '2026-08-05T08:30:00Z',
    venue: 'The Daily Star Centre',
    organizerName: 'Startup Bangladesh',
    hostingOrg: 'Startup Bangladesh',
    capacityLimit: 60,
    tags: ['Network', 'Founders', 'Community'],
  },
  {
    _id: 'de-5',
    title: 'Growth Marketing Masterclass',
    eventType: 'webinar',
    format: 'online',
    status: 'upcoming',
    date: '2026-08-10T14:00:00Z',
    venue: null,
    organizerName: 'bKash Marketing Team',
    hostingOrg: 'CampusLaunch',
    capacityLimit: 0,
    tags: ['Marketing', 'Growth', 'SaaS'],
  },
  {
    _id: 'de-6',
    title: 'Climate Tech Demo Day',
    eventType: 'pitch-competition',
    format: 'hybrid',
    status: 'live',
    date: '2026-06-26T13:00:00Z',
    venue: 'BRAC Centre Inn, Dhaka',
    organizerName: 'GreenTech BD',
    hostingOrg: 'BRAC',
    capacityLimit: 200,
    tags: ['ClimaTech', 'GreenStartup'],
  },
];

/* ─── Shared filter button style ────────────────────────────────── */
const filterBtn = (active) => ({
  style: { ...MONO },
  className: `px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-none border transition-none cursor-pointer ${
    active
      ? 'bg-[#2563EB] border-[#2563EB] text-white'
      : 'bg-[#09090B] border-[#27272A] text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
  }`,
});

/* ─── EventRow — the registry list item ─────────────────────────── */
function EventRow({ event, token, onRsvp }) {
  const [registering, setRegistering] = useState(false);

  const handleRsvp = async () => {
    if (!token) { toast.error('Please log in to register'); return; }
    setRegistering(true);
    try {
      const res  = await fetch(`${API}/hub/${event._id}/rsvp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) { toast.success(data.message); onRsvp && onRsvp(); }
      else toast.error(data.message || 'Failed to register');
    } finally { setRegistering(false); }
  };

  const typeStyle   = TYPE_BADGE[event.eventType]   || TYPE_BADGE['other'];
  const statusStyle = STATUS_BADGE[event.status]    || STATUS_BADGE['upcoming'];
  const FormatIcon  = FORMAT_ICON[event.format]     || MapPin;

  const dateObj = new Date(event.date);
  const mon = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div
      className="group flex items-center gap-0 bg-[#18181B] border border-[#27272A] border-l-2"
      style={{
        borderLeftColor: 'transparent',
        transition: 'border-left-color 0s, background-color 0s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#202022';
        e.currentTarget.style.borderLeftColor = '#2563EB';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#18181B';
        e.currentTarget.style.borderLeftColor = 'transparent';
      }}
    >
      {/* COL 1 — Date ──────────────────────────────────────────── */}
      <div className="w-20 shrink-0 flex flex-col items-center justify-center py-4 px-3 border-r border-[#27272A]">
        <span className="text-[10px] font-bold uppercase text-zinc-500 leading-none" style={MONO}>{mon}</span>
        <span className="text-xl font-black text-zinc-300 leading-tight" style={MONO}>{day}</span>
        <span className="text-[9px] text-zinc-600 uppercase tracking-wide mt-0.5" style={MONO}>{time}</span>
      </div>

      {/* COL 2 — Event info ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 py-3.5 px-5">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-zinc-100 leading-snug truncate" style={OUTFIT}>
            {event.title}
          </h3>
          {/* Status badge — inline */}
          <span
            className="shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border"
            style={{ ...MONO, backgroundColor: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}
          >
            {event.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500" style={MONO}>
          <span className="flex items-center gap-1">
            <FormatIcon size={10} className="text-zinc-600" />
            {event.format === 'online' ? 'Online' : (event.venue || event.format)}
          </span>
          <span className="text-zinc-700">·</span>
          <span>{event.organizerName}</span>
          {event.capacityLimit > 0 && (
            <>
              <span className="text-zinc-700">·</span>
              <span className="flex items-center gap-1">
                <Users size={10} className="text-zinc-600" />
                {event.capacityLimit} seats
              </span>
            </>
          )}
        </div>
      </div>

      {/* COL 3 — Type badge ─────────────────────────────────────── */}
      <div className="shrink-0 px-5 py-3.5 border-l border-[#27272A] hidden md:flex items-center">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 border whitespace-nowrap"
          style={{ ...MONO, backgroundColor: typeStyle.bg, color: typeStyle.color, borderColor: typeStyle.border }}
        >
          {event.eventType?.replace('-', ' ') || 'event'}
        </span>
      </div>

      {/* COL 4 — Actions ────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-0 border-l border-[#27272A]">
        <Link
          to={`/events/${event._id}`}
          className="flex items-center gap-1.5 px-4 py-5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-100 hover:bg-[#27272A] transition-colors border-r border-[#27272A]"
          style={MONO}
        >
          Details <ChevronRight size={11} />
        </Link>
        {event.status !== 'completed' && (
          <button
            onClick={handleRsvp}
            disabled={registering}
            className="flex items-center gap-1.5 px-4 py-5 text-[10px] font-semibold uppercase tracking-widest text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors disabled:opacity-40"
            style={MONO}
          >
            {registering ? '···' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── EventHub — main page ──────────────────────────────────────── */
export default function EventHub() {
  const { token, user } = useContext(AuthContext);
  const [events, setEvents]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [type, setType]       = useState('All');
  const [format, setFormat]   = useState('All');
  const [status, setStatus]   = useState('All');
  const [page, setPage]       = useState(1);

  /* ── All data-fetching logic UNCHANGED ───────────────────────── */
  useEffect(() => { fetchEvents(); }, [page, type, format, status]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchEvents(); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchEvents = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (search) params.set('search', search);
    if (type   !== 'All') params.set('type',   type);
    if (format !== 'All') params.set('format', format);
    if (status !== 'All') params.set('status', status);
    try {
      const res  = await fetch(`${API}/hub?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setEvents(data.events || []);
      setTotal(data.total  || 0);
    } finally { setLoading(false); }
  };

  /* ── Display data: live API or dummy fallback ────────────────── */
  const displayEvents = events.length > 0 ? events : DUMMY_EVENTS;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-10">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-[#2563EB]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Event Registry
              </span>
            </div>
            <h1 className="text-4xl font-bold text-zinc-100" style={OUTFIT}>The Event Hub</h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Pitch competitions, hackathons, workshops, and networking events across the Bangladesh startup ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Active count — static, no pulsing dot */}
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest" style={MONO}>
              {total > 0 ? total : displayEvents.length} events
            </span>
            {(user?.role === 'Organizer' || user?.role === 'Mentor') && (
              <Link
                to="/events/create"
                className="flex items-center gap-2 bg-[#2563EB] text-white text-[10px] font-semibold uppercase tracking-widest px-4 py-2 hover:bg-blue-500 transition-colors"
                style={MONO}
              >
                <Plus size={12} /> Create Event
              </Link>
            )}
          </div>
        </div>

        {/* ── Filter Bar ──────────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] p-4 mb-6 flex flex-col gap-4">

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search events by title, tags, or organizer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#09090B] border border-[#27272A] text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#2563EB] transition-colors"
              style={MONO}
            />
          </div>

          {/* Type pills */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 block mb-2" style={MONO}>
              <Filter size={10} className="inline mr-1.5 text-zinc-700" />Type
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTIONS.map(t => {
                const b = filterBtn(type === t);
                return (
                  <button key={t} onClick={() => { setType(t); setPage(1); }} className={b.className} style={b.style}>
                    {t.replace('-', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format + Status */}
          <div className="flex flex-wrap gap-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 block mb-2" style={MONO}>Format</span>
              <div className="flex gap-1.5">
                {FORMAT_OPTIONS.map(f => {
                  const b = filterBtn(format === f);
                  return (
                    <button key={f} onClick={() => { setFormat(f); setPage(1); }} className={b.className} style={b.style}>
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 block mb-2" style={MONO}>Status</span>
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map(s => {
                  const b = filterBtn(status === s);
                  return (
                    <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={b.className} style={b.style}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Registry Column Headers ──────────────────────────────── */}
        <div className="hidden md:flex items-center bg-[#09090B] border border-[#27272A] border-b-0 px-0">
          <div className="w-20 shrink-0 px-3 py-2 border-r border-[#27272A]">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-700" style={MONO}>Date</span>
          </div>
          <div className="flex-1 px-5 py-2">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-700" style={MONO}>Event</span>
          </div>
          <div className="shrink-0 px-5 py-2 border-l border-[#27272A] w-40">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-700" style={MONO}>Type</span>
          </div>
          <div className="shrink-0 px-4 py-2 border-l border-[#27272A] w-36">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-zinc-700" style={MONO}>Action</span>
          </div>
        </div>

        {/* ── Registry List ────────────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col gap-px bg-[#27272A]">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-[#18181B] animate-pulse" />
            ))}
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="bg-[#18181B] border border-dashed border-[#27272A] py-16 text-center">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold" style={MONO}>
              No events match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-px bg-[#27272A]">
              {displayEvents.map(ev => (
                <EventRow key={ev._id} event={ev} token={token} onRsvp={fetchEvents} />
              ))}
            </div>

            {/* ── Pagination ─────────────────────────────────────── */}
            {total > 9 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#27272A]">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="text-[10px] font-semibold uppercase tracking-widest px-4 py-2 border border-[#27272A] text-zinc-500 hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-30 transition-colors"
                  style={MONO}
                >
                  ← Prev
                </button>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>
                  Page {page} of {Math.ceil(total / 9)}
                </span>
                <button
                  disabled={events.length < 9}
                  onClick={() => setPage(p => p + 1)}
                  className="text-[10px] font-semibold uppercase tracking-widest px-4 py-2 border border-[#27272A] text-zinc-500 hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-30 transition-colors"
                  style={MONO}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}