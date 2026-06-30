import { memo } from 'react';

// Colored left-bar + floating avatar showing which teammate is editing.
const SectionFocusOverlay = ({ focus }) => {
  if (!focus) return null;
  return (
    <div
      className="absolute inset-y-0 left-0 w-1"
      style={{ backgroundColor: focus.color || '#0f766e' }}
      aria-hidden="true"
    />
  );
};

export default memo(SectionFocusOverlay);
