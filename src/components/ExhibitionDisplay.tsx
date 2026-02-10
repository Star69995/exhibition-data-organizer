"use client";

import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Layout, FileText, Users, CalendarDays, Info, AlertCircle } from 'lucide-react';
import { displaySettings } from '@/config/display-settings';
import CopyButton from './CopyButton';

interface Props {
  data: ExhibitionData;
}

const CMSField = ({ label, value, description, isLong = false }: { label: string, value: string, description?: string, isLong?: boolean }) => {
  // ניקוי ירידות שורה ורווחים מהתחלה ומהסוף
  const trimmedValue = value?.trim() || '';
  
  if (!trimmedValue && !isLong) return null;
  
  return (
    <div className="group flex flex-col gap-1.5 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <CopyButton value={trimmedValue} />
      </div>
      {description && <p className="text-xs text-slate-400 mb-1">{description}</p>}
      <div className={`p-3 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-900 ${isLong ? 'min-h-[80px] whitespace-pre-wrap text-justify leading-relaxed' : 'break-all'}`}>
        {trimmedValue || <span className="text-slate-300 italic">אין נתונים</span>}
      </div>
    </div>
  );
};

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  const { labels } = displaySettings;

  const formatDateWithDots = (dateStr: string) => {
    return dateStr.replace(/\//g, '.');
  };

  const formatCatalogOrder = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.match(/\d+/g);
    if (!parts || parts.length < 3) return '';
    
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    let year = parts[2];
    
    if (year.length === 4) year = year.substring(2);
    else year = year.padStart(2, '0');
    
    return `${year}${month}${day}`;
  };

  const catalogOrder = formatCatalogOrder(data.exhibition.openDate);
  const slug = data.exhibition.titleEng.toLowerCase().replace(/\s+/g, '-');
  const openDateDots = formatDateWithDots(data.exhibition.openDate);
  const closeDateDots = formatDateWithDots(data.exhibition.closeDate);
  
  const galleryCaption = `${data.exhibition.titleHeb} | אוצרת: ${data.curator.nameHeb} | ${openDateDots}`;
  
  const artistNamesFormatted = data.artists.length > 0 
    ? data.artists.map(a => a.nameHeb).join(' | ') + ' |'
    : '';
    
  const curatorFormatted = data.curator.nameHeb ? `אוצרת: ${data.curator.nameHeb}` : '';
  
  // זיהוי אירועים מתוך הטקסט שלא סווג
  const openingEvent = data.unmatched.find(l => l.includes('פתיחה') || l.includes('אירוע')) || '';
  
  // שיפור זיהוי אירועים מיוחדים (שיח, הופעה, סיור וכו')
  const eventKeywords = ['שיח', 'סיור', 'הופעה', 'מפגש', 'סדנה'];
  const specialEvents = data.unmatched
    .filter(l => eventKeywords.some(key => l.includes(key)))
    .join('\n')
    .trim();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">
      
      {/* קבוצה 1: הגדרות דף ותצוגה (ויקס 1+2) */}
      <Card className="shadow-md border-t-4 border-t-blue-500">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
            <Layout className="h-5 w-5" />
            הגדרות דף ותצוגה (Wix CMS)
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <CMSField label={labels.slug} value={slug} description="סיומת מקוצרת של הלינק (באנגלית)" />
          <CMSField label={labels.googleTitle} value={data.exhibition.titleHeb} description="בעברית ומולטי-לינגואל לתרגום לאנגלית" />
          <CMSField label={labels.catalogOrder} value={catalogOrder} description="פורמט: YYMMDD (לפי תאריך פתיחה)" />
          <CMSField label={labels.galleryCaption} value={galleryCaption} description="שם התערוכה | אוצר: שם מלא | תאריך" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <CMSField label={labels.titleLarge + " - שחור/לבן"} value={data.exhibition.titleHeb} />
            <CMSField label={labels.titleSmall + " - שחור/לבן"} value={data.exhibition.titleEng} />
          </div>
          <CMSField label={labels.dates} value={`${openDateDots}-${closeDateDots}`} />
        </CardContent>
      </Card>

      {/* קבוצה 2: שמות ותוכן (ויקס 3) */}
      <Card className="shadow-md border-t-4 border-t-purple-500">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
            <Users className="h-5 w-5" />
            שמות ותוכן אינפורמטיבי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CMSField 
            label={labels.artistNames} 
            value={artistNamesFormatted} 
            description="שמות בעברית בלבד, מופרדים ב-| עם קו בסוף" 
            isLong 
          />
          <CMSField label={labels.curatorName} value={curatorFormatted} isLong />
          <CMSField label={labels.informativeInfo} value={openingEvent} isLong />
        </CardContent>
      </Card>

      {/* קבוצה 3: אירועים ומידע נוסף (ויקס 4) */}
      <Card className="shadow-md border-t-4 border-t-amber-500">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-amber-700">
            <CalendarDays className="h-5 w-5" />
            אירועים ומידע נוסף
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CMSField 
            label={labels.specialEvents} 
            value={specialEvents} 
            description="להפריד את המידע עם קו | כזה לפי הצורך" 
            isLong 
          />
        </CardContent>
      </Card>

      {/* קבוצה 4: טקסטים להודעה לעיתונות */}
      <Card className="shadow-md border-t-4 border-t-green-500">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-green-700">
            <FileText className="h-5 w-5" />
            טקסטים להודעה לעיתונות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CMSField label={labels.pressFull} value={data.pressRelease.full} isLong />
            <CMSField label={labels.pressShort} value={data.pressRelease.short} isLong />
          </div>
        </CardContent>
      </Card>

      {/* קבוצה 5: נתונים שלא סווגו (גיבוי) */}
      {data.unmatched.length > 0 && (
        <Card className="shadow-md border-t-4 border-t-slate-400 bg-slate-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-600">
              <AlertCircle className="h-5 w-5" />
              נתונים שלא סווגו (טקסט גולמי נוסף)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.unmatched.map((line, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-slate-100 text-sm">
                  <span className="truncate ml-4">{line}</span>
                  <CopyButton value={line} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* קבוצה 6: פרטי דימויים (אחרון) */}
      <Card className="shadow-md border-t-4 border-t-rose-500">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-rose-700">
            <Info className="h-5 w-5" />
            פרטי דימויים לנגישות
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.images.map(img => (
              <div key={img.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm space-y-3">
                <div className="flex justify-between items-center font-bold border-b pb-2">
                  <span className="text-rose-600">דימוי {img.id}</span>
                  <CopyButton value={`${img.detailsHeb}\n${img.accessibilityHeb}`} />
                </div>
                <div className="space-y-2">
                  <p><strong className="text-slate-600">עברית:</strong> {img.detailsHeb}</p>
                  <p><strong className="text-slate-600">נגישות:</strong> {img.accessibilityHeb}</p>
                </div>
              </div>
            ))}
            {data.images.length === 0 && (
              <p className="text-slate-400 italic text-center col-span-full py-4">לא נמצאו פרטי דימויים</p>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ExhibitionDisplay;