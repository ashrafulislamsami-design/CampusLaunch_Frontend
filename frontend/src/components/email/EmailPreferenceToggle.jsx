import React from 'react';

const EmailPreferenceToggle = ({ enabled, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200
        focus:outline-none focus:ring-1 focus:ring-blue-500/50
        ${enabled ? 'bg-blue-600' : 'bg-zinc-800 border border-zinc-700/50'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
      `}
    >
      <span
        className={`
          inline-block h-3 w-3 transform rounded-full bg-zinc-100 transition-transform duration-200 shadow-md
          ${enabled ? 'translate-x-[18px]' : 'translate-x-[2px]'}
        `}
      />
    </button>
  );
};

export default EmailPreferenceToggle;
