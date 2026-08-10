import React from 'react';
import { PlusCircle, UserPlus } from 'lucide-react';
import { Button } from '../common/Button';

export function QuickActions({ onAddVisit, onAddClient }) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="primary"
        icon={PlusCircle}
        onClick={onAddVisit}
        className="flex-1 py-3 text-sm font-bold shadow-md shadow-[#585990]/15"
      >
        Add Visit
      </Button>

      <Button
        variant="secondary"
        icon={UserPlus}
        onClick={onAddClient}
        className="flex-1 py-3 text-sm font-bold"
      >
        Add Client
      </Button>
    </div>
  );
}
