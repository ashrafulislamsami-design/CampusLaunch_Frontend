import { memo } from 'react';
import { Plus, Lock, Unlock, MessageSquare } from 'lucide-react';
import { SECTION_META, SECTION_PROMPTS } from './canvasConstants';
import DragDropCardList from './DragDropCardList';
import SectionFocusOverlay from './SectionFocusOverlay';

function CanvasSection({
  sectionKey,
  section = { cards: [] },
  focus,
  commentCount = 0,
  readOnly = false,
  currentUserId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onColorChange,
  onReorder,
  onToggleLock,
  onOpenComments,
  onFocus,
  onBlur
}) {
  const meta = SECTION_META[sectionKey];
  const cards = section.cards || [];
  const lockedBy = section.lockedBy;
  const locked = !!lockedBy;
  const lockedByMe = locked && currentUserId && lockedBy.toString?.() === currentUserId;

  return (
    <section
      aria-label={meta.label}
      className="relative flex flex-col bg-[#18181B] border border-[#27272A] rounded-sm overflow-hidden min-h-[180px] focus-within:border-[#2563EB] transition-none"
      onFocusCapture={() => onFocus?.(sectionKey)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onBlur?.(sectionKey);
      }}
    >
      <SectionFocusOverlay focus={focus} />

      <header className="flex items-center justify-between px-3 py-2 bg-transparent border-b border-[#27272A] relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 truncate">
            {meta.label}
          </h3>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {focus && (
            <div
              className="flex items-center gap-1.5 bg-[#09090B] border border-[#27272A] pl-1 pr-2 py-0.5 rounded-sm text-[8px] font-mono font-bold"
              title={`${focus.userName} is editing`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[7px]"
                style={{ backgroundColor: focus.color || '#0f766e' }}
              >
                {(focus.userName || '?').charAt(0).toUpperCase()}
              </span>
              <span className="text-zinc-500 uppercase tracking-wider">editing</span>
            </div>
          )}
          <span className="text-xs font-mono font-bold text-[#2563EB]">
            {cards.length}
          </span>
          <div className="flex items-center gap-1 border-l border-[#27272A] pl-2">
            {!readOnly && (
              <button
                type="button"
                onClick={() => onToggleLock?.(sectionKey)}
                className={`p-1 rounded-sm ${locked ? 'text-red-500' : 'text-zinc-500'} hover:text-zinc-300 transition-none`}
                aria-label={locked ? 'Unlock section' : 'Lock section'}
                title={locked ? (lockedByMe ? 'Locked by you' : 'Locked') : 'Lock section'}
              >
                {locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenComments?.(sectionKey)}
              className="p-1 rounded-sm text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5 transition-none"
              aria-label={`Open comments (${commentCount})`}
              title="Comments"
            >
              <MessageSquare size={12} />
              {commentCount > 0 && (
                <span className="text-[9px] font-mono font-bold text-[#2563EB]">{commentCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-2 py-2 overflow-y-auto canvas-section-scroll relative z-10">
        {cards.length === 0 ? (
          <ul className="space-y-1 text-xs text-zinc-600 leading-relaxed px-1 pt-1 font-mono">
            {(SECTION_PROMPTS[sectionKey] || []).map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        ) : (
          <DragDropCardList
            cards={cards}
            sectionKey={sectionKey}
            readOnly={readOnly || (locked && !lockedByMe)}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onColorChange={onColorChange}
            onReorder={onReorder}
          />
        )}
      </div>

      {!readOnly && (
        <button
          type="button"
          onClick={() => onAddCard?.(sectionKey)}
          disabled={locked && !lockedByMe}
          className="m-2 mt-0 border border-dashed border-[#27272A] hover:border-zinc-500 hover:bg-white/5 text-zinc-400 rounded-sm py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-none disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={`Add card to ${meta.label}`}
        >
          <Plus size={12} /> Add card
        </button>
      )}
    </section>
  );
}

export default memo(CanvasSection);
