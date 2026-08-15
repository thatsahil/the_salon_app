import React from 'react';
import { LogOut, User } from 'lucide-react';

export function TopBar({ title, activeTab, user, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#e2e8f0]/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/salon_logo.png"
            alt="AK Hair Studio Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-xs border border-[#585990]/20"
          />
          <div>
            <h1 className="font-bold text-lg text-[#585990] tracking-tight leading-tight">
              {title}
            </h1>
            <span className="text-[11px] text-[#46464f] font-medium block truncate max-w-[180px] sm:max-w-xs">
              {user?.salonName || 'AK Hair Studio'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 bg-[#ceeac5]/40 text-[#4c6548] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#ceeac5]">
            <span className="w-2 h-2 rounded-full bg-[#4c6548] animate-pulse"></span>
            <span>Live</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-[#e2e8f0]">
            <div className="w-7 h-7 rounded-full bg-[#585990] text-white font-semibold text-xs flex items-center justify-center border border-white shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-xs font-bold text-[#0b1c30] hidden md:inline max-w-[100px] truncate">
              {user?.name || 'Admin'}
            </span>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1 rounded-lg text-[#777680] hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
