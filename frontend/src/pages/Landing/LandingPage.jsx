import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  ArrowRight, Users, Coins, BookOpen,
  Mic2, LayoutGrid, Target,
} from 'lucide-react';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };
const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

/* ─── Static feature cards ──────────────────────────────────────── */
const FEATURE_CARDS = [
  {
    icon: Target,
    label: 'Team Formation',
    title: 'Build Your Core Team',
    desc: 'Assemble co-founders, assign roles, and launch your startup architecture inside a shared workspace.',
    accent: '#2563EB',
    stat: '500+ teams formed',
  },
  {
    icon: Coins,
    label: 'Funding Matrix',
    title: 'Discover Capital',
    desc: 'A curated directory of grants, accelerators, and pitch competitions. Pin opportunities to your watchlist.',
    accent: '#16A34A',
    stat: '80+ live opportunities',
  },
  {
    icon: Users,
    label: 'Mentor Network',
    title: 'Book Expert Sessions',
    desc: '1-on-1 sessions with founders, investors, and operators who have built and scaled real companies.',
    accent: '#7C3AED',
    stat: '50+ verified mentors',
  },
  {
    icon: BookOpen,
    label: 'Curriculum',
    title: 'Structured Learning Path',
    desc: '12-week startup curriculum: idea validation, business model design, fundraising, and growth frameworks.',
    accent: '#059669',
    stat: '12 weeks · 48 modules',
  },
  {
    icon: Mic2,
    label: 'Pitch Arena',
    title: 'Compete Live',
    desc: 'Upload your deck, enter live pitch battles, and get scored by real judges. Winners get featured.',
    accent: '#DC2626',
    stat: 'Live events weekly',
  },
  {
    icon: LayoutGrid,
    label: 'Canvas Builder',
    title: 'Business Model Canvas',
    desc: 'Collaborative, real-time canvas with sticky notes, version history, and shareable public links.',
    accent: '#CA8A04',
    stat: 'Real-time collaboration',
  },
];

const STATS = [
  { value: '500+', label: 'Student Founders' },
  { value: '80+', label: 'Funding Opportunities' },
  { value: '50+', label: 'Expert Mentors' },
  { value: '12', label: 'Platform Modules' },
];

/* ─── Grid texture via inline style ─────────────────────────────── */
const GRID_BG = {
  backgroundImage: `
    linear-gradient(rgba(39,39,42,0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(39,39,42,0.5) 1px, transparent 1px)
  `,
  backgroundSize: '64px 64px',
};

/* ─── Component ──────────────────────────────────────────────────── */
const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col" style={GRID_BG}>

      {/* ══════════════════════════════════════════════════════
          TOP BAR  (replaces Navbar on this page)
      ══════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-14 flex flex-row items-center justify-between w-full gap-3 md:gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap"
            style={{ ...MONO, fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            CampusLaunch
            <span className="hidden md:inline">
              <span className="mx-1.5 text-zinc-700">·</span>
              2026
            </span>
          </Link>

          {/* Auth actions */}
          <nav className="flex items-center gap-3 md:gap-6">
            <Link
              to="/login"
              className="text-zinc-400 hover:text-zinc-100 transition-colors text-[10px] md:text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap"
              style={MONO}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 bg-[#2563EB] text-white font-semibold px-3 py-1.5 md:px-5 md:py-2 rounded-sm text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-colors whitespace-nowrap"
              style={MONO}
            >
              Get Started <ArrowRight size={12} />
            </Link>
          </nav>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-28 md:py-36 text-center overflow-hidden">

        {/* Blue gradient origin — single subtle wash, no blob */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2563EB]/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse at center top, #2563EB 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Eyebrow label */}
        <div className="inline-flex items-center border border-[#27272A] rounded-sm px-3 py-1.5 mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500" style={MONO}>
            CampusLaunch · 2026
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="text-[clamp(3rem,8vw,7.5rem)] font-black text-zinc-100 leading-[0.92] tracking-[-0.04em] max-w-5xl mx-auto mb-8"
          style={OUTFIT}
        >
          The Command<br />
          Center for<br />
          <span className="text-[#2563EB]">Campus</span>{' '}
          <span className="text-zinc-500">Founders.</span>
        </h1>

        {/* Sub-headline */}
        <p
          className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Build your team, map your business model, connect with mentors,
          discover funding, and pitch live — all in one focused workspace.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          {isAuthenticated ? (
            <Link
              to="/home"
              className="flex items-center gap-2 bg-[#2563EB] text-white font-bold px-10 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-blue-500 transition-colors"
              style={MONO}
            >
              Back to Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-[#2563EB] text-white font-bold px-10 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-blue-500 transition-colors"
                style={MONO}
              >
                Start for Free <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-transparent text-zinc-400 font-bold px-10 py-4 rounded-sm text-sm uppercase tracking-widest border border-[#27272A] hover:border-zinc-500 hover:text-zinc-100 transition-colors"
                style={MONO}
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 border-t border-[#27272A] pt-10 w-full max-w-2xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-zinc-100" style={OUTFIT}>{value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION DIVIDER
      ══════════════════════════════════════════════════════ */}
      <div className="border-t border-[#27272A] w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600" style={MONO}>
            Platform Modules
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700" style={MONO}>
            {FEATURE_CARDS.length} modules available
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FEATURE GRID
      ══════════════════════════════════════════════════════ */}
      <section className="w-full border-t border-[#27272A]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#27272A]">
            {FEATURE_CARDS.map(({ icon: Icon, label, title, desc, accent, stat }, idx) => (
              <div
                key={label}
                className="bg-[#09090B] p-8 flex flex-col gap-5 hover:bg-[#0D0D0F] transition-colors group"
              >
                {/* Icon + index */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center"
                    style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}35` }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <span
                    className="text-[10px] font-semibold text-zinc-700 tabular-nums"
                    style={MONO}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest mb-2 block"
                    style={{ ...MONO, color: accent }}
                  >
                    {label}
                  </span>
                  <h3 className="text-base font-bold text-zinc-100 mb-2 leading-snug" style={OUTFIT}>
                    {title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {desc}
                  </p>
                </div>

                {/* Stat */}
                <div className="mt-auto pt-4 border-t border-[#27272A] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest" style={MONO}>
                    {stat}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM CTA STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-[#27272A] bg-[#18181B]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-1" style={OUTFIT}>
              Ready to launch your startup?
            </h2>
            <p className="text-zinc-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Join 500+ student founders. No credit card required.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-[#2563EB] text-white font-bold px-8 py-3.5 rounded-sm text-sm uppercase tracking-widest hover:bg-blue-500 transition-colors"
              style={MONO}
            >
              Create Free Account <ArrowRight size={14} />
            </Link>
            <Link
              to="/teams/browse"
              className="flex items-center gap-2 bg-transparent text-zinc-400 font-bold px-8 py-3.5 rounded-sm text-sm uppercase tracking-widest border border-[#27272A] hover:border-zinc-500 hover:text-zinc-100 transition-colors"
              style={MONO}
            >
              Browse Startups
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#27272A]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-12 flex items-center justify-between">
          <span className="text-[10px] text-zinc-700 font-semibold uppercase tracking-widest" style={MONO}>
            © 2026 CampusLaunch
          </span>
          <div className="flex items-center gap-4">
            {[
              { to: '/resources', label: 'Resources' },
              { to: '/mentors', label: 'Mentors' },
              { to: '/events/browse', label: 'Events' },
            ].map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="text-[10px] text-zinc-600 hover:text-zinc-400 font-semibold uppercase tracking-widest transition-colors"
                style={MONO}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
