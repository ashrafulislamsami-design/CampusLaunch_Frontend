import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  Save,
  History,
  Share2,
  Download,
  Maximize,
  Minimize,
  ArrowLeft,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import CompletionMeter from './CompletionMeter';
import PresenceIndicator from './PresenceIndicator';

const CanvasHeader = ({
  teamName,
  teamId,
  sections = {},
  activeUsers = [],
  connected,
  saving,
  lastSavedAt,
  onSaveVersion,
  onOpenHistory,
  onOpenShare,
  onOpenTemplate,
  onExportPDF,
  onExportPNG,
  exporting,
  fullscreen,
  onToggleFullscreen,
  readOnly,
  sidebarOpen
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const saveStatus = saving
    ? 'Saving…'
    : lastSavedAt
    ? `Saved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Not saved';

  const keys = Object.keys(sections || {});
  const total = keys.length || 9;
  const filled = keys.filter((k) => (sections[k]?.cards || []).length > 0).length;
  const pct = Math.round((filled / total) * 100);

  return (
    <header className={`sticky top-0 z-20 bg-[#09090B] border-b border-[#27272A] pb-4 mb-6 transition-all duration-150 ${sidebarOpen ? 'lg:pr-[380px]' : ''}`}>
      <div className="max-w-[1880px] mx-auto px-4 pt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        {/* Left: Title + Startup badge */}
        <div className="flex items-center gap-3 min-w-0">
          {teamId && !readOnly && (
            <Link
              to={`/teams/dashboard/${teamId}`}
              className="p-2 rounded-sm border border-[#27272A] bg-[#18181B] text-zinc-400 hover:text-white transition-none"
              aria-label="Back to team dashboard"
              title="Back to team"
            >
              <ArrowLeft size={14} />
            </Link>
          )}
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight">
              Business Model Canvas
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-wider bg-[#18181B] border border-[#27272A] text-zinc-400 px-2 py-0.5 rounded-sm shrink-0">
              {teamName || 'SSD'}
            </span>
          </div>
        </div>

        {/* Center/Right: Action Buttons & Telemetry Cluster */}
        <div className="flex flex-wrap items-center gap-4 ml-auto w-full md:w-auto justify-end">
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={onSaveVersion}
                  className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-[9px] font-mono font-semibold uppercase tracking-widest rounded-sm transition-none flex items-center gap-1.5"
                  aria-label="Save version"
                >
                  <Save size={12} /> <span>Save Version</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="px-3 py-1.5 bg-[#18181B] border border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-500 text-[9px] font-mono font-semibold uppercase tracking-widest rounded-sm transition-none flex items-center gap-1.5"
                  aria-label="Version history"
                >
                  <History size={12} /> <span>History</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenTemplate}
                  className="px-3 py-1.5 bg-[#18181B] border border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-500 text-[9px] font-mono font-semibold uppercase tracking-widest rounded-sm transition-none flex items-center gap-1.5"
                  aria-label="Use template"
                >
                  <Sparkles size={12} /> <span>Template</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenShare}
                  className="px-3 py-1.5 bg-[#18181B] border border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-500 text-[9px] font-mono font-semibold uppercase tracking-widest rounded-sm transition-none flex items-center gap-1.5"
                  aria-label="Share"
                >
                  <Share2 size={12} /> <span>Share</span>
                </button>
              </>
            )}

            <div ref={exportRef} className="relative">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                disabled={exporting}
                className="px-3 py-1.5 bg-[#18181B] border border-[#27272A] text-zinc-300 hover:text-white hover:border-zinc-500 text-[9px] font-mono font-semibold uppercase tracking-widest rounded-sm transition-none flex items-center gap-1.5 disabled:opacity-40"
                aria-label="Export"
              >
                <Download size={12} /> <span>{exporting ? 'Exporting…' : 'Export'}</span>
                <ChevronDown size={10} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 mt-1 bg-[#18181B] border border-[#27272A] rounded-sm w-40 z-30 font-mono text-[9px] uppercase tracking-wider">
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      onExportPDF?.();
                    }}
                    className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/5"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      onExportPNG?.();
                    }}
                    className="w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-white/5 border-t border-[#27272A]"
                  >
                    Download PNG
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1.5 bg-[#18181B] border border-[#27272A] text-zinc-400 hover:text-white rounded-sm transition-none"
              aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            </button>
          </div>

          {/* Telemetry cluster */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 pl-4 border-l border-[#27272A]">
            <div className="flex items-center gap-3.5 font-mono text-[9px] uppercase text-zinc-500">
              {/* Presence list */}
              {!readOnly && activeUsers?.length > 0 && (
                <div className="flex -space-x-1.5 mr-2">
                  {activeUsers.slice(0, 3).map((u) => (
                    <div
                      key={u.userId}
                      title={u.userName}
                      className="w-5 h-5 rounded-sm border border-[#27272A] flex items-center justify-center text-[8px] font-mono font-bold text-white shadow-none"
                      style={{ backgroundColor: u.color || '#2563EB' }}
                    >
                      {(u.userName || '?').charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="w-5 h-5 rounded-sm border border-[#27272A] bg-[#18181B] text-zinc-400 text-[8px] font-mono font-bold flex items-center justify-center">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1">
                <span>System:</span>
                <span className={saving ? 'text-[#2563EB]' : 'text-zinc-300'}>{saveStatus}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-none flex-shrink-0 ${connected ? 'bg-[#2563EB]' : 'bg-red-500'}`} />
                <span>{connected ? 'Live' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-1 border-l border-[#27272A] pl-3.5">
                <span>Telemetry:</span>
                <span className="text-zinc-300">{filled}/{total} ({pct}%)</span>
              </div>
            </div>
            
            {/* strict geometric line (1px height) progress bar */}
            <div className="w-40 bg-[#09090B] border border-[#27272A] h-[3px] p-[1px] rounded-none">
              <div
                className="h-full bg-[#2563EB] transition-all duration-350"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CanvasHeader;
