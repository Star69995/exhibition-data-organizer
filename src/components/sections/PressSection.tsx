"use client";

import React from 'react';
import { FileText } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { displaySettings } from '@/config/display-settings';

interface Props {
  data: ExhibitionData;
}

const PressSection: React.FC<Props> = ({ data }) => {
  return (
    <CMSSectionWrapper 
      title="טקסטים להודעה לעיתונות" 
      icon={FileText} 
      borderColor="border-t-emerald-600" 
      textColor="text-emerald-800"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <CMSField label={displaySettings.labels.pressFull} value={data.pressRelease.full} isLong />
        <CMSField label={displaySettings.labels.pressShort} value={data.pressRelease.short} isLong />
      </div>
    </CMSSectionWrapper>
  );
};

export default PressSection;