import React from 'react';
import CopyButton from './CopyButton';
import { cleanText } from '@/lib/formatter-utils';

interface CMSFieldProps {
  label: string;
  value: string;
  description?: string;
  isLong?: boolean;
}

const CMSField: React.FC<CMSFieldProps> = ({ label, value, description, isLong = false }) => {
  const trimmedValue = cleanText(value);
  
  if (!trimmedValue && !isLong) return null;
  
  return (
    <div className="group flex flex-col gap-1.5 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <CopyButton value={trimmedValue} />
      </div>
      {description && <p className="text-xs text-slate-400 mb-1">{description}</p>}
      <div className={`p-3 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-900 ${
        isLong ? 'min-h-[80px] whitespace-pre-wrap text-justify leading-relaxed' : 'break-all'
      }`}>
        {trimmedValue || <span className="text-slate-300 italic">אין נתונים</span>}
      </div>
    </div>
  );
};

export default CMSField;