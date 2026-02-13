"use client";

import React from 'react';
import { CalendarDays } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { displaySettings } from '@/config/display-settings';

interface Props {
  data: ExhibitionData;
}

const SpecialEventsSection: React.FC<Props> = ({ data }) => {
  const specialEvents = data.events.filter(e => !e.includes('פתיחה')).join('\n') || 'להפריד את המידע עם קו | כזה לפי הצורך';

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 4" 
      icon={CalendarDays} 
      borderColor="border-t-purple-600" 
      textColor="text-purple-800"
      description="אירועים מיוחדים, שיחי גלריה ומידע נוסף"
    >
      <CMSField label={displaySettings.labels.specialEvents} value={specialEvents} isLong />
    </CMSSectionWrapper>
  );
};

export default SpecialEventsSection;