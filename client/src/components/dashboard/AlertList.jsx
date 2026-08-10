import React from 'react';
import { Bell, Send, Phone, Calendar } from 'lucide-react';
import { formatDisplayDate } from '../../utils/date';
import { formatPhoneDisplay, getWhatsAppReminderUrl } from '../../utils/phone';
import { EmptyState } from '../common/EmptyState';

export function AlertList({ alerts = [], onSelectClient }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0]">
        <h3 className="text-base font-bold text-[#0b1c30] mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#585990]" />
          Today's Reminder Alerts
        </h3>
        <EmptyState
          title="No Reminders Due Today"
          description="All set! None of your clients are due for their 30-day monthly visit today."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ffdad9] text-[#805252] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0b1c30]">Today's Reminder Alerts</h3>
            <p className="text-xs text-[#46464f]">Clients due for monthly visit today</p>
          </div>
        </div>
        <span className="bg-[#805252] text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
          {alerts.length} Due
        </span>
      </div>

      <div className="divide-y divide-[#eff4ff]">
        {alerts.map((client) => {
          const waUrl = getWhatsAppReminderUrl(client.phoneNumber, client.name);
          return (
            <div
              key={client._id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8f9ff] px-2 rounded-xl transition-colors cursor-pointer"
              onClick={() => onSelectClient && onSelectClient(client)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#585990] font-bold text-sm flex items-center justify-center shrink-0 border border-[#d3e4fe]">
                  {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0b1c30] hover:text-[#585990]">
                    {client.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[#46464f] mt-0.5">
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

              <div className="flex items-center gap-2 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ceeac5]/60 hover:bg-[#ceeac5] text-[#4c6548] font-bold text-xs border border-[#ceeac5] transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Reminder
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
