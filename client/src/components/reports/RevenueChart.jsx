

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { formatDisplayDate } from '../../utils/date';

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0b1c30] text-white p-3 rounded-xl shadow-lg text-xs flex flex-col gap-1 border border-[#213145]">
        <span className="font-semibold text-[#c1c1ff]">
          {data.date ? formatDisplayDate(data.date) : data.name}
        </span>
        <div className="flex items-center gap-2 font-bold text-sm">
          <span>Revenue:</span>
          <span className="text-[#ceeac5]">{formatCurrency(data.revenue)}</span>
        </div>
        {data.count !== undefined && (
          <span className="text-[11px] text-[#c8c5d0]">
            Visits: {data.count}
          </span>
        )}
      </div>
    );
  }
  return null;
};

export function RevenueChart({
  data = [],
  period = 'monthly',
  setPeriod,
  offset = 0,
  onPrev,
  onNext,
  onResetOffset,
  periodLabel = '',
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0b1c30]">Revenue Overview</h3>
          <p className="text-xs text-[#46464f]">
            {period === 'weekly' ? 'Daily breakdown per week' : 'Daily breakdown per month'}
          </p>
        </div>

        <div className="flex items-center bg-[#f8f9ff] p-1 rounded-xl border border-[#e2e8f0] self-start sm:self-auto">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'weekly'
                ? 'bg-[#585990] text-white shadow-xs'
                : 'text-[#46464f] hover:text-[#0b1c30]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'monthly'
                ? 'bg-[#585990] text-white shadow-xs'
                : 'text-[#46464f] hover:text-[#0b1c30]'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Date Navigation Bar (Back & Forth) */}
      <div className="flex items-center justify-between bg-[#f8f9ff] px-3 py-2 rounded-xl border border-[#e5eeff]">
        <button
          onClick={onPrev}
          className="p-1.5 rounded-lg hover:bg-white text-[#585990] hover:text-[#0b1c30] border border-transparent hover:border-[#d3e4fe] transition-all flex items-center gap-1 text-xs font-semibold"
          title={period === 'weekly' ? 'Previous Week' : 'Previous Month'}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev {period === 'weekly' ? 'Week' : 'Month'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-[#0b1c30] tracking-tight">
            {periodLabel || (period === 'weekly' ? 'Current Week' : 'Current Month')}
          </span>
          {offset !== 0 && (
            <button
              onClick={onResetOffset}
              className="p-1 text-[11px] font-bold text-[#585990] hover:text-[#0b1c30] bg-white rounded-md border border-[#d3e4fe] flex items-center gap-1"
              title="Reset to current"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Current</span>
            </button>
          )}
        </div>

        <button
          onClick={onNext}
          className="p-1.5 rounded-lg hover:bg-white text-[#585990] hover:text-[#0b1c30] border border-transparent hover:border-[#d3e4fe] transition-all flex items-center gap-1 text-xs font-semibold"
          title={period === 'weekly' ? 'Next Week' : 'Next Month'}
        >
          <span className="hidden sm:inline">Next {period === 'weekly' ? 'Week' : 'Month'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#46464f]">
            No revenue recorded for this period yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eff4ff" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#777680', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#777680', fontSize: 11 }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9ff' }} />
              <Bar
                dataKey="revenue"
                fill="#585990"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
