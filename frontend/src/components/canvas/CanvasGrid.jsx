import { memo } from 'react';
import { SECTION_KEYS } from './canvasConstants';
import CanvasSection from './CanvasSection';

const GRID_CLASSES = {
  keyPartnerships:       'col-span-1 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2',
  keyActivities:         'col-span-1 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-1',
  keyResources:          'col-span-1 lg:col-start-3 lg:col-span-2 lg:row-start-2 lg:row-span-1',
  valuePropositions:     'col-span-1 lg:col-start-5 lg:col-span-2 lg:row-start-1 lg:row-span-2',
  customerRelationships: 'col-span-1 lg:col-start-7 lg:col-span-2 lg:row-start-1 lg:row-span-1',
  channels:              'col-span-1 lg:col-start-7 lg:col-span-2 lg:row-start-2 lg:row-span-1',
  customerSegments:      'col-span-1 lg:col-start-9 lg:col-span-2 lg:row-start-1 lg:row-span-2',
  costStructure:         'col-span-1 lg:col-start-1 lg:col-span-5 lg:row-start-3 lg:row-span-1',
  revenueStreams:        'col-span-1 lg:col-start-6 lg:col-span-5 lg:row-start-3 lg:row-span-1'
};

function CanvasGrid({
  sections = {},
  sectionFocus = {},
  commentCounts = {},
  readOnly = false,
  currentUserId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onColorChange,
  onReorder,
  onToggleLock,
  onOpenComments,
  onFocus,
  onBlur
}) {
  return (
    <div
      className="w-full min-h-[520px] md:min-h-[640px] lg:h-[calc(100vh-180px)] bg-[#09090B] border border-[#27272A] rounded-sm p-2 md:p-3"
      role="group"
      aria-label="Business Model Canvas Grid"
    >
      <div
        className="
          grid gap-2
          grid-cols-1
          lg:grid-cols-10 lg:grid-rows-3
          h-full
        "
      >
        {SECTION_KEYS.map((key) => (
          <div key={key} className={`${GRID_CLASSES[key]} min-h-[160px]`}>
            <CanvasSection
              sectionKey={key}
              section={sections[key]}
              focus={sectionFocus[key]}
              commentCount={commentCounts[key] || 0}
              readOnly={readOnly}
              currentUserId={currentUserId}
              onAddCard={onAddCard}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onColorChange={onColorChange}
              onReorder={onReorder}
              onToggleLock={onToggleLock}
              onOpenComments={onOpenComments}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CanvasGrid);
