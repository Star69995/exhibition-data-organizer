/**
 * Clean text and extract value based on label
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
    gender: 'male' | 'female';
    phone: string;
    email: string;
    instagram: string;
    website: string;
  };
  artists: Array<{
    id: string;
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
      gender: 'female', // Default to female
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

  const artistBlocks = text.split(/אמנ\.ית\s*\d+/);
  if (artistBlocks.length > 1) {
    artistBlocks.slice(1).forEach((block, i) => {
      data.artists.push({
        id: `artist-${i}`,
        nameHeb: extractValue(block, 'שם בעברית'),
        nameEng: extractValue(block, 'שם באנגלית'),
        phone: extractValue(block, 'טלפון'),
        email: extractValue(block, 'מייל'),
        website: block.match(/https?:\/\/[^\s\n]+/)?.[0] || '',
        instagram: '',
      });
    });
  }

  // Find instagram handles
  const instaMatches = text.match(/@[\w\.]+/g);
  if (instaMatches) {
    instaMatches.forEach((handle, i) => {
      if (data.artists[i]) data.artists[i].instagram = handle;
    });
  }

  const pressFullMatch = text.match(/טקסט להודעה לעיתונות([\s\S]*?)(?=טקסט מקוצר|$)/);
  if (pressFullMatch) {
    data.pressRelease.full = pressFullMatch[1].trim();
  }

  const pressShortMatch = text.match(/טקסט מקוצר להזמנה[\s\S]*?([^\n][\s\S]*?)(?=פרטי הדימויים|$)/);
  if (pressShortMatch) {
    data.pressRelease.short = pressShortMatch[1].trim();
  }

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

  const eventKeywords = ['שיח', 'סיור', 'הופעה', 'מפגש', 'פתיחה'];
  data.events = lines.filter(l => eventKeywords.some(k => l.includes(k)) && l.length > 5);

  return data;
};