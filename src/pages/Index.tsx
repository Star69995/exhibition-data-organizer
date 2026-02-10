import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { parseExhibitionText, ExhibitionData } from '@/lib/parser-utils';
import ExhibitionDisplay from '@/components/ExhibitionDisplay';
import { Upload, FileText, Trash2, Sparkles } from 'lucide-react';
import mammoth from 'mammoth';
import { showSuccess, showError } from '@/utils/toast';

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
            הדבק טקסט גולמי או העלה קובץ Word כדי לסדר מחדש את כל פרטי התערוכה, האמנים והדימויים באופן אוטומטי.
          </p>
        </div>

        {!parsedData ? (
          <Card className="shadow-xl border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    הדבק טקסט כאן:
                  </label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="relative overflow-hidden">
                      <Upload className="ml-2 h-4 w-4" />
                      העלה קובץ (docx/txt)
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".docx,.txt"
                        onChange={handleFileUpload}
                      />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive">
                      <Trash2 className="ml-2 h-4 w-4" />
                      נקה
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  placeholder="הדבק כאן את הטקסט הגולמי של התערוכה..."
                  className="min-h-[400px] text-right font-mono text-sm leading-relaxed border-slate-200 focus:ring-primary"
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
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold">תוצאות העיבוד</h2>
              <Button variant="outline" onClick={() => setParsedData(null)}>
                חזור לעריכה
              </Button>
            </div>
            <ExhibitionDisplay data={parsedData} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm pt-8">
          <p>© {new Date().getFullYear()} - כלי עזר לאוצרים וגלריות</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;