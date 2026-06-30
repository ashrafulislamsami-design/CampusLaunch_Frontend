import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL as API } from '@/config';
import ProfileForm from '../../components/profile/ProfileForm';
import toast from 'react-hot-toast';
import {
  Rocket, Edit3, Trash2, CheckCircle2, Clock, Link2,
  Users, Lightbulb, Code2, BookOpen, Award, Eye, EyeOff
} from 'lucide-react';

// ─── Tag colour map ───────────────────────────────────────────────────────────
const TAG_STYLES = {
  'Looking for co-founder': 'bg-purple-950/20 text-purple-400 border-purple-500/20',
  'I have an idea':          'bg-teal-950/20   text-teal-400  border-teal-500/20',
  'Ready to join a team':    'bg-zinc-950/20   text-zinc-400  border-zinc-500/20',
};

// ─── Skill badge (read-only) ───────────────────────────────────────────────────
function SkillBadge({ label }) {
  return (
    <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border border-[#27272A] bg-[#09090B] text-zinc-400 rounded-sm">
      {label}
    </span>
  );
}

// ─── Project card (read-only) ─────────────────────────────────────────────────
function ProjectCard({ proj }) {
  return (
    <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-sm">
      <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wider mb-1">{proj.title}</p>
      <p className="text-zinc-400 text-xs leading-relaxed">{proj.description}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StudentProfile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => { fetchMyProfile(); }, []);

  const fetchMyProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) { setProfile(null); }
      else { const d = await res.json(); setProfile(d); }
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (formData) => {
    const res = await fetch(`${API}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) { toast.success('Profile created!'); setProfile(data); }
    else toast.error(data.message || 'Error creating profile');
  };

  const handleUpdate = async (formData) => {
    const res = await fetch(`${API}/profiles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) { toast.success('Profile updated!'); setProfile(data); setEditing(false); }
    else toast.error(data.message || 'Error updating profile');
  };

  const handleDelete = async () => {
    if (!confirm('Delete your profile? This cannot be undone.')) return;
    const res = await fetch(`${API}/profiles`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) { toast.success('Profile deleted'); setProfile(null); }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center py-32 bg-[#09090B] min-h-screen">
      <div className="animate-pulse text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Loading…</div>
    </div>
  );

  // ── Create mode ──────────────────────────────────────────────────────────
  if (!profile && !editing) return (
    <div className="min-h-screen bg-[#09090B] w-full text-zinc-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header strip */}
        <div className="mb-8 pb-4 border-b border-[#27272A]">
          <h1 className="text-base font-bold text-white tracking-tight">BUILD YOUR FOUNDER PROFILE</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">
            Let co-founders and mentors discover you. Complete your profile to unlock the full network.
          </p>
        </div>
        <ProfileForm onSave={handleCreate} isEdit={false} />
      </div>
    </div>
  );

  // ── Edit mode ────────────────────────────────────────────────────────────
  if (editing) return (
    <div className="min-h-screen bg-[#09090B] w-full text-zinc-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#27272A]">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">EDIT PROFILE</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Update your founder details and startup stats</p>
          </div>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-zinc-400 bg-[#09090B] border border-[#27272A] hover:text-white hover:border-zinc-500 px-3 py-2 rounded-sm transition-colors duration-150"
          >
            ✕ Cancel
          </button>
        </div>
        <ProfileForm initialData={profile} onSave={handleUpdate} isEdit={true} />
      </div>
    </div>
  );

  // ── View mode ────────────────────────────────────────────────────────────
  const completeness = profile.completeness ?? 0;

  return (
    <div className="min-h-screen bg-[#09090B] w-full text-zinc-100">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-8 space-y-6">

        {/* ── Hero card ──────────────────────────────────────────────────── */}
        <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
            {/* Left: identity */}
            <div className="flex-1">
              {/* Tag */}
              <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-widest mb-4 rounded-sm ${TAG_STYLES[profile.profileTag] || TAG_STYLES['Ready to join a team']}`}>
                {profile.profileTag}
              </span>

              <h1 className="text-2xl font-bold text-white leading-tight mb-1">
                {profile.name}
              </h1>
              <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mt-1">
                {[profile.university, profile.department].filter(Boolean).join(' // ')}
                {profile.graduationYear && ` // CLASS OF ${profile.graduationYear}`}
              </p>

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-[9px] font-mono font-semibold uppercase tracking-widest text-[#60A5FA] hover:text-[#2563EB] transition-colors"
                >
                  <Link2 size={10} /> <span>LinkedIn Profile</span>
                </a>
              )}
            </div>

            {/* Right: meta */}
            <div className="flex flex-col sm:items-end items-start gap-3 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest px-3 py-2 rounded-sm transition-colors duration-150"
                >
                  <Edit3 size={11} /> <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 bg-[#09090B] border border-[#27272A] text-zinc-400 hover:text-red-400 hover:border-red-500/20 font-mono text-[9px] font-semibold uppercase tracking-widest px-3 py-2 rounded-sm transition-colors duration-150"
                >
                  <Trash2 size={11} /> <span>Delete</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                {profile.isPublic ? <Eye size={12} className="text-green-500" /> : <EyeOff size={12} className="text-zinc-600" />}
                <span>{profile.isPublic ? 'Public profile' : 'Private profile'}</span>
              </div>
            </div>
          </div>

          {/* Completeness strip */}
          <div className="relative z-10 mt-6 pt-6 border-t border-[#27272A]">
            <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
              <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-[#2563EB]" /> Profile Completeness</span>
              <span className="text-[#2563EB]">{completeness}%</span>
            </div>
            <div className="w-full bg-[#09090B] border border-[#27272A] h-[2px]">
              <div className="h-full bg-[#2563EB] transition-all duration-700" style={{ width: `${completeness}%` }} />
            </div>
          </div>
        </div>

        {/* ── Two-column body ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Availability */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock size={12} className="text-[#2563EB]" /> Weekly Availability
            </p>
            <p className="text-4xl font-bold text-white font-mono">
              {profile.weeklyAvailability}<span className="text-sm text-zinc-500"> hrs/wk</span>
            </p>
          </div>

          {/* Skills */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Code2 size={12} className="text-[#2563EB]" /> My Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length > 0
                ? profile.skills.map(s => <SkillBadge key={s} label={s} />)
                : <span className="text-zinc-600 text-xs italic font-mono uppercase text-[9px]">No skills added yet</span>}
            </div>
          </div>
        </div>

        {/* Looking For */}
        {profile.lookingForSkills?.length > 0 && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Users size={12} className="text-[#2563EB]" /> Looking for in a Co-founder
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.lookingForSkills.map(s => <SkillBadge key={s} label={s} />)}
            </div>
          </div>
        )}

        {/* Motivation */}
        {profile.motivation && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Rocket size={12} className="text-[#2563EB]" /> Motivation
            </p>
            <p className="text-zinc-300 text-xs leading-relaxed italic border-l-2 border-[#2563EB] pl-4">
              {profile.motivation}
            </p>
          </div>
        )}

        {/* Startup Idea */}
        {profile.startupIdea && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Lightbulb size={12} className="text-[#2563EB]" /> Startup Idea
            </p>
            <p className="text-zinc-300 text-xs leading-relaxed">{profile.startupIdea}</p>
          </div>
        )}

        {/* Past Projects */}
        {profile.pastProjects?.length > 0 && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
            <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={12} className="text-[#2563EB]" /> Past Projects
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.pastProjects.map((p, i) => <ProjectCard key={i} proj={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}