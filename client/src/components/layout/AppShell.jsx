import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

export function AppShell({ children, activeTab, setActiveTab, title, user }) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans antialiased">
      <TopBar title={title} activeTab={activeTab} user={user} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-20 pb-28">
        {children}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
