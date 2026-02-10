import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
  id: string;
  children: React.ReactNode;
}

const SortableSection: React.FC<Props> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-4 p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-slate-500 z-20"
      >
        <GripVertical size={20} />
      </div>
      {children}
    </div>
  );
};

export default SortableSection;