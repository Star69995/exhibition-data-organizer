"use client";

import React from 'react';
import { Info } from 'lucide-react';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import CopyButton from '../CopyButton';
import { cleanText } from '@/lib/formatter-utils';

interface Props {
  data: ExhibitionData;
}

const ImagesSection: React.FC<Props> = ({ data }) => {
  if (!data.images.length) return null;

  return (
    <CMSSectionWrapper 
      title="פרטי דימויים לנגישות" 
      icon={Info} 
      borderColor="border-t-rose-500" 
      textColor="text-rose-700"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {data.images.map(img => (
          <div key={img.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm space-y-3 transition-colors hover:bg-slate-100/50">
            <div className="flex justify-between items-center font-bold border-b pb-2">
              <span className="text-rose-600">דימוי {img.id}</span>
              <CopyButton value={`${cleanText(img.detailsHeb)}\n${cleanText(img.accessibilityHeb)}`} />
            </div>
            <div className="space-y-1">
              <p><strong className="text-slate-600">עברית:</strong> {cleanText(img.detailsHeb)}</p>
              <p><strong className="text-slate-700 italic">תיאור נגישות:</strong> {cleanText(img.accessibilityHeb)}</p>
              {img.detailsEng && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p><strong className="text-slate-600 font-medium">English:</strong> {cleanText(img.detailsEng)}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CMSSectionWrapper>
  );
};

export default ImagesSection;