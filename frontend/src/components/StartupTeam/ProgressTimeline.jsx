import { CalendarDays, Milestone, Rocket } from 'lucide-react';

const ProgressTimeline = ({ history = [], currentStage = 'Idea', isPublic = false }) => {
  // Always include the initial "Idea" creation as the first point
  const timelinePoints = [
    {
      stage: 'Idea',
      note: 'Startup conceived in the CampusLaunch forge.',
      date: history.length > 0 ? history[0].timestamp : new Date(),
      isInitial: true
    },
    ...history.map(h => ({
      stage: h.newStage,
      note: h.changeNote,
      date: h.timestamp,
      isInitial: false
    }))
  ];

  return (
    <div className={`relative ${isPublic ? 'py-12 bg-[#09090B] min-h-screen px-4' : 'py-4 px-2'}`} aria-label={`Startup journey progress — current stage: ${currentStage}`}>
      {isPublic ? (
        <h3 className="font-sans text-3xl font-bold text-white text-center mb-12 tracking-tight">
          The Traction Journey
        </h3>
      ) : (
        <div className="flex items-center gap-2 mb-6 px-4">
          <div className="w-0.5 h-4 bg-[#2563EB]" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
            Journey Progress
          </span>
        </div>
      )}

      <div className="relative px-2">
        {/* Minimal vertical line thread */}
        <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-[#27272A] z-0"></div>

        <div className="space-y-8" role="list" aria-label="Journey stages">
          {timelinePoints.map((point, idx) => {
            const isCurrent = idx === timelinePoints.length - 1;
            return (
              <div key={idx} className="relative z-10 flex items-start gap-4 group" role="listitem" aria-current={isCurrent ? 'step' : undefined} aria-label={`Stage: ${point.stage}${isCurrent ? ' (current)' : ''}`}>
                {/* Point Node */}
                <div 
                  className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-sm border transition-all duration-150 z-10 ${
                    isCurrent 
                      ? 'bg-[#2563EB15] border-[#2563EB] text-[#60A5FA]' 
                      : 'bg-[#09090B] border-[#27272A] text-zinc-600 group-hover:border-zinc-500'
                  }`}
                >
                  {isCurrent ? <Rocket size={16} /> : <Milestone size={15} />}
                </div>

                {/* Data Placard */}
                <div className="p-4 flex-grow bg-[#09090B] border border-[#27272A] rounded-sm hover:border-zinc-600 transition-colors duration-150">
                  <div className="flex justify-between items-center gap-2">
                    <h4 className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${isCurrent ? 'text-zinc-100' : 'text-zinc-500'}`}>
                      Stage: {point.stage}
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-600 flex items-center gap-1">
                      <CalendarDays size={10} /> {new Date(point.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-500 font-sans text-xs leading-relaxed border-l border-[#27272A] pl-3 py-0.5 mt-2">
                    {point.note || `Progressing within the ${point.stage} phase.`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;
