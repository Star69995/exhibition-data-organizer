/**
 * פונקציה לניקוי טקסט והוצאת ערך לפי תווית
 */
export const extractValue = (text: string, label: string): string => {
  const regex = new RegExp(`${label}\\s*[:\\-]?\\s*(.*)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
};

/**
 * פונקציה לזיהוי רשימות (כמו דימויים או משמרות)
 */
export const extractList = (text: string, startMarker: string, endMarker?: string): string[] => {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return [];
  
  let relevantText = text.substring(startIndex + startMarker.length);
  if (endMarker) {
    const endIndex = relevantText.indexOf(endMarker);
    if (endIndex !== -1) {
      relevantText = relevantText.substring(0, endIndex);
    }
  }
  
  return relevantText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.includes('לחץ או הקש'));
};

export interface ExhibitionData {
  exhibition: {
    titleHeb: string;
    titleEng: string;
    openDate: string;
    closeDate: string;
  };
  curator: {
    nameHeb: string;
    nameEng: string;
    phone: string;
    email: string;
    instagram: string;
    website: string;
  };
  artists: Array<{
    nameHeb: string;
    nameEng: string;
    phone: string;
    email: string;
    website: string;
  }>;
  pressRelease: {
    full: string;
    short: string;
  };
  images: Array<{
    id: string;
    detailsHeb: string;
    accessibilityHeb: string;
    detailsEng: string;
    accessibilityEng: string;
  }>;
  shifts: string[];
  unmatched: string[];
}

export const parseExhibitionText = (text: string): ExhibitionData => {
  const lines = text.split('\n');
  const data: ExhibitionData = {
    exhibition: {
      titleHeb: extractValue(text, 'שם התערוכה - עברית'),
      titleEng: extractValue(text, 'שם התערוכה - אנגלית'),
      openDate: extractValue(text, 'תאריך פתיחה'),
      closeDate: extractValue(text, 'תאריך נעילה'),
    },
    curator: {
      nameHeb: extractValue(text, 'שם בעברית'),
      nameEng: extractValue(text, 'שם באנגלית'),
      phone: extractValue(text, 'טלפון'),
      email: extractValue(text, 'מייל'),
      instagram: extractValue(text, 'אינסטגרם'),
      website: extractValue(text, 'קישור לאתר האוצר'),
    },
    artists: [],
    pressRelease: {
      full: '',
      short: '',
    },
    images: [],
    shifts: extractList(text, 'תאריכי משמרות'),
    unmatched: [],
  };

  // פירסור אמנים (לפי מבנה אמנ.ית X)
  const artistMatches = text.matchAll(/אמנ\.ית\s*(\d+)([\s\S]*?)(?=אמנ\.ית|$|אינסטגרם)/g);
  for (const match of artistMatches) {
    const artistBlock = match[2];
    data.artists.push({
      nameHeb: extractValue(artistBlock, 'שם בעברית'),
      nameEng: extractValue(artistBlock, 'שם באנגלית'),
      phone: extractValue(artistBlock, 'טלפון'),
      email: extractValue(artistBlock, 'מייל'),
      website: extractValue(artistBlock, 'קישור לאתר האמן'),
    });
  }

  // פירסור הודעה לעיתונות
  const pressFull = text.match(/טקסט להודעה לעיתונות([\s\S]*?)(?=טקסט מקוצר|$)/);
  if (pressFull) data.pressRelease.full = pressFull[1].trim().split('\n').filter(l => !l.includes('ההודעה לעיתונות')).join('\n');

  const pressShort = text.match(/טקסט מקוצר להזמנה לרשימת התפוצה([\s\S]*?)(?=פרטי הדימויים|$)/);
  if (pressShort) data.pressRelease.short = pressShort[1].trim().split('\n').filter(l => !l.includes('טקסט בין')).join('\n');

  // פירסור דימויים
  const imageMatches = text.matchAll(/(\d+)\.\s*א\.\s*פרטי הדימוי בעברית([\s\S]*?)(?=\d+\.|$|תאריכי משמרות)/g);
  for (const match of imageMatches) {
    const id = match[1];
    const block = match[2];
    data.images.push({
      id,
      detailsHeb: extractValue(block, 'א. פרטי הדימוי בעברית'),
      accessibilityHeb: extractValue(block, 'ב. תיאור נגישות'),
      detailsEng: extractValue(block, 'ג. פרטי הדימוי באנגלית'),
      accessibilityEng: extractValue(block, 'ד. תיאור נגישות באנגלית'),
    });
  }

  // זיהוי שורות שלא נכנסו לקטגוריות (פשוט מאוד - כל מה שלא ריק ולא כותרת מוכרת)
  const knownKeywords = ['שם התערוכה', 'תאריך', 'אוצר', 'אמן', 'מייל', 'טלפון', 'אינסטגרם', 'דימוי', 'נגישות', 'משמרות', 'הודעה לעיתונות'];
  data.unmatched = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.length < 5) return false;
    return !knownKeywords.some(key => trimmed.includes(key));
  }).slice(0, 10); // הגבלה כדי לא להציף

  return data;
};