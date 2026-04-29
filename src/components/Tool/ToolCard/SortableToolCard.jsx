import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MiniWin from '@/components/MiniWin'
import Item from './Item'
import { settingKey, settingConfig } from '@/store/toolStore';

const SortableToolCard = ({ tool }) => {

  const config = settingConfig.useValue();
  const autoOpenToolId = config?.autoOpenTool;
  const isAutoOpen = autoOpenToolId && autoOpenToolId !== 'none' && String(tool.id) === autoOpenToolId;
  const [isOpen, setIsOpen] = React.useState(isAutoOpen);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-tool-card">
      <div className='drag-handle' {...attributes} {...listeners}>
        ⠿
      </div>
      <Item
        image={tool.image}
        title={tool.name}
        description={tool.description}
        onClick={() => {
          setIsOpen(true)
        }}
      />
      <MiniWin
        id={"win" + tool.id}
        title={tool.name}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPosition={{ x: 100, y: 100 }}
        initIsOwner={isAutoOpen}
        initialSize={{ width: innerWidth * .6 | 0, height: innerHeight * .6 | 0 }}
        btns={[
          tool.SettingBtn,
        ].filter(Boolean)}
        children={tool.Component}
        settingKey={tool.settingKey}
        config={tool.config}
      />
    </div>
  );
};

export default SortableToolCard;
