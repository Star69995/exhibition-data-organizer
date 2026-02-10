"use client";

import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, FileText, Users, CalendarDays, Info, AlertCircle } from 'lucide-react';
import { displaySettings } from '@/config/display-settings';
import CMSField from './CMSField';
import CopyButton from './CopyButton';
import { 
  formatDateWithDots, 
  formatCatalogOrder, 
  formatArtistNames, 
  formatSlug,
  cleanText
} from '@/lib/formatter-utils';

interface Props {
  data: ExhibitionData;
}

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  const { labels } = displaySettings;

  // הכנת הנתונים המפורמטים מראש
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const closeDate = formatDateWithDots(data.exhibition.closeDate);
  const catalogOrder = formatCatalogOrder(data.exhibition.openDate);
  const slug = formatSlug(data.exhibition.titleEng);
  const galleryCaption = `${data.exhibition.titleHeb} | אוצרת: ${data.curator.nameHeb} | ${openDate}`;
  const artistsFormatted = formatArtistNames(data.artists);
  const curatorFormatted = data.curator.nameHeb ? `אוצרת: ${data.curator.nameHeb}` : '';
  
  // לוגיקת זיהוי אירועים
  const eventKeywords = ['שיח', 'סיור', 'הופעה', 'מפגש', 'סדנה', 'פתיחה', 'אירוע'];
  const detectedEvents = data.unmatched
    .filter(line => eventKeywords.some(key => line.includes(key)))
    .join('\n');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">
      
      {/* קבוצה 1: הגדרות דף */}
      <Card className="shadow-md border-t-4 border-t-blue-500 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
            <Layout className="h-5 w-5" />
            הגדרות דף ותצוגה
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <CMSField label={labels.slug} value={slug} description="סיומת הלינק" />
          <CMSField label={labels.googleTitle} value={data.exhibition.titleHeb} />
          <CMSField label={labels.catalogOrder} value={catalogOrder} description="YYMMDD" />
          <CMSField label={labels.galleryCaption} value={galleryCaption} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <CMSField label={labels.titleLarge} value={data.exhibition.titleHeb} />
            <CMSField label={labels.titleSmall} value={data.exhibition.titleEng} />
          </div>
          <CMSField label={labels.dates} value={`${openDate}-${closeDate}`} />
        </CardContent>
      </Card>

      {/* קבוצה 2: תוכן ומשתתפים */}
      <Card className="shadow-md border-t-4 border-t-purple-500 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
            <Users className="h-5 w-5" />
            שמות ותוכן אינפורמטיבי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CMSField label={labels.artistNames} value={artistsFormatted} isLong />
          <CMSField label={labels.curatorName} value={curatorFormatted} />
          <CMSField label={labels.informativeInfo} value={detectedEvents} isLong />
        </CardContent>
      </Card>

      {/* קבוצה 3: הודעה לעיתונות */}
      <Card className="shadow-md border-t-4 border-t-green-500 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-green-700">
            <FileText className="h-5 w-5" />
            טקסטים להודעה לעיתונות
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <CMSField label={labels.pressFull} value={data.pressRelease.full} isLong />
          <CMSField label={labels.pressShort} value={data.pressRelease.short} isLong />
        </CardContent>
      </Card>

      {/* קבוצה 4: נתונים שלא סווגו */}
      {data.unmatched.length > 0 && (
        <Card className="shadow-md border-t-4 border-t-slate-400 bg-slate-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-600">
              <AlertCircle className="h-5 w-5" />
              מידע נוסף מהקובץ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.unmatched.map((line, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100 text-sm">
                <span className="truncate ml-4">{line}</span>
                <CopyButton value={line} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* קבוצה 5: פרטי דימויים (אחרון) */}
      <Card className="shadow-md border-t-4 border-t-rose-500 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-rose-700">
            <Info className="h-5 w-5" />
            פרטי דימויים לנגישות
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {data.images.map(img => (
            <div key={img.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm space-y-3">
              <div className="flex justify-between items-center font-bold border-b pb-2">
                <span className="text-rose-600">דימוי {img.id}</span>
                <CopyButton value={`${cleanText(img.detailsHeb)}\n${cleanText(img.accessibilityHeb)}`} />
              </div>
              <p><strong className="text-slate-600">עברית:</strong> {cleanText(img.detailsHeb)}</p>
              <p><strong className="text-slate-600">נגישות:</strong> {cleanText(img.accessibilityHeb)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default ExhibitionDisplay;