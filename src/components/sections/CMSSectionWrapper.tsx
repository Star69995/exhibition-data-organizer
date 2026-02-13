"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface CMSSectionWrapperProps {
  title: string;
  icon: LucideIcon;
  borderColor: string;
  textColor: string;
  children: React.ReactNode;
  description?: string;
}

const CMSSectionWrapper: React.FC<CMSSectionWrapperProps> = ({ 
  title, 
  icon: Icon, 
  borderColor, 
  textColor, 
  children,
  description 
}) => {
  return (
    <Card className={`shadow-md border-t-4 ${borderColor} overflow-hidden transition-all hover:shadow-lg`}>
      <CardHeader className="bg-slate-50/50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 text-lg ${textColor} font-bold`}>
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
        </div>
        {description && <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>}
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default CMSSectionWrapper;