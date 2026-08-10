import React from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyState({
  title = 'No records found',
  description = 'Everything looks quiet here right now.',
  icon: Icon = Sparkles,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-[#c8c5d0] my-4">
      <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#585990] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[#0b1c30] mb-1">{title}</h4>
      <p className="text-sm text-[#46464f] max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
