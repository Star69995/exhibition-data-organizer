"use client";

import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import BasicSettingsSection from './sections/BasicSettingsSection';
import DisplayTitlesSection from './sections/DisplayTitlesSection';
import ContentSection from './sections/ContentSection';
import PressSection from './sections/PressSection';
import ImagesSection from './sections/ImagesSection';
import ExtraInfoSection from './sections/ExtraInfoSection';
import SpecialEventsSection from './sections/SpecialEventsSection';

interface Props {
  data: ExhibitionData;
}

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">
      {/* ויקס 1: הגדרות בסיסיות */}
      <BasicSettingsSection data={data} />

      {/* ויקס 2: כותרות ותאריכים */}
      <DisplayTitlesSection data={data} />

      {/* ויקס 3: שמות ותוכן */}
      <ContentSection data={data} />

      {/* ויקס 4: אירועים מיוחדים */}
      <SpecialEventsSection data={data} />

      {/* טקסטים להודעה לעיתונות */}
      <PressSection data={data} />

      {/* נתונים נוספים ומשמרות */}
      <ExtraInfoSection data={data} />

      {/* פרטי דימויים */}
      <ImagesSection data={data} />
    </div>
  );
};

export default ExhibitionDisplay;