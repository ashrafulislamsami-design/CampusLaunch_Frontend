import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import FundingCard from './FundingCard';
import { Search, Filter, Rocket } from 'lucide-react';
import { API_BASE_URL } from '@/config';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const DUMMY_FUNDING = [
  {
    _id: 'dummy-1',
    title: 'Bangladesh Innovation Grant 2026',
    provider: 'ICT Division, Govt. of Bangladesh',
    amount: 'BDT 5,00,000',
    deadline: '2026-08-15T00:00:00Z',
    category: 'Grant',
    eligibility: 'Registered student-led startups from any Bangladeshi university with a working prototype.',
    applyLink: '#',
    pastWinners: 'ShopUp, Maya, Shajgoj received support in previous cycles.',
  },
  {
    _id: 'dummy-2',
    title: 'a2i StartupBangladesh Pitch Competition',
    provider: 'Aspire to Innovate (a2i)',
    amount: 'USD 10,000',
    deadline: '2026-07-30T00:00:00Z',
    category: 'Competition',
    eligibility: 'Open to all students under 30 with a tech-enabled business idea.',
    applyLink: '#',
  },
  {
    _id: 'dummy-3',
    title: 'Grameenphone Accelerator Cohort 8',
    provider: 'GP Accelerator',
    amount: 'BDT 25,00,000 + Mentorship',
    deadline: '2026-09-01T00:00:00Z',
    category: 'Accelerator',
    eligibility: 'Early-stage startups with at least one student co-founder and a viable MVP.',
    applyLink: '#',
    pastWinners: 'Chaldal, Sheba.xyz, and 10 Minute School are alumni.',
  },
  {
    _id: 'dummy-4',
    title: 'BRAC University Seed Fund',
    provider: 'BRAC University Entrepreneurship Development Centre',
    amount: 'BDT 3,00,000',
    deadline: '2026-07-10T00:00:00Z',
    category: 'Grant',
    eligibility: 'BRAC University students only. All departments eligible.',
    applyLink: '#',
  },
  {
    _id: 'dummy-5',
    title: 'NSU Techstars Campus Competition',
    provider: 'North South University & Techstars',
    amount: 'USD 5,000 + Global Network Access',
    deadline: '2026-08-20T00:00:00Z',
    category: 'Competition',
    eligibility: 'Any NSU enrolled student team with a minimum viable product.',
    applyLink: '#',
  },
  {
    _id: 'dummy-6',
    title: 'YY Ventures Early-Stage Accelerator',
    provider: 'YY Ventures',
    amount: 'USD 20,000 equity-free',
    deadline: '2026-10-01T00:00:00Z',
    category: 'Accelerator',
    eligibility: 'South Asian student founders, remote-friendly cohort.',
    applyLink: '#',
    pastWinners: 'Multiple cohorts with exits and Series A raises.',
  },
];

const FundingDirectory = () => {
  const { token, user, setUser } = useContext(AuthContext);
  const [funding, setFunding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    fetchFunding();
    if (user && user.watchlist) {
      setWatchlist(user.watchlist);
    }
  }, [user]);

  const fetchFunding = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/funding?search=${search}&category=${category}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setFunding(data);
    } catch (err) {
      console.error('Failed to fetch funding:', err);
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
        setWatchlist(data);
        // Sync back to AuthContext user object if needed
        if (setUser && user) {
           setUser({ ...user, watchlist: data });
        }
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFunding();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const displayData = funding.length > 0 ? funding : DUMMY_FUNDING;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-10">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Funding Matrix
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100" style={OUTFIT}>The Funding Matrix</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                Connect with the leading grants, competitions, and startup accelerators across the Bangladesh ecosystem.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 shrink-0" style={MONO}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              Tracking {displayData.length} active opportunities
            </div>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by title or provider..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#09090B] border border-[#27272A] rounded-sm text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#2563EB] transition-colors"
              style={MONO}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mr-1 flex items-center gap-1" style={MONO}>
              <Filter size={11} /> Category:
            </span>
            {['All', 'Grant', 'Competition', 'Accelerator'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-sm border transition-colors"
                style={{
                  ...MONO,
                  backgroundColor: category === cat ? '#2563EB' : '#09090B',
                  color: category === cat ? 'white' : '#71717A',
                  borderColor: category === cat ? '#2563EB' : '#27272A',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-[#18181B] border border-[#27272A] rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayData.map((item) => (
              <FundingCard
                key={item._id}
                item={item}
                isSaved={watchlist.includes(item._id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingDirectory;
