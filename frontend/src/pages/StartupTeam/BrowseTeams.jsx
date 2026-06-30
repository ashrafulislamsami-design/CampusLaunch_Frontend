import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Rocket, Lightbulb, ArrowRight, Filter, Globe } from 'lucide-react';

import { API_BASE_URL as API } from '@/config';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const DUMMY_TEAMS = [
  {
    _id: 'dt-1',
    name: 'MediLink BD',
    stage: 'MVP',
    problemStatement: 'Millions of rural Bangladeshis cannot access specialist doctors. Telemedicine solutions lack local language support and affordable pricing.',
    solution: 'A Bangla-first telemedicine platform connecting rural patients to urban specialists via voice-first UX.',
    fundingReceived: 12000,
    logoUrl: null,
  },
  {
    _id: 'dt-2',
    name: 'AgroSense',
    stage: 'Growth',
    problemStatement: 'Small-scale farmers lose 30% of crop yield due to delayed pest detection and poor fertilizer usage decisions.',
    solution: 'IoT sensors + ML model providing real-time soil and crop health diagnostics with actionable SMS alerts.',
    fundingReceived: 35000,
    logoUrl: null,
  },
  {
    _id: 'dt-3',
    name: 'EduTrack',
    stage: 'Prototype',
    problemStatement: 'High school students in tier-2 cities lack access to quality teachers and structured learning paths for university entrance exams.',
    solution: 'AI-powered adaptive learning platform delivering personalized practice sets and live doubt-clearing sessions.',
    fundingReceived: 0,
    logoUrl: null,
  },
  {
    _id: 'dt-4',
    name: 'GreenRide',
    stage: 'Idea',
    problemStatement: 'Urban commuters face high fuel costs and traffic congestion while contributing to rising CO2 emissions in Dhaka.',
    solution: 'Electric ride-sharing network specifically designed for Dhaka\'s narrow roads using compact EVs.',
    fundingReceived: 0,
    logoUrl: null,
  },
  {
    _id: 'dt-5',
    name: 'FinEdge',
    stage: 'MVP',
    problemStatement: 'SMEs in Bangladesh struggle to access working capital due to lack of formal credit history and collateral.',
    solution: 'Alternative credit scoring using mobile money, utility bill, and supply chain data to unlock micro-loans.',
    fundingReceived: 8000,
    logoUrl: null,
  },
  {
    _id: 'dt-6',
    name: 'SupplyChain.ai',
    stage: 'Growth',
    problemStatement: 'RMG factories face 15% wastage due to poor demand forecasting and unoptimized inventory management.',
    solution: 'AI demand planning and inventory optimization SaaS built specifically for Bangladesh\'s garment export sector.',
    fundingReceived: 55000,
    logoUrl: null,
  },
];

const STAGE_COLORS = {
  Idea: { bg: '#27272A', color: '#A1A1AA', border: '#3F3F46' },
  Prototype: { bg: '#2563EB18', color: '#60A5FA', border: '#2563EB30' },
  MVP: { bg: '#16A34A18', color: '#4ADE80', border: '#16A34A30' },
  Growth: { bg: '#EA580C18', color: '#FB923C', border: '#EA580C30' },
  Scaling: { bg: '#7C3AED18', color: '#C084FC', border: '#7C3AED30' },
};

const TeamCard = ({ team }) => {
  const stageStyle = STAGE_COLORS[team.stage] || STAGE_COLORS.Idea;
  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col justify-between hover:border-zinc-600 transition-colors group">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-sm flex items-center justify-center overflow-hidden">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              <Rocket size={18} className="text-[#2563EB]" />
            )}
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm border"
            style={{ ...MONO, backgroundColor: stageStyle.bg, color: stageStyle.color, borderColor: stageStyle.border }}
          >
            {team.stage}
          </span>
        </div>

        <h3 className="text-base font-bold text-zinc-100 mb-1.5" style={OUTFIT}>{team.name}</h3>

        <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          "{team.problemStatement?.slice(0, 110) || 'No problem statement provided.'}..."
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-zinc-500 text-xs" style={MONO}>
            <Lightbulb size={12} className="text-zinc-600 mt-0.5 shrink-0" />
            <span>
              <span className="text-zinc-400">Solution: </span>
              {team.solution?.slice(0, 60) || 'In development'}...
            </span>
          </div>
          {team.fundingReceived > 0 && (
            <div className="flex items-center gap-2 text-xs" style={MONO}>
              <Globe size={12} className="text-green-600 shrink-0" />
              <span className="text-green-500 font-semibold">${team.fundingReceived.toLocaleString()} raised</span>
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/startup/${team._id}`}
        className="flex items-center justify-center gap-2 w-full text-center bg-[#2563EB] text-white font-semibold py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors"
        style={MONO}
      >
        View Portfolio <ArrowRight size={12} />
      </Link>
    </div>
  );
};

export default function BrowseTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/teams/public${search ? `?search=${search}` : ''}`);
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchTeams, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const displayTeams = teams.length > 0 ? teams : DUMMY_TEAMS;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Startup Showcase
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100" style={OUTFIT}>Browse Startups</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                Explore the next generation of student-led ventures. Discover innovative solutions and connect with the founders of tomorrow.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 shrink-0" style={MONO}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              {displayTeams.length} active ventures
            </div>
          </div>
        </div>

        {/* ── Search Bar ──────────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-4 mb-8 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-grow w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, problem, or industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#09090B] border border-[#27272A] rounded-sm text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#2563EB] transition-colors"
              style={MONO}
            />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[#27272A] text-zinc-400 hover:border-zinc-500 hover:text-zinc-100 rounded-sm text-xs uppercase tracking-widest font-semibold transition-colors shrink-0"
            style={MONO}
          >
            <Filter size={13} />
            Filters
          </button>
        </div>

        {/* ── Grid ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[#18181B] border border-[#27272A] p-5 rounded-sm flex flex-col justify-between h-[300px]">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 skeleton-box" />
                    <div className="w-16 h-5 skeleton-box" />
                  </div>
                  <div className="w-2/3 h-5 skeleton-box mb-2" />
                  <div className="w-full h-12 skeleton-box mb-4" />
                  <div className="w-3/4 h-3.5 skeleton-box" />
                </div>
                <div className="w-full h-8 skeleton-box" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayTeams.map(team => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
