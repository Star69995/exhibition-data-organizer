"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import CopyButton from '../CopyButton';

interface Props {
  data: ExhibitionData;
}

const ExtraInfoSection: React.FC<Props> = ({ data }) => {
  return (
    <CMSSectionWrapper 
      title="נתונים נוספים ומשמרות" 
      icon={AlertCircle} 
      borderColor="border-t-slate-400" 
      textColor="text-slate-600"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-500">תאריכי משמרות:</h4>
          <div className="bg-white p-3 rounded border border-slate-200 text-sm whitespace-pre-wrap min-h-[100px] relative">
            {data.shifts.length > 0 ? data.shifts.join('\n') : 'לא נמצאו נתוני משמרות'}
            <div className="absolute top-2 left-2">
              <CopyButton value={data.shifts.join('\n')} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-500">פרטי קשר ואינסטגרם:</h4>
          <div className="space-y-2">
            {data.artists.map((a, i) => (
              <div key={i} className="bg-white p-3 rounded border border-slate-200 text-xs flex justify-between items-center transition-colors hover:border-slate-300">
                <span className="font-medium">{a.nameHeb}: <span className="text-slate-500">{a.instagram || 'אין אינסטגרם'} | {a.website || 'אין אתר'}</span></span>
                <CopyButton value={`${a.nameHeb} - ${a.instagram || ''} - ${a.website || ''}`} />
              </div>
            ))}
            {data.artists.length === 0 && <p className="text-xs text-slate-400 italic">לא נמצאו פרטי אמנים</p>}
          </div>
        </div>
      </div>
    </CMSSectionWrapper>
  );
};

export default ExtraInfoSection;