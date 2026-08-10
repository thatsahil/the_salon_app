import React, { useState, useEffect } from 'react';
import { InsightCards } from '../components/reports/InsightCards';
import { RevenueChart } from '../components/reports/RevenueChart';
import { PaymentSummary } from '../components/reports/PaymentSummary';
import { LoadingState } from '../components/common/LoadingState';
import { api } from '../services/api';

export function Reports() {
  const [period, setPeriod] = useState('monthly');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await api.getRevenueReport(period);
        if (res.success) {
          setReportData(res.data);
        }
      } catch (err) {
        setError('Failed to load revenue insights');
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [period]);

  if (loading && !reportData) {
    return <LoadingState message="Calculating revenue insights & charts..." />;
  }

  const {
    chartData = [],
    totalRevenue = 0,
    cashTotal = 0,
    onlineTotal = 0,
    totalVisitsCount = 0,
    averageBill = 0,
    newClientsCount = 0,
  } = reportData || {};

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
          Business Reports & Analytics
        </h2>
        <p className="text-xs sm:text-sm text-[#46464f]">
          Track salon revenue trends, payment modes, and new client growth.
        </p>
      </div>

      {/* Insight Cards */}
      <InsightCards
        newClientsCount={newClientsCount}
        totalRevenue={totalRevenue}
        totalVisitsCount={totalVisitsCount}
        averageBill={averageBill}
      />

      {/* Recharts Revenue Chart */}
      <RevenueChart data={chartData} period={period} setPeriod={setPeriod} />

      {/* Cash vs Online Payment Summary */}
      <PaymentSummary
        cashTotal={cashTotal}
        onlineTotal={onlineTotal}
        totalRevenue={totalRevenue}
      />
    </div>
  );
}
