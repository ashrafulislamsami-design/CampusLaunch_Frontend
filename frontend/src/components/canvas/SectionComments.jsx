import { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import canvasService from '../../services/canvasService';
import { SECTION_META } from './canvasConstants';
import CommentItem from './CommentItem';

const SectionComments = ({ token, teamId, sectionKey, currentUserId, onClose, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!sectionKey) return undefined;
    setLoading(true);
    canvasService
      .listComments(token, teamId, sectionKey)
      .then((data) => {
        if (!mounted) return;
        setComments(data);
        onCountChange?.(sectionKey, data.length);
      })
      .catch(() => mounted && toast.error('Failed to load comments'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey, teamId, token]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const created = await canvasService.addComment(token, teamId, sectionKey, text.trim());
      const next = [...comments, created];
      setComments(next);
      onCountChange?.(sectionKey, next.length);
      setText('');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = async (id, content) => {
    try {
      const updated = await canvasService.editComment(token, id, content);
      setComments((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch {
      toast.error('Failed to edit');
    }
  };

  const handleDelete = async (id) => {
    try {
      await canvasService.deleteComment(token, id);
      const next = comments.filter((c) => c._id !== id);
      setComments(next);
      onCountChange?.(sectionKey, next.length);
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (!sectionKey) return null;
  const meta = SECTION_META[sectionKey];

  return (
    <aside
      className="fixed top-0 right-0 h-screen w-full sm:w-[380px] bg-[#18181B] border-l border-[#27272A] shadow-2xl z-40 flex flex-col animate-in slide-in-from-right text-zinc-100 font-mono text-xs"
      aria-label={`Comments for ${meta?.label}`}
    >
      <header className="flex justify-between items-center p-4 border-b border-[#27272A] bg-[#09090B]">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">TEAM TRANSMISSIONS</span>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-white font-bold mt-0.5">{meta?.label}</h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comments"
          className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-[#27272A] text-zinc-400 hover:text-white rounded-none border border-transparent transition-colors duration-150"
        >
          <X size={16} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-14 bg-[#09090B] border border-[#27272A] rounded-sm" />
            <div className="h-14 bg-[#09090B] border border-[#27272A] rounded-sm" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-8">No comments yet. Start a discussion!</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              currentUserId={currentUserId}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <form onSubmit={submit} className="border-t border-[#27272A] p-3 flex gap-2 bg-[#09090B]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 border border-[#27272A] bg-[#18181B] px-3 py-2 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none rounded-sm transition-colors duration-150"
          maxLength={1000}
          disabled={posting}
        />
        <button
          type="submit"
          disabled={!text.trim() || posting}
          className="px-3 bg-[#2563EB] text-white rounded-sm hover:bg-blue-700 disabled:opacity-40 transition-none flex items-center justify-center"
          aria-label="Post comment"
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
};

export default SectionComments;
