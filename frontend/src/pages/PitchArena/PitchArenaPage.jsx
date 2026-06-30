import { useState, useEffect, useMemo, useContext } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { listEvents } from '../../services/pitchService';
import PitchArenaHero from '../../components/pitch/PitchArenaHero';
import EventCard from '../../components/pitch/EventCard';
import CreateEventModal from '../../components/pitch/CreateEventModal';
import MyPitchEvents from '../../components/pitch/MyPitchEvents';

const FILTERS = ['all', 'registration_open', 'live', 'results_published'];
const FILTER_LABELS = { all: 'All', registration_open: 'Upcoming', live: 'Live Now', results_published: 'Past' };

const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const SkeletonCard = () => (
  <div className="bg-[#18181B] border border-[#27272A] flex flex-col">
    <div className="h-12 border-b border-[#27272A] bg-[#1F1F23]" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-[#27272A] w-2/3" />
      <div className="h-3 bg-[#27272A] w-full" />
      <div className="h-3 bg-[#27272A] w-1/2" />
      <div className="h-8 bg-[#27272A] mt-3" />
    </div>
  </div>
);

const PitchArenaPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await listEvents();
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events.filter(e => e.status !== 'draft');
    if (filter === 'results_published') return events.filter(e => ['ended', 'results_published'].includes(e.status));
    if (filter === 'registration_open') return events.filter(e => ['registration_open', 'registration_closed'].includes(e.status));
    return events.filter(e => e.status === filter);
  }, [events, filter]);

  const liveEvents = useMemo(() => events.filter(e => e.status === 'live'), [events]);

  const stats = useMemo(() => ({
    totalEvents: events.filter(e => e.status !== 'draft').length,
    totalTeams: events.reduce((sum, e) => sum + (e.registeredTeamsCount || 0), 0),
    totalPrize: events.reduce((sum, e) => sum + (e.prizeMoney?.first || 0) + (e.prizeMoney?.second || 0) + (e.prizeMoney?.third || 0), 0)
  }), [events]);

  const isOrganizer = user?.role === 'Organizer';

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-10">
      <PitchArenaHero stats={stats} />

      {/* Live Now highlight — static label, no pulsing dot */}
      {liveEvents.length > 0 && (
        <section className="mb-8" aria-label="Live events">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-0.5 h-4 bg-red-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-red-500" style={MONO}>
              Live Now
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border"
              style={{ ...MONO, backgroundColor: '#DC262618', color: '#F87171', borderColor: '#DC262635' }}
            >
              {liveEvents.length} active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#27272A]">
            {liveEvents.map(e => <EventCard key={e._id} event={e} />)}
          </div>
        </section>
      )}

      {/* Filter pills — flat Swiss style, no pill shapes */}
      <nav className="flex gap-1.5 mb-6 overflow-x-auto pb-1" role="tablist" aria-label="Event filters">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            role="tab"
            aria-selected={filter === f}
            className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-widest border transition-none whitespace-nowrap cursor-pointer ${
              filter === f
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-[#09090B] border-[#27272A] text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
            }`}
            style={MONO}
          >
            {FILTER_LABELS[f]}
            {f === 'live' && liveEvents.length > 0 && (
              <span
                className="ml-2 text-[9px] font-bold px-1 py-0.5 border"
                style={{ backgroundColor: '#DC262618', color: '#F87171', borderColor: '#DC262635' }}
              >
                {liveEvents.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Event grid */}
      <section aria-label="Events">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#27272A]">
            {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#18181B] border border-dashed border-[#27272A] py-16 text-center">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold" style={MONO}>
              No events match the selected filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#27272A]">
            {filteredEvents.map(e => <EventCard key={e._id} event={e} />)}
          </div>
        )}
      </section>

      <MyPitchEvents />

      {/* Organizer Create Button — sharp square, no rounded-full, no hover:scale */}
      {isOrganizer && (
        <button
          onClick={() => setShowCreate(true)}
          className="fixed bottom-8 right-8 bg-[#2563EB] text-white w-12 h-12 flex items-center justify-center z-40 hover:bg-blue-500 transition-colors"
          aria-label="Create new event"
        >
          <Plus size={22} />
        </button>
      )}

      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onCreated={() => fetchEvents()}
        />
      )}
      </div>
    </div>
  );
};

export default PitchArenaPage;
