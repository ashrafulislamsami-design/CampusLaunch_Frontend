import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Users, Lightbulb, Rocket, Code2, Clock,
  CheckCircle2, ExternalLink, UserCheck, Award
} from 'lucide-react';

import { API_BASE_URL as API } from '@/config';

const SKILL_OPTIONS = [
  'coding', 'design', 'marketing', 'writing', 'finance',
  'sales', 'product', 'data', 'ai/ml', 'legal',
  'operations', 'social media', 'video editing', 'research',
];

const TAG_OPTIONS = [
  { label: 'All',                    value: '' },
  { label: 'Looking for Co-founder', value: 'Looking for co-founder' },
  { label: 'I Have an Idea',          value: 'I have an idea' },
  { label: 'Ready to Join a Team',    value: 'Ready to join a team' },
];

// ─── Tag colour ───────────────────────────────────────────────────────────────
const TAG_STYLES = {
  'Looking for co-founder': 'bg-purple-950/20 text-purple-400 border-purple-500/20',
  'I have an idea':          'bg-teal-950/20   text-teal-400  border-teal-500/20',
  'Ready to join a team':    'bg-zinc-950/20   text-zinc-400  border-zinc-500/20',
};

// ─── Profile Card (mirrors FundingCard's aesthetic exactly) ──────────────────
const ProfileCard = ({ profile }) => {
  const completeness = profile.completeness ?? 0;

  // Pick icon for tag
  const TagIcon =
    profile.profileTag === 'Looking for co-founder' ? Users :
    profile.profileTag === 'I have an idea'          ? Lightbulb :
    Rocket;

  return (
    <div
      className="bg-[#18181B] border border-[#27272A] p-6 flex flex-col justify-between rounded-sm relative overflow-hidden transition-colors"
    >
      <div>
        {/* Header row — icon + tag badge */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="w-10 h-10 bg-[#09090B] border border-[#27272A] text-zinc-400 rounded-sm flex items-center justify-center">
            <TagIcon size={18} className="text-zinc-300" />
          </div>
          <span className={`px-2 py-0.5 border text-[8px] font-mono font-bold uppercase tracking-widest rounded-sm ${TAG_STYLES[profile.profileTag] || TAG_STYLES['Ready to join a team']}`}>
            {profile.profileTag}
          </span>
        </div>

        {/* Name + university */}
        <h3 className="text-lg font-bold text-white mb-1 leading-tight">
          {profile.name}
        </h3>
        <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mb-4">
          {profile.university || 'University not listed'}
        </p>

        {/* Meta row */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2.5 text-zinc-300 font-mono text-[10px] uppercase tracking-wide">
            <Clock size={12} className="text-[#2563EB]" />
            <span>
              Availability: <span className="font-bold text-white">{profile.weeklyAvailability} hrs/wk</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300 font-mono text-[10px] uppercase tracking-wide">
            <Code2 size={12} className="text-[#2563EB]" />
            <span>
              Skills: <span className="font-bold text-white">{profile.skills.slice(0, 3).join(', ')}{profile.skills.length > 3 ? ` +${profile.skills.length - 3}` : ''}</span>
            </span>
          </div>
        </div>

        {/* Motivation snippet */}
        {profile.motivation && (
          <div className="bg-[#09090B] border border-[#27272A] p-3 mb-4 rounded-sm">
            <h4 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <UserCheck size={11} className="text-[#2563EB]" /> Motivation
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed italic line-clamp-3">
              "{profile.motivation}"
            </p>
          </div>
        )}

        {/* Startup idea snippet */}
        {profile.startupIdea && (
          <div className="bg-[#09090B] border border-[#27272A] p-3 mb-4 rounded-sm">
            <h4 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Award size={11} className="text-[#2563EB]" /> Startup Idea
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">
              {profile.startupIdea}
            </p>
          </div>
        )}

        {/* Completeness strip */}
        <div className="mb-6">
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={10} /> Completeness
            </span>
            <span className="text-[#2563EB]">{completeness}%</span>
          </div>
          <div className="w-full bg-[#09090B] border border-[#27272A] h-[2px]">
            <div
              className="h-full bg-[#2563EB] transition-all"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/profiles/${profile.userId}`}
        className="flex items-center justify-center gap-2 w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-3 rounded-sm transition-colors duration-150"
      >
        <span>View Profile</span>
        <ExternalLink size={10} />
      </Link>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BrowseProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTag, setSelectedTag]       = useState('');
  const [minAvail, setMinAvail]             = useState('');
  const [loading, setLoading]               = useState(false);

  useEffect(() => { fetchProfiles(); }, [page, selectedSkills, selectedTag, minAvail]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchProfiles(); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProfiles = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (selectedSkills.length) params.set('skills', selectedSkills.join(','));
    if (selectedTag)  params.set('tag', selectedTag);
    if (minAvail)     params.set('minAvailability', minAvail);
    if (search)       params.set('search', search);
    try {
      const res  = await fetch(`${API}/profiles?${params}`);
      const data = await res.json();
      setProfiles(data.profiles || []);
      setTotal(data.total || 0);
    } finally { setLoading(false); }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#09090B] w-full text-zinc-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 pb-4 border-b border-[#27272A] relative">
          <h1 className="text-base font-bold text-white tracking-tight">THE FOUNDER NETWORK</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
            Discover student entrepreneurs, match with co-founders, and build together
          </p>
        </div>

        {/* Live tracker metric */}
        <div className="flex items-center gap-2 mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          <div className="w-1.5 h-1.5 bg-[#2563EB]" />
          <span>Currently tracking {total} student founders</span>
        </div>

        {/* ── Filter / Search control bar ── */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 mb-8 flex flex-col gap-6">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, university, idea, or motivation…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#09090B] border border-[#27272A] focus:border-[#2563EB] focus:outline-none text-white text-sm rounded-sm transition-colors duration-150"
            />
          </div>

          {/* Filter controls row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[#27272A]">
            {/* Tag filter */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-zinc-500 font-mono uppercase tracking-widest text-[9px]">
                <Filter size={10} /> Status Tag:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => { setSelectedTag(value); setPage(1); }}
                    className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest border transition duration-150 rounded-sm ${
                      selectedTag === value
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-[#09090B] border-[#27272A] text-zinc-500 hover:text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill filter */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-zinc-500 font-mono uppercase tracking-widest text-[9px]">
                <Code2 size={10} /> Filter by Skill:
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin p-1.5 bg-[#09090B] border border-[#27272A] rounded-sm">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-widest capitalize border transition duration-150 rounded-sm ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#2563EB] border-[#2563EB] text-white'
                        : 'bg-[#18181B] border-[#27272A] text-zinc-500 hover:text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability filter */}
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Clock size={10} /> Min hrs/week:
              </span>
              <input
                type="number"
                className="border border-[#27272A] bg-[#09090B] px-3 py-2 text-xs font-mono text-white w-24 focus:border-[#2563EB] focus:outline-none rounded-sm transition-colors duration-150"
                value={minAvail}
                onChange={e => { setMinAvail(e.target.value); setPage(1); }}
                min={0}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex flex-col justify-between h-[340px]">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-10 skeleton-box" />
                    <div className="w-24 h-5 skeleton-box" />
                  </div>
                  <div className="w-2/3 h-5 skeleton-box mb-2" />
                  <div className="w-1/2 h-3.5 skeleton-box mb-6" />
                  <div className="space-y-3 mb-6">
                    <div className="w-3/4 h-3.5 skeleton-box" />
                    <div className="w-5/6 h-3.5 skeleton-box" />
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="w-full h-2 skeleton-box" />
                  </div>
                </div>
                <div className="w-full h-10 skeleton-box" />
              </div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-[#18181B] border border-dashed border-[#27272A] rounded-sm flex flex-col items-center justify-center gap-4">
            <Users size={32} className="text-zinc-700" />
            <p className="text-zinc-500 font-mono uppercase tracking-widest text-[10px] font-semibold">
              No founders match your search filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profiles.map(profile => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-widest border border-[#27272A] bg-[#18181B] text-zinc-400 hover:text-white rounded-sm disabled:opacity-30 transition-colors"
                >
                  ← Prev
                </button>
                <span className="px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-widest bg-[#2563EB] text-white border border-[#2563EB] rounded-sm">
                  Page {page}
                </span>
                <button
                  disabled={profiles.length < 12}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-widest border border-[#27272A] bg-[#18181B] text-zinc-400 hover:text-white rounded-sm disabled:opacity-30 transition-colors"
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