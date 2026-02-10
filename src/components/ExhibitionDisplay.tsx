"use client";

import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, FileText, Users, CalendarDays, Info, AlertCircle, Image as ImageIcon } from 'lucide-react';
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
  const openDate = formatDateWithDots(data.exhibition.openDate);
  const closeDate = formatDateWithDots(data.exhibition.closeDate);
  const catalogOrder = formatCatalogOrder(data.exhibition.openDate);
  const slug = formatSlug(data.exhibition.titleEng);
  
  const artistsFormatted = formatArtistNames(data.artists);
  const curatorFormatted = data.curator.nameHeb ? `אוצרת: ${data.curator.nameHeb}` : '';
  const galleryCaption = `${data.exhibition.titleHeb} | אוצרת: ${data.curator.nameHeb} | ${openDate}`;
  
  const openingEvent = data.events.find(e => e.includes('פתיחה')) || `אירוע פתיחה: יום חמישי ${openDate} משעה 19:30`;
  const specialEvents = data.events.filter(e => !e.includes('פתיחה')).join('\n') || 'להפריד את המידע עם קו | כזה לפי הצורך';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" dir="rtl">
      
      {/* ויקס 1: הגדרות בסיסיות */}
      <Card className="shadow-md border-t-4 border-t-sky-500 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-sky-700 font-bold">
            <Layout className="h-5 w-5" />
            Wix CMS - הגדרות דף
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <CMSField label="Slug" value={slug} description="סיומת מקוצרת של הלינק (באנגלית)" />
          <CMSField label="שם התערוכה לגוגל" value={data.exhibition.titleHeb} description="בעברית ומולטי-לינגואל לתרגום לאנגלית" />
          <CMSField label="סדר הופעה בקטלוג" value={catalogOrder} description="YYMMDD" />
        </CardContent>
      </Card>

      {/* ויקס 2: כותרות ותאריכים */}
      <Card className="shadow-md border-t-4 border-t-blue-600 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-800 font-bold">
            <ImageIcon className="h-5 w-5" />
            Wix CMS - תצוגה וכותרות
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <CMSField label="כותרת מתחת לתמונה בגלריה בקטלוג" value={galleryCaption} description="שם התערוכה | אוצר: שם מלא | תאריך" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <CMSField label="שם התערוכה כותרת גדולה - שחור" value={data.exhibition.titleHeb} />
            <CMSField label="שם התערוכה כותרת קטנה - שחור" value={data.exhibition.titleEng} />
            <CMSField label="תאריכים - שחור" value={`${openDate}-${closeDate}`} />
            <CMSField label="שם התערוכה כותרת גדולה - לבן" value={data.exhibition.titleHeb} />
            <CMSField label="שם התערוכה כותרת קטנה - לבן" value={data.exhibition.titleEng} />
            <CMSField label="תאריכים - לבן" value={`${openDate}-${closeDate}`} />
          </div>
        </CardContent>
      </Card>

      {/* ויקס 3: שמות ותוכן */}
      <Card className="shadow-md border-t-4 border-t-indigo-600 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-indigo-800 font-bold">
            <Users className="h-5 w-5" />
            Wix CMS - שמות ותוכן
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <CMSField label="שמות האמנים" value={artistsFormatted} description="להפריד שם של כל אמן עם קו | כזה ולשים עוד קו בסוף המשפט" isLong />
          <CMSField label="שם האוצר" value={curatorFormatted} isLong />
          <CMSField label="מידע אינפורמטיבי" value={openingEvent} description="אירוע פתיחה ותאריך" isLong />
        </CardContent>
      </Card>

      {/* ויקס 4: אירועים מיוחדים */}
      <Card className="shadow-md border-t-4 border-t-purple-600 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-purple-800 font-bold">
            <CalendarDays className="h-5 w-5" />
            Wix CMS - אירוע מיוחד
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CMSField label="אירוע מיוחד / מידע נוסף" value={specialEvents} description="להפריד את המידע עם קו | כזה לפי הצורך" isLong />
        </CardContent>
      </Card>

      {/* טקסטים להודעה לעיתונות */}
      <Card className="shadow-md border-t-4 border-t-emerald-600 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-800 font-bold">
            <FileText className="h-5 w-5" />
            טקסטים להודעה לעיתונות
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <CMSField label="הודעה לעיתונות מלאה" value={data.pressRelease.full} isLong />
          <CMSField label="טקסט מקוצר" value={data.pressRelease.short} isLong />
        </CardContent>
      </Card>

      {/* נתונים נוספים ומשמרות */}
      <Card className="shadow-md border-t-4 border-t-slate-400 bg-slate-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-600 font-bold">
            <AlertCircle className="h-5 w-5" />
            נתונים נוספים ומשמרות
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-500">תאריכי משמרות:</h4>
            <div className="bg-white p-3 rounded border border-slate-200 text-sm whitespace-pre-wrap">
              {data.shifts.join('\n')}
              <div className="mt-2 flex justify-end">
                <CopyButton value={data.shifts.join('\n')} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-500">פרטי קשר ואינסטגרם:</h4>
            {data.artists.map((a, i) => (
              <div key={i} className="bg-white p-3 rounded border border-slate-200 text-xs flex justify-between items-center">
                <span>{a.nameHeb}: {a.instagram} | {a.website}</span>
                <CopyButton value={`${a.nameHeb} - ${a.instagram} - ${a.website}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* פרטי דימויים */}
      <Card className="shadow-md border-t-4 border-t-rose-500 overflow-hidden">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg text-rose-700 font-bold">
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
              <div className="space-y-1">
                <p><strong className="text-slate-600">עברית:</strong> {cleanText(img.detailsHeb)}</p>
                <p><strong className="text-slate-600 italic">נגישות:</strong> {cleanText(img.accessibilityHeb)}</p>
                {img.detailsEng && <p className="mt-2 pt-2 border-t border-slate-200"><strong className="text-slate-600">English:</strong> {cleanText(img.detailsEng)}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default ExhibitionDisplay;