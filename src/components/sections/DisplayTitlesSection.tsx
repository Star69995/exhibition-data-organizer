"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { formatDateWithDots, toUpperCase, cleanText } from '@/lib/formatter-utils';
import { displaySettings } from '@/config/display-settings';

interface Props {
  data: ExhibitionData;
}

const DisplayTitlesSection: React.FC<Props> = ({ data }) => {
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const closeDate = formatDateWithDots(data.exhibition.closeDate);
  const datesRange = `${openDate}-${closeDate}`;
  
  // Hebrew Caption: Title | Curator: Name | Date (No trailing dots)
  const curatorLabel = "אוצרת"; // In real app, this should sync with the switch in ContentSection, but for CMS display we follow the rule
  const galleryCaptionHeb = `${cleanText(data.exhibition.titleHeb)} | ${curatorLabel}: ${cleanText(data.curator.nameHeb)} | ${openDate}`;
  
  // English Caption: Title | Curator: Name | Date
  const galleryCaptionEng = `${toUpperCase(data.exhibition.titleEng)} | Curator: ${cleanText(data.curator.nameEng)} | ${openDate}`;

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 2" 
      icon={ImageIcon} 
      borderColor="border-t-blue-600" 
      textColor="text-blue-800"
      description="כותרות ותצוגה חזותית בגלריה"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <CMSField label="כותרת גלריה (עברית)" value={galleryCaptionHeb} />
        <CMSField label="Gallery Caption (English)" value={galleryCaptionEng} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-2">
        <CMSField label={`${displaySettings.labels.titleLarge} - שחור`} value={data.exhibition.titleHeb} />
        <CMSField label={`${displaySettings.labels.titleSmall} - שחור`} value={toUpperCase(data.exhibition.titleEng)} />
        <CMSField label={`${displaySettings.labels.dates} - שחור`} value={datesRange} />
        
        <CMSField label={`${displaySettings.labels.titleLarge} - לבן`} value={data.exhibition.titleHeb} />
        <CMSField label={`${displaySettings.labels.titleSmall} - לבן`} value={toUpperCase(data.exhibition.titleEng)} />
        <CMSField label={`${displaySettings.labels.dates} - לבן`} value={datesRange} />
      </div>
    </CMSSectionWrapper>
  );
};

export default DisplayTitlesSection;