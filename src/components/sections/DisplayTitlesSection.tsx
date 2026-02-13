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
  isMale: boolean;
}

const DisplayTitlesSection: React.FC<Props> = ({ data, isMale }) => {
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const closeDate = formatDateWithDots(data.exhibition.closeDate);
  const datesRange = `${openDate}-${closeDate}`;
  
  const curatorPrefix = isMale ? "אוצר" : "אוצרת";
  
  // Clean values for caption
  const titleHeb = cleanText(data.exhibition.titleHeb);
  const curatorHeb = cleanText(data.curator.nameHeb);
  const titleEng = toUpperCase(cleanText(data.exhibition.titleEng));
  const curatorEng = cleanText(data.curator.nameEng);

  // Hebrew Caption: Title | Role: Name | Date
  const galleryCaptionHeb = `${titleHeb} | ${curatorPrefix}: ${curatorHeb} | ${openDate}`;
  
  // English Caption: TITLE | Curator: Name | Date
  const galleryCaptionEng = `${titleEng} | Curator: ${curatorEng} | ${openDate}`;

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
        <CMSField label={`${displaySettings.labels.titleLarge} - שחור`} value={titleHeb} />
        <CMSField label={`${displaySettings.labels.titleSmall} - שחור`} value={titleEng} />
        <CMSField label={`${displaySettings.labels.dates} - שחור`} value={datesRange} />
        
        <CMSField label={`${displaySettings.labels.titleLarge} - לבן`} value={titleHeb} />
        <CMSField label={`${displaySettings.labels.titleSmall} - לבן`} value={titleEng} />
        <CMSField label={`${displaySettings.labels.dates} - לבן`} value={datesRange} />
      </div>
    </CMSSectionWrapper>
  );
};

export default DisplayTitlesSection;