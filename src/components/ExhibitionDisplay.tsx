"use client";

import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Layout, FileText, Users, CalendarDays, Info } from 'lucide-react';
import { displaySettings } from '@/config/display-settings';
import CopyButton from './CopyButton';

interface Props {
  data: ExhibitionData;
}

const CMSField = ({ label, value, description, isLong = false }: { label: string, value: string, description?: string, isLong?: boolean }) => {
  if (!value && !isLong) return null;
  return (
    <div className="group flex flex-col gap-1.5 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <CopyButton value={value} />
      </div>
      {description && <p className="text-xs text-slate-400 mb-1">{description}</p>}
      <div className={`p-3 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-900 ${isLong ? 'min-h-[80px] whitespace-pre-wrap text-justify leading-relaxed' : 'break-all'}`}>
        {value || <span className="text-slate-300 italic">אין נתונים</span>}
      </div>
    </div>
  );
};

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  const { labels } = displaySettings;

  // פונקציה להמרת תאריך לפורמט YYMMDD
  const formatCatalogOrder = (dateStr: string) => {
    if (!dateStr) return '';
    // מנסה לחלץ מספרים מהתאריך (תומך ב-DD.MM.YYYY או DD/MM/YY וכו')
    const parts = dateStr.match(/\d+/g);
    if (!parts || parts.length < 3) return '';
    
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    let year = parts[2];
    
    // אם השנה היא 4 ספרות, לוקחים רק את ה-2 האחרונות
    if (year.length === 4) year = year.substring(2);
    else year = year.padStart(2, '0');
    
    return `${year}${month}${day}`;
  };

  // חישוב שדות מורכבים
  const catalogOrder = formatCatalogOrder(data.exhibition.openDate);
  const slug = data.exhibition.titleEng.toLowerCase().replace(/\s+/g, '-');
  const galleryCaption = `${data.exhibition.titleHeb} | אוצרת: ${data.curator.nameHeb} | ${data.exhibition.openDate}`;
  const artistNamesFormatted = data.artists.map(a => a.nameHeb).join(' | ');
  const curatorFormatted = data.curator.nameHeb ? `אוצרת: ${data.curator.nameHeb}` : '';
  
  const openingEvent = data.unmatched.find(l => l.includes('פתיחה') || l.includes('אירוע')) || '';
  const specialEvents = data.unmatched.filter(l => (l.includes('שיח') || l.includes('סיור'))).join('\n') || '';

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
          <CMSField label={labels.dates} value={`${data.exhibition.openDate}-${data.exhibition.closeDate}`} />
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
            description="להפריד שם של כל אמן עם קו | כזה ולשים עוד קו בסוף המשפט" 
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

      {/* קבוצה 4: טקסטים ודימויים (לצרכי העתקה כלליים) */}
      <Card className="shadow-md border-t-4 border-t-green-500">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-green-700">
            <FileText className="h-5 w-5" />
            טקסטים להודעה לעיתונות ודימויים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CMSField label={labels.pressFull} value={data.pressRelease.full} isLong />
            <CMSField label={labels.pressShort} value={data.pressRelease.short} isLong />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2"><Info className="h-4 w-4" /> פרטי דימויים לנגישות:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.images.map(img => (
                <div key={img.id} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>דימוי {img.id}</span>
                    <CopyButton value={`${img.detailsHeb}\n${img.accessibilityHeb}`} />
                  </div>
                  <p><strong>עברית:</strong> {img.detailsHeb}</p>
                  <p><strong>נגישות:</strong> {img.accessibilityHeb}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ExhibitionDisplay;