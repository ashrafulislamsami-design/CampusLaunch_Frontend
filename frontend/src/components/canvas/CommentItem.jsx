import { memo, useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const formatTime = (d) => {
  const date = new Date(d);
  return date.toLocaleString();
};

const CommentItem = ({ comment, currentUserId, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const isAuthor = comment.author?._id === currentUserId;

  const save = async () => {
    if (!text.trim()) return;
    await onEdit?.(comment._id, text.trim());
    setEditing(false);
  };

  return (
    <div className="border-l-2 border-l-[#2563EB] pl-3 py-2 bg-[#09090B] border border-[#27272A] rounded-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-300 font-mono">
          {comment.author?.name || 'Member'}
          {comment.isEdited && <span className="ml-1 text-[8px] italic text-zinc-600">(edited)</span>}
        </span>
        <span className="text-[8px] text-zinc-500 font-mono">{formatTime(comment.createdAt)}</span>
      </div>
      {editing ? (
        <div className="mt-1.5 flex gap-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border border-[#27272A] bg-[#18181B] rounded-sm px-2 py-1 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none"
            maxLength={1000}
          />
          <button type="button" onClick={save} className="p-1 text-green-400" aria-label="Save comment">
            <Check size={14} />
          </button>
          <button type="button" onClick={() => setEditing(false)} className="p-1 text-zinc-400" aria-label="Cancel edit">
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-xs text-zinc-300 mt-1 whitespace-pre-wrap font-mono leading-relaxed">{comment.content}</p>
      )}
      {isAuthor && !editing && (
        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-[#27272A]">
          <button
            onClick={() => setEditing(true)}
            className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5"
          >
            <Pencil size={10} /> Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this comment?')) onDelete?.(comment._id);
            }}
            className="text-[9px] font-mono text-zinc-500 hover:text-red-400 flex items-center gap-0.5"
          >
            <Trash2 size={10} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(CommentItem);
