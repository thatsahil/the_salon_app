import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export function PaymentSummary({ cashTotal = 0, onlineTotal = 0, totalRevenue = 0 }) {
  const grandTotal = totalRevenue || cashTotal + onlineTotal || 1;
  const cashPercent = Math.round((cashTotal / grandTotal) * 100);
  const onlinePercent = Math.round((onlineTotal / grandTotal) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col gap-4">
      <div>
        <h3 className="text-base font-bold text-[#0b1c30]">Payment Mode Breakdown</h3>
        <p className="text-xs text-[#46464f]">Cash vs Digital UPI payments</p>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-[#f8f9ff] rounded-full overflow-hidden flex border border-[#eff4ff]">
        <div
          style={{ width: `${cashPercent}%` }}
          className="bg-[#585990] h-full transition-all duration-500"
          title={`Cash: ${cashPercent}%`}
        />
        <div
          style={{ width: `${onlinePercent}%` }}
          className="bg-[#4c6548] h-full transition-all duration-500"
          title={`Online: ${onlinePercent}%`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        {/* Cash Total */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9ff] border border-[#eff4ff]">
          <div className="w-10 h-10 rounded-xl bg-[#e5eeff] text-[#585990] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#46464f] uppercase block">
              Cash Total ({cashPercent}%)
            </span>
            <span className="text-base font-extrabold text-[#0b1c30]">
              {formatCurrency(cashTotal)}
            </span>
          </div>
        </div>

        {/* Online Total */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9ff] border border-[#eff4ff]">
          <div className="w-10 h-10 rounded-xl bg-[#ceeac5]/60 text-[#4c6548] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#46464f] uppercase block">
              Online UPI ({onlinePercent}%)
            </span>
            <span className="text-base font-extrabold text-[#585990]">
              {formatCurrency(onlineTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
