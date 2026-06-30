const MONO  = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const SERVICES = [
  { name: 'API Gateway',        status: 'operational', latency: '42ms'  },
  { name: 'Authentication',     status: 'operational', latency: '18ms'  },
  { name: 'Database Cluster',   status: 'operational', latency: '6ms'   },
  { name: 'File Storage',       status: 'operational', latency: '91ms'  },
  { name: 'Notification Engine',status: 'operational', latency: '34ms'  },
  { name: 'Search Index',       status: 'operational', latency: '55ms'  },
];

const INCIDENTS = [
  { date: 'Jun 20, 2026', title: 'Elevated API latency', severity: 'minor',    resolved: true  },
  { date: 'May 14, 2026', title: 'Notification delay',   severity: 'minor',    resolved: true  },
  { date: 'Apr 02, 2026', title: 'Planned maintenance',  severity: 'info',     resolved: true  },
];

const STATUS_DOT = {
  operational: '#16A34A',
  degraded:    '#CA8A04',
  outage:      '#DC2626',
};

const SEVERITY_STYLE = {
  minor:    { bg: '#CA8A0415', color: '#FCD34D', border: '#CA8A0440' },
  info:     { bg: '#2563EB15', color: '#60A5FA', border: '#2563EB40' },
  major:    { bg: '#DC262615', color: '#F87171', border: '#DC262640' },
};

export default function StatusPage() {
  const allOperational = SERVICES.every(s => s.status === 'operational');

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 bg-[#2563EB]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              System Status
            </span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2" style={OUTFIT}>
            CampusLaunch Status
          </h1>

          {/* Global status banner */}
          <div
            className="flex items-center gap-3 mt-5 px-4 py-3 border"
            style={{
              backgroundColor: allOperational ? '#16A34A12' : '#CA8A0412',
              borderColor:     allOperational ? '#16A34A40' : '#CA8A0440',
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: allOperational ? '#16A34A' : '#CA8A04' }}
            />
            <span className="text-sm font-semibold text-zinc-100" style={MONO}>
              {allOperational ? 'All systems operational' : 'Some systems degraded'}
            </span>
            <span className="ml-auto text-[10px] text-zinc-600 uppercase tracking-widest" style={MONO}>
              Updated just now
            </span>
          </div>
        </div>

        {/* Services table */}
        <div className="bg-[#18181B] border border-[#27272A] mb-8">
          <div className="px-4 py-3 border-b border-[#27272A] flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500" style={MONO}>
              Services
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>
              Latency
            </span>
          </div>
          <div className="flex flex-col divide-y divide-[#27272A]">
            {SERVICES.map(svc => (
              <div key={svc.name} className="flex items-center justify-between px-4 py-3 hover:bg-[#1F1F23] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_DOT[svc.status] }} />
                  <span className="text-sm text-zinc-200 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {svc.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border"
                    style={{ ...MONO, backgroundColor: '#16A34A12', color: '#4ADE80', borderColor: '#16A34A30' }}
                  >
                    {svc.status}
                  </span>
                  <span className="text-[10px] text-zinc-600 w-12 text-right" style={MONO}>{svc.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident history */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 block mb-3" style={MONO}>
            Past Incidents
          </span>
          <div className="flex flex-col gap-px bg-[#27272A]">
            {INCIDENTS.map(inc => {
              const sev = SEVERITY_STYLE[inc.severity] || SEVERITY_STYLE.info;
              return (
                <div key={inc.title} className="bg-[#18181B] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-600 w-24 shrink-0" style={MONO}>{inc.date}</span>
                    <span className="text-sm text-zinc-300" style={{ fontFamily: "'Inter', sans-serif" }}>{inc.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border"
                      style={{ ...MONO, backgroundColor: sev.bg, color: sev.color, borderColor: sev.border }}
                    >
                      {inc.severity}
                    </span>
                    {inc.resolved && (
                      <span className="text-[9px] text-zinc-600 uppercase tracking-widest" style={MONO}>resolved</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
