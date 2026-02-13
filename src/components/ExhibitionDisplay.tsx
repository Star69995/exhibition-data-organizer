"use client";

import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import BasicSettingsSection from './sections/BasicSettingsSection';
import DisplayTitlesSection from './sections/DisplayTitlesSection';
import ContentSection from './sections/ContentSection';
import ImagesSection from './sections/ImagesSection';
import SpecialEventsSection from './sections/SpecialEventsSection';

interface Props {
  data: ExhibitionData;
}

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">
      {/* Vix 1: Basic Settings */}
      <BasicSettingsSection data={data} />

      {/* Vix 2: Titles and Dates */}
      <DisplayTitlesSection data={data} />

      {/* Vix 3: Names and Content */}
      <ContentSection data={data} />

      {/* Vix 4: Special Events */}
      <SpecialEventsSection data={data} />

      {/* Image Details for Accessibility */}
      <ImagesSection data={data} />
    </div>
  );
};

export default ExhibitionDisplay;