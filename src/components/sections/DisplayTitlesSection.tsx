"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { formatDateWithDots } from '@/lib/formatter-utils';
import { displaySettings } from '@/config/display-settings';

interface Props {
  data: ExhibitionData;
}

const DisplayTitlesSection: React.FC<Props> = ({ data }) => {
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const closeDate = formatDateWithDots(data.exhibition.closeDate);
  const galleryCaption = `${data.exhibition.titleHeb} | אוצרת: ${data.curator.nameHeb} | ${openDate}`;
  const datesRange = `${openDate}-${closeDate}`;

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 2" 
      icon={ImageIcon} 
      borderColor="border-t-blue-600" 
      textColor="text-blue-800"
      description="כותרות ותצוגה חזותית בגלריה"
    >
      <CMSField label={displaySettings.labels.galleryCaption} value={galleryCaption} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <CMSField label={`${displaySettings.labels.titleLarge} - שחור`} value={data.exhibition.titleHeb} />
        <CMSField label={`${displaySettings.labels.titleSmall} - שחור`} value={data.exhibition.titleEng} />
        <CMSField label={`${displaySettings.labels.dates} - שחור`} value={datesRange} />
        <CMSField label={`${displaySettings.labels.titleLarge} - לבן`} value={data.exhibition.titleHeb} />
        <CMSField label={`${displaySettings.labels.titleSmall} - לבן`} value={data.exhibition.titleEng} />
        <CMSField label={`${displaySettings.labels.dates} - לבן`} value={datesRange} />
      </div>
    </CMSSectionWrapper>
  );
};

export default DisplayTitlesSection;