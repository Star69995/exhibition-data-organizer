/**
 * פונקציות עזר לפירמוט נתונים עבור ה-CMS
 */

export const formatDateWithDots = (dateStr: string): string => {
  return dateStr ? dateStr.replace(/\//g, '.') : '';
};

export const formatCatalogOrder = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.match(/\d+/g);
  if (!parts || parts.length < 3) return '';
  
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  let year = parts[2];
  
  // תמיכה בשנים בפורמט 2024 או 24
  if (year.length === 4) year = year.substring(2);
  else year = year.padStart(2, '0');
  
  return `${year}${month}${day}`;
};

export const formatArtistNames = (artists: Array<{ nameHeb: string }>): string => {
  if (artists.length === 0) return '';
  return artists.map(a => a.nameHeb).join(' | ') + ' |';
};

export const formatSlug = (titleEng: string): string => {
  return titleEng.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
};

export const cleanText = (text: string): string => {
  return text ? text.trim() : '';
};