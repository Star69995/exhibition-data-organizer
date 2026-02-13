"use client";

import React, { useState } from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import BasicSettingsSection from './sections/BasicSettingsSection';
import DisplayTitlesSection from './sections/DisplayTitlesSection';
import ContentSection from './sections/ContentSection';
import ImagesSection from './sections/ImagesSection';
import SpecialEventsSection from './sections/SpecialEventsSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Props {
  data: ExhibitionData;
}

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  const [isMale, setIsMale] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">
      {/* Global Gender Control */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between sticky top-4 z-20 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4">
          <Label htmlFor="global-gender" className="font-bold text-slate-700">מגדר האוצר.ת:</Label>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${!isMale ? 'font-bold text-primary' : 'text-slate-400'}`}>אוצרת</span>
            <Switch 
              id="global-gender" 
              checked={isMale} 
              onCheckedChange={setIsMale}
            />
            <span className={`text-xs ${isMale ? 'font-bold text-primary' : 'text-slate-400'}`}>אוצר</span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          משפיע על כותרות הגלריה ותיאורי ה-CMS
        </div>
      </div>

      {/* Vix 1: Basic Settings */}
      <BasicSettingsSection data={data} />

      {/* Vix 2: Titles and Dates */}
      <DisplayTitlesSection data={data} isMale={isMale} />

      {/* Vix 3: Names and Content */}
      <ContentSection data={data} isMale={isMale} />

      {/* Vix 4: Special Events */}
      <SpecialEventsSection data={data} />

      {/* Image Details for Accessibility */}
      <ImagesSection data={data} />
    </div>
  );
};

export default ExhibitionDisplay;