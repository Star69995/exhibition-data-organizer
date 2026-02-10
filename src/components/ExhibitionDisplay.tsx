import React, { useState, useEffect } from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Image as ImageIcon, FileText, Clock, Info } from 'lucide-react';
import { displaySettings } from '@/config/display-settings';
import CopyButton from './CopyButton';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableSection from './SortableSection';

interface Props {
  data: ExhibitionData;
}

const DataField = ({ label, value, isLong = false }: { label: string, value: string, isLong?: boolean }) => {
  if (!value) return null;
  return (
    <div className={`group flex ${isLong ? 'flex-col' : 'items-start justify-between'} py-2 border-b border-slate-50 last:border-0 gap-2`}>
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <span className="text-sm font-semibold text-slate-500 shrink-0">{label}:</span>
        {!isLong && (
          <span className="text-sm text-slate-900 break-all overflow-hidden">
            {value}
          </span>
        )}
      </div>
      {isLong && (
        <p className="text-sm text-slate-900 mt-1 whitespace-pre-wrap text-justify leading-relaxed">
          {value}
        </p>
      )}
      <div className={`${isLong ? 'mt-2 self-end' : 'shrink-0'}`}>
        <CopyButton value={value} />
      </div>
    </div>
  );
};

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  const { labels, sectionOrder } = displaySettings;
  
  const [sectionIds, setSectionIds] = useState<string[]>([]);

  useEffect(() => {
    const initialSections = [
      { id: 'exhibition', order: sectionOrder.exhibition },
      { id: 'curator', order: sectionOrder.curator },
      { id: 'artists', order: sectionOrder.artists },
      { id: 'press', order: sectionOrder.press },
      { id: 'images', order: sectionOrder.images },
      { id: 'shifts', order: sectionOrder.shifts },
      { id: 'unmatched', order: sectionOrder.unmatched },
    ]
    .sort((a, b) => a.order - b.order)
    .map(s => s.id);
    
    setSectionIds(initialSections);
  }, [sectionOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderSectionContent = (id: string) => {
    switch (id) {
      case 'exhibition':
        return (
          <div className="text-center space-y-2 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-primary break-words">{data.exhibition.titleHeb || 'תערוכה חדשה'}</h1>
              <CopyButton value={data.exhibition.titleHeb} />
            </div>
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg md:text-xl text-muted-foreground italic break-words">{data.exhibition.titleEng}</p>
              <CopyButton value={data.exhibition.titleEng} />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Badge variant="outline" className="text-base md:text-lg py-1 px-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {data.exhibition.openDate} - {data.exhibition.closeDate}
                <CopyButton value={`${data.exhibition.openDate} - ${data.exhibition.closeDate}`} />
              </Badge>
            </div>
          </div>
        );

      case 'curator':
        return (
          <Card className="border-r-4 border-r-blue-500 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-500" />
                אוצר.ת
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DataField label={labels.nameHeb} value={data.curator.nameHeb} />
              <DataField label={labels.nameEng} value={data.curator.nameEng} />
              <DataField label={labels.phone} value={data.curator.phone} />
              <DataField label={labels.email} value={data.curator.email} />
              <DataField label={labels.instagram} value={data.curator.instagram} />
              <DataField label={labels.website} value={data.curator.website} />
            </CardContent>
          </Card>
        );

      case 'artists':
        return (
          <Card className="border-r-4 border-r-purple-500 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-purple-500" />
                אמנים משתתפים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.artists.map((artist, i) => (
                <div key={i} className="p-3 bg-purple-50/30 rounded-lg space-y-1">
                  <DataField label={labels.nameHeb} value={artist.nameHeb} />
                  <DataField label={labels.nameEng} value={artist.nameEng} />
                  <DataField label={labels.email} value={artist.email} />
                  <DataField label={labels.phone} value={artist.phone} />
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'press':
        return (
          <Card className="border-r-4 border-r-green-500 shadow-sm w-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-green-500" />
                טקסטים לפרסום
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-green-700">{labels.pressFull}:</h4>
                  <CopyButton value={data.pressRelease.full} />
                </div>
                <p className="text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap text-justify">
                  {data.pressRelease.full}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-green-700">{labels.pressShort}:</h4>
                  <CopyButton value={data.pressRelease.short} />
                </div>
                <p className="text-sm italic bg-green-50/30 p-4 rounded-lg border border-green-100 whitespace-pre-wrap text-justify">
                  {data.pressRelease.short}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 'images':
        return (
          <div className="w-full space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-orange-500" />
              {labels.images || 'דימויים'}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.images.map((img) => (
                <Card key={img.id} className="bg-orange-50/20 border-orange-100 shadow-sm">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge className="bg-orange-500 shrink-0">{img.id}</Badge>
                      <div className="flex-1 space-y-3 min-w-0">
                        <DataField label={labels.imageDetailsHeb} value={img.detailsHeb} isLong />
                        <DataField label={labels.accessibilityHeb} value={img.accessibilityHeb} isLong />
                        <div className="pt-2 border-t border-orange-100">
                          <DataField label={labels.imageDetailsEng} value={img.detailsEng} isLong />
                          <DataField label={labels.accessibilityEng} value={img.accessibilityEng} isLong />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'shifts':
        return (
          <Card className="border-r-4 border-r-amber-500 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-amber-500" />
                משמרות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {data.shifts.map((shift, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-amber-50 last:border-0">
                    <span className="text-sm">{shift}</span>
                    <CopyButton value={shift} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'unmatched':
        return (
          <Card className="border-r-4 border-r-gray-400 bg-gray-50 shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-gray-500" />
                מידע נוסף שלא סווג
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-2">
                {data.unmatched.length > 0 ? (
                  data.unmatched.map((line, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <p className="flex-1 break-words">• {line}</p>
                      <CopyButton value={line} />
                    </div>
                  ))
                ) : (
                  <p>כל המידע סווג בהצלחה.</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" dir="rtl">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sectionIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-6">
            {sectionIds.map(id => (
              <SortableSection key={id} id={id}>
                {renderSectionContent(id)}
              </SortableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ExhibitionDisplay;