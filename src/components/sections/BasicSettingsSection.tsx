"use client";

import React from 'react';
import { Layout } from 'lucide-react';
import CMSField from '../CMSField';
import CMSSectionWrapper from './CMSSectionWrapper';
import { ExhibitionData } from '@/lib/parser-utils';
import { formatSlug, formatCatalogOrder } from '@/lib/formatter-utils';
import { displaySettings } from '@/config/display-settings';

interface Props {
  data: ExhibitionData;
}

const BasicSettingsSection: React.FC<Props> = ({ data }) => {
  const slug = formatSlug(data.exhibition.titleEng);
  const catalogOrder = formatCatalogOrder(data.exhibition.openDate);

  return (
    <CMSSectionWrapper 
      title="Wix CMS - ויקס 1" 
      icon={Layout} 
      borderColor="border-t-sky-500" 
      textColor="text-sky-700"
      description="הגדרות בסיסיות של דף התערוכה"
    >
      <CMSField label={displaySettings.labels.slug} value={slug} description="סיומת מקוצרת של הלינק (באנגלית)" />
      <CMSField label={displaySettings.labels.googleTitle} value={data.exhibition.titleHeb} description="שם התערוכה כפי שיוצג בתוצאות החיפוש" />
      <CMSField label={displaySettings.labels.catalogOrder} value={catalogOrder} description="פורמט תאריכי YYMMDD" />
    </CMSSectionWrapper>
  );
};

export default BasicSettingsSection;