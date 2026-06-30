import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Code2, Palette, Megaphone, PenLine, BarChart2, Users, PackageSearch,
  Brain, Scale, Settings, Share2, Film, FlaskConical, Lightbulb,
  Target, Rocket, Clock, Link2, BookOpen, Plus, Trash2, CheckCircle2,
  ChevronDown
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const SKILL_OPTIONS = [
  { label: 'Coding',        value: 'coding',        icon: Code2 },
  { label: 'Design',        value: 'design',        icon: Palette },
  { label: 'Marketing',     value: 'marketing',     icon: Megaphone },
  { label: 'Writing',       value: 'writing',       icon: PenLine },
  { label: 'Finance',       value: 'finance',       icon: BarChart2 },
  { label: 'Sales',         value: 'sales',         icon: Users },
  { label: 'Product',       value: 'product',       icon: PackageSearch },
  { label: 'Data',          value: 'data',          icon: Brain },
  { label: 'AI / ML',       value: 'ai/ml',         icon: Brain },
  { label: 'Legal',         value: 'legal',         icon: Scale },
  { label: 'Operations',    value: 'operations',    icon: Settings },
  { label: 'Social Media',  value: 'social media',  icon: Share2 },
  { label: 'Video Editing', value: 'video editing', icon: Film },
  { label: 'Research',      value: 'research',      icon: FlaskConical },
];

const TAG_OPTIONS = [
  { label: 'Looking for Co-founder', value: 'Looking for co-founder', icon: Users,    color: 'amber' },
  { label: 'I Have an Idea',          value: 'I have an idea',          icon: Lightbulb, color: 'teal'  },
  { label: 'Ready to Join a Team',    value: 'Ready to join a team',    icon: Rocket,   color: 'stone' },
];

// ─── Completeness calculator ──────────────────────────────────────────────────

function calcCompleteness(form) {
  const checks = [
    form.university,
    form.department,
    form.skills.length > 0,
    form.lookingForSkills.length > 0,
    form.pastProjects.length > 0,
    form.startupIdea,
    form.weeklyAvailability > 0,
    form.motivation,
    form.profileTag,
    form.linkedinUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-sm p-6 relative overflow-hidden">
      <h3 className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-5 relative z-10">
        {Icon && <Icon size={12} className="text-[#2563EB]" />}
        {title}
      </h3>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Skill pill ───────────────────────────────────────────────────────────────

function SkillPill({ skill, selected, onClick }) {
  const Icon = skill.icon;
  const activeClass = 'bg-[#2563EB] border-[#2563EB] text-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest border border-[#27272A] rounded-sm transition-none
        ${selected ? activeClass : 'bg-[#09090B] text-zinc-500 hover:text-zinc-200 hover:border-zinc-500'}`}
    >
      {Icon && <Icon size={10} />}
      {skill.label}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileForm({ initialData = {}, onSave, isEdit = false }) {
  const [form, setForm] = useState({
    university:        initialData.university        || '',
    department:        initialData.department        || '',
    graduationYear:    initialData.graduationYear    || '',
    skills:            initialData.skills            || [],
    lookingForSkills:  initialData.lookingForSkills  || [],
    pastProjects:      initialData.pastProjects      || [],
    startupIdea:       initialData.startupIdea       || '',
    weeklyAvailability: initialData.weeklyAvailability || 0,
    motivation:        initialData.motivation        || '',
    profileTag:        initialData.profileTag        || 'Ready to join a team',
    linkedinUrl:       initialData.linkedinUrl       || '',
    isPublic:          initialData.isPublic !== undefined ? initialData.isPublic : true,
  });

  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const completeness = calcCompleteness(form);

  const toggleSkill = (val, field) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(s => s !== val)
        : [...prev[field], val],
    }));
  };

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast.error('Both title and description are required');
      return;
    }
    setForm(prev => ({ ...prev, pastProjects: [...prev.pastProjects, { ...newProject }] }));
    setNewProject({ title: '', description: '' });
  };

  const removeProject = idx =>
    setForm(prev => ({ ...prev, pastProjects: prev.pastProjects.filter((_, i) => i !== idx) }));

  const handleSubmit = async () => {
    setLoading(true);
    try { await onSave(form); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">

      {/* ── Progress card ─────────────────────────────────────────── */}
      <div className="bg-[#18181B] border border-[#27272A] p-6 rounded-sm relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-1">Profile Completeness</p>
            <p className="text-5xl font-mono font-bold text-[#2563EB]">{completeness}%</p>
          </div>
          <CheckCircle2
            size={40}
            className="text-[#2563EB] opacity-40"
            strokeWidth={1.5}
          />
        </div>
        <div className="w-full bg-[#09090B] border border-[#27272A] h-[2px]">
          <div
            className="h-full bg-[#2563EB] transition-all duration-700"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider mt-3">
          {completeness < 50 ? 'Keep going — fill in more details to stand out.' :
           completeness < 80 ? 'Looking good! A few more fields to go.' :
           'Outstanding! Your profile is nearly complete.'}
        </p>
      </div>

      {/* ── Profile Tag ───────────────────────────────────────────── */}
      <Section title="Your Status Tag" icon={Target}>
        <div className="flex flex-wrap gap-2.5">
          {TAG_OPTIONS.map(({ label, value, icon: Icon }) => {
            const active = form.profileTag === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, profileTag: value })}
                className={`flex items-center gap-2 px-4 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest border rounded-sm transition-none
                  ${active
                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                    : 'bg-[#09090B] border-[#27272A] text-zinc-500 hover:text-zinc-300 hover:border-zinc-500'}`}
              >
                <Icon size={11} />
                {label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Basic Info ────────────────────────────────────────────── */}
      <Section title="Basic Information" icon={BookOpen}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'University',        key: 'university',        placeholder: 'e.g. BUET, DU, NSU' },
            { label: 'Department',        key: 'department',        placeholder: 'e.g. Computer Science' },
            { label: 'Graduation Year',   key: 'graduationYear',    placeholder: '2026', type: 'number' },
            { label: 'LinkedIn URL',      key: 'linkedinUrl',       placeholder: 'https://linkedin.com/in/…' },
          ].map(({ label, key, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                {label}
              </label>
              <input
                type={type}
                className="w-full border border-[#27272A] bg-[#09090B] px-4 py-2.5 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none transition-colors duration-150 placeholder-zinc-700 rounded-sm"
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}

          {/* Weekly Availability */}
          <div className="sm:col-span-2">
            <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
              Weekly Availability
            </label>
            <div className="flex items-center gap-4 bg-[#09090B] border border-[#27272A] rounded-sm p-4">
              <input
                type="range"
                min={0} max={40}
                value={form.weeklyAvailability}
                onChange={e => setForm({ ...form, weeklyAvailability: Number(e.target.value) })}
                className="flex-1 appearance-none bg-[#18181B] h-1 border border-[#27272A] rounded-none accent-[#2563EB] cursor-pointer"
              />
              <span className="text-xl font-bold font-mono text-[#2563EB] w-20 text-right shrink-0">
                {form.weeklyAvailability}<span className="text-xs text-zinc-500"> hrs</span>
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── My Skills ─────────────────────────────────────────────── */}
      <Section title="My Skills" icon={Code2}>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map(skill => (
            <SkillPill
              key={skill.value}
              skill={skill}
              selected={form.skills.includes(skill.value)}
              onClick={() => toggleSkill(skill.value, 'skills')}
            />
          ))}
        </div>
      </Section>

      {/* ── Looking For ───────────────────────────────────────────── */}
      <Section title="Skills I'm Looking For in a Co-founder" icon={Users}>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map(skill => (
            <SkillPill
              key={skill.value}
              skill={skill}
              selected={form.lookingForSkills.includes(skill.value)}
              onClick={() => toggleSkill(skill.value, 'lookingForSkills')}
            />
          ))}
        </div>
      </Section>

      {/* ── Motivation ────────────────────────────────────────────── */}
      <Section title="Motivation" icon={Rocket}>
        <textarea
          className="w-full border border-[#27272A] bg-[#09090B] px-4 py-3 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none transition-colors duration-150 placeholder-zinc-700 min-h-[100px] resize-none rounded-sm"
          value={form.motivation}
          onChange={e => setForm({ ...form, motivation: e.target.value })}
          placeholder="What drives you as a student entrepreneur? What problem are you trying to solve?"
        />
      </Section>

      {/* ── Startup Idea (optional) ────────────────────────────────── */}
      <Section title="Startup Idea (optional)" icon={Lightbulb}>
        <textarea
          className="w-full border border-[#27272A] bg-[#09090B] px-4 py-3 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none transition-colors duration-150 placeholder-zinc-700 min-h-[80px] resize-none rounded-sm"
          value={form.startupIdea}
          onChange={e => setForm({ ...form, startupIdea: e.target.value })}
          placeholder="Briefly describe your startup idea…"
        />
      </Section>

      {/* ── Past Projects ─────────────────────────────────────────── */}
      <Section title="Past Projects" icon={PackageSearch}>
        <div className="space-y-3 mb-4">
          {form.pastProjects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-[#09090B] border border-[#27272A] p-4 flex justify-between items-start rounded-sm"
            >
              <div>
                <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{proj.title}</p>
                <p className="text-zinc-400 text-xs mt-1">{proj.description}</p>
              </div>
              <button type="button" onClick={() => removeProject(idx)} className="text-red-400 hover:text-red-500 ml-4 mt-0.5 flex-shrink-0">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            className="border border-[#27272A] bg-[#09090B] px-4 py-2.5 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none transition-colors placeholder-zinc-700 rounded-sm"
            placeholder="Project title"
            value={newProject.title}
            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
          />
          <input
            className="border border-[#27272A] bg-[#09090B] px-4 py-2.5 text-xs text-zinc-100 focus:border-[#2563EB] focus:outline-none transition-colors placeholder-zinc-700 rounded-sm"
            placeholder="Short description"
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          />
          <button
            type="button"
            onClick={addProject}
            className="flex items-center justify-center gap-2 bg-[#2563EB] text-white text-[9px] font-mono font-semibold uppercase tracking-widest border border-[#2563EB] hover:bg-blue-700 transition-colors rounded-sm shadow-none"
          >
            <Plus size={12} /> Add Project
          </button>
        </div>
      </Section>

      {/* ── Visibility ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-2 py-4 border-t border-[#27272A]">
        <button
          type="button"
          onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
          className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
        >
          <span className={`w-1.5 h-1.5 rounded-none flex-shrink-0 ${form.isPublic ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{form.isPublic ? 'Profile is visible to other students' : 'Profile is hidden (private)'}</span>
        </button>
      </div>

      {/* ── Submit ────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-[9px] font-semibold uppercase tracking-widest py-4 border border-transparent disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors duration-150 rounded-sm shadow-none"
      >
        {loading ? (
          <span className="animate-pulse">Saving…</span>
        ) : (
          <>
            <Rocket size={12} />
            <span>{isEdit ? 'Update Profile' : 'Create Profile'}</span>
          </>
        )}
      </button>
    </div>
  );
}