import React from 'react';
import EmailPreferenceToggle from './EmailPreferenceToggle';

const OUTFIT = { fontFamily: "'Outfit', 'Inter', sans-serif" };

const EmailPreferenceCategory = ({
  icon,
  title,
  description,
  enabled,
  disabled = false,
  onToggle,
  children,
}) => {
  return (
    <div
      className={`
        bg-[#18181B] border rounded-sm p-5 transition-all duration-200
        ${enabled && !disabled ? 'border-zinc-700/80 shadow-md shadow-black/10' : 'border-[#27272A]'}
        ${disabled ? 'opacity-50' : 'hover:border-zinc-700 hover:bg-zinc-800/10'}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`
              w-10 h-10 rounded-sm flex items-center justify-center text-lg transition-colors
              ${enabled && !disabled ? 'bg-blue-950/30 border border-blue-900/30 text-blue-400' : 'bg-[#09090B] border border-zinc-800 text-zinc-500'}
            `}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100 text-sm tracking-wide" style={OUTFIT}>{title}</h3>
            {description && (
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <EmailPreferenceToggle
            enabled={enabled}
            disabled={disabled}
            onChange={onToggle}
          />
        </div>
      </div>

      {children && enabled && !disabled && (
        <div className="mt-4 pt-4 border-t border-[#27272A] space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default EmailPreferenceCategory;
