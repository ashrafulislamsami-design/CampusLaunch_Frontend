// frontend/src/components/Footer.jsx
import { Link } from 'react-router-dom';

const MONO = { fontFamily: "'Geist Mono', 'SF Mono', monospace" };

const Footer = () => (
  <footer className="border-t border-[#27272A] bg-[#09090B]">
    <div className="max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 h-auto md:h-12">

        {/* LEFT — branding: raw static mono string, no icon, no dot */}
        <span
          className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest whitespace-nowrap"
          style={MONO}
        >
          CampusLaunch · 2026
        </span>

        {/* CENTER — policy links */}
        <div className="flex items-center gap-1">
          {[
            { label: 'Status',  to: '/status'  },
            { label: 'Terms',   to: '/terms'   },
            { label: 'Privacy', to: '/privacy' },
          ].map(({ label, to }, i, arr) => (
            <span key={label} className="flex items-center gap-1">
              <Link
                to={to}
                className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                style={MONO}
              >
                [ {label} ]
              </Link>
              {i < arr.length - 1 && (
                <span className="text-zinc-700 text-[10px]" style={MONO}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* RIGHT — origin tag: pure text, no icon */}
        <span
          className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 whitespace-nowrap"
          style={MONO}
        >
          Built in Bangladesh
        </span>

      </div>
    </div>
  </footer>
);

export default Footer;
