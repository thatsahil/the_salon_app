import React from 'react';
import { UserPlus, TrendingUp, CalendarCheck, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export function InsightCards({
  newClientsCount = 0,
  totalRevenue = 0,
  totalVisitsCount = 0,
  averageBill = 0,
}) {
  const cards = [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      bgColor: 'bg-[#eff4ff]',
      textColor: 'text-[#585990]',
      borderColor: 'border-[#d3e4fe]',
    },
    {
      title: 'New Clients',
      value: newClientsCount,
      icon: UserPlus,
      bgColor: 'bg-[#ceeac5]/50',
      textColor: 'text-[#4c6548]',
      borderColor: 'border-[#ceeac5]',
    },
    {
      title: 'Total Visits',
      value: totalVisitsCount,
      icon: CalendarCheck,
      bgColor: 'bg-[#f8f9ff]',
      textColor: 'text-[#0b1c30]',
      borderColor: 'border-[#e2e8f0]',
    },
    {
      title: 'Average Bill',
      value: formatCurrency(averageBill),
      icon: Receipt,
      bgColor: 'bg-[#ffdad9]/40',
      textColor: 'text-[#805252]',
      borderColor: 'border-[#ffdad9]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`bg-white rounded-2xl p-4 border ${c.borderColor} shadow-xs flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#46464f] uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${c.bgColor} ${c.textColor} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0b1c30]">{c.value}</div>
          </div>
        );
      })}
    </div>
  );
}
