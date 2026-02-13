"use client";

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { formatArtistNames, formatArtistNamesEng, formatDateWithDots, cleanText } from '@/lib/formatter-utils';
import { displaySettings } from '@/config/display-settings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Props {
  data: ExhibitionData;
}

const ContentSection: React.FC<Props> = ({ data }) => {
  const [isMale, setIsMale] = useState(data.curator.gender === 'male');
  
  const artistsHeb = formatArtistNames(data.artists);
  const artistsEng = formatArtistNamesEng(data.artists);
  
  const curatorLabel = isMale ? "אוצר" : "אוצרת";
  const curatorLabelEng = isMale ? "Curator" : "Curator"; // English usually gender neutral
  
  const curatorFormatted = data.curator.nameHeb ? `${curatorLabel}: ${cleanText(data.curator.nameHeb)}` : '';
  const curatorFormattedEng = data.curator.nameEng ? `${curatorLabelEng}: ${cleanText(data.curator.nameEng)}` : '';
  
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const openingEventHeb = `אירוע פתיחה: יום חמישי ${openDate} משעה 19:30`;
  const openingEventEng = `Opening event: Thursday ${openDate} from 19:30`;

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 3" 
      icon={Users} 
      borderColor="border-t-indigo-600" 
      textColor="text-indigo-800"
      description="פרטי אמנים, אוצרים ואירוע פתיחה"
    >
      <div className="py-4 flex items-center gap-4 bg-indigo-50/50 px-4 rounded-md mb-4 border border-indigo-100">
        <Label htmlFor="gender-toggle" className="font-bold text-indigo-900">מגדר האוצר.ת:</Label>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${!isMale ? 'font-bold' : 'text-slate-400'}`}>אוצרת</span>
          <Switch 
            id="gender-toggle" 
            checked={isMale} 
            onCheckedChange={setIsMale}
          />
          <span className={`text-xs ${isMale ? 'font-bold' : 'text-slate-400'}`}>אוצר</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <CMSField label="שמות האמנים (עברית)" value={artistsHeb} />
        <CMSField label="Artist Names (English)" value={artistsEng} />
        
        <CMSField label="שם האוצר (עברית)" value={curatorFormatted} />
        <CMSField label="Curator Name (English)" value={curatorFormattedEng} />
        
        <CMSField label="אירוע פתיחה (עברית)" value={openingEventHeb} />
        <CMSField label="Opening Event (English)" value={openingEventEng} />
      </div>
    </CMSSectionWrapper>
  );
};

export default ContentSection;