import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, CheckCircle2, Clock, Users } from 'lucide-react';

import { API_BASE_URL as API } from '@/config';

export default function MyEvents() {
  const { token } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [myCreated, setMyCreated]         = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/hub/my-registrations`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/hub/my-events`,        { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(([regs, created]) => {
      setRegistrations(Array.isArray(regs) ? regs : []);
      setMyCreated(Array.isArray(created) ? created : []);
    }).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    registered: 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20',
    waitlisted: 'bg-amber-950/20 text-amber-400 border-amber-500/20',
    'checked-in': 'bg-blue-950/20 text-blue-400 border-blue-500/20'
  };

  const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
  const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4">
        <div className="w-1/3 h-8 skeleton-box" />
        {[1, 2].map(i => (
          <div key={i} className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-5 skeleton-box" />
              <div className="w-1/4 h-3.5 skeleton-box" />
            </div>
            <div className="w-16 h-8 skeleton-box" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-zinc-100">
      
      {/* ── My Registrations ────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-0.5 h-4 bg-[#2563EB]" />
          <h2 className="text-xl font-bold text-white tracking-tight" style={OUTFIT}>My Registrations</h2>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-sm">
            <div className="w-12 h-12 bg-[#09090B] border border-[#27272A] text-zinc-400 rounded-sm flex items-center justify-center mx-auto mb-6">
              <Calendar size={20} className="text-zinc-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2" style={OUTFIT}>Event Reservation Pipeline</h3>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest max-w-md mx-auto mb-8">
              Complete these steps to attend campus sessions:
            </p>
            
            <div className="max-w-md mx-auto text-left space-y-4 mb-8 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
                <div className="w-5 h-5 bg-[#2563EB]/25 text-[#60A5FA] border border-[#2563EB]/40 flex items-center justify-center rounded-sm text-[9px] font-bold">01</div>
                <div>
                  <p className="font-bold text-zinc-200">Explore Event Catalog</p>
                  <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Look for hackathons, guest lectures, and networking nights.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
                <div className="w-5 h-5 bg-zinc-900 text-zinc-600 border border-zinc-800 flex items-center justify-center rounded-sm text-[9px] font-bold">02</div>
                <div>
                  <p className="font-bold text-zinc-300">Reserve a Seat</p>
                  <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Click register to add your name to the participant lists.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
                <div className="w-5 h-5 bg-zinc-900 text-zinc-600 border border-zinc-800 flex items-center justify-center rounded-sm text-[9px] font-bold">03</div>
                <div>
                  <p className="font-bold text-zinc-300">Check In at Venue</p>
                  <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Get your checked-in status active upon attending the location.</p>
                </div>
              </div>
            </div>

            <Link
              to="/events/browse"
              className="inline-block bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
            >
              Browse Event Hub
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {registrations.map(reg => {
              const ev = reg.eventId;
              if (!ev) return null;
              return (
                <div key={reg._id} 
                  className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight" style={OUTFIT}>{ev.title}</h3>
                    <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <Calendar size={11} className="text-[#2563EB]" />
                      <span>{new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border rounded-sm ${STATUS_COLORS[reg.status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                      {reg.status}
                    </span>
                    <Link to={`/events/${ev._id}`}
                      className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-300 bg-[#121214] border border-[#27272A] px-4 py-2.5 hover:border-zinc-500 rounded-sm transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Events I Organized ────────────────────────────────── */}
      {myCreated.length > 0 && (
        <div className="pt-6 border-t border-[#27272A]">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <h2 className="text-xl font-bold text-white tracking-tight" style={OUTFIT}>Events I Organized</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {myCreated.map(ev => (
              <div key={ev._id} 
                className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight" style={OUTFIT}>{ev.title}</h3>
                  <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={11} className="text-[#2563EB]" />
                      {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="capitalize">{ev.status}</span>
                  </p>
                </div>
                <Link to={`/events/${ev._id}`}
                  className="text-[9px] font-mono font-bold uppercase tracking-widest bg-[#2563EB] hover:bg-blue-600 text-white px-5 py-2.5 hover:border-blue-500 rounded-sm transition shrink-0 text-center"
                >
                  Manage Event
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}