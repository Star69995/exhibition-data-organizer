/**
 * Clean text and extract value based on label.
 */
export const extractValue = (text: string, label: string): string => {
  const regex = new RegExp(`${label}\\s*[:\\-]?\\s*([^\\n\\.]*(?:\\.[^\\n\\.]*)*?)(?=\\s*(?:שם באנגלית|טלפון|מייל|אינסטגרם|אמנ\\.ית|$))`, 'i');
  const match = text.match(regex);
  if (!match) return '';
  
  let val = match[1].trim();
  if (val.endsWith('.')) val = val.slice(0, -1);
  return val.trim();
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
      gender: 'female', 
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

  // Find all artist blocks
  const artistParts = text.split(/אמנ\.ית\s*\d+/);
  if (artistParts.length > 1) {
    artistParts.slice(1).forEach((block, i) => {
      const nameHeb = extractValue(block, 'שם בעברית');
      const nameEng = extractValue(block, 'שם באנגלית');
      if (nameHeb || nameEng) {
        data.artists.push({
          id: `artist-${i}`,
          nameHeb,
          nameEng,
          phone: extractValue(block, 'טלפון'),
          email: extractValue(block, 'מייל'),
          website: block.match(/https?:\/\/[^\s\n]+/)?.[0] || '',
          instagram: '',
        });
      }
    });
  }

  // Find instagram handles
  const instaMatches = text.match(/@[\w\.]+/g);
  if (instaMatches) {
    instaMatches.forEach((handle, i) => {
      if (data.artists[i]) data.artists[i].instagram = handle;
    });
  }

  // Capture image blocks
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

  // Refined Event Filter: Exclude headers, placeholders, and dates already captured in main exhibition details
  const excludeKeywords = ['תאריך פתיחה', 'תאריך נעילה', 'אירוע שיח:', 'הופעה:', 'תאריך טרם נקבע', 'פרטי התערוכה', 'כל תערוכה צריכה'];
  const eventKeywords = ['שיח', 'סיור', 'הופעה', 'מפגש', 'פתיחה'];
  
  data.events = lines
    .map(l => l.trim())
    .filter(l => 
      l.length > 3 && 
      eventKeywords.some(k => l.includes(k)) && 
      !excludeKeywords.some(e => l.includes(e))
    )
    .map(l => l.replace(/^[-*]\s*/, '').replace(/\.$/, ''));

  // Capture shifts separately
  const shiftsStart = lines.findIndex(l => l.includes('תאריכי משמרות'));
  if (shiftsStart !== -1) {
    data.shifts = lines
      .slice(shiftsStart + 1)
      .filter(l => l.trim().length > 3 && (l.includes('.') || l.includes('/')))
      .map(l => l.trim().replace(/\.$/, ''));
  }

  return data;
};