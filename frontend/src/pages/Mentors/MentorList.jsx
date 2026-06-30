import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, Filter, Briefcase, Zap } from 'lucide-react';

import { API_BASE_URL as API } from '@/config';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const EXPERTISE_OPTIONS = ['tech', 'marketing', 'finance', 'law', 'product', 'design', 'operations', 'fundraising'];

const DUMMY_MENTORS = [
  {
    _id: 'dm-1',
    name: 'Dr. Arif Rahman',
    jobDetails: 'CTO at ShopUp · Ex-Google',
    averageRating: 4.8,
    totalRatings: 36,
    sessionType: 'paid',
    sessionPriceUSD: 30,
    expertise: ['tech', 'product', 'fundraising'],
    bio: 'Built and scaled two successful SaaS products in Dhaka. Passionate about helping student founders navigate the technical stack and investor conversations.',
  },
  {
    _id: 'dm-2',
    name: 'Sabrina Hossain',
    jobDetails: 'Marketing Lead at bKash',
    averageRating: 4.5,
    totalRatings: 21,
    sessionType: 'free',
    sessionPriceUSD: 0,
    expertise: ['marketing', 'design'],
    bio: 'Specializes in growth marketing for fintech and consumer apps. Offers frameworks for positioning and brand storytelling for early-stage companies.',
  },
  {
    _id: 'dm-3',
    name: 'Kamal Uddin',
    jobDetails: 'Partner at YY Ventures',
    averageRating: 4.9,
    totalRatings: 58,
    sessionType: 'paid',
    sessionPriceUSD: 50,
    expertise: ['fundraising', 'finance', 'operations'],
    bio: 'Led investments in 15+ Bangladeshi startups. Guides founders on pitch strategy, term sheets, and scaling operations post-Series A.',
  },
  {
    _id: 'dm-4',
    name: 'Nadia Chowdhury',
    jobDetails: 'Head of Product at Chaldal',
    averageRating: 4.6,
    totalRatings: 29,
    sessionType: 'free',
    sessionPriceUSD: 0,
    expertise: ['product', 'design', 'tech'],
    bio: '10 years building consumer products from 0→1. Expert in user research, product-market fit, and UX strategy for emerging markets.',
  },
  {
    _id: 'dm-5',
    name: 'Adnan Siddique',
    jobDetails: 'Legal Counsel at Grameenphone',
    averageRating: 4.3,
    totalRatings: 14,
    sessionType: 'paid',
    sessionPriceUSD: 25,
    expertise: ['law'],
    bio: 'Specializes in startup incorporation, IP protection, and regulatory compliance for tech companies operating in South Asia.',
  },
  {
    _id: 'dm-6',
    name: 'Tanvir Ahmed',
    jobDetails: 'CEO & Co-founder at Maya',
    averageRating: 5.0,
    totalRatings: 44,
    sessionType: 'free',
    sessionPriceUSD: 0,
    expertise: ['tech', 'fundraising', 'operations'],
    bio: 'Serial entrepreneur with two exits. Loves helping first-time founders avoid the mistakes he made. Strong focus on lean execution.',
  },
];

function StarDisplay({ rating }) {
  const rounded = Math.round(rating || 0);
  return (
    <span className="text-amber-400 text-sm tracking-tight" style={MONO}>
      {'★'.repeat(rounded)}
      <span className="text-zinc-700">{'★'.repeat(5 - rounded)}</span>
    </span>
  );
}

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expertise, setExpertise] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sessionType, setSessionType] = useState('');

  useEffect(() => { fetchMentors(); }, [expertise, minRating, sessionType]);

  const fetchMentors = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (expertise) params.set('expertise', expertise);
    if (minRating) params.set('minRating', minRating);
    if (sessionType) params.set('sessionType', sessionType);
    try {
      const res = await fetch(`${API}/mentors?${params}`);
      const data = await res.json();
      setMentors(data.mentors || []);
    } finally {
      setLoading(false);
    }
  };

  const displayMentors = mentors.length > 0 ? mentors : DUMMY_MENTORS;

  const filterBtnCls = (active) =>
    `px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-sm border transition-colors cursor-pointer`;

  const filterBtnStyle = (active) => ({
    ...MONO,
    backgroundColor: active ? '#2563EB' : '#09090B',
    color: active ? 'white' : '#71717A',
    borderColor: active ? '#2563EB' : '#27272A',
  });

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-10">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Expert Network
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100" style={OUTFIT}>Mentor Directory</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                Book 1-on-1 sessions with experienced entrepreneurs and professionals. Get guidance tailored to your startup journey.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 shrink-0" style={MONO}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              {displayMentors.length} mentors available
            </div>
          </div>
        </div>

        {/* ── Filters ─────────────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-4 mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
            <Filter size={11} /> Filters
          </div>

          {/* Expertise */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 block mb-2" style={MONO}>Expertise</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setExpertise('')} className={filterBtnCls(expertise === '')} style={filterBtnStyle(expertise === '')}>All</button>
              {EXPERTISE_OPTIONS.map(e => (
                <button key={e} onClick={() => setExpertise(e)} className={filterBtnCls(expertise === e)} style={filterBtnStyle(expertise === e)}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Min Rating */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 block mb-2" style={MONO}>Min Rating</span>
              <div className="flex gap-2">
                <button onClick={() => setMinRating('')} className={filterBtnCls(minRating === '')} style={filterBtnStyle(minRating === '')}>Any</button>
                {[3, 3.5, 4, 4.5].map(r => (
                  <button key={r} onClick={() => setMinRating(String(r))} className={filterBtnCls(minRating === String(r))} style={filterBtnStyle(minRating === String(r))}>
                    {r}+★
                  </button>
                ))}
              </div>
            </div>

            {/* Session Type */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 block mb-2" style={MONO}>Session Type</span>
              <div className="flex gap-2">
                {[{ val: '', label: 'All' }, { val: 'free', label: 'Free' }, { val: 'paid', label: 'Paid' }].map(opt => (
                  <button key={opt.val} onClick={() => setSessionType(opt.val)} className={filterBtnCls(sessionType === opt.val)} style={filterBtnStyle(sessionType === opt.val)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-[#18181B] border border-[#27272A] rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMentors.map(mentor => (
              <div
                key={mentor._id}
                className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col justify-between hover:border-zinc-600 transition-colors"
              >
                {/* Top row */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-sm flex items-center justify-center">
                      <Users size={18} className="text-[#2563EB]" />
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-sm border uppercase tracking-widest"
                      style={{
                        ...MONO,
                        backgroundColor: mentor.sessionType === 'free' ? '#16A34A18' : '#EA580C18',
                        color: mentor.sessionType === 'free' ? '#4ADE80' : '#FB923C',
                        borderColor: mentor.sessionType === 'free' ? '#16A34A40' : '#EA580C40',
                      }}
                    >
                      {mentor.sessionType === 'free' ? 'Free' : `$${mentor.sessionPriceUSD}`}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-100 mb-0.5" style={OUTFIT}>{mentor.name}</h3>
                  <p className="text-zinc-500 text-xs mb-3 flex items-center gap-1.5" style={MONO}>
                    <Briefcase size={11} /> {mentor.jobDetails}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarDisplay rating={mentor.averageRating} />
                    <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-widest" style={MONO}>
                      ({mentor.totalRatings} reviews)
                    </span>
                  </div>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {mentor.expertise.map(e => (
                      <span
                        key={e}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm border uppercase tracking-widest"
                        style={{ ...MONO, backgroundColor: '#2563EB10', color: '#60A5FA', borderColor: '#2563EB30' }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>

                  {mentor.bio && (
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {mentor.bio}
                    </p>
                  )}
                </div>

                <Link
                  to={`/mentors/${mentor._id}/book`}
                  className="w-full text-center bg-[#2563EB] text-white font-semibold py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 mt-auto"
                  style={MONO}
                >
                  <Zap size={12} /> Book Session
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}