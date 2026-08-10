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
   * Aggregates revenue for weekly and monthly views
   */
  calculateReportMetrics(visits = [], customers = [], period = 'monthly') {
    const now = new Date();
    const todayStr = formatDate(now);

    let filteredVisits = [...visits];
    let chartData = [];

    if (period === 'weekly') {
      // Get current week's Monday to Sunday
      const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday
      const distanceToMon = (dayOfWeek + 6) % 7; // Monday = 0
      const monday = new Date(now);
      monday.setDate(now.getDate() - distanceToMon);

      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyMap = {};
      daysOfWeek.forEach((day, idx) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + idx);
        const dateStr = formatDate(d);
        dailyMap[dateStr] = { date: dateStr, name: day, revenue: 0, count: 0 };
      });

      visits.forEach((v) => {
        if (dailyMap[v.visitDate]) {
          dailyMap[v.visitDate].revenue += v.amount || 0;
          dailyMap[v.visitDate].count += 1;
        }
      });

      chartData = Object.values(dailyMap);
    } else {
      // Monthly view (last 30 days or current calendar month)
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Filter visits in current month
      filteredVisits = visits.filter((v) => {
        const vd = new Date(v.visitDate);
        return vd.getFullYear() === currentYear && vd.getMonth() === currentMonth;
      });

      // Group by date of month
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const monthlyMap = {};

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(currentYear, currentMonth, day);
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

    // New clients created in current month
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newClientsCount = customers.filter((c) => {
      if (!c.createdAt) return false;
      const cDateStr = formatDate(new Date(c.createdAt));
      return cDateStr.startsWith(currentYearMonth);
    }).length;

    return {
      period,
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
