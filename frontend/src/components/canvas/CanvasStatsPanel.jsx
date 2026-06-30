import { memo, useState } from 'react';
import { BarChart3, ChevronRight, ChevronLeft } from 'lucide-react';

const CanvasStatsPanel = ({ sections = {}, activeUsers = [], versionCount = 0, lastSavedAt, commentCounts = {} }) => {
  const [open, setOpen] = useState(false);
  const keys = Object.keys(sections);
  const totalCards = keys.reduce((sum, k) => sum + (sections[k]?.cards?.length || 0), 0);
  const sectionsFilled = keys.filter((k) => (sections[k]?.cards || []).length > 0).length;
  const totalComments = Object.values(commentCounts).reduce((a, b) => a + b, 0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-2 top-1/2 -translate-y-1/2 z-30 bg-[#18181B] border border-[#27272A] rounded-sm px-1.5 py-3 shadow-none hover:bg-white/5 text-zinc-400"
        aria-label="Open stats panel"
      >
        <ChevronLeft size={14} />
      </button>
    );
  }

  return (
    <aside className="fixed right-2 top-1/2 -translate-y-1/2 z-30 w-56 bg-[#18181B] border border-[#27272A] rounded-sm shadow-none p-3 font-mono text-[10px]">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#27272A]">
        <h5 className="font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
          <BarChart3 size={12} /> Stats
        </h5>
        <button onClick={() => setOpen(false)} aria-label="Close stats" className="p-0.5 hover:bg-white/5 rounded-sm text-zinc-400">
          <ChevronRight size={12} />
        </button>
      </div>
      <dl className="space-y-1 text-[9px] uppercase tracking-wider">
        <div className="flex justify-between"><dt className="text-zinc-500">Cards</dt><dd className="font-bold text-[#2563EB]">{totalCards}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Sections filled</dt><dd className="font-bold text-white">{sectionsFilled}/9</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Collaborators</dt><dd className="font-bold text-white">{activeUsers.length}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Versions</dt><dd className="font-bold text-white">{versionCount}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Comments</dt><dd className="font-bold text-white">{totalComments}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Last saved</dt><dd className="font-bold text-white">{lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : '—'}</dd></div>
      </dl>
    </aside>
  );
};

export default memo(CanvasStatsPanel);
