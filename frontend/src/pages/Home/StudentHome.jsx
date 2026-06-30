import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '@/config';
import {
  Rocket, Target, CalendarDays, Coins, Users, Gem, BookOpen, Mic2, LayoutGrid, FileText
} from 'lucide-react';
import FundingCard from '../Funding/FundingCard';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

// Module card data
const MODULES = [
  {
    icon: Target,
    label: 'Teams',
    title: 'Create a Team',
    desc: 'Form an idea, define your problem space, and invite classmates to your entrepreneurial journey.',
    cta: 'Commence',
    to: '/teams/create',
    accent: '#2563EB',
  },
  {
    icon: Coins,
    label: 'Funding',
    title: 'Browse Funding',
    desc: 'Discover active university grants, alumni accelerators, and local VC pitch competitions.',
    cta: 'Connect',
    to: '/funding',
    accent: '#16A34A',
  },
  {
    icon: Users,
    label: 'Mentors',
    title: 'Mentorship',
    desc: 'Connect with industry experts, book 1-on-1 sessions, and get guidance for your startup journey.',
    cta: 'Find Mentors',
    to: '/mentors',
    accent: '#7C3AED',
  },
  {
    icon: Users,
    label: 'Matching',
    title: 'Founder Match',
    desc: 'Our engine identifies missing roles in your team and suggests ideal student co-founders.',
    cta: 'Find Synergy',
    to: '/matching',
    accent: '#0891B2',
  },
  {
    icon: Users,
    label: 'Profiles',
    title: 'Browse Profiles',
    desc: 'Discover student entrepreneurs, explore their skills, ideas, and find your next co-founder.',
    cta: 'Explore',
    to: '/profiles',
    accent: '#DB2777',
  },
  {
    icon: BookOpen,
    label: 'Curriculum',
    title: 'Curriculum',
    desc: 'Follow a structured startup curriculum with lessons, videos, quizzes, and assignments.',
    cta: 'Start Learning',
    to: '/curriculum',
    accent: '#059669',
  },
  {
    icon: Mic2,
    label: 'Arena',
    title: 'Pitch Arena',
    desc: 'Compete in live pitch events, upload your deck, and present before judges.',
    cta: 'Enter Arena',
    to: '/pitch-arena',
    accent: '#DC2626',
  },
  {
    icon: CalendarDays,
    label: 'Events',
    title: 'Event Hub',
    desc: 'Check out upcoming networking events, workshops, and hackathons around your campus.',
    cta: 'Network',
    to: '/events/browse',
    accent: '#EA580C',
  },
  {
    icon: FileText,
    label: 'Decks',
    title: 'Pitch Decks',
    desc: 'Upload, manage, and showcase your startup pitch decks to mentors, judges, and investors.',
    cta: 'My Decks',
    to: '/decks',
    accent: '#9333EA',
  },
];

const StudentHome = () => {
  const { userTeamId, token, user, setUser } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, [token]);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/watchlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setWatchlist(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (fundingId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/funding/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fundingId })
      });
      const data = await res.json();
      if (res.ok) {
        // Sync watchlist locally and in AuthContext
        setWatchlist(prev => prev.filter(item => item._id !== fundingId));
        if (setUser && user) {
          setUser({ ...user, watchlist: data });
        }
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <div className="mb-10 bg-[#18181B] border border-[#27272A] rounded-sm p-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Command Center
            </span>
          </div>
          <h1 className="text-4xl font-bold text-zinc-100 mb-2" style={OUTFIT}>
            The CampusLaunch Hub
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed" style={MONO}>
            Choose a module below to begin crafting your startup architecture, map your event calendar, and navigate the seed matrix.
          </p>
        </div>

        {userTeamId && (
          <Link
            to={`/teams/dashboard/${userTeamId}`}
            className="flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-6 py-3 rounded-sm text-sm uppercase tracking-widest hover:bg-blue-500 transition-colors shrink-0"
            style={MONO}
          >
            <Rocket size={16} />
            Go to Workspace
          </Link>
        )}
      </div>

      {/* ── Modules Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {MODULES.map(({ icon: Icon, label, title, desc, cta, to, accent }) => (
          <div key={label} className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col justify-between hover:border-zinc-600 transition-colors group">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: `${accent}20`, border: `1px solid ${accent}40` }}
                >
                  <Icon size={16} style={{ color: accent }} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                  {label}
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 mb-2" style={OUTFIT}>{title}</h2>
              <p className="text-zinc-500 text-xs leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                {desc}
              </p>
            </div>
            <Link
              to={to}
              className="w-full text-center font-semibold py-2 rounded-sm text-xs uppercase tracking-widest transition-colors"
              style={{ ...MONO, backgroundColor: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${accent}30`; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${accent}18`; }}
            >
              {cta}
            </Link>
          </div>
        ))}

        {/* Canvas Builder — special case (requires teamId) */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col justify-between hover:border-zinc-600 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#CA8A0420', border: '1px solid #CA8A0440' }}>
                <LayoutGrid size={16} style={{ color: '#CA8A04' }} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Canvas
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-100 mb-2" style={OUTFIT}>Canvas Builder</h2>
            <p className="text-zinc-500 text-xs leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Build your Business Model Canvas collaboratively with your team — real-time editing and version history.
            </p>
          </div>
          {userTeamId ? (
            <Link
              to={`/canvas/${userTeamId}`}
              className="w-full text-center font-semibold py-2 rounded-sm text-xs uppercase tracking-widest transition-colors"
              style={{ ...MONO, backgroundColor: '#CA8A0418', color: '#CA8A04', border: '1px solid #CA8A0430' }}
            >
              Open Canvas
            </Link>
          ) : (
            <div
              className="w-full text-center font-semibold py-2 rounded-sm text-xs uppercase tracking-widest text-zinc-600 border border-[#27272A] cursor-not-allowed"
              style={MONO}
              title="Join a team first"
            >
              Join a team first
            </div>
          )}
        </div>

        {/* My Connections — special case */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col justify-between hover:border-zinc-600 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#5865F220', border: '1px solid #5865F240' }}>
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                  <path d="M20 4C11.163 4 4 10.716 4 19c0 3.09.938 5.97 2.553 8.382L4 36l8.97-2.497A16.8 16.8 0 0020 34c8.837 0 16-6.716 16-15S28.837 4 20 4z" fill="#5865F2" fillOpacity="0.8" />
                  <circle cx="13" cy="19" r="2.2" fill="white" />
                  <circle cx="20" cy="19" r="2.2" fill="white" />
                  <circle cx="27" cy="19" r="2.2" fill="white" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Network
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-100 mb-2" style={OUTFIT}>My Connections</h2>
            <p className="text-zinc-500 text-xs leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Connect, view requests, and chat directly with your accepted co-founders. Message and save conversations.
            </p>
          </div>
          <Link
            to="/connections"
            className="w-full text-center font-semibold py-2 rounded-sm text-xs uppercase tracking-widest transition-colors"
            style={{ ...MONO, backgroundColor: '#5865F218', color: '#5865F2', border: '1px solid #5865F230' }}
          >
            My Partners
          </Link>
        </div>
      </div>

      {/* ── My Saved Opportunities ────────────────────────────────── */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-0.5 h-5 bg-[#2563EB]" />
          <div>
            <h2 className="text-xl font-bold text-zinc-100" style={OUTFIT}>Saved Opportunities</h2>
            <p className="text-zinc-500 text-xs mt-0.5" style={MONO}>Your curated watchlist from the Funding Matrix</p>
          </div>
        </div>

        {!loading && watchlist.length === 0 ? (
          <div className="bg-[#18181B] border border-dashed border-[#27272A] rounded-sm p-12 text-center">
            <Gem size={28} className="mx-auto mb-3 text-zinc-700" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-4" style={MONO}>
              No opportunities saved yet. Explore the Matrix to pin your future.
            </p>
            <Link
              to="/funding"
              className="inline-block text-[#2563EB] hover:text-blue-400 text-xs uppercase tracking-widest font-semibold transition-colors"
              style={MONO}
            >
              Browse Funding Matrix →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {watchlist.map((item) => (
              <FundingCard
                key={item._id}
                item={item}
                isSaved={true}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
