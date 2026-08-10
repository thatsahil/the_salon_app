import React from 'react';
import { IndianRupee, Users, CalendarCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export function QuickStats({ todayVisitsCount = 0, todayRevenue = 0 }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Today's Visits */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#46464f] uppercase tracking-wider">
            Today's Visits
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#eff4ff] text-[#585990] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30]">
          {todayVisitsCount}
        </div>
        <span className="text-[11px] text-[#46464f] mt-1 flex items-center gap-1">
          <CalendarCheck className="w-3 h-3 text-[#4c6548]" /> Checked-in today
        </span>
      </div>

      {/* Today's Revenue */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#46464f] uppercase tracking-wider">
            Today's Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#ceeac5]/50 text-[#4c6548] flex items-center justify-center">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#585990]">
          {formatCurrency(todayRevenue)}
        </div>
        <span className="text-[11px] text-[#46464f] mt-1">Total collected today</span>
      </div>
    </div>
  );
}
