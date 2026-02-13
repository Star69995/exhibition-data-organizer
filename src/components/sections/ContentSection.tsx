"use client";

import React from 'react';
import { Users } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { formatArtistNames, formatDateWithDots } from '@/lib/formatter-utils';
import { displaySettings } from '@/config/display-settings';

interface Props {
  data: ExhibitionData;
}

const ContentSection: React.FC<Props> = ({ data }) => {
  const artistsFormatted = formatArtistNames(data.artists);
  const curatorFormatted = data.curator.nameHeb ? `אוצרת: ${data.curator.nameHeb}` : '';
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const openingEvent = data.events.find(e => e.includes('פתיחה')) || `אירוע פתיחה: יום חמישי ${openDate} משעה 19:30`;

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 3" 
      icon={Users} 
      borderColor="border-t-indigo-600" 
      textColor="text-indigo-800"
      description="פרטי אמנים, אוצרים ואירוע פתיחה"
    >
      <CMSField label={displaySettings.labels.artistNames} value={artistsFormatted} isLong />
      <CMSField label={displaySettings.labels.curatorName} value={curatorFormatted} isLong />
      <CMSField label={displaySettings.labels.informativeInfo} value={openingEvent} isLong />
    </CMSSectionWrapper>
  );
};

export default ContentSection;