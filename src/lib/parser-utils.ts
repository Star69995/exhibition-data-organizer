/**
 * פונקציה לניקוי טקסט והוצאת ערך לפי תווית
 */
export const extractValue = (text: string, label: string): string => {
  const regex = new RegExp(`${label}\\s*[:\\-]?\\s*([^\\n]*)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
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
    instagram: string;
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
  events: string[];
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
      website: extractValue(text, 'אתר האוצר'),
    },
    artists: [],
    pressRelease: { full: '', short: '' },
    images: [],
    shifts: [],
    events: [],
    unmatched: [],
  };

  // פירסור אמנים
  const artistBlocks = text.split(/אמנ\.ית\s*\d+/);
  if (artistBlocks.length > 1) {
    artistBlocks.slice(1).forEach(block => {
      data.artists.push({
        nameHeb: extractValue(block, 'שם בעברית'),
        nameEng: extractValue(block, 'שם באנגלית'),
        phone: extractValue(block, 'טלפון'),
        email: extractValue(block, 'מייל'),
        website: block.match(/https?:\/\/[^\s\n]+/)?.[0] || '',
        instagram: '',
      });
    });
  }

  // שיוך אינסטגרם
  const instaMatches = text.match(/@[\w\.]+/g);
  if (instaMatches) {
    instaMatches.forEach((handle, i) => {
      if (data.artists[i]) data.artists[i].instagram = handle;
    });
  }

  // פירסור וניקוי הודעה לעיתונות
  const pressFullMatch = text.match(/טקסט להודעה לעיתונות([\s\S]*?)(?=טקסט מקוצר|$)/);
  if (pressFullMatch) {
    let content = pressFullMatch[1];
    // הסרת הנחיית ה"4-5 משפטים" עד "בתיאום עם האוצר"
    content = content.replace(/ההודעה לעיתונות יכולה להיות[\s\S]*?בתיאום עם האוצר\./, '');
    data.pressRelease.full = content.trim();
  }

  // פירסור וניקוי טקסט מקוצר
  const pressShortMatch = text.match(/טקסט מקוצר להזמנה[\s\S]*?([^\n][\s\S]*?)(?=פרטי הדימויים|$)/);
  if (pressShortMatch) {
    let content = pressShortMatch[1];
    // הסרת הנחיית ה"2-4 משפטים" עד "על ידי צוות הגלריה"
    content = content.replace(/טקסט בין 2-4 משפטים[\s\S]*?על ידי צוות הגלריה\./, '');
    data.pressRelease.short = content.trim();
  }

  // פירסור דימויים
  const imageBlocks = text.split(/\d+\.\s*א\.\s*פרטי הדימוי/);
  if (imageBlocks.length > 1) {
    imageBlocks.slice(1).forEach((block, i) => {
      data.images.push({
        id: (i + 1).toString(),
        detailsHeb: block.split('ב. תיאור נגישות')[0].trim(),
        accessibilityHeb: (block.match(/ב\. תיאור נגישות([\s\S]*?)(?=ג\.)/) || [])[1]?.trim() || '',
        detailsEng: (block.match(/ג\. פרטי הדימוי באנגלית([\s\S]*?)(?=ד\.)/) || [])[1]?.trim() || '',
        accessibilityEng: (block.match(/ד\. תיאור נגישות באנגלית([\s\S]*?)(?=\d+\.|$)/) || [])[1]?.trim() || '',
      });
    });
  }

  // משמרות ואירועים
  const shiftText = text.match(/תאריכי משמרות([\s\S]*?)(?=אירוע שיח|$)/);
  if (shiftText) data.shifts = shiftText[1].trim().split('\n').filter(l => l.trim());

  const eventKeywords = ['שיח', 'סיור', 'הופעה', 'מפגש', 'פתיחה'];
  data.events = lines.filter(l => eventKeywords.some(k => l.includes(k)) && l.length > 5 && !l.includes('כותרת') && !l.includes('כל תערוכה צריכה'));

  // שורות שלא סווגו
  const knownKeywords = ['שם', 'תאריך', 'אוצר', 'אמן', 'מייל', 'טלפון', 'אינסטגרם', 'דימוי', 'נגישות', 'משמרות', 'הודעה'];
  data.unmatched = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.length < 10) return false;
    return !knownKeywords.some(key => trimmed.includes(key));
  }).slice(0, 15);

  return data;
};