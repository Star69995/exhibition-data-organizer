"use client";

import React from 'react';
import { Users } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { formatArtistNames, formatArtistNamesEng, formatDateWithDots, cleanText } from '@/lib/formatter-utils';

interface Props {
  data: ExhibitionData;
  isMale: boolean;
}

const ContentSection: React.FC<Props> = ({ data, isMale }) => {
  const artistsHeb = formatArtistNames(data.artists);
  const artistsEng = formatArtistNamesEng(data.artists);
  
  const curatorRoleHeb = isMale ? "אוצר" : "אוצרת";
  const curatorNameHeb = cleanText(data.curator.nameHeb);
  const curatorNameEng = cleanText(data.curator.nameEng);
  
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const openingEventHeb = `אירוע פתיחה: ${openDate}`;
  const openingEventEng = `Opening event: ${openDate}`;

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 3" 
      icon={Users} 
      borderColor="border-t-indigo-600" 
      textColor="text-indigo-800"
      description="פרטי אמנים, אוצרים ואירוע פתיחה"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <CMSField label="שם | שם בעברית (אמנים)" value={artistsHeb} />
        <CMSField label="Name | Name in English (Artists)" value={artistsEng} />
        
        <CMSField label="שם האוצר (עברית)" value={`${curatorRoleHeb}: ${curatorNameHeb}`} />
        <CMSField label="Curator Name (English)" value={`Curator: ${curatorNameEng}`} />
        
        <CMSField label="אירוע פתיחה (עברית)" value={openingEventHeb} />
        <CMSField label="Opening Event (English)" value={openingEventEng} />
      </div>
    </CMSSectionWrapper>
  );
};

export default ContentSection;