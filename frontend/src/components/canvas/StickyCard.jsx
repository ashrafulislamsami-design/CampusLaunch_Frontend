import { memo, useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, Palette, GripVertical } from 'lucide-react';
import { CARD_COLORS } from './canvasConstants';
import CardColorPicker from './CardColorPicker';

// A single sticky-note card. Tilts slightly for a whiteboard feel and supports
// inline edit, color change, delete and drag-reorder.
function StickyCard({
  card,
  sectionKey,
  readOnly = false,
  onEdit,
  onDelete,
  onColorChange,
  dragHandleProps = {},
  onDragStart,
  onDragOver,
  onDrop
}) {
  const [editing, setEditing] = useState(!card.content);
  const [text, setText] = useState(card.content || '');
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);
  const commitTimerRef = useRef(null);

  useEffect(() => {
    setText(card.content || '');
  }, [card.content]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  // Auto-grow textarea.
  const autoResize = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  // Debounced commit so we don't spam the network on every keystroke.
  const scheduleCommit = (value) => {
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    commitTimerRef.current = setTimeout(() => {
      if (value !== card.content) onEdit?.(card._id, sectionKey, value);
    }, 500);
  };

  const commitNow = (value) => {
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    if (value !== card.content) onEdit?.(card._id, sectionKey, value);
  };

  const colorMap = {
    yellow: 'border-l-2 border-l-amber-500',
    blue:   'border-l-2 border-l-[#2563EB]',
    green:  'border-l-2 border-l-emerald-500',
    pink:   'border-l-2 border-l-pink-500',
    orange: 'border-l-2 border-l-orange-500'
  };

  const leftBorder = colorMap[card.color] || colorMap.yellow;

  return (
    <article
      draggable={!readOnly}
      onDragStart={(e) => onDragStart?.(e, card._id)}
      onDragOver={(e) => onDragOver?.(e, card._id)}
      onDrop={(e) => onDrop?.(e, card._id)}
      aria-label={`Schematic card: ${card.content?.slice(0, 40) || 'empty'}`}
      className={`group relative bg-[#09090B] border border-[#27272A] hover:border-zinc-500 ${leftBorder} rounded-sm p-3 transition-none select-none`}
    >
      {/* Drag handle */}
      {!readOnly && (
        <div
          {...dragHandleProps}
          className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-70 cursor-grab"
          aria-label="Drag to reorder"
        >
          <GripVertical size={12} className="text-zinc-500" />
        </div>
      )}

      <div className={!readOnly ? 'pl-2.5' : ''}>
        {editing && !readOnly ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              autoResize(e.target);
              scheduleCommit(e.target.value);
            }}
            onBlur={() => {
              setEditing(false);
              commitNow(text);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                setEditing(false);
                commitNow(text);
              }
            }}
            className="w-full bg-transparent outline-none text-xs text-zinc-100 leading-relaxed font-mono resize-none focus:ring-0 focus:outline-none"
            rows={Math.max(2, Math.ceil((text.length || 10) / 22))}
            maxLength={280}
            aria-label="Edit card"
          />
        ) : (
          <p
            onClick={() => !readOnly && setEditing(true)}
            className="text-xs text-zinc-300 leading-relaxed font-mono cursor-text whitespace-pre-wrap min-h-[1.5rem]"
          >
            {card.content || <span className="italic text-zinc-600">Click to add…</span>}
          </p>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#27272A]">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPicker((v) => !v);
              }}
              className="p-1 rounded-sm hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-none"
              aria-label="Change color"
              title="Change color"
            >
              <Palette size={12} />
            </button>
            {showPicker && (
              <div className="absolute top-6 left-0 z-20">
                <CardColorPicker
                  value={card.color}
                  onChange={(c) => {
                    onColorChange?.(card._id, sectionKey, c);
                    setShowPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-none">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="p-1 rounded-sm hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-none"
              aria-label="Edit card"
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this card?')) onDelete?.(card._id, sectionKey);
              }}
              className="p-1 rounded-sm hover:bg-red-950/30 text-zinc-500 hover:text-red-400 transition-none"
              aria-label="Delete card"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default memo(StickyCard);
