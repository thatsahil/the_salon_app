import React from 'react';
import { QuickStats } from '../components/dashboard/QuickStats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AlertList } from '../components/dashboard/AlertList';
import { LoadingState } from '../components/common/LoadingState';

export function Dashboard({
  user,
  dashboardData,
  loading,
  onAddVisit,
  onAddClient,
  onSelectClient,
}) {
  if (loading) {
    return <LoadingState message="Loading salon dashboard..." />;
  }

  const { todayVisitsCount = 0, todayRevenue = 0, alerts = [] } = dashboardData || {};

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Greeting Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
          Good day, {user?.name ? user.name.split(' ')[0] : 'Akshay'} 👋
        </h2>
        <p className="text-xs sm:text-sm text-[#46464f]">
          Here is your salon activity and monthly customer reminders for today.
        </p>
      </div>

      {/* Quick Metrics */}
      <QuickStats todayVisitsCount={todayVisitsCount} todayRevenue={todayRevenue} />

      {/* Quick Actions */}
      <QuickActions onAddVisit={onAddVisit} onAddClient={onAddClient} />

      {/* Today's Alerts List */}
      <AlertList alerts={alerts} onSelectClient={onSelectClient} />
    </div>
  );
}
