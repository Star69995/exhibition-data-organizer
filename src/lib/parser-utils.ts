import { cleanText } from './formatter-utils';

/**
 * All field labels the parser knows how to recognize, used both to extract a specific
 * field's value and as boundary markers so one field's value doesn't swallow the next
 * field's label (this happens often in the real templates, where two labels can share
 * a single paragraph, e.g. "שם בעברית: X. שם באנגלית: Y.").
 */
const FIELD_LABELS = [
  'שם התערוכה - עברית',
  'שם התערוכה - אנגלית',
  'תאריך פתיחה',
  'תאריך נעילה',
  'שם בעברית',
  'שם באנגלית',
  'טלפון',
  'מייל',
  'אינסטגרם',
  'קישור לאתר האוצר',
  'אתר האוצר',
  'אמנ.ית',
];

const HEBREW_LETTER_RANGE = '\\u0590-\\u05FF';

const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Finds the first occurrence of `label` in `text` at or after `fromIndex`, requiring that
 * it isn't preceded by a Hebrew letter (so `אינסטגרם` doesn't match inside `האינסטגרם`).
 */
const findLabelIndex = (text: string, label: string, fromIndex: number): number => {
  const regex = new RegExp(`(?<![${HEBREW_LETTER_RANGE}])${escapeRegex(label)}`, 'i');
  const match = text.slice(fromIndex).match(regex);
  return match && match.index !== undefined ? fromIndex + match.index : -1;
};

/**
 * Extract the value that follows `label` in `text`, stopping at whichever comes first:
 * the next paragraph break, the start of another known field label, or the end of the text.
 */
export const extractValue = (text: string, label: string): string => {
  const labelRegex = new RegExp(`(?<![${HEBREW_LETTER_RANGE}])${escapeRegex(label)}`, 'i');
  const labelMatch = text.match(labelRegex);
  if (!labelMatch || labelMatch.index === undefined) return '';

  let cursor = labelMatch.index + labelMatch[0].length;
  const connector = text.slice(cursor).match(/^[ \t]*[:-]?[ \t]*/);
  if (connector) cursor += connector[0].length;

  let boundary = text.length;

  const paragraphBreak = text.indexOf('\n\n', cursor);
  if (paragraphBreak !== -1) boundary = Math.min(boundary, paragraphBreak);

  for (const otherLabel of FIELD_LABELS) {
    if (otherLabel === label) continue;
    const otherIndex = findLabelIndex(text, otherLabel, cursor);
    if (otherIndex !== -1) boundary = Math.min(boundary, otherIndex);
  }

  const value = text.slice(cursor, boundary).trim().replace(/\.+$/, '').trim();
  return value;
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
      website: extractValue(text, 'קישור לאתר האוצר') || extractValue(text, 'אתר האוצר'),
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
          website: cleanText(block.match(/https?:\/\/[^\s\n]+/)?.[0] || ''),
          instagram: '',
        });
      }
    });
  }

  // Find instagram handles: only lines that are exclusively a handle, so email
  // addresses like "artist@gmail.com" (which also contain an "@") are never picked up.
  const instaMatches = lines
    .map(l => l.trim())
    .filter(l => /^@[\w.]+$/.test(l));
  if (instaMatches.length) {
    instaMatches.forEach((handle, i) => {
      if (data.artists[i]) data.artists[i].instagram = handle;
    });
  }

  // Capture image blocks. Real-world documents mark each block's start with "א." at the
  // start of a line - sometimes with a leading number, sometimes followed by "פרטי הדימוי"
  // (optionally "בעברית"), sometimes with none of that, just the letter. The ב/ג/ד sub-labels
  // are similarly inconsistent: sometimes glued directly onto their value with no punctuation,
  // sometimes followed by a colon and/or a blank line before the real content starts.
  const imageBlocks = text.split(/(?:^|\n)\s*(?:\d+\.\s*)?א\.\s*(?:פרטי הדימוי\s*(?:בעברית)?)?\s*/);
  if (imageBlocks.length > 1) {
    imageBlocks.slice(1).forEach((block, i) => {
      const accessibilityHebMatch = block.match(/ב\.\s*תיאור נגישות[:\s]*([^\s][\s\S]*?)(?=ג\.\s*פרטי הדימוי באנגלית|\n\n|$)/);
      const detailsEngMatch = block.match(/ג\.\s*פרטי הדימוי באנגלית[:\s]*([^\s][\s\S]*?)(?=ד\.\s*תיאור נגישות באנגלית|\n\n|$)/);
      const accessibilityEngMatch = block.match(/ד\.\s*תיאור נגישות באנגלית[:\s]*([^\s][\s\S]*?)(?=\n\n|$)/);
      const detailsHeb = block.split(/ב\.\s*תיאור נגישות/)[0];

      data.images.push({
        id: (i + 1).toString(),
        detailsHeb: cleanText(detailsHeb),
        accessibilityHeb: cleanText(accessibilityHebMatch?.[1] || ''),
        detailsEng: cleanText(detailsEngMatch?.[1] || ''),
        accessibilityEng: cleanText(accessibilityEngMatch?.[1] || ''),
      });
    });
  }

  // Refined Event Filter: Exclude headers, placeholders, dates already captured in main
  // exhibition details, and long prose (e.g. the press release, which otherwise gets pulled
  // in whenever it happens to contain a word like "מפגש").
  const excludeKeywords = ['תאריך פתיחה', 'תאריך נעילה', 'אירוע שיח:', 'הופעה:', 'תאריך טרם נקבע', 'פרטי התערוכה', 'כל תערוכה צריכה'];
  const eventKeywords = ['שיח', 'סיור', 'הופעה', 'מפגש', 'פתיחה'];

  data.events = lines
    .map(l => l.trim())
    .filter(l =>
      l.length > 3 &&
      l.length < 150 &&
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
