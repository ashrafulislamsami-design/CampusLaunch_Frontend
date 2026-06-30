import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Rocket, Target, Lightbulb, Users, BarChart3, 
  Globe, Play, Image as ImageIcon, Award, 
  DollarSign, Briefcase, ChevronRight, ExternalLink,
  Download
} from 'lucide-react';
import ProgressTimeline from '../../components/StartupTeam/ProgressTimeline';
import { API_BASE_URL } from '@/config';

const PublicProfile = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicTeam = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/teams/public/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch team');
        setTeam(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTeam();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
      <div className="flex flex-col items-center gap-4">
        <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest font-semibold animate-pulse">Initializing Portfolio...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
      <div className="text-center p-8 bg-[#18181B] border border-[#27272A] rounded-sm">
        <h2 className="text-xs font-mono font-semibold text-red-500 uppercase tracking-widest mb-2">System Error</h2>
        <p className="text-zinc-400 text-sm">{error}</p>
      </div>
    </div>
  );

  if (!team) return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
      <div className="text-center">
        <span className="text-[10px] font-mono font-semibold text-zinc-600 uppercase tracking-widest">Startup Not Found</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] pb-24 text-zinc-100">
      
      {/* ── HERO HEADER ── */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 border-b border-[#27272A] mb-12">
        <div className="flex flex-col gap-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 border border-[#27272A] px-2.5 py-1 rounded-sm">
              Showcase Series 2024
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                {team.name}
              </h1>
              <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest mt-2">
                {team.description || "Building the next generation of solutions."}
              </p>
            </div>
            
            {/* Logo Placement */}
            <div className="w-16 h-16 bg-[#18181B] border border-[#27272A] p-1 rounded-sm overflow-hidden flex items-center justify-center shrink-0">
               {team.logoUrl ? (
                  <img src={team.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-sm" />
                ) : (
                  <Rocket size={24} className="text-zinc-600" />
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Problem */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 flex flex-col">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">The Problem</h3>
            <p className="text-zinc-300 text-sm leading-relaxed italic flex-1">
              "{team.problemStatement}"
            </p>
          </div>

          {/* Our Solution */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 flex flex-col">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Our Solution</h3>
            <p className="text-zinc-300 text-sm leading-relaxed flex-1">
              {team.solution}
            </p>
          </div>

          {/* Business Model */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Business Model</h3>
              <p className="text-zinc-400 text-xs leading-relaxed font-mono border-b border-[#27272A] pb-4 mb-4">
                {team.businessModel || "Developing sustainable revenue streams through strategic university and industry partnerships."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Seed Raised</span>
                <span className="text-2xl font-bold text-white mt-1 font-mono">${team.fundingReceived?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Current Stage</span>
                <span className="text-2xl font-bold text-[#2563EB] mt-1 font-mono uppercase">{team.stage}</span>
              </div>
            </div>
          </div>

          {/* Product Showcase */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Product Showcase</h3>
            <div className="flex-1">
              {team.productMedia && team.productMedia.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.productMedia.map((media, idx) => (
                    <div key={idx} className="bg-[#18181B] border border-[#27272A] rounded-sm overflow-hidden">
                      {media.mediaType === 'video' ? (
                        <div className="aspect-video bg-black relative">
                           <iframe 
                             src={media.url.replace('watch?v=', 'embed/')} 
                             className="w-full h-full border-none"
                             title={media.caption || 'Video'}
                             allowFullScreen
                           />
                        </div>
                      ) : (
                        <div className="aspect-video relative overflow-hidden">
                          <img src={media.url} alt={media.caption} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-3 bg-[#18181B] border-t border-[#27272A]">
                        <p className="text-[9px] font-mono font-semibold uppercase tracking-widest text-zinc-500">{media.caption || 'Media Highlight'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[#27272A] rounded-sm bg-transparent flex flex-col items-center justify-center p-12 text-center h-full min-h-[220px]">
                  <ImageIcon size={24} className="text-zinc-700 mb-2" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Product Gallery In Development</span>
                </div>
              )}
            </div>
          </div>

          {/* Connect CTA */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Connect with {team.name}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                Interested in this venture? Connect with the founders through the CampusLaunch network.
              </p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/login'}
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-3.5 rounded-sm transition duration-150"
              >
                Express Interest
              </button>
              {team.pitchDeckUrl && (
                <a 
                  href={team.pitchDeckUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-300 font-mono text-[9px] uppercase tracking-widest py-2 transition"
                >
                  <Download size={12} /> <span>Download Pitch Deck</span>
                </a>
              )}
            </div>
          </div>

          {/* Achievements & Traction */}
          <div className="md:col-span-3 flex flex-col gap-4 mt-6">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Achievements & Growth</h3>
            <div className="border border-[#27272A] bg-[#18181B] rounded-sm p-1">
               <ProgressTimeline history={team.history} currentStage={team.stage} isPublic={true} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {team.achievements && team.achievements.length > 0 ? (
                team.achievements.map((ach, idx) => (
                  <div key={idx} className="border border-[#27272A] bg-[#18181B] rounded-sm flex flex-row items-stretch overflow-hidden">
                     {/* Date Column */}
                     <div className="w-32 shrink-0 p-4 border-r border-[#27272A] flex items-center justify-center bg-[#09090B]">
                       <span className="font-mono text-[10px] text-[#2563EB] tracking-wider uppercase">
                         {new Date(ach.date).toLocaleDateString()}
                       </span>
                     </div>
                     {/* Event details column */}
                     <div className="flex-1 p-4">
                       <h4 className="font-sans text-xs font-bold text-zinc-100 uppercase tracking-tight mb-1">{ach.title}</h4>
                       <p className="text-zinc-400 text-xs leading-relaxed">{ach.description}</p>
                     </div>
                  </div>
                ))
              ) : (
                 <div className="col-span-2 border border-dashed border-[#27272A] bg-[#18181B] rounded-sm p-6 text-center">
                    <Award size={18} className="mx-auto text-zinc-700 mb-2" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">No official milestones logged yet</span>
                 </div>
              )}
            </div>
          </div>

          {/* Founders */}
          <div className="md:col-span-3 flex flex-col gap-4 mt-6">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">The Founders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {team.members && team.members.filter(m => m.status === 'accepted').map((m, idx) => (
                <div key={idx} className="bg-[#18181B] border border-[#27272A] rounded-sm p-4 flex items-center justify-between">
                   <span className="text-xs font-bold text-white">{m.userId?.name || "Founder"}</span>
                   <span className="font-mono text-[#2563EB] text-[10px] uppercase tracking-widest">{m.role}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
