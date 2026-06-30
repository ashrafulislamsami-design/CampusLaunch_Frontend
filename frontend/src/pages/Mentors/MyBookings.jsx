import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { CalendarDays, Clock, FileText, Star, Video, BookOpen } from 'lucide-react';

import { API_BASE_URL as API } from '@/config';

const STATUS_STYLES = {
  pending:   'bg-amber-950/20 text-amber-400 border-amber-500/20',
  confirmed: 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-950/20 text-red-400 border-red-500/20',
  completed: 'bg-zinc-900/50 text-zinc-400 border-zinc-700/50'
};

export default function MyBookings() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetch(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm('Cancel this booking?')) return;
    const res = await fetch(`${API}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      toast.success('Booking cancelled');
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    }
  };

  const handleRate = async () => {
    const res = await fetch(`${API}/bookings/${ratingModal}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rating, feedback })
    });
    if (res.ok) {
      toast.success('Rating submitted!');
      setRatingModal(null);
      setFeedback('');
      setRating(5);
      // Refresh local state list
      fetch(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => setBookings(Array.isArray(data) ? data : []));
    }
  };

  const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
  const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-zinc-100">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="bg-[#18181B] border border-[#27272A] p-8 mb-8 rounded-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-[#2563EB]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Sync Center
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={OUTFIT}>My Bookings</h1>
            <p className="text-zinc-400 text-sm max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Track consultation requests, check in-progress video links, and review logs.
            </p>
          </div>
          <Link
            to="/mentors"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-4 py-3 rounded-sm transition-colors shrink-0"
            style={MONO}
          >
            Find Mentors
          </Link>
        </div>
      </div>

      {/* ── Live Stats Tracker ───────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 px-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
        <span>Tracking {bookings.length} session{bookings.length !== 1 ? 's' : ''} total</span>
      </div>

      {/* ── Loading / Empty / Content States ──────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="w-1/3 h-5 skeleton-box" />
                  <div className="w-1/4 h-3.5 skeleton-box" />
                </div>
                <div className="w-16 h-6 skeleton-box" />
              </div>
              <div className="w-full h-12 skeleton-box" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-sm">
          <div className="w-12 h-12 bg-[#09090B] border border-[#27272A] text-zinc-400 rounded-sm flex items-center justify-center mx-auto mb-6">
            <BookOpen size={20} className="text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2" style={OUTFIT}>Establish Mentor Synapses</h3>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest max-w-md mx-auto mb-8">
            Complete onboarding flow to secure advisory slots:
          </p>
          
          {/* Onboarding steps list */}
          <div className="max-w-md mx-auto text-left space-y-4 mb-8 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
              <div className="w-5 h-5 bg-[#2563EB]/25 text-[#60A5FA] border border-[#2563EB]/40 flex items-center justify-center rounded-sm text-[9px] font-bold">01</div>
              <div>
                <p className="font-bold text-zinc-200">Browse Mentor Directory</p>
                <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Inspect expertise domains, backgrounds, and user reviews.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
              <div className="w-5 h-5 bg-zinc-900 text-zinc-600 border border-zinc-800 flex items-center justify-center rounded-sm text-[9px] font-bold">02</div>
              <div>
                <p className="font-bold text-zinc-300">Submit Booking Form</p>
                <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Define your slide questions, agenda topic, and select an hour.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
              <div className="w-5 h-5 bg-zinc-900 text-zinc-600 border border-zinc-800 flex items-center justify-center rounded-sm text-[9px] font-bold">03</div>
              <div>
                <p className="font-bold text-zinc-300">Join Video Room</p>
                <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Access room invite keys directly inside this pane on execution time.</p>
              </div>
            </div>
          </div>

          <Link
            to="/mentors"
            className="inline-block bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
          >
            Browse Mentors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div
              key={b._id}
              className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                
                {/* Left Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white tracking-tight" style={OUTFIT}>{b.mentorName}</h3>
                  <div className="flex flex-wrap gap-4 text-zinc-400 font-mono text-[9px] uppercase tracking-widest mt-2">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={11} className="text-[#2563EB]" />
                      {new Date(b.sessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={11} className="text-[#2563EB]" />
                      {b.startTime} – {b.endTime} ({b.durationMinutes} min)
                    </span>
                  </div>

                  {b.agenda && (
                    <div className="mt-4 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
                      <p className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <FileText size={10} /> Session Agenda
                      </p>
                      <p className="text-zinc-300 text-xs leading-relaxed italic">"{b.agenda}"</p>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <span className={`text-[9px] font-mono font-bold px-2.5 py-1 border uppercase tracking-widest rounded-sm self-start ${STATUS_STYLES[b.status] || 'bg-zinc-800 text-zinc-400'}`}>
                  {b.status}
                </span>
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#27272A]">
                {b.meetingLink && b.status === 'confirmed' && (
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors"
                  >
                    Join Meet
                  </a>
                )}
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="inline-flex items-center gap-1.5 bg-red-950/20 border border-red-900/30 text-red-400 hover:border-red-600 px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-widest rounded-sm transition-colors"
                  >
                    Cancel Slot
                  </button>
                )}
                {b.status === 'completed' && !b.studentRating && (
                  <button
                    onClick={() => setRatingModal(b._id)}
                    className="inline-flex items-center gap-1.5 bg-amber-950/20 border border-amber-900/30 text-amber-400 hover:border-amber-500 px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-widest rounded-sm transition-colors"
                  >
                    <Star size={11} /> Review Mentor
                  </button>
                )}
                {b.status === 'completed' && b.studentRating && (
                  <div className="flex items-center gap-1 text-amber-400 text-xs self-center">
                    {'★'.repeat(b.studentRating)}
                    <span className="text-zinc-700">{'★'.repeat(5 - b.studentRating)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Rating Modal (Sleek Dark Blueprint style) ────────────── */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#18181B] border border-[#27272A] p-8 w-full max-w-sm rounded-sm space-y-6">
            <h3 className="text-lg font-bold text-white" style={OUTFIT}>Session Evaluation</h3>

            {/* Stars */}
            <div className="flex gap-1.5 justify-center text-2xl">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={`transition-all ${n <= rating ? 'text-amber-400 scale-110' : 'text-zinc-700'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#2563EB] focus:outline-none rounded-sm px-4 py-3 text-xs font-mono text-zinc-100 placeholder-zinc-700 resize-none min-h-[90px]"
              placeholder="Write feedback remarks..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />

            <div className="flex gap-2 font-mono text-[9px] font-bold uppercase tracking-widest pt-2">
              <button
                onClick={handleRate}
                className="flex-1 bg-[#2563EB] hover:bg-blue-600 text-white py-3 rounded-sm transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => setRatingModal(null)}
                className="flex-1 bg-[#121214] border border-[#27272A] text-zinc-400 hover:text-white py-3 rounded-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}