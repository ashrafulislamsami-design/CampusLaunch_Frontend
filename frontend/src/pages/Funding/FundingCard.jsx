import { Calendar, Gem, Heart, ExternalLink, UserCheck, Award } from 'lucide-react';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const FundingCard = ({ item, isSaved, onToggleSave }) => {
  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-5 flex flex-col justify-between hover:border-zinc-600 transition-colors group">
      <div>
        {/* Top row: icon + save */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-sm flex items-center justify-center">
              <Gem size={15} className="text-[#2563EB]" />
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm border"
              style={{
                ...MONO,
                backgroundColor: item.category === 'Grant' ? '#16A34A18' : item.category === 'Competition' ? '#2563EB18' : '#7C3AED18',
                color: item.category === 'Grant' ? '#16A34A' : item.category === 'Competition' ? '#2563EB' : '#7C3AED',
                borderColor: item.category === 'Grant' ? '#16A34A40' : item.category === 'Competition' ? '#2563EB40' : '#7C3AED40',
              }}
            >
              {item.category}
            </span>
          </div>
          <button
            onClick={() => onToggleSave(item._id)}
            className={`p-1.5 transition-colors rounded-sm ${isSaved ? 'text-red-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            <Heart size={16} strokeWidth={isSaved ? 0 : 1.5} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3 className="text-base font-bold text-zinc-100 mb-1 leading-snug" style={OUTFIT}>{item.title}</h3>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-4" style={MONO}>{item.provider}</p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-zinc-400 text-xs" style={MONO}>
            <Gem size={12} className="text-zinc-500 shrink-0" />
            <span>Value: <span className="text-zinc-200 font-semibold">{item.amount}</span></span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs" style={MONO}>
            <Calendar size={12} className="text-zinc-500 shrink-0" />
            <span>Deadline: <span className="text-zinc-200 font-semibold">
              {new Date(item.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span></span>
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-3 mb-3">
          <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5" style={MONO}>
            <UserCheck size={11} className="text-zinc-600" /> Who Can Apply
          </h4>
          <p className="text-zinc-400 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.eligibility}</p>
        </div>

        {/* Past Winners — Conditional */}
        {item.pastWinners && (
          <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-3 mb-4">
            <h4 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5" style={MONO}>
              <Award size={11} className="text-zinc-600" /> Previous Success
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{item.pastWinners}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <a
          href={item.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-[#2563EB] text-white font-semibold py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center justify-center gap-1.5"
          style={MONO}
        >
          Apply <ExternalLink size={11} />
        </a>
        <button
          onClick={() => {
            const expiry = new Date(item.deadline);
            const dateStr = expiry.toISOString().replace(/-|:|\\.\\d\\d\\d/g, "").slice(0, 8);
            const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`DEADLINE: ${item.title}`)}&dates=${dateStr}/${dateStr}&details=${encodeURIComponent(`Provider: ${item.provider}\nApply here: ${item.applyLink}\nEligibility: ${item.eligibility}`)}`;
            window.open(calendarUrl, '_blank');
          }}
          className="flex-1 text-center bg-transparent text-zinc-400 font-semibold py-2 rounded-sm text-xs uppercase tracking-widest border border-[#27272A] hover:border-zinc-500 hover:text-zinc-100 transition-colors"
          style={MONO}
        >
          Remind
        </button>
      </div>
    </div>
  );
};

export default FundingCard;
