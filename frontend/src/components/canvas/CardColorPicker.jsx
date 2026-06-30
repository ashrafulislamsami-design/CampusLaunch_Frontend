import { memo } from 'react';
import { CARD_COLORS } from './canvasConstants';

// Tiny 5-swatch picker used inside StickyCard.
const CardColorPicker = ({ value, onChange }) => (
  <div
    className="flex items-center gap-1 bg-[#18181B] border border-[#27272A] rounded-sm px-1.5 py-1.5 shadow-none"
    onClick={(e) => e.stopPropagation()}
  >
    {Object.keys(CARD_COLORS).map((key) => (
      <button
        key={key}
        type="button"
        aria-label={`Set card color ${key}`}
        onClick={() => onChange(key)}
        className={`w-3.5 h-3.5 rounded-sm ${CARD_COLORS[key].dot} border ${
          value === key ? 'border-white' : 'border-transparent'
        } transition-none`}
      />
    ))}
  </div>
);

export default memo(CardColorPicker);
