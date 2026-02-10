import React from 'react';
import { ExhibitionData } from '@/lib/parser-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Image as ImageIcon, FileText, Clock, Info } from 'lucide-react';

interface Props {
  data: ExhibitionData;
}

const ExhibitionDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      {/* כותרת ראשית */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">{data.exhibition.titleHeb || 'תערוכה חדשה'}</h1>
        <p className="text-xl text-muted-foreground italic">{data.exhibition.titleEng}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge variant="outline" className="text-lg py-1 px-4">
            <Calendar className="ml-2 h-4 w-4" />
            {data.exhibition.openDate} - {data.exhibition.closeDate}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* אוצר */}
        <Card className="border-r-4 border-r-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              אוצר.ת
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>שם:</strong> {data.curator.nameHeb} ({data.curator.nameEng})</p>
            <p><strong>טלפון:</strong> {data.curator.phone}</p>
            <p><strong>מייל:</strong> {data.curator.email}</p>
            {data.curator.instagram && <p><strong>אינסטגרם:</strong> @{data.curator.instagram.replace('@', '')}</p>}
            {data.curator.website && <p><strong>אתר:</strong> <a href={data.curator.website} target="_blank" className="text-blue-600 underline">{data.curator.website}</a></p>}
          </CardContent>
        </Card>

        {/* אמנים */}
        <Card className="border-r-4 border-r-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              אמנים משתתפים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.artists.map((artist, i) => (
              <div key={i} className="pb-2 border-b last:border-0">
                <p className="font-bold">{artist.nameHeb} / {artist.nameEng}</p>
                <p className="text-sm text-muted-foreground">{artist.email} | {artist.phone}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* הודעה לעיתונות */}
      <Card className="border-r-4 border-r-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            טקסט לתערוכה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-bold mb-2 text-green-700">הודעה לעיתונות:</h4>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{data.pressRelease.full}</p>
          </div>
          {data.pressRelease.short && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-green-700">טקסט מקוצר:</h4>
              <p className="text-sm italic">{data.pressRelease.short}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* דימויים */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-orange-500" />
          דימויים (קטלוג)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.images.map((img) => (
            <Card key={img.id} className="bg-orange-50/30">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-orange-500">{img.id}</Badge>
                  <div className="space-y-2">
                    <p><strong>עברית:</strong> {img.detailsHeb}</p>
                    <p className="text-xs text-muted-foreground">נגישות: {img.accessibilityHeb}</p>
                    <div className="pt-2 border-t border-orange-100">
                      <p className="italic"><strong>English:</strong> {img.detailsEng}</p>
                      <p className="text-xs text-muted-foreground italic">Alt: {img.accessibilityEng}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* משמרות ומידע נוסף */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-r-4 border-r-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              משמרות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {data.shifts.map((shift, i) => (
                <li key={i} className="text-sm">{shift}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-r-4 border-r-gray-400 bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-500" />
              מידע נוסף שלא סווג
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-2">
              {data.unmatched.length > 0 ? (
                data.unmatched.map((line, i) => <p key={i}>• {line}</p>)
              ) : (
                <p>כל המידע סווג בהצלחה.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExhibitionDisplay;