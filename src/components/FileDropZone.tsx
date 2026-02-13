"use client";

import React, { useState } from 'react';
import { Upload, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileSelect, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer group",
        isDragging 
          ? "border-primary bg-primary/5 scale-[0.99]" 
          : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50",
        className
      )}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept=".docx,.txt"
        onChange={handleFileInput}
      />
      
      <div className={cn(
        "p-4 rounded-full transition-colors",
        isDragging ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:text-primary group-hover:bg-primary/5 shadow-sm"
      )}>
        <Upload className="h-8 w-8" />
      </div>
      
      <div className="text-center">
        <p className="text-lg font-bold text-slate-700">גרור קובץ לכאן</p>
        <p className="text-sm text-slate-500">או לחץ לבחירת קובץ (docx, txt)</p>
      </div>

      <div className="flex gap-2 mt-2">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-1 rounded border">
          <FileType className="h-3 w-3" /> DOCX
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-1 rounded border">
          <FileType className="h-3 w-3" /> TXT
        </div>
      </div>
    </div>
  );
};

export default FileDropZone;