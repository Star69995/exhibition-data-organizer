"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ExhibitionData } from '@/lib/parser-utils';

type Artist = ExhibitionData['artists'][number];

interface RowProps {
  artist: Artist;
}

const SortableArtistRow: React.FC<RowProps> = ({ artist }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: artist.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2 text-sm ${isDragging ? 'shadow-lg opacity-90 z-10 relative' : ''}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
        aria-label="גרור לשינוי סדר"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="font-medium text-slate-700">{artist.nameHeb || artist.nameEng || 'אמנ.ית ללא שם'}</span>
      {artist.nameEng && <span className="text-slate-400 text-xs">({artist.nameEng})</span>}
    </div>
  );
};

interface Props {
  artists: Artist[];
  onReorder: (artists: Artist[]) => void;
}

const ArtistReorderList: React.FC<Props> = ({ artists, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (artists.length < 2) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = artists.findIndex(a => a.id === active.id);
    const newIndex = artists.findIndex(a => a.id === over.id);
    onReorder(arrayMove(artists, oldIndex, newIndex));
  };

  return (
    <div className="space-y-2 mb-4">
      <p className="text-xs text-slate-400 font-medium">גררו לשינוי סדר הופעת האמנים ברשימה</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={artists.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {artists.map(artist => (
              <SortableArtistRow key={artist.id} artist={artist} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ArtistReorderList;
