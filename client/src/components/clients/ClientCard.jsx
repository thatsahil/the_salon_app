import React from 'react';
import { Phone, Calendar, ArrowRight, Bell } from 'lucide-react';
import { formatDisplayDate, getTodayStr } from '../../utils/date';
import { formatPhoneDisplay } from '../../utils/phone';

export function ClientCard({ client, onClick }) {
  const today = getTodayStr();
  const isDueToday = client.nextReminderDate === today;
  const isOverdue = client.nextReminderDate && client.nextReminderDate < today;

  return (
    <div
      onClick={() => onClick(client)}
      className="bg-white rounded-2xl p-4 border border-[#e2e8f0] hover:border-[#8b8cc7] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#d3e4fe] text-[#585990] font-bold text-base flex items-center justify-center shrink-0 border border-[#d3e4fe]">
          {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-[#0b1c30] truncate group-hover:text-[#585990] transition-colors">
              {client.name}
            </h3>
            {isDueToday && (
              <span className="bg-[#805252] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Bell className="w-2.5 h-2.5" /> Due Today
              </span>
            )}
            {isOverdue && !isDueToday && (
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Overdue
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#46464f] mt-1">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#777680]" />
              {formatPhoneDisplay(client.phoneNumber)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#777680]" />
              Last: {formatDisplayDate(client.lastVisitDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="pl-2">
        <div className="w-8 h-8 rounded-full bg-[#f8f9ff] group-hover:bg-[#585990] text-[#777680] group-hover:text-white flex items-center justify-center transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
