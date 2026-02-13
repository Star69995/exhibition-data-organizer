import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { parseExhibitionText, ExhibitionData } from '@/lib/parser-utils';
import ExhibitionDisplay from '@/components/ExhibitionDisplay';
import { FileText, Trash2, Sparkles, Upload } from 'lucide-react';
import mammoth from 'mammoth';
import { showSuccess, showError } from '@/utils/toast';
import FileDropZone from '@/components/FileDropZone';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState<ExhibitionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    if (!inputText.trim()) {
      showError('אנא הזן טקסט או העלה קובץ');
      return;
    }
    setIsProcessing(true);
    try {
      const data = parseExhibitionText(inputText);
      setParsedData(data);
      showSuccess('הטקסט פוענח בהצלחה!');
    } catch (error) {
      showError('שגיאה בפענוח הטקסט');
    } finally {
      setIsProcessing(false);
    }
  };

  const processFile = async (file: File) => {
    if (file.name.endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          setInputText(result.value);
          showSuccess('קובץ ה-Word נקרא בהצלחה');
        } catch (err) {
          showError('שגיאה בקריאת קובץ ה-Word');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target?.result as string);
        showSuccess('קובץ הטקסט נקרא בהצלחה');
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    setInputText('');
    setParsedData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            מעבד נתוני תערוכות
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            העלו קובץ Word או הדביקו טקסט גולמי כדי לסדר את כל פרטי התערוכה באופן אוטומטי.
          </p>
        </div>

        {!parsedData ? (
          <div className="space-y-8">
            {/* Upload Section at the Top */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 px-1">
                <Upload className="h-5 w-5 text-primary" />
                העלאת קבצים
              </h3>
              <FileDropZone onFileSelect={processFile} className="bg-white" />
              <p className="text-center text-sm text-slate-500 italic">
                העלאת קובץ תמלא אוטומטית את תיבת הטקסט למטה
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-50 px-4 text-slate-500 font-bold uppercase tracking-wider">או הדבקה ידנית</span>
              </div>
            </div>

            {/* Text Input Section */}
            <Card className="shadow-xl border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      עריכת טקסט:
                    </label>
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:bg-destructive/5">
                      <Trash2 className="ml-2 h-4 w-4" />
                      נקה הכל
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="הדבק כאן את הטקסט הגולמי או ערוך את הטקסט שנטען מהקובץ..."
                    className="min-h-[300px] text-right font-mono text-sm leading-relaxed border-slate-200 focus:ring-primary shadow-inner bg-slate-50/30"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  
                  <Button 
                    className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                    onClick={handleProcess}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'מעבד נתונים...' : 'סדר לי את התערוכה! ✨'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-slate-800">תוצאות העיבוד</h2>
              <Button variant="outline" onClick={() => setParsedData(null)} className="font-bold">
                חזור לעריכה
              </Button>
            </div>
            <ExhibitionDisplay data={parsedData} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm pt-8">
          <p>© {new Date().getFullYear()} - כלי עזר לאוצרים וגלריות | גלריה בנימין</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;