const { formatDate } = require('../utils/date');

class RevenueService {
  /**
   * Calculate summary metrics from visits and customers
   */
  calculateDashboardMetrics(visits = []) {
    const todayStr = formatDate(new Date());
    const todayVisits = visits.filter((v) => v.visitDate === todayStr);

    const todayRevenue = todayVisits.reduce((sum, v) => sum + (v.amount || 0), 0);
    const todayVisitsCount = todayVisits.length;

    return {
      todayRevenue,
      todayVisitsCount,
    };
  }

  /**
   * Aggregates revenue for weekly and monthly views with offset support
   * @param {Array} visits
   * @param {Array} customers
   * @param {string} period 'weekly' | 'monthly'
   * @param {number} offset 0 for current, -1 for previous, 1 for next, etc.
   */
  calculateReportMetrics(visits = [], customers = [], period = 'monthly', offset = 0) {
    const now = new Date();
    const numOffset = Number(offset) || 0;

    let filteredVisits = [];
    let chartData = [];
    let periodLabel = '';

    if (period === 'weekly') {
      // Shift base date by numOffset weeks
      const baseDate = new Date(now);
      baseDate.setDate(now.getDate() + numOffset * 7);

      const dayOfWeek = baseDate.getDay(); // 0 is Sun, 1 is Mon
      const distanceToMon = (dayOfWeek + 6) % 7; // Mon = 0
      const monday = new Date(baseDate);
      monday.setDate(baseDate.getDate() - distanceToMon);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const startMonth = monday.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
      const year = sunday.getFullYear();

      periodLabel = startMonth === endMonth
        ? `${startMonth} ${monday.getDate()} - ${sunday.getDate()}, ${year}`
        : `${startMonth} ${monday.getDate()} - ${endMonth} ${sunday.getDate()}, ${year}`;

      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyMap = {};

      daysOfWeek.forEach((day, idx) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + idx);
        const dateStr = formatDate(d);
        const dateDayNum = d.getDate();
        dailyMap[dateStr] = {
          date: dateStr,
          name: `${day} ${dateDayNum}`,
          revenue: 0,
          count: 0,
        };
      });

      // Filter visits in this week
      visits.forEach((v) => {
        if (dailyMap[v.visitDate]) {
          dailyMap[v.visitDate].revenue += v.amount || 0;
          dailyMap[v.visitDate].count += 1;
          filteredVisits.push(v);
        }
      });

      chartData = Object.values(dailyMap);
    } else {
      // Monthly view with offset
      const targetDate = new Date(now.getFullYear(), now.getMonth() + numOffset, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();

      periodLabel = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Filter visits in target month
      filteredVisits = visits.filter((v) => {
        if (!v.visitDate) return false;
        const [yStr, mStr] = v.visitDate.split('-');
        return Number(yStr) === targetYear && Number(mStr) === targetMonth + 1;
      });

      // Group by date of month
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      const monthlyMap = {};

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(targetYear, targetMonth, day);
        const dateStr = formatDate(d);
        monthlyMap[dateStr] = {
          date: dateStr,
          name: `${day}`,
          revenue: 0,
          count: 0,
        };
      }

      visits.forEach((v) => {
        if (monthlyMap[v.visitDate]) {
          monthlyMap[v.visitDate].revenue += v.amount || 0;
          monthlyMap[v.visitDate].count += 1;
        }
      });

      chartData = Object.values(monthlyMap);
    }

    // Cash vs Online totals
    let cashTotal = 0;
    let onlineTotal = 0;
    let totalRevenue = 0;

    filteredVisits.forEach((v) => {
      totalRevenue += v.amount || 0;
      if (v.paymentMethod === 'online') {
        onlineTotal += v.amount || 0;
      } else {
        cashTotal += v.amount || 0;
      }
    });

    const totalVisitsCount = filteredVisits.length;
    const averageBill = totalVisitsCount > 0 ? Math.round(totalRevenue / totalVisitsCount) : 0;

    // New clients created in target period/month
    let newClientsCount = 0;
    if (period === 'monthly') {
      const targetDate = new Date(now.getFullYear(), now.getMonth() + numOffset, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetPrefix = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;

      newClientsCount = customers.filter((c) => {
        if (!c.createdAt) return false;
        const cDateStr = formatDate(new Date(c.createdAt));
        return cDateStr.startsWith(targetPrefix);
      }).length;
    } else {
      newClientsCount = customers.filter((c) => {
        if (!c.createdAt) return false;
        const cDateStr = formatDate(new Date(c.createdAt));
        return chartData.some((cd) => cd.date === cDateStr);
      }).length;
    }

    return {
      period,
      offset: numOffset,
      periodLabel,
      chartData,
      totalRevenue,
      cashTotal,
      onlineTotal,
      totalVisitsCount,
      averageBill,
      newClientsCount,
    };
  }
}

module.exports = new RevenueService();
