import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL as API } from '@/config';
import { FileText, Upload, Trash2, BarChart2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyDecks() {
  const { token } = useContext(AuthContext);
  const [decks, setDecks]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDecks(); }, []);

  const fetchDecks = () => {
    fetch(`${API}/decks/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setDecks(Array.isArray(d) ? d : []); setLoading(false); });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this deck?')) return;
    const res = await fetch(`${API}/decks/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) { toast.success('Deck deleted'); fetchDecks(); }
  };

  const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
  const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-100">
      
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="bg-[#18181B] border border-[#27272A] p-8 mb-8 rounded-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-[#2563EB]" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
                Asset Vault
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={OUTFIT}>My Pitch Decks</h1>
            <p className="text-zinc-400 text-sm max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Upload pitch decks, track version iterations, and inspect evaluation scorecards.
            </p>
          </div>
          <Link to="/decks/upload"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-4 py-3 rounded-sm transition-colors shrink-0"
            style={MONO}>
            <Plus size={12} /> Upload Deck
          </Link>
        </div>
      </div>

      {/* ── Loading / Empty / Content States ──────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex items-center justify-between">
              <div className="flex-1 space-y-2.5">
                <div className="w-1/3 h-5 skeleton-box" />
                <div className="w-1/4 h-3.5 skeleton-box" />
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-8 skeleton-box" />
                <div className="w-24 h-8 skeleton-box" />
                <div className="w-8 h-8 skeleton-box" />
              </div>
            </div>
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-16 bg-[#18181B] border border-[#27272A] rounded-sm">
          <div className="w-12 h-12 bg-[#09090B] border border-[#27272A] text-zinc-400 rounded-sm flex items-center justify-center mx-auto mb-6">
            <FileText size={20} className="text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2" style={OUTFIT}>Activate Your Venture Space</h3>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest max-w-md mx-auto mb-8">
            Complete these steps to receive institutional feedback:
          </p>
          
          {/* Gamified Onboarding Steps */}
          <div className="max-w-md mx-auto text-left space-y-4 mb-8 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
              <div className="w-5 h-5 bg-[#2563EB]/25 text-[#60A5FA] border border-[#2563EB]/40 flex items-center justify-center rounded-sm text-[9px] font-bold">01</div>
              <div>
                <p className="font-bold text-zinc-200">Format Slide Deck</p>
                <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Ensure your document is formatted as landscape PDF and under 10MB.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
              <div className="w-5 h-5 bg-zinc-900 text-zinc-600 border border-zinc-800 flex items-center justify-center rounded-sm text-[9px] font-bold">02</div>
              <div>
                <p className="font-bold text-zinc-300">Submit to Sandbox</p>
                <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Add a structured tag and write a clear problem statement.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#09090B] border border-[#27272A] p-3 rounded-sm">
              <div className="w-5 h-5 bg-zinc-900 text-zinc-600 border border-zinc-800 flex items-center justify-center rounded-sm text-[9px] font-bold">03</div>
              <div>
                <p className="font-bold text-zinc-300">Engage Mentor Review</p>
                <p className="text-[8px] text-zinc-500 mt-0.5 lowercase">Classroom mentors score your deck across 5 distinct key rubrics.</p>
              </div>
            </div>
          </div>

          <Link
            to="/decks/upload"
            className="inline-block bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors"
          >
            Upload Pitch Deck
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {decks.map(deck => (
            <div key={deck._id}
              className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg tracking-tight" style={OUTFIT}>{deck.title}</h3>
                <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span>Version {deck.currentVersion}</span>
                  <span className="text-zinc-700">•</span>
                  <span>{deck.totalReviews} reviews</span>
                  {deck.latestAvgScore && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <span className="text-[#2563EB]">Avg Rating: {deck.latestAvgScore}/5</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/decks/${deck._id}/report`}
                  className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-[#60A5FA] bg-[#2563EB]/10 border border-[#2563EB]/20 px-4 py-2.5 hover:bg-[#2563EB]/25 rounded-sm transition"
                >
                  Report
                </Link>
                <Link to={`/decks/${deck._id}/version`}
                  className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-300 bg-[#121214] border border-[#27272A] px-4 py-2.5 hover:border-zinc-500 rounded-sm transition"
                >
                  New Version
                </Link>
                
                {/* Tooltip wrapper for Delete Button */}
                <div className="tooltip-container">
                  <button onClick={() => handleDelete(deck._id)}
                    className="flex items-center justify-center text-red-400 bg-red-950/20 border border-red-900/30 hover:border-red-600 px-3.5 py-2.5 rounded-sm transition"
                  >
                    <Trash2 size={13} />
                  </button>
                  <span className="tooltip-text">Delete Deck</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}